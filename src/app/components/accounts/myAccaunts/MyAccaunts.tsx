'use client'
import { gql, useQuery } from '@apollo/client'
import style from './myAccaunts.module.css'
import { useCurrentLanguage } from '@/app/hook/useCurrentLanguage'
import client from '@/lib/apollo-client'
import { useMemo } from 'react'
import { Card } from '@/ui/card/Card'
import { Loader } from '@/ui/loader/Loader'
import Link from 'next/link'

export function MyAccaunts() {
  const language = useCurrentLanguage()

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

  if (loading || error) {
    return <Loader loading={loading} error={error} />
  }

  return (
    <div className={style.mycards}>
      <div className={style.textgroup}>
        <h2 className="global-title">{language === 'en' ? 'My accounts' : 'Мои счета'}</h2>
        <Link className={style.button} href="/transfer">
          {language === 'en' ? 'Transfer' : 'Перевод'}
        </Link>
      </div>

      <div className={style.cards}>
        {sortedCards.map((card, index) => (
          <Card
            key={card.account}
            active={index === 0}
            balance={card.balance}
            cardNumber={card.account}
            name={'Your name'}
          />
        ))}
      </div>
    </div>
  )
}
