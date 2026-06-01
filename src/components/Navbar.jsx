function Navbar({ navigate }) {
  return (
    <nav className="navbar">
      <span
        className="navbar-brand"
        onClick={() => navigate('home')}
        style={{ cursor: 'pointer' }}
      >
        RoomMatch
      </span>
      <div className="navbar-links">
        <a onClick={() => navigate('login')}
           style={{ cursor: 'pointer' }}>
          Login
        </a>
        <a onClick={() => navigate('register')}
           style={{ cursor: 'pointer' }}>
          Register
        </a>
      </div>
    </nav>
  )
}

export default Navbar