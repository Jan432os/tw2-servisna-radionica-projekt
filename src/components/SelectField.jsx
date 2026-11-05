function SelectField({ id, label, value, onChange, options, error, placeholder }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      <select
        id={id}
        className={`form-select${error ? ' is-invalid' : ''}`}
        value={value}
        onChange={onChange}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error ? <div className="invalid-feedback d-block">{error}</div> : null}
    </div>
  )
}

export default SelectField