function SortableHeader({ label, sortKey, currentSortKey, direction, onSort }) {
  const isActive = currentSortKey === sortKey
  return (
    <th>
      <button type="button" className="btn btn-link p-0 text-decoration-none fw-bold" onClick={() => onSort(sortKey)}>
        {label}
        {isActive ? (direction === 'asc' ? ' ▲' : ' ▼') : ''}
      </button>
    </th>
  )
}

export default SortableHeader