import Image from 'next/image'
import style from './infoAccaunt.module.css'

type InfoAccountProps = {
  text: string
  balance: string
  icon: string
}

export function InfoAccount({ text, balance, icon }: InfoAccountProps) {
  return (
    <div className={style.info}>
      <Image src={icon} alt="image" width={70} height={70} />
      <div className={style.infoText}>
        <p className={style.text}>{text}</p>
        <span className={style.balance}>{balance} $</span>
      </div>
    </div>
  )
}
