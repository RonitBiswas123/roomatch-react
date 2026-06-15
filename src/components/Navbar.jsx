function Navbar({ navigate, userProfile, onLogout }) {
  return (
    <nav className="bg-slate-900 px-8 py-4 flex justify-between items-center">
      <span
        className="text-white text-xl font-bold cursor-pointer"
        onClick={() => navigate('home')}
      >
        RoomMatch
      </span>
      <div className="flex gap-5 items-center">
        {userProfile ? (
          <>
            <a onClick={() => navigate('dashboard')}
               className="text-blue-300 hover:text-white cursor-pointer text-sm">
              Dashboard
            </a>
            <a onClick={() => navigate('search')}
               className="text-blue-300 hover:text-white cursor-pointer text-sm">
              Search
            </a>
            <a onClick={() => navigate('recommendations')}
               className="text-blue-300 hover:text-white cursor-pointer text-sm">
              Matches
            </a>
            <a onClick={() => navigate('requests')}
               className="text-blue-300 hover:text-white cursor-pointer text-sm">
              Requests
            </a>
            <a onClick={() => navigate('admin')}
               className="text-blue-300 hover:text-white cursor-pointer text-sm">
              Admin
            </a>
            <a onClick={() => navigate('profile')}
               className="text-blue-300 hover:text-white cursor-pointer text-sm">
              Profile
            </a>
            <a onClick={onLogout}
               className="text-red-400 hover:text-red-300 cursor-pointer text-sm">
              Logout
            </a>
          </>
        ) : (
          <>
            <a onClick={() => navigate('login')}
               className="text-blue-300 hover:text-white cursor-pointer text-sm">
              Login
            </a>
            <a onClick={() => navigate('register')}
               className="text-blue-300 hover:text-white cursor-pointer text-sm">
              Register
            </a>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar