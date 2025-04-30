'use client'

import { gql, useQuery } from '@apollo/client'
import client from '@/lib/apollo-client'
import { Loader } from '@/ui/loader/Loader'
import { InfoAccount } from '@/ui/infoAccaunt/InfoAccount'
import style from './info.module.css'
import { formatBalance } from '@/utils/formatBalance'
import { useCurrentLanguage } from '@/app/hook/useCurrentLanguage'
import { useMemo, useState } from 'react'
import { TransactionsTable } from '@/ui/transactionsTable/TransactionsTable'

export function Info({ id }: { id: string }) {
  const language = useCurrentLanguage()
  const [activeBtn, setActiveBtn] = useState(1)
  const GET_ACCOUNT = gql`
    query GetAccount($id: String!) {
      account(id: $id) {
        account
        balance
        transactions {
          date
          amount
          from
          to
        }
      }
    }
  `

  const { data, loading, error } = useQuery(GET_ACCOUNT, {
    client,
    variables: { id },
    fetchPolicy: 'network-only'
  })

  const income = data?.account?.transactions
    ?.filter((transaction: any) => transaction.to === id)
    .reduce((sum: number, transaction: any) => sum + transaction.amount, 0)

  const expenses = data?.account?.transactions
    ?.filter((transaction: any) => transaction.from === id)
    .reduce((sum: number, transaction: any) => sum + transaction.amount, 0)

  const allTransactions = useMemo(() => {
    return [...(data?.account?.transactions || [])].reverse()
  }, [data])

  const incomeTransactions = useMemo(() => {
    return [...(data?.account?.transactions || [])]
      .filter((transaction: any) => transaction.to === id)
      .reverse()
  }, [data])

  const expensesTransactions = useMemo(() => {
    return [...(data?.account?.transactions || [])]
      .filter((transaction: any) => transaction.from === id)
      .reverse()
  }, [data])

  const lastTransactions = expensesTransactions[0]

  const infoAcc = [
    {
      text: language === 'en' ? 'My balance' : 'Мой баланс',
      balance: formatBalance(data?.account?.balance),
      icon: '/acc1.png'
    },
    {
      text: language === 'en' ? 'Income' : 'Доход',
      balance: formatBalance(income),
      icon: '/acc2.png'
    },
    {
      text: language === 'en' ? 'Expenses' : 'Расходы',
      balance: formatBalance(expenses),
      icon: '/acc3.png'
    },
    {
      text: language === 'en' ? 'Last transactions' : 'Последняя транзакция',
      balance: formatBalance(lastTransactions?.amount),
      icon: '/acc4.png'
    }
  ]

  const buttons = [
    {
      id: 1,
      name: language === 'en' ? 'All transactions' : 'Все транзакции'
    },
    {
      id: 2,
      name: language === 'en' ? 'Income' : 'Доход'
    },
    {
      id: 3,
      name: language === 'en' ? 'Expenses' : 'Расходы'
    }
  ]
  const handleClick = (id: number) => {
    setActiveBtn(id)
  }

  if (loading || error) {
    return <Loader loading={loading} error={error} />
  }

  return (
    <>
      <div className={style.container}>
        <div className={style.info}>
          {infoAcc.map((item, index) => (
            <InfoAccount key={index} text={item.text} balance={item.balance} icon={item.icon} />
          ))}
        </div>
        <div className={style.btnGroup}>
          {buttons.map((item, index) => (
            <button
              key={index}
              className={`${style.btn} ${activeBtn === item.id && style.active}`}
              onClick={() => handleClick(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        {activeBtn === 1 && (
          <TransactionsTable
            language={language ? language : 'ru'}
            allTransactions={allTransactions}
          />
        )}
        {activeBtn === 2 && (
          <TransactionsTable
            language={language ? language : 'ru'}
            allTransactions={incomeTransactions}
          />
        )}
        {activeBtn === 3 && (
          <TransactionsTable
            language={language ? language : 'ru'}
            allTransactions={expensesTransactions}
          />
        )}
      </div>
    </>
  )
}
