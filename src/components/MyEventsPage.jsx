import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../api/taskService';
import { toast } from 'react-toastify';

const MyEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = (id, title) => {
    toast.warn(({ closeToast }) => (
      <div className="p-1">
        <p className="font-bold text-sm text-gray-800">
          "{title || 'Bu etkinlik'}" isimli etkinliği silmek istediğinize emin misiniz?
        </p>
        <div className="flex justify-end gap-2 mt-3">
          <button 
            onClick={closeToast}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold rounded-lg transition-colors cursor-pointer"
          >
            Vazgeç
          </button>
          <button 
            onClick={async () => {
              closeToast();
              try {
                setDeletingId(id);
                await taskService.deleteTask(id);
                setEvents(prev => prev.filter(event => event.id !== id));
                toast.success('Etkinlik başarıyla silindi.');
              } catch (err) {
                console.error('Etkinlik silme hatasi:', err);
                toast.error('Etkinlik silinirken bir hata oluştu. Lütfen tekrar deneyin.');
              } finally {
                setDeletingId(null);
              }
            }}
            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-extrabold rounded-lg transition-colors cursor-pointer"
          >
            Evet, Sil
          </button>
        </div>
      </div>
    ), {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
    });
  };

  useEffect(() => {
    let ignore = false;

    const fetchMyEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await taskService.getMyTasks();
        if (!ignore) {
          setEvents(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Kendi etkinliklerimi yukleme hatasi:', err);
        if (!ignore) {
          setError('Etkinlikleriniz yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchMyEvents();

    return () => {
      ignore = true;
    };
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Tarih belirtilmedi';
    try {
      return new Date(dateStr).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Geçersiz tarih';
    }
  };

  const parseLocation = (event) => {
    const loc = event.location ?? {};
    const address = loc.address ?? event.address ?? 'Adres bilgisi yok';
    const city = loc.city ?? event.city ?? loc.country ?? event.country ?? 'Konum';
    return { address, city };
  };

  // Dynamic statistics calculations
  const totalCount = events.length;
  const activeCount = events.filter(e => !e.completed).length;
  const upcomingCount = events.filter(e => e.startDate && new Date(e.startDate) > new Date()).length;

  return (
    <section className="w-full max-w-6xl mx-auto pb-10">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Kullanıcı Paneli</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Etkinliklerim
        </h1>
        <p className="mt-2 text-gray-500 font-medium">Oluşturduğunuz etkinlikleri yönetin</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-sm hover:scale-[1.02] hover:border-primary/20 hover:shadow-md transition-all duration-300">
          <p className="text-3xl font-extrabold text-primary">{loading ? '...' : totalCount}</p>
          <p className="text-sm text-gray-500 font-medium mt-1">Toplam Etkinlik</p>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-sm hover:scale-[1.02] hover:border-green-500/20 hover:shadow-md transition-all duration-300">
          <p className="text-3xl font-extrabold text-green-500">{loading ? '...' : activeCount}</p>
          <p className="text-sm text-gray-500 font-medium mt-1">Aktif Etkinlik</p>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-sm hover:scale-[1.02] hover:border-amber-500/20 hover:shadow-md transition-all duration-300">
          <p className="text-3xl font-extrabold text-amber-500">{loading ? '...' : upcomingCount}</p>
          <p className="text-sm text-gray-500 font-medium mt-1">Yaklaşan Etkinlik</p>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-sm">
              <div className="h-6 ec-shimmer rounded-lg w-1/3 mb-3" />
              <div className="h-4 ec-shimmer rounded-lg w-2/3 mb-4" />
              <div className="flex gap-4">
                <div className="h-4 ec-shimmer rounded-lg w-1/4" />
                <div className="h-4 ec-shimmer rounded-lg w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event List */}
      {!loading && (
        <div className="space-y-4">
          {events.map((event) => {
            const { address, city } = parseLocation(event);
            return (
              <div key={event.id} className="group bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-6 elevation-2 hover:elevation-4 elevation-hover active:scale-[0.995] transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div 
                    className="flex-1 cursor-pointer hover:opacity-80 transition-opacity" 
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-extrabold text-gray-900 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1">{event.title || 'İsimsiz Etkinlik'}</h3>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        event.visibility === 'PUBLIC' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {event.visibility === 'PUBLIC' ? 'Herkese Açık' : 'Özel'}
                      </span>
                      {event.completed && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                          Tamamlandı
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {event.description || <span className="italic text-gray-300">Açıklama belirtilmemiş</span>}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{city}, {address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-primary">{event.fileCount ?? 0}</p>
                      <p className="text-xs text-gray-500 font-medium">Dosya</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {!event.completed ? (
                        <button className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 hover:scale-105 active:scale-95 hover:shadow-md hover:shadow-green-500/20 transition-all duration-300 whitespace-nowrap">
                          Tamamla
                        </button>
                      ) : (
                        <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 text-sm font-semibold rounded-xl cursor-not-allowed whitespace-nowrap">
                          Tamamlandı
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/events/${event.id}/edit`)}
                        className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 hover:shadow-md hover:shadow-primary/20 transition-all duration-300 shadow-sm"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        disabled={deletingId === event.id}
                        className="px-4 py-2 text-red-500 text-sm font-semibold rounded-xl border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-105 active:scale-95 hover:shadow-md hover:shadow-red-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === event.id ? 'Siliniyor...' : 'Sil'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && events.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Henüz etkinlik oluşturmadınız</h3>
          <p className="text-gray-500 text-sm mb-4">İlk etkinliğinizi oluşturmak için butona tıklayın</p>
          <button 
            onClick={() => navigate('/events/new')}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-colors shadow-md"
          >
            Etkinlik Oluştur
          </button>
        </div>
      )}
    </section>
  );
};

export default MyEventsPage;