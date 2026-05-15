import { useState, useEffect, useCallback, useRef } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EventMap from './components/EventMap';
import EventCard from './components/EventCard';
import Bottombar from './components/Bottombar';
import EventDetail from './components/EventDetail';

import { authService } from './api/authService';
import { taskService, parseTask, parseElasticTask, parseTaskDetail } from './api/taskService';

function EventDetailRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  useEffect(() => {
    if (id == null) return;

    let ignore = false;

    const fetchEventDetail = async () => {
      setDetailLoading(true);
      setDetailError(null);

      try {
        const data = await taskService.getTaskById(id);
        if (!ignore) {
          setSelectedEvent(parseTaskDetail(data));
        }
      } catch (err) {
        console.error('Etkinlik detay hatasi:', err);
        if (!ignore) {
          setDetailError('Etkinlik detaylari yuklenirken bir hata olustu.');
          setSelectedEvent(null);
        }
      } finally {
        if (!ignore) {
          setDetailLoading(false);
        }
      }
    };

    fetchEventDetail();

    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <EventDetail
      event={selectedEvent}
      loading={detailLoading}
      error={detailError}
      onBack={() => navigate('/')}
    />
  );
}

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [mapFilter, setMapFilter] = useState('all');
  const currentView = pathname.startsWith('/events/')
    ? 'detail'
    : pathname === '/login'
      ? 'login'
      : pathname === '/register'
        ? 'register'
        : 'home';

  // --- Event state ---
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 6;

  // --- Search state ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const isSearching = searchQuery.trim().length > 0;
  const debounceRef = useRef(null);

  const fetchEvents = useCallback(async (pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks(pageNum, PAGE_SIZE);
      setEvents(data.content.map(parseTask));
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      setError('Etkinlikler yüklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentView === 'home' && !isSearching) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchEvents(page);
    }
  }, [currentView, page, fetchEvents, isSearching]);

  // --- Debounced search ---
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length === 0) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await taskService.searchTasks(value.trim());
        setSearchResults(results.map(parseElasticTask));
      } catch (err) {
        console.error('Arama hatası:', err);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  // Which events to display: search results or paginated events
  const displayedEvents = isSearching ? searchResults : events;
  const isLoading = isSearching ? searchLoading : loading;

  const openEventDetail = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleNavigate = (view) => {
    const paths = {
      home: '/',
      login: '/login',
      register: '/register',
    };
    navigate(paths[view] ?? '/');
  };

  const filterPills = [
    { id: 'all', label: 'Tümü', color: 'bg-primary' },
    { id: 'today', label: 'Bugün', color: 'bg-red-500' },
    { id: 'week', label: 'Bu Hafta', color: 'bg-amber-500' },
    { id: 'month', label: 'Bu Ay', color: 'bg-blue-500' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">

      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        user={user}
        onLogout={() => {
          authService.logout();
          setUser(null);
          navigate('/');
        }}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">

        {/* Top Search Bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="flex items-center gap-3 px-6 py-3 max-w-[1800px] mx-auto">
            {/* Search Input */}
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Etkinlik, kategori veya konum ara..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-500 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {/* Location Button */}
            <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all whitespace-nowrap">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Konumum
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Add Event Button */}
            <button className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Etkinlik Ekle
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 max-w-[1800px] mx-auto w-full">

          <Routes>
            <Route path="/events/:id" element={<EventDetailRoute />} />
            <Route path="/" element={(
            <div className="flex flex-col lg:flex-row gap-6 items-start w-full">

              {/* Left: Map */}
              <div className="w-full lg:w-[45%] flex flex-col gap-3 shrink-0">
                <div className="h-[350px] lg:h-[calc(100vh-11rem)] lg:sticky lg:top-[4.5rem] rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
                  <EventMap events={displayedEvents} onEventSelect={openEventDetail} />
                </div>
                {/* Map Filter Pills */}
                <div className="flex items-center justify-center gap-2 py-2">
                  {filterPills.map(pill => (
                    <button
                      key={pill.id}
                      onClick={() => setMapFilter(pill.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        mapFilter === pill.id
                          ? 'bg-white shadow-md text-gray-800 border border-gray-200'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${pill.color}`} />
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Cards */}
              <div className="w-full lg:w-[55%] pb-8">

                {/* Title & Filters */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                      {isSearching ? (
                        <><span className="text-primary">Arama:</span> "{searchQuery}"</>
                      ) : (
                        <>Yakındaki <span className="text-primary">Etkinlikler</span></>
                      )}
                    </h1>
                    <p className="text-gray-400 font-medium text-sm mt-1">
                      {isLoading ? 'Aranıyor…' : `${displayedEvents.length} etkinlik listeleniyor`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Filtrele
                    </button>
                    <button className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm">
                      Yakınlık
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-xl font-medium">
                    {error}
                  </div>
                )}

                {/* Skeleton Loader */}
                {isLoading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
                    {Array.from({ length: isSearching ? 6 : PAGE_SIZE }).map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="h-[160px] ec-shimmer" />
                        <div className="p-4 space-y-2.5">
                          <div className="h-4 ec-shimmer rounded-lg w-3/4" />
                          <div className="h-3 ec-shimmer rounded-lg w-full" style={{ animationDelay: '0.15s' }} />
                          <div className="flex justify-between pt-2">
                            <div className="h-3 ec-shimmer rounded w-2/5" style={{ animationDelay: '0.3s' }} />
                            <div className="h-3 ec-shimmer rounded w-1/6" style={{ animationDelay: '0.45s' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Card Grid */}
                {!isLoading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
                    {displayedEvents.length > 0 ? (
                      displayedEvents.map(event => (
                        <EventCard key={event.id} event={event} onSelect={openEventDetail} />
                      ))
                    ) : isSearching ? (
                      <div className="col-span-full text-center py-16">
                        <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-gray-400 font-semibold text-lg">Sonuç bulunamadı</p>
                        <p className="text-gray-300 text-sm mt-1">"{searchQuery}" için eşleşen etkinlik yok</p>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Pagination - only in non-search mode */}
                {!isSearching && !loading && totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <button
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm shadow-sm"
                    >
                      ← Önceki
                    </button>
                    <span className="text-sm font-semibold text-gray-500 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm">
                      {page + 1} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm shadow-md shadow-primary/20"
                    >
                      Sonraki →
                    </button>
                  </div>
                )}

                {/* Tümünü Görüntüle Button */}
                {!isSearching && !loading && events.length > 0 && (
                  <div className="flex justify-center mt-6">
                    <button className="flex items-center gap-2 text-primary font-semibold text-sm border-2 border-primary/20 px-6 py-2.5 rounded-xl hover:bg-primary/5 transition-all">
                      Tümünü Görüntüle
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                )}

              </div>
            </div>
            )} />

            <Route path="/login" element={(
            <Login
              onNavigateToRegister={() => navigate('/register')}
              onLoginSuccess={(username) => {
                setUser(username);
                navigate('/');
              }}
            />
            )} />

            <Route path="/register" element={(
            <Register
              onNavigateToLogin={() => navigate('/login')}
              onRegisterSuccess={() => navigate('/login')}
            />
            )} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

        </div>
        <Bottombar />
      </main>
    </div>
  );
}

export default App;
