import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import { taskService, parseTask } from '../api/taskService';

const PAGE_SIZE = 12;

const UpcomingEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvents(page);
  }, [page, fetchEvents]);

  const openEventDetail = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="w-full h-full pb-8 pt-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Yaklaşan <span className="text-primary">Etkinlikler</span>
        </h1>
        <p className="text-gray-500 font-medium text-base mt-2">
          Sizin için seçilen ve en yakın zamanda gerçekleşecek etkinlikler
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/60 overflow-hidden flex flex-col p-5 gap-5 shadow-sm">
              <div className="w-full h-48 shrink-0 ec-shimmer rounded-2xl" />
              <div className="flex-1 space-y-4 py-2">
                <div className="h-5 ec-shimmer rounded-lg w-3/4" />
                <div className="h-3.5 ec-shimmer rounded-lg w-full" style={{ animationDelay: '0.15s' }} />
                <div className="h-3.5 ec-shimmer rounded-lg w-5/6" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cards Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.length > 0 ? (
            events.map(event => (
              <EventCard key={event.id} event={event} onSelect={openEventDetail} layout="vertical" />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/60">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 font-semibold text-xl">Yaklaşan etkinlik bulunmuyor.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-12">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-6 py-3 bg-white/80 backdrop-blur-md border border-white/65 text-gray-600 font-semibold rounded-xl hover:bg-white/95 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 text-sm shadow-sm"
          >
            ← Önceki
          </button>
          <span className="text-sm font-semibold text-gray-600 bg-white/80 backdrop-blur-md px-5 py-3 rounded-xl border border-white/65 shadow-sm">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
          >
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
};

export default UpcomingEventsPage;
