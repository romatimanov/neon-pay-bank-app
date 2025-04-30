'use client'

import { formatDateTransaction } from '@/utils/formatDateTransaction'
import style from './transactionTable.module.css'
import { formatCardNumber } from '@/utils/formatCardNumber'
import { Pagination } from '../pagination/Pagination'
import { useMemo, useState } from 'react'

type TransactionsTableProps = {
  language: string
  allTransactions?: any
}

export function TransactionsTable({ language, allTransactions }: TransactionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(allTransactions.length / itemsPerPage)

  const currentTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return allTransactions.slice(start, end)
  }, [allTransactions, currentPage])

  return (
    <>
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
              <div className={style.tdAlt} data-label={language === 'en' ? 'Date' : 'Дата'}>
                <p className={style.date}>
                  {language && formatDateTransaction({ language, dateString: transaction.date })}
                </p>
              </div>
              <div className={style.tdAlt} data-label={language === 'en' ? 'From card' : 'С карты'}>
                <p>{formatCardNumber(transaction.from)}</p>
              </div>
              <div className={style.tdAlt} data-label={language === 'en' ? 'To card' : 'На карту'}>
                <p>{formatCardNumber(transaction.to)}</p>
              </div>
              <div className={style.tdAlt} data-label={language === 'en' ? 'Amount' : 'Сумма'}>
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
    </>
  )
}
