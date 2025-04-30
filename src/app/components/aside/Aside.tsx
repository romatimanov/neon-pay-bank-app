'use client'

import Image from 'next/image'
import style from './aside.module.css'
import { usePathname, useRouter } from 'next/navigation'
import IconHome from '@/icons/home.svg'
import IconTransaction from '@/icons/transaction.svg'
import User from '@/icons/user.svg'
import { useCurrentLanguage } from '@/app/hook/useCurrentLanguage'

export function Aside({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const language = useCurrentLanguage()
  const pathname = usePathname()

  const nav = [
    { name: language === 'en' ? 'Dashboard' : 'Главная', icon: IconHome, path: '/' },
    { name: language === 'en' ? 'Accounts' : 'Счета', icon: User, path: '/accounts' },
    { name: language === 'en' ? 'Transfer' : 'Перевод', icon: IconTransaction, path: '/transfer' }
  ]

  return (
    <aside className={`${style.aside} ${isOpen ? style.open : ''}`}>
      <div className={style.logo} onClick={() => router.push('/')}>
        <Image className={style.img} src={'/logo.png'} alt="logo" width={200} height={70} />
      </div>
      <nav className={style.nav}>
        <ul className={style.list}>
          {nav.map((item) => (
            <li
              className={`${style.item} ${
                pathname === item.path || pathname.startsWith(item.path + '/') ? style.active : ''
              }`}
              key={item.name}
              onClick={() => {
                router.push(item.path)
                onClose()
              }}
            >
              <item.icon className={style.icon} />
              <p className={style.text}>{item.name}</p>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
