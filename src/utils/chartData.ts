import { weekDays, weekDaysEn } from '@/contstants/days'

type ChartData = {
  language: string
  data: any
}
export function prepareChartData({ data, language }: ChartData) {
  const firstAccount = data?.accounts?.[0]?.account
  const transactions = data?.accounts?.flatMap((acc: any) => acc.transactions) || []

  const chartDataMap: Record<string, { day: string; incoming: number; outgoing: number }> = {}

  weekDays.forEach((day) => {
    chartDataMap[day] = { day, incoming: 0, outgoing: 0 }
  })

  transactions.forEach((t: any) => {
    const dateObj = new Date(t.date)
    const day = dateObj.getDay()

    if (day >= 1 && day <= 7) {
      const dayLabel = weekDays[day - 1]
      if (!chartDataMap[dayLabel]) {
        chartDataMap[dayLabel] = { day: dayLabel, incoming: 0, outgoing: 0 }
      }

      if (t.from === firstAccount) {
        chartDataMap[dayLabel].outgoing += t.amount
      } else if (t.to === firstAccount) {
        chartDataMap[dayLabel].incoming += t.amount
      }
    }
  })

  return language === 'en'
    ? weekDaysEn.map((day, index) => ({
        day,
        incoming: chartDataMap[weekDays[index]]?.incoming || 0,
        outgoing: chartDataMap[weekDays[index]]?.outgoing || 0
      }))
    : weekDays.map((day) => chartDataMap[day])
}
