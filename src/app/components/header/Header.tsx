'use client'

import { useCurrentLanguage } from '@/app/hook/useCurrentLanguage'
import style from './header.module.css'
import IconSet from '@/icons/setting.svg'
import { usePathname } from 'next/navigation'
import { Button } from '@/ui/button/Button'
export function Header() {
  const language = useCurrentLanguage()
  const pathname = usePathname()

  const path = [
    {
      name: language === 'en' ? 'Overview' : 'Обзор',
      path: '/'
    },
    {
      name: language === 'en' ? 'Transactions' : 'Транзакции',
      path: '/transactions'
    }
  ]
  return (
    <header className={style.header}>
      <div className="header__logo">
        <h2>{path && path.find((item) => item.path === pathname)?.name}</h2>
      </div>
      <nav className={style.nav}>
        <ul className={style.list}>
          <li>
            <IconSet className={style.icon} />
          </li>
          <li>
            <Button>{language === 'en' ? 'Login' : 'Войти'}</Button>
          </li>
        </ul>
      </nav>
    </header>
  )
}
