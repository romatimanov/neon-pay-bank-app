'use client'
import { gql, useQuery } from '@apollo/client'
import style from './myAccaunts.module.css'
import { useCurrentLanguage } from '@/app/hook/useCurrentLanguage'
import client from '@/lib/apollo-client'
import { useMemo, useState } from 'react'
import { Card } from '@/ui/card/Card'
import { Loader } from '@/ui/loader/Loader'
import Link from 'next/link'
import { useResize } from '@/app/hook/useResize'

export function MyAccaunts() {
  const language = useCurrentLanguage()
  const isMobile = useResize(768)

  const [showAll, setShowAll] = useState(false)

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

  const visibleCards = useMemo(() => {
    if (isMobile && !showAll) {
      return sortedCards.slice(0, 3)
    }
    return sortedCards
  }, [sortedCards, isMobile, showAll])

  if (loading || error) {
    return <Loader loading={loading} error={error} />
  }

  return (
    <div className={style.mycards}>
      <div className={style.textgroup}>
        <h2 className="global-title">{language === 'en' ? 'My accounts' : 'Мои счета'}</h2>
        <Link className={style.button} href="/transfer">
          {language === 'en' ? 'Transfers' : 'Переводы'}
        </Link>
      </div>

      <div className={style.cards}>
        {visibleCards.map((card, index) => (
          <Card
            key={card.account}
            active={index === 0}
            balance={card.balance}
            cardNumber={card.account}
            name="Your name"
          />
        ))}
      </div>

      {isMobile && sortedCards.length > 3 && !showAll && (
        <button className={style.showMoreButton} onClick={() => setShowAll(true)}>
          {language === 'en' ? 'Show more' : 'Показать ещё'}
        </button>
      )}
    </div>
  )
}
