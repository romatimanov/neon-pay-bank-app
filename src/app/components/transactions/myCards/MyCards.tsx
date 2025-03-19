'use client'
import { gql, useQuery } from '@apollo/client'
import style from './mycards.module.css'
import { useCurrentLanguage } from '@/app/hook/useCurrentLanguage'
import client from '@/lib/apollo-client'
import { useState, useMemo } from 'react'
import { formatDateTransaction } from '@/utils/formatDateTransaction'
import { formatCardNumber } from '@/utils/formatCardNumber'
import { Card } from '@/ui/card/Card'
import { Loader } from '@/ui/loader/Loader'
import { Pagination } from '@/ui/pagination/Pagination'

export function MyCards() {
  const language = useCurrentLanguage()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const GET_ACCOUNTS = gql`
    query {
      accounts {
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

  const { data, loading, error } = useQuery(GET_ACCOUNTS, { client })

  const sortedCards = useMemo(() => {
    return [...(data?.accounts || [])].sort((a, b) => b.balance - a.balance)
  }, [data])

  const allTransactions = useMemo(() => {
    return data?.accounts?.flatMap((account: any) => account.transactions) || []
  }, [data])

  const totalPages = Math.ceil(allTransactions.length / itemsPerPage)

  const currentTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return allTransactions.slice(start, end)
  }, [allTransactions, currentPage])

  if (loading || error) {
    return <Loader loading={loading} error={error} />
  }

  return (
    <div className={style.mycards}>
      <div className={style.textgroup}>
        <h2 className="global-title">{language === 'en' ? 'My Cards' : 'Мои карты'}</h2>
        <button className={style.button}>
          {language === 'en' ? '+ Add Card' : '+ Добавить карту'}
        </button>
      </div>

      <div className={style.cards}>
        {sortedCards.slice(0, 2).map((card, index) => (
          <Card
            key={card.account}
            active={index === 0}
            balance={card.balance}
            cardNumber={card.account}
            name={'Your name'}
          />
        ))}
      </div>

      <div className={style.textgroup}>
        <h2 className="global-title">
          {language === 'en' ? 'Recent Transactions' : 'Последние транзакции'}
        </h2>
      </div>

      <div className={style.recentTransactions}>
        <div className={style.tableAlt}>
          <div className={`${style.header}`}>
            <div className={style.thAlt}>
              <p>{language === 'en' ? 'Date' : 'Дата'}</p>
            </div>
            <div className={style.thAlt}>
              <p>{language === 'en' ? 'From card' : 'С карты'}</p>
            </div>
            <div className={style.thAlt}>
              <p>{language === 'en' ? 'To card' : 'На карту'}</p>
            </div>
            <div className={style.thAlt}>
              <p>{language === 'en' ? 'Amount' : 'Сумма'}</p>
            </div>
          </div>

          {currentTransactions.map((transaction: any, index: number) => (
            <div key={`${transaction.date}-${index}`} className={style.trAlt}>
              <div className={style.tdAlt}>
                <p className={style.date}>
                  {language && formatDateTransaction({ language, dateString: transaction.date })}
                </p>
              </div>
              <div className={style.tdAlt}>
                <p>{formatCardNumber(transaction.from)}</p>
              </div>
              <div className={style.tdAlt}>
                <p>{formatCardNumber(transaction.to)}</p>
              </div>
              <div className={style.tdAlt}>
                <p>{transaction.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination
        totalPages={totalPages}
        language={language}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}
