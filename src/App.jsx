import { useState, useEffect, useCallback, useRef } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EventMap from './components/EventMap';
import EventCard from './components/EventCard';
import Bottombar from './components/Bottombar';
import EventDetail from './components/EventDetail';
import AddEventPage from './components/AddEventPage';
import MyEventsPage from './components/MyEventsPage';
import UpcomingEventsPage from './components/UpcomingEventsPage';
import SharedEventsPage from './components/SharedEventsPage';
import ShareEventPage from './components/ShareEventPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
          const status = err.response?.status;
          if (status === 403) {
            setDetailError('403_FORBIDDEN');
          } else {
            setDetailError('Etkinlik detaylari yuklenirken bir hata olustu.');
          }
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
  const currentView = pathname === '/events/new'
    ? 'add'
    : pathname.startsWith('/events/')
      ? 'detail'
      : pathname === '/login'
        ? 'login'
        : pathname === '/register'
          ? 'register'
          : pathname === '/my-events'
            ? 'my-events'
            : pathname === '/upcoming'
              ? 'upcoming'
              : pathname === '/shared-events'
                ? 'shared-events'
                : pathname === '/share-events'
                  ? 'share-events'
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

  // --- Geolocation state ---
  const [userLocation, setUserLocation] = useState(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [minDistance, setMinDistance] = useState(0);
  const [maxDistance, setMaxDistance] = useState(10);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleGetCoords = () => {
    setLocatingUser(true);

    const useIpFallback = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const ipData = await res.json();
        if (ipData.latitude && ipData.longitude) {
          const coords = {
            lat: Number(ipData.latitude.toFixed(6)),
            lng: Number(ipData.longitude.toFixed(6)),
          };
          setUserLocation(coords);
        } else {
          throw new Error("Invalid IP geo coordinates");
        }
      } catch (ipError) {
        console.error("IP geolocation failed:", ipError);
        toast.error("Konumunuz tespit edilemedi. Lütfen tarayıcınızın konum izinlerini kontrol edin.");
      } finally {
        setLocatingUser(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: Number(position.coords.latitude.toFixed(6)),
            lng: Number(position.coords.longitude.toFixed(6)),
          };
          setUserLocation(coords);
          setLocatingUser(false);
        },
        (error) => {
          console.warn("Tarayıcı konum servisi başarısız oldu, IP konumuna geçiliyor...", error);
          useIpFallback();
        },
        { enableHighAccuracy: true, timeout: 4000 }
      );
    } else {
      useIpFallback();
    }
  };

  const fetchEvents = useCallback(async (pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const lat = userLocation?.lat || 41.0082; // Varsayılan İstanbul
      const lng = userLocation?.lng || 28.9784;
      const data = await taskService.getNearbyTasks(lat, lng, minDistance, maxDistance);
      setEvents(data.content.map(parseTask));
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      setError('Etkinlikler yüklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userLocation, minDistance, maxDistance]);

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
      add: '/events/new',
      'my-events': '/my-events',
      upcoming: '/upcoming',
      'shared-events': '/shared-events',
      'share-events': '/share-events',
    };
    navigate(paths[view] ?? '/');
  };

  const filterPills = [
    { id: 'all', label: 'Tümü', color: 'bg-primary' },
    { id: 'today', label: 'Bugün', color: 'bg-red-500' },
    { id: 'week', label: 'Bu Hafta', color: 'bg-amber-500' },
    { id: 'month', label: 'Bu Ay', color: 'bg-blue-500' },
  ];

  const homeLayout = (
    <div className={`flex flex-col lg:flex-row gap-6 items-start w-full transition-all duration-500 ${
      ['login', 'register'].includes(currentView) ? 'blur-lg pointer-events-none select-none' : ''
    }`}>

      {/* Left: Map */}
      <div className="w-full lg:w-[44%] flex flex-col gap-3 shrink-0">
        <div className="h-[450px] lg:h-[calc(100vh-10rem)] lg:sticky lg:top-[5.5rem] rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/60 elevation-2">
          <EventMap events={displayedEvents} onEventSelect={openEventDetail} userLocation={userLocation} />
        </div>
        {/* Map Filter Pills */}
        <div className="flex items-center justify-center gap-2 py-2">
          {filterPills.map(pill => (
            <button
              key={pill.id}
              onClick={() => setMapFilter(pill.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${mapFilter === pill.id
                  ? 'bg-white/90 backdrop-blur-md shadow-md text-gray-800 border border-white/65'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${pill.color}`} />
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Cards */}
      <div className="w-full lg:w-[55%] lg:h-[calc(100vh-11rem)] lg:sticky lg:top-[4.5rem] lg:overflow-y-auto pr-1 pb-8 ec-scrollbar">

        {/* Title & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              {isSearching ? (
                <><span className="text-primary">Arama:</span> "{searchQuery}"</>
              ) : (
                <>Yaklaşan <span className="text-primary">Etkinlikler</span></>
              )}
            </h1>
            <p className="text-gray-400 font-medium text-sm mt-1">
              {isLoading ? 'Aranıyor…' : `${displayedEvents.length} etkinlik listeleniyor`}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filtrele Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(o => !o)}
                className={`group/fil flex items-center gap-1.5 backdrop-blur-md border text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 shadow-sm ${
                  filterOpen
                    ? 'bg-primary text-white border-primary shadow-primary/25'
                    : 'bg-white/80 border-white/60 text-gray-600 hover:bg-white/95'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtrele
                {(minDistance > 0 || maxDistance !== 10) && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-red-400 inline-block" />
                )}
              </button>

              {/* Dropdown Panel */}
              {filterOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 w-56 bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl p-4 flex flex-col gap-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mesafe Filtresi</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Min (km)</label>
                      <input
                        type="number"
                        value={minDistance}
                        onFocus={(e) => { if (Number(e.target.value) === 0) e.target.value = ''; }}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          setMinDistance(val);
                          setPage(0);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-center text-sm font-semibold bg-gray-50"
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    <span className="text-gray-300 font-bold text-lg mt-4">—</span>
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Max (km)</label>
                      <input
                        type="number"
                        value={maxDistance}
                        onFocus={(e) => { e.target.select(); }}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          setMaxDistance(val);
                          setPage(0);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-center text-sm font-semibold bg-gray-50"
                        min="0"
                        placeholder="10"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMinDistance(0);
                      setMaxDistance(10);
                      setPage(0);
                    }}
                    className="text-xs text-gray-400 hover:text-primary font-semibold transition-colors text-center"
                  >
                    Sıfırla
                  </button>
                </div>
              )}
            </div>
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
          <div className="grid grid-cols-1 gap-5">
            {Array.from({ length: isSearching ? 6 : PAGE_SIZE }).map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 overflow-hidden flex flex-col md:flex-row p-5 gap-5">
                <div className="w-full md:w-48 h-48 shrink-0 ec-shimmer rounded-xl" />
                <div className="flex-1 space-y-4 py-2">
                  <div className="h-5 ec-shimmer rounded-lg w-3/4" />
                  <div className="h-3.5 ec-shimmer rounded-lg w-full" style={{ animationDelay: '0.15s' }} />
                  <div className="h-3.5 ec-shimmer rounded-lg w-5/6" style={{ animationDelay: '0.2s' }} />
                  <div className="flex justify-between pt-4 border-t border-gray-50">
                    <div className="h-4 ec-shimmer rounded w-2/5" style={{ animationDelay: '0.3s' }} />
                    <div className="h-6 ec-shimmer rounded-xl w-1/5" style={{ animationDelay: '0.45s' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Card Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 gap-5">
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
              className="px-5 py-2.5 bg-white/80 backdrop-blur-md border border-white/65 text-gray-600 font-semibold rounded-xl hover:bg-white/95 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-all duration-300 text-sm shadow-sm"
            >
              ← Önceki
            </button>
            <span className="text-sm font-semibold text-gray-500 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/65 shadow-sm">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 text-sm shadow-md shadow-primary/20"
            >
              Sonraki →
            </button>
          </div>
        )}

        {/* Tümünü Görüntüle Button */}
        {!isSearching && !loading && events.length > 0 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate('/upcoming')}
              className="flex items-center gap-2 text-primary font-semibold text-sm border-2 border-primary/20 px-6 py-2.5 rounded-xl hover:bg-primary/5 transition-all"
            >
              Tümünü Görüntüle
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-light font-sans">
      {/* {currentView === 'home' && <WelcomeOverlay />} */}

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
      <main className="flex-1 min-w-0 flex flex-col lg:pl-[96px] relative">

        {/* Floating animated blobs & frosted glass blur backdrop for Auth views */}
        {['login', 'register'].includes(currentView) && (
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Blurry colorful lights */}
            <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full bg-primary/20 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-[15%] right-[15%] w-[500px] h-[500px] rounded-full bg-secondary/25 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
            <div className="absolute top-[45%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-coral/20 blur-[110px]" />
            {/* frosted glass layer */}
            <div className="absolute inset-0 bg-light/35 backdrop-blur-[28px]" />
          </div>
        )}

        {/* Floating Pill Navbar */}
        {currentView === 'home' && (
          <div className="sticky top-3 z-30 flex justify-center px-4">
            <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-full elevation-3 border border-white/60 px-6 py-3 flex items-center gap-3.5">
              {/* Logo */}
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full shrink-0 shadow-md shadow-primary/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Etkinlik ara..."
                  className="w-full bg-transparent text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                />
              </div>
              {/* Nav Links */}
              <div className="hidden md:flex items-center gap-1.5">
                <button className="px-4 py-2 text-base font-bold text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100/80 active:scale-95 hover:scale-105 transition-all duration-300">
                  Keşfet
                </button>
                <button className="px-4 py-2 text-base font-bold text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100/80 active:scale-95 hover:scale-105 transition-all duration-300">
                  Harita
                </button>
                <button className="px-4 py-2 text-base font-bold text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100/80 active:scale-95 hover:scale-105 transition-all duration-300">
                  Takvim
                </button>
              </div>
              {/* Divider */}
              <div className="hidden md:block w-px h-6 bg-gray-200"></div>
              {/* Location Button */}
              <button
                onClick={handleGetCoords}
                disabled={locatingUser}
                className="group/loc flex items-center gap-1.5 px-4 py-2 text-base font-bold text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-all duration-300 active:scale-95 hover:scale-105 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className={`w-4 h-4 text-primary transition-transform duration-300 group-hover/loc:scale-110 group-hover/loc:rotate-12 ${locatingUser ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden lg:inline">{locatingUser ? 'Alınıyor...' : 'Konumum'}</span>
              </button>
              {/* Add Event Button */}
              <button
                onClick={() => navigate('/events/new')}
                className="group/addbtn flex items-center gap-1.5 px-5 py-2 bg-primary text-white text-base font-extrabold rounded-full hover:bg-primary/90 transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-95 hover:scale-105 whitespace-nowrap"
              >
                <svg className="w-4 h-4 transition-transform duration-500 group-hover/addbtn:scale-110 group-hover/addbtn:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden lg:inline">Etkinlik Ekle</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-grow p-6 max-w-[1800px] mx-auto w-full relative">

          <Routes>
            <Route path="/events/new" element={<AddEventPage />} />
            <Route path="/events/:id/edit" element={<AddEventPage />} />
            <Route path="/events/:id" element={<EventDetailRoute />} />
            <Route path="/" element={homeLayout} />
            <Route path="/login" element={homeLayout} />
            <Route path="/register" element={homeLayout} />
            <Route path="/my-events" element={<MyEventsPage />} />
            <Route path="/upcoming" element={<UpcomingEventsPage />} />
            <Route path="/shared-events" element={<SharedEventsPage />} />
            <Route path="/share-events" element={<ShareEventPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Floating Login/Register Modals over blurred active background */}
          {currentView === 'login' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div 
                className="absolute inset-0 bg-dark/15 backdrop-blur-[12px] cursor-pointer" 
                onClick={() => navigate('/')} 
              />
              <div className="w-full max-w-lg relative z-10 transition-all duration-300">
                <Login
                  onNavigateToRegister={() => navigate('/register')}
                  onLoginSuccess={(username) => {
                    setUser(username);
                    navigate('/');
                  }}
                />
              </div>
            </div>
          )}

          {currentView === 'register' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div 
                className="absolute inset-0 bg-dark/15 backdrop-blur-[12px] cursor-pointer" 
                onClick={() => navigate('/')} 
              />
              <div className="w-full max-w-lg relative z-10 transition-all duration-300">
                <Register
                  onNavigateToLogin={() => navigate('/login')}
                  onRegisterSuccess={() => navigate('/login')}
                />
              </div>
            </div>
          )}
        </div>
        <Bottombar />
        <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </div>
  );
}

export default App;
