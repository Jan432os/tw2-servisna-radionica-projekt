function Pagination({ currentPage, totalPages, totalItems, onPrev, onNext }) {
  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
      <button type="button" className="btn btn-outline-secondary btn-sm" disabled={currentPage <= 1} onClick={onPrev}>
        Prethodna
      </button>
      <span>Stranica {currentPage} / {totalPages} ({totalItems} zapisa)</span>
      <button type="button" className="btn btn-outline-secondary btn-sm" disabled={currentPage >= totalPages} onClick={onNext}>
        Sljedeća
      </button>
    </div>
  )
}

export default Pagination