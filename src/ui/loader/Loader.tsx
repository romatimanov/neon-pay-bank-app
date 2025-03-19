import style from './loader.module.css'

type LoaderProps = {
  loading: any
  error: any
}

export function Loader({ loading, error }: LoaderProps) {
  if (loading)
    return (
      <div className={style.load}>
        <span className={style.loader}></span>
      </div>
    )

  if (error)
    return (
      <div className={style.load}>
        <p>{error.message}</p>
      </div>
    )
  return null
}
