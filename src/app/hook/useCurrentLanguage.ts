'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { setLanguage, Language } from '../store/slice/languageSlice'

export const useCurrentLanguage = () => {
  const dispatch = useDispatch()

  const language = useSelector((state: RootState) => state.language.currentLanguage)

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language | null
    if (storedLang && storedLang !== language) {
      dispatch(setLanguage(storedLang))
    }
    setIsLoaded(true)
  }, [dispatch])

  return isLoaded ? language : null
}
