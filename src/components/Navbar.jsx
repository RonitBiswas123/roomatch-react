function Navbar({ navigate, userProfile, onLogout }) {
  return (
    <nav className="navbar">
      <span className="navbar-brand" onClick={() => navigate('home')}>
        RoomMatch
      </span>
      <div className="navbar-links">
        {userProfile ? (
          <>
            <a onClick={() => navigate('dashboard')}>Dashboard</a>
            <a onClick={() => navigate('profile')}>Edit Profile</a>
            <a onClick={onLogout} style={{ color: '#ff6b6b' }}>Logout</a>
          </>
        ) : (
          <>
            <a onClick={() => navigate('login')}>Login</a>
            <a onClick={() => navigate('register')}>Register</a>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar