import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import { useFavorites } from './FavoritesContext';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, loadingFavorites, fetchFavorites } = useFavorites();

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="w-full flex-grow flex flex-col items-center justify-start lg:h-[calc(100vh-8rem)] pt-2 sm:pt-6">
      <div className="w-full max-w-[1200px] flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              Favori <span className="text-primary">Etkinliklerim</span>
            </h1>
            <p className="text-gray-400 font-medium text-sm mt-2">
              Kaydettiğiniz ve favorilerinize eklediğiniz etkinlikler
            </p>
          </div>
        </div>

        {/* Content */}
        {loadingFavorites ? (
          <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {favorites.map(event => (
              <EventCard key={event.id} event={event} layout="vertical" onSelect={() => navigate(`/events/${event.id}`)} />
            ))}
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center py-20 px-4 bg-white/50 backdrop-blur-md rounded-3xl border border-white/60 elevation-2 mt-4">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-12 h-12 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Henüz favori etkinliğiniz yok</h2>
            <p className="text-gray-500 max-w-md mb-8">
              İlginizi çeken etkinlikleri favorilerinize ekleyerek daha sonra kolayca bulabilirsiniz.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-3.5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Etkinlikleri Keşfet
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default FavoritesPage;
