import { monthNames, monthNamesEn } from '@/contstants/months'

type FormatProps = {
  language: string
  dateString: string
}

export function formatDateRu({ language, dateString }: FormatProps): string {
  const date = new Date(dateString)
  const day = date.getDate()

  const month = language === 'en' ? monthNamesEn[date.getMonth()] : monthNames[date.getMonth()]
  const year = date.getFullYear()

  return `${day} ${month} ${year}`
}
