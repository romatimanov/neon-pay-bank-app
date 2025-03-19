import { NextRequest } from 'next/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'
import { readData } from '@/utils/utils'
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
  }
`

const resolvers = {
  Query: {
    cards: () => cards,
    accounts: () => {
      const data = readData()
      const myAccounts = Object.values(data.accounts)
        .filter((account: any) => account.mine)
        .map((account: any) => ({
          ...account,
          transactions: [account.transactions[account.transactions.length - 1]].filter(Boolean)
        }))

      return myAccounts
    },
    account: (_: any, args: { id: string }) => {
      const data = readData()
      return data.accounts[args.id]
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })
const handler = startServerAndCreateNextHandler<NextRequest>(server)

export { handler as GET, handler as POST }
