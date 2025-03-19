import style from './button.module.css'

type ButtonProps = {
  children: React.ReactNode
  onclick?: () => void
  styles?: string
}
export function Button({ children, onclick, styles }: ButtonProps) {
  return (
    <button onClick={onclick} className={style.button + ' ' + styles}>
      {children}
    </button>
  )
}
