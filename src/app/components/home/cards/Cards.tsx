'use client'

import { useCurrentLanguage } from '@/app/hook/useCurrentLanguage'
import style from './cards.module.css'
import { gql, useQuery } from '@apollo/client'
import client from '@/lib/apollo-client'
import { Card } from '@/ui/card/Card'
import IconCardMinus from '@/icons/minus-card.svg'
import IconCardPlus from '@/icons/plus-card.svg'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { formatDateRu } from '@/utils/formatDate'
import { prepareChartData } from '@/utils/chartData'
import { useRouter } from 'next/navigation'
import { formatCardNumber } from '@/utils/formatCardNumber'
import { Loader } from '@/ui/loader/Loader'

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

export function Cards() {
  const language = useCurrentLanguage()
  const { data, loading, error } = useQuery(GET_ACCOUNTS, { client })
  const firstAccount = data?.accounts?.[0]?.account
  const route = useRouter()

  const sortedData = [...(data?.accounts || [])].sort((a, b) => b.balance - a.balance)

  const CustomCursor = (props: any) => {
    const { x, y, width, height } = props
    return <rect x={x} y={y} width={width} height={height} fill="#539BFF90" rx={5} ry={5} />
  }

  const chartData = prepareChartData({ data, language: language ?? 'ru' })

  const COLORS = ['#16DBCC', '#FF82AC']
  const pieData = [
    {
      name: language === 'en' ? 'Deposit' : 'Депозит',
      value: chartData.reduce((sum, d) => sum + d.incoming, 0)
    },
    {
      name: language === 'en' ? 'Withdraw' : 'Вывод',
      value: chartData.reduce((sum, d) => sum + d.outgoing, 0)
    }
  ]

  if (loading || error) {
    return <Loader loading={loading} error={error} />
  }

  return (
    <div className={style.cards}>
      <div className={style.cardContent}>
        <div className={style.cardTextGroup}>
          <h2 className="global-title">{language === 'en' ? 'My Cards' : 'Мои карты'}</h2>
          <button className={style.button} onClick={() => route.push('/accounts')}>
            {language === 'en' ? 'See All' : 'Посмотреть все'}
          </button>
        </div>
        <div className={style.cardsGroup}>
          {sortedData?.slice(0, 2).map((account: any, index: number) => {
            return (
              <Card
                key={account.account}
                active={index === 0}
                balance={account.balance}
                cardNumber={account.account}
                name={'Your name'}
              />
            )
          })}
        </div>
      </div>
      <div className={style.cardContent}>
        <div className={style.cardTextGroup}>
          <h2 className="global-title">
            {language === 'en' ? 'Recent Transaction' : 'Последние транзакции'}
          </h2>
        </div>
        <div className={style.cardTransactions}>
          {sortedData
            ?.flatMap((account: any) => account.transactions)
            ?.filter(
              (transaction: any) =>
                transaction.from === firstAccount || transaction.to === firstAccount
            )
            ?.map((transaction: any, index: number) => (
              <div key={`${transaction.date}-${index}`} className={style.cardInfo}>
                <div className={style.cardInfoGroup}>
                  <div className={style.cardInfoIcon}>
                    {transaction.from === firstAccount ? <IconCardMinus /> : <IconCardPlus />}
                  </div>
                  <div>
                    <p className={style.cardInfoNum}>{formatCardNumber(firstAccount)}</p>
                    <p className={style.cardInfoDate}>
                      {language && formatDateRu({ dateString: transaction.date, language })}
                    </p>
                  </div>
                </div>
                <p className={transaction.from === firstAccount ? style.minus : style.plus}>
                  {transaction.from === firstAccount ? '- ' : '+ '}
                  {transaction.amount}
                </p>
              </div>
            ))}
        </div>
      </div>
      <div className={style.cardContent}>
        <div className={style.cardTextGroup}>
          <h2 className="global-title">
            {language === 'en' ? 'Weekly Activity' : 'Недельная активность'}
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 50, right: 20, bottom: -30, left: -10 }}>
            <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={<CustomCursor />}
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

      <div className={style.cardContent}>
        <div className={style.cardTextGroup}>
          <h2 className="global-title">
            {language === 'en' ? 'Expense Statistics' : 'Статистика расходов'}
          </h2>
        </div>
        <PieChart width={730} height={250}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={250}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </div>
  )
}
