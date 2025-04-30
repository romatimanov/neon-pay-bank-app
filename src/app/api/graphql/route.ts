import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'
import { readData, writeData, makeAccount } from '@/utils/utils'
import cards from '@/contstants/server'

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
    cards: () => cards,
    accounts: () => {
      const data = readData()
      return Object.values(data.accounts)
        .filter((a: any) => a.mine)
        .map((a: any) => ({
          ...a,
          transactions: [a.transactions.at(-1)].filter(Boolean)
        }))
    },
    account: (_: any, { id }: { id: string }) => {
      const data = readData()
      return data.accounts[id]
    },
    outgoingTransactions: () => {
      const data = readData()
      const allOutgoing: any[] = []

      for (const account of Object.values(data.accounts) as {
        account: string
        transactions: any[]
      }[]) {
        const outgoing = account.transactions?.filter((tx) => tx.from === account.account)
        allOutgoing.push(...(outgoing || []))
      }

      return allOutgoing
    }
  },
  Mutation: {
    transfer: async (_: any, args: { from: string; to: string; amount: number }) => {
      const { from, to, amount: rawAmount } = args
      const amount = Number(rawAmount)
      const data = readData()

      const fromAccount = data.accounts[from]
      let toAccount = data.accounts[to]

      if (!fromAccount || !fromAccount.mine) throw new Error('Invalid account from')

      if (!toAccount) {
        if (Math.random() < 0.25) {
          toAccount = makeAccount(false, to)
          data.accounts[to] = toAccount
        } else {
          throw new Error('Invalid account to')
        }
      }

      if (isNaN(amount) || amount < 0) throw new Error('Invalid amount')
      if (fromAccount.balance < amount) throw new Error('Overdraft prevented')

      fromAccount.balance -= amount
      toAccount.balance += amount

      const tx = {
        date: new Date().toISOString(),
        from: fromAccount.account,
        to: toAccount.account,
        amount
      }

      fromAccount.transactions.push(tx)
      toAccount.transactions.push(tx)

      writeData(data)
      return fromAccount
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => ({ req })
})

export { handler as GET, handler as POST }
