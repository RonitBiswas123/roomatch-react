function Button({ text, type = 'primary', onClick, fullWidth = false, submit = false }) {
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-800 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent',
    danger:  'bg-red-500 hover:bg-red-700 text-white',
  }

  return (
    <button
      className={`${styles[type]} ${fullWidth ? 'w-full' : ''} px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200`}
      onClick={onClick}
      type={submit ? 'submit' : 'button'}
    >
      {text}
    </button>
  )
}

export default Button