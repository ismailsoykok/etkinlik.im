const Navbar = ({ onNavigate, user, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            {/* Simple Map Pin Icon resembling the logo */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-primary">etkinlik</span>
              <span className="text-secondary">.im</span>
            </span>
          </div>

          {/* Center Links (Optional) */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate('home')} className="text-gray-600 hover:text-primary font-medium transition-colors">Keşfet</button>
            <button className="text-gray-600 hover:text-primary font-medium transition-colors">Yaklaşanlar</button>
            <button className="text-gray-600 hover:text-primary font-medium transition-colors">Kategoriler</button>
          </div>

          {/* Auth Divs - Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  Hoş geldin, <span className="font-bold text-primary">{user}</span>
                </span>
                <button 
                  onClick={onLogout}
                  className="text-red-500 font-medium hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => onNavigate('login')}
                  className="text-gray-600 font-medium hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Giriş Yap
                </button>
                <button 
                  onClick={() => onNavigate('register')}
                  className="bg-primary text-white font-medium px-5 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                >
                  Kayıt Ol
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-500 hover:text-primary focus:outline-none p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
