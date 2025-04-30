'use client'

import { useCurrentLanguage } from '@/app/hook/useCurrentLanguage'
import style from './header.module.css'
import IconSet from '@/icons/lang.svg'
import { usePathname } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setLanguage, Language } from '@/app/store/slice/languageSlice'
import { useState } from 'react'

export function Header({
  onToggleAside,
  isAsideOpen
}: {
  onToggleAside: () => void
  isAsideOpen: boolean
}) {
  const language = useCurrentLanguage()
  const pathname = usePathname()
  const dispatch = useDispatch()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const path = [
    { name: language === 'en' ? 'Overview' : 'Обзор', path: '/' },
    { name: language === 'en' ? 'Accounts' : 'Счета', path: '/accounts' },
    { name: language === 'en' ? 'Transfer' : 'Перевод', path: '/transfer' }
  ]

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev)
  }

  const handleLanguageChange = (lang: Language) => {
    dispatch(setLanguage(lang))
    localStorage.setItem('language', lang)
    setIsDropdownOpen(false)
  }

  return (
    <header className={style.header}>
      <div className="header__logo">
        <h2>{path.find((item) => item.path === pathname)?.name}</h2>
      </div>
      <nav className={style.nav}>
        <ul className={style.list}>
          <li style={{ position: 'relative' }}>
            <IconSet
              className={style.icon}
              onClick={toggleDropdown}
              style={{ cursor: 'pointer' }}
            />
            {isDropdownOpen && (
              <ul className={style.dropdown}>
                <li onClick={() => handleLanguageChange('en')}>English</li>
                <li onClick={() => handleLanguageChange('ru')}>Русский</li>
              </ul>
            )}
          </li>
          <li>
            <div
              className={`${style.burger} ${isAsideOpen ? style.open : ''}`}
              onClick={onToggleAside}
            >
              <div className={`${style.burgerLine} ${style.line1}`} />
              <div className={`${style.burgerLine} ${style.line2}`} />
              <div className={`${style.burgerLine} ${style.line3}`} />
            </div>
          </li>
        </ul>
      </nav>
    </header>
  )
}
