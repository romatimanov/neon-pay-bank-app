import { useCurrentLanguage } from '@/app/hook/useCurrentLanguage'
import style from './card.module.css'
import Image from 'next/image'
import { formatCardNumber } from '@/utils/formatCardNumber'
import { useRouter } from 'next/navigation'
import { formatBalance } from '@/utils/formatBalance'

type CardProps = {
  active?: boolean
  balance: number
  cardNumber: string
  name: string
}
export function Card({ active, balance, cardNumber, name }: CardProps) {
  const language = useCurrentLanguage()
  const route = useRouter()

  return (
    <div
      className={`${style.card} ${active ? style.active : ''}`}
      onClick={() => route.push(`accounts/${cardNumber}`)}
    >
      <div className={style.cardInfo}>
        <div className={style.cardFront}>
          <div className={style.cardLogo}>
            <p className={style.cardBalance}>{language === 'en' ? 'Balance' : 'Баланс'}</p>
            <p className={style.cardBalanceValue}>{formatBalance(balance)} $</p>
          </div>
          <Image src="/chip-active.png" alt="logo" width={25} height={25} />
        </div>
        <div className={style.cardNumber}>
          <span className={style.cardDigitGroup}>{formatCardNumber(cardNumber)}</span>
        </div>
        <div className={style.cardBack}>
          <div className={style.cardValidThru}>
            {language === 'en' ? 'Valid Thru' : 'Действителен до'}
          </div>
          <div className={style.cardExpDate}>
            <time>01/38</time>
          </div>
        </div>
        <div className={style.cardName}>
          {language === 'en' ? 'Card Holder' : 'Владелец карты'}
          <Image src="/card.png" alt="logo" width={44} height={30} />
        </div>
      </div>
      <div className={style.cardTexture}></div>
    </div>
  )
}
