import { useState } from 'react';

const navItems = [
  {
    id: 'home',
    label: 'Keşfet',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    id: 'upcoming',
    label: 'Yaklaşanlar',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'categories',
    label: 'Kategoriler',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: 'favorites',
    label: 'Favorilerim',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'add',
    label: 'Etkinlik Ekle',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const Sidebar = ({ currentView, onNavigate, user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id) => {
    onNavigate(id === 'upcoming' || id === 'categories' || id === 'favorites' || id === 'add' ? 'home' : id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[60] w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {mobileOpen
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          }
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[240px] bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-300 shrink-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Logo */}
        <div
          className="px-6 py-5 flex items-center gap-2.5 cursor-pointer border-b border-gray-50"
          onClick={() => handleNav('home')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-primary">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-primary">etkinlik</span>
            <span className="text-secondary">.im</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map(item => {
            const isActive = (item.id === 'home' && (currentView === 'home' || currentView === 'detail'));
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-100">
          {user ? (
            <div>
              <div className="flex items-center gap-3 mb-3 px-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {user.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium">Hoş geldin,</p>
                  <p className="font-bold text-primary text-sm truncate">{user}</p>
                </div>
              </div>
              <button
                onClick={() => { onLogout(); setMobileOpen(false); }}
                className="w-full flex items-center justify-center gap-2 text-red-500 font-semibold text-sm px-4 py-2.5 rounded-xl border-2 border-red-100 hover:bg-red-50 hover:border-red-200 transition-all"
              >
                Çıkış Yap
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => { onNavigate('login'); setMobileOpen(false); }}
                className="w-full text-gray-600 font-semibold text-sm px-4 py-2.5 rounded-xl border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => { onNavigate('register'); setMobileOpen(false); }}
                className="w-full bg-primary text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              >
                Kayıt Ol
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
