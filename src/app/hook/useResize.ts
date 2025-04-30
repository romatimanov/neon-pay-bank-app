import { useEffect, useState } from 'react'

export const useResize = (width: number) => {
  const [isResize, setIsResize] = useState<null | boolean>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsResize(window.innerWidth <= width)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [width])

  return isResize
}
