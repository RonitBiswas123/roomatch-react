function Button({ text, type = 'primary', onClick, fullWidth = false, submit = false }) {
  return (
    <button
      className={`btn btn-${type}`}
      onClick={onClick}
      type={submit ? 'submit' : 'button'}
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      {text}
    </button>
  )
}

export default Button