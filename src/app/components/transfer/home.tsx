'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import Select from 'react-select'
import style from './style.module.css'
import { useCurrentLanguage } from '@/app/hook/useCurrentLanguage'
import { TransactionsTable } from '@/ui/transactionsTable/TransactionsTable'

const GET_ACCOUNTS = gql`
  query {
    accounts {
      account
      balance
    }
  }
`

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

const TRANSFER = gql`
  mutation Transfer($from: String!, $to: String!, $amount: Float!) {
    transfer(from: $from, to: $to, amount: $amount) {
      account
      balance
    }
  }
`

const TRANSACTIONS = gql`
  query {
    outgoingTransactions {
      date
      amount
      from
      to
    }
  }
`
type ExchangeRate = {
  from: string
  to: string
  rate: number
  change: number
}

type AccountOption = {
  value: string
  label: string
}

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

export function Home() {
  const { data } = useQuery(GET_ACCOUNTS)
  const [transfer] = useMutation(TRANSFER)
  const [from, setFrom] = useState<AccountOption | null>(null)
  const [to, setTo] = useState<AccountOption | null>(null)
  const [amount, setAmount] = useState('')
  const language = useCurrentLanguage()
  const hasMounted = useHasMounted()
  const [filter, setFilter] = useState('')
  const { data: transactionsData } = useQuery(TRANSACTIONS)
  const allTransactions = (transactionsData?.outgoingTransactions || [])
    .slice()
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const [currencies, setCurrencies] = useState<Record<string, ExchangeRate>>({})

  const accounts = data?.accounts || []
  const currencyList = Object.values(currencies).sort((a, b) =>
    (a.from + a.to).localeCompare(b.from + b.to)
  )
  const filteredCurrencyList = currencyList.filter(
    (c) => c.from.includes(filter) || c.to.includes(filter)
  )

  const options: AccountOption[] = accounts.map((a: any) => ({
    value: a.account,
    label: `${a.account} — ${a.balance}₽`
  }))

  const handleSubmit = async () => {
    if (!from || !to) return

    try {
      await transfer({
        variables: {
          from: from.value,
          to: to.value,
          amount: parseFloat(amount)
        },
        refetchQueries: [
          { query: GET_ACCOUNTS },
          { query: GET_ACCOUNT, variables: { id: from.value } },
          { query: GET_ACCOUNT, variables: { id: to.value } }
        ]
      })
      setAmount('')
    } catch (err: any) {
      alert(err.message)
    }
  }

  useEffect(() => {
    const socket = new WebSocket('ws://neon-bank-ws.onrender.com')

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'subscribe', channel: 'currency' }))
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'EXCHANGE_RATE_CHANGE') {
        const key = `${data.from}/${data.to}`
        setCurrencies((prev) => ({
          ...prev,
          [key]: data
        }))
      }
    }

    socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error)
    }

    socket.onclose = () => {
      console.log('🔌 WebSocket disconnected')
    }

    return () => {
      socket.close()
    }
  }, [])

  return (
    <div className={style.home}>
      <div className={style.transferContainer}>
        <div className={style.transfer}>
          <label className={style.label}>{language ? 'From card' : 'С карты'}</label>
          {hasMounted && (
            <Select
              className={style.select}
              options={options}
              value={from}
              onChange={setFrom}
              placeholder={language ? 'Select account' : 'Выберите счёт'}
            />
          )}

          <label className={style.label}>{language ? 'To card' : 'На карту'}</label>
          {hasMounted && (
            <Select
              className={style.select}
              options={options}
              value={to}
              onChange={setTo}
              placeholder={language ? 'Select account' : 'Выберите счёт'}
            />
          )}

          <label className={style.label}>{language ? 'Amount' : 'Сумма'}</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => {
              const value = e.target.value
              if (/^\d*\.?\d*$/.test(value)) {
                setAmount(value)
              }
            }}
            placeholder={language ? 'Enter amount' : 'Введите сумму'}
            className={style.input}
          />

          <button
            className={style.button}
            onClick={handleSubmit}
            disabled={!from || !to || !amount}
          >
            {language === 'en' ? 'Transfer' : 'Перевести'}
          </button>
        </div>

        <div className={style.websocketBox}>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value.toUpperCase())}
            placeholder={language === 'en' ? 'Filter by currency' : 'Фильтр по валюте'}
            className={style.input}
          />

          {filteredCurrencyList.length > 0 ? (
            <ul className={style.rateList}>
              {filteredCurrencyList.map((c, idx) => (
                <li key={idx} className={style.rateItem}>
                  <span className={style.ratePair}>
                    {c.from}/{c.to}
                  </span>
                  <span className={`${style.rateValue} ${c.change > 0 ? style.up : style.down}`}>
                    {c.rate} {c.change > 0 ? '↑' : c.change < 0 ? '↓' : '→'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={style.rate}>
              {language === 'en' ? 'No matching currencies...' : 'Валюты не найдены...'}
            </p>
          )}
        </div>
      </div>

      <div className={style.container}>
        <h2 className="global-title">
          {language === 'en' ? 'Transfer history' : 'История переводов'}
        </h2>
        <TransactionsTable
          language={language ? language : 'ru'}
          allTransactions={allTransactions}
        />
      </div>
    </div>
  )
}
