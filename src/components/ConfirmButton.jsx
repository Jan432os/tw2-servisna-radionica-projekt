function ConfirmButton({ children, confirmMessage, onConfirm, className }) {
  function handleClick() {
    const confirmed = window.confirm(confirmMessage)
    if (confirmed) {
      onConfirm()
    }
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  )
}

export default ConfirmButton