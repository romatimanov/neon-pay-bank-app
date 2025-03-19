import style from './pagination.module.css'

type PaginationProps = {
  totalPages: number
  language: string | null
  currentPage: number
  setCurrentPage: (page: any) => void
}
export function Pagination({ totalPages, language, currentPage, setCurrentPage }: PaginationProps) {
  const handlePrev = () => {
    setCurrentPage((prev: number) => Math.max(prev - 1, 1))
  }

  const handleNext = () => {
    setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))
  }

  const getPageNumbers = () => {
    const visiblePages = 4
    let start = Math.max(currentPage - 1, 1)
    let end = start + visiblePages - 1

    if (end > totalPages) {
      end = totalPages
      start = Math.max(end - visiblePages + 1, 1)
    }

    const pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className={style.pagination}>
      <button className={style.buttonNav} onClick={handlePrev} disabled={currentPage === 1}>
        ← {language === 'en' ? 'Previous' : 'Назад'}
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`${style.button} ${currentPage === page ? style.active : ''}`}
        >
          {page}
        </button>
      ))}

      <button
        className={style.buttonNav}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        {language === 'en' ? 'Next' : 'Вперед'} →
      </button>
    </div>
  )
}
