import { useState } from 'react';

const navItems = [
  {
    id: 'home',
    label: 'Keşfet',
    icon: (
      <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    id: 'my-events',
    label: 'Etkinliklerim',
    icon: (
      <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: 'shared-events',
    label: 'Davet Edildiklerim',
    icon: (
      <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'share-events',
    label: 'Etkinlik Paylaş',
    icon: (
      <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a3 3 0 11-5.4 1.8a3 3 0 015.4-1.8zm0-13.44a3 3 0 11-5.4-1.8 3 3 0 015.4 1.8zM6 12a3 3 0 11-5.4 0 3 3 0 015.4 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.4 10.8l7.2-4.2m-7.2 5.4l7.2 4.2" />
      </svg>
    ),
  },
  {
    id: 'upcoming',
    label: 'Yaklaşanlar',
    icon: (
      <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'categories',
    label: 'Kategoriler',
    icon: (
      <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: 'favorites',
    label: 'Favorilerim',
    icon: (
      <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'add',
    label: 'Etkinlik Ekle',
    icon: (
      <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const Sidebar = ({ currentView, onNavigate, user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id) => {
    onNavigate(id === 'categories' || id === 'favorites' ? 'home' : id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger - kapalıyken duvara gömülü } şeklinde, açılınca sidebar kenarına yaslanır */}
      <button
        className={`lg:hidden fixed z-[60] flex items-center justify-center text-gray-600 hover:text-primary transition-all duration-300 bg-white shadow-lg ${
          mobileOpen
            ? 'top-4 left-[288px] w-10 h-10 rounded-xl'
            : 'top-14 left-0 w-5 h-14 rounded-r-xl'
        }`}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <svg className={`${mobileOpen ? 'w-5 h-5' : 'w-4 h-4'} transition-all`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

      {/* Sidebar Wrapper Container */}
      <div 
        className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out shrink-0 group ${
          mobileOpen 
            ? 'w-[280px] translate-x-0' 
            : '-translate-x-full lg:translate-x-0 w-[280px] lg:w-[96px] lg:hover:w-[280px]'
        }`}
      >
        {/* Sidebar layout itself (clipped internally with overflow-hidden) */}
        <aside className="w-full h-full bg-white/75 backdrop-blur-2xl border-r border-white/45 flex flex-col overflow-hidden pointer-events-auto relative shadow-sm lg:group-hover:shadow-2xl lg:group-hover:shadow-gray-200/80">
          
          {/* Logo */}
          <div
            className="px-[26px] lg:group-hover:px-6 py-6 flex items-center gap-3 cursor-pointer border-b border-gray-50 overflow-hidden shrink-0"
            onClick={() => handleNav('home')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-primary shrink-0 transition-transform duration-300 hover:scale-105 active:scale-95">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="text-2xl font-extrabold tracking-tight transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 whitespace-nowrap overflow-hidden">
              <span className="text-primary">etkinlik</span>
              <span className="text-secondary">.in</span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3.5 py-5 space-y-2.5 overflow-y-auto overflow-x-hidden">
            {navItems.map(item => {
              if ((item.id === 'my-events' || item.id === 'shared-events' || item.id === 'share-events') && !user) return null;
              const isActive = item.id === currentView || (item.id === 'home' && (currentView === 'home' || currentView === 'detail'));
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`group/btn w-full flex items-center gap-4 px-[21px] lg:group-hover:px-4 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-[1.01] active:scale-[0.96] ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-primary hover:shadow-sm'
                  }`}
                >
                  <div className="shrink-0 transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-[8deg]">{item.icon}</div>
                  <span className="transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 group-hover/btn:translate-x-1.5 whitespace-nowrap overflow-hidden">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-100 overflow-hidden shrink-0">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm shadow-primary/10">
                    {user.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 whitespace-nowrap overflow-hidden">
                    <p className="text-xs text-gray-400 font-medium">Hoş geldin,</p>
                    <p className="font-bold text-primary text-sm truncate">{user}</p>
                  </div>
                </div>
                <button
                  onClick={() => { onLogout(); setMobileOpen(false); }}
                  className="group/logout w-full flex items-center justify-center lg:justify-start gap-3.5 text-red-500 font-bold text-base px-4 lg:px-[17px] lg:group-hover:px-4 py-3.5 rounded-xl border-2 border-red-100 hover:bg-red-50 hover:border-red-200 hover:scale-[1.01] active:scale-[0.96] transition-all duration-300"
                >
                  <svg className="w-[30px] h-[30px] shrink-0 transition-transform duration-300 group-hover/logout:scale-110 group-hover/logout:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 group-hover/logout:translate-x-1.5 whitespace-nowrap overflow-hidden">
                    Çıkış Yap
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => { onNavigate('login'); setMobileOpen(false); }}
                  className="group/login w-full flex items-center justify-center lg:justify-start gap-3.5 text-gray-600 font-bold text-base px-4 lg:px-[17px] lg:group-hover:px-4 py-3.5 rounded-xl border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:scale-[1.01] active:scale-[0.96] transition-all duration-300"
                >
                  <svg className="w-[30px] h-[30px] shrink-0 transition-transform duration-300 group-hover/login:scale-110 group-hover/login:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 group-hover/login:translate-x-1.5 whitespace-nowrap overflow-hidden">
                    Giriş Yap
                  </span>
                </button>
                <button
                  onClick={() => { onNavigate('register'); setMobileOpen(false); }}
                  className="group/register w-full flex items-center justify-center lg:justify-start gap-3.5 bg-primary text-white font-bold text-base px-4 lg:px-[17px] lg:group-hover:px-4 py-3.5 rounded-xl hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.96] transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                >
                  <svg className="w-[30px] h-[30px] shrink-0 transition-transform duration-500 group-hover/register:scale-110 group-hover/register:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 group-hover/register:translate-x-1.5 whitespace-nowrap overflow-hidden">
                    Kayıt Ol
                  </span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Sharp vertical edge gradient border (OUTSIDE aside, so it NEVER gets clipped!) */}
        <div className="absolute top-0 right-0 w-[3px] h-full bg-gradient-to-b from-[#f8c210] to-[#10b981] opacity-100 transition-opacity duration-300 group-hover:opacity-0 z-20 pointer-events-none" />
      </div>
    </>
  );
};

export default Sidebar;
