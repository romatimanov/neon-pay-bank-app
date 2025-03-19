'use client'

import { gql, useQuery } from '@apollo/client'
import client from '@/lib/apollo-client'
import { Loader } from '@/ui/loader/Loader'
import { InfoAccount } from '@/ui/infoAccaunt/InfoAccount'
import style from './info.module.css'
import { formatBalance } from '@/utils/formatBalance'
import { useCurrentLanguage } from '@/app/hook/useCurrentLanguage'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { prepareChartData } from '@/utils/chartData'

export function Info({ id }: { id: string }) {
  const language = useCurrentLanguage()

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
    variables: { id }
  })

  const income = data?.account?.transactions
    ?.filter((transaction: any) => transaction.to === id)
    .reduce((sum: number, transaction: any) => sum + transaction.amount, 0)

  const expenses = data?.account?.transactions
    ?.filter((transaction: any) => transaction.from === id)
    .reduce((sum: number, transaction: any) => sum + transaction.amount, 0)

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
    }
  ]

  const chartData = prepareChartData({ data, language: language ?? 'ru' })

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
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 50, right: 20, bottom: -30, left: -10 }}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  padding: '10px',
                  color: '#333',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
                itemStyle={{ color: '#333', fontSize: '14px' }}
              />
              <Legend
                wrapperStyle={{
                  top: 20,
                  right: 20,
                  backgroundColor: 'none',
                  border: 'none',
                  borderRadius: 3,
                  lineHeight: '40px'
                }}
              />
              <Bar
                dataKey="incoming"
                name={language === 'en' ? 'Diposit' : 'Депозит'}
                fill="#16DBCC"
                barSize={30}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="outgoing"
                name={language === 'en' ? 'Withdraw' : 'Вывод'}
                fill="#FF82AC"
                barSize={30}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}
