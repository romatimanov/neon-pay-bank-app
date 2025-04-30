import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'
import { readData, writeData, makeAccount } from '@/utils/utils'
import cards from '@/contstants/server'
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

const typeDefs = `#graphql
  type Transaction {
    date: String!
    from: String!
    to: String!
    amount: Float!
  }

  type Account {
    account: String!
    balance: Float!
    mine: Boolean!
    transactions: [Transaction!]!
  }

  type Query {
    cards: [String!]!
    accounts: [Account!]!
    account(id: String!): Account
    outgoingTransactions: [Transaction!]!
  }

  type Mutation {
    transfer(from: String!, to: String!, amount: Float!): Account
  }
`

const resolvers = {
  Query: {
    accounts: async () => {
      const { data, error } = await supabase.from('accounts').select('*').eq('mine', true)
      if (error) throw error

      // Последняя транзакция (пример, можно улучшить)
      for (let acc of data) {
        const { data: txs } = await supabase
          .from('transactions')
          .select('*')
          .eq('from', acc.account)
          .order('date', { ascending: false })
          .limit(1)
        acc.transactions = txs || []
      }

      return data
    },

    account: async (_: any, { id }: { id: string }) => {
      const { data: acc, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('account', id)
        .single()
      if (error) throw error

      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .or(`from.eq.${id},to.eq.${id}`)
        .order('date', { ascending: false })

      return { ...acc, transactions: txs || [] }
    },

    outgoingTransactions: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      return data
    }
  },

  Mutation: {
    transfer: async (
      _: any,
      { from, to, amount }: { from: string; to: string; amount: number }
    ) => {
      const amt = Number(amount)

      const { data: fromAcc, error: errFrom } = await supabase
        .from('accounts')
        .select('*')
        .eq('account', from)
        .single()

      const { data: toAccRaw } = await supabase
        .from('accounts')
        .select('*')
        .eq('account', to)
        .maybeSingle()

      if (errFrom || !fromAcc?.mine) throw new Error('Invalid account from')

      let toAcc = toAccRaw
      if (!toAcc) {
        if (Math.random() < 0.25) {
          const { data: created } = await supabase
            .from('accounts')
            .insert({ id: uuidv4(), account: to, balance: 0, mine: false })
            .select()
            .single()
          toAcc = created
        } else {
          throw new Error('Invalid account to')
        }
      }

      if (amt < 0 || fromAcc.balance < amt) throw new Error('Overdraft prevented')

      await Promise.all([
        supabase
          .from('accounts')
          .update({ balance: fromAcc.balance - amt })
          .eq('account', from),
        supabase
          .from('accounts')
          .update({ balance: toAcc.balance + amt })
          .eq('account', toAcc.account),
        supabase.from('transactions').insert({
          id: uuidv4(),
          date: new Date().toISOString(),
          from,
          to: toAcc.account,
          amount: amt
        })
      ])

      const { data: updated } = await supabase
        .from('accounts')
        .select('*')
        .eq('account', from)
        .single()

      return { ...updated, transactions: [] }
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => ({ req })
})

export async function GET(req: NextRequest) {
  return handler(req)
}

export async function POST(req: NextRequest) {
  return handler(req)
}
