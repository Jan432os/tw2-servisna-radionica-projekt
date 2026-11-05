function FormField({ id, label, type = 'text', value, onChange, error }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        id={id}
        type={type}
        className={`form-control${error ? ' is-invalid' : ''}`}
        value={value}
        onChange={onChange}
      />
      {error ? <div className="invalid-feedback d-block">{error}</div> : null}
    </div>
  )
}

export default FormField