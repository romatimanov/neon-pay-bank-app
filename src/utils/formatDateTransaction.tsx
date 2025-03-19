import { monthNames, monthNamesEn } from '@/contstants/months'

type FormatProps = {
  language: string
  dateString: string
}

export function formatDateTransaction({ language, dateString }: FormatProps): string {
  const date = new Date(dateString)
  const day = date.getDate()

  const month = language === 'en' ? monthNamesEn[date.getMonth()] : monthNames[date.getMonth()]

  return `${day} ${month.split('').splice(0, 3).join('')} ${
    date.getHours() + ':' + date.getMinutes()
  }`
}
