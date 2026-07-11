import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../api/taskService';
import { toast } from 'react-toastify';

const SharedEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPermissionEvent, setSelectedPermissionEvent] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionsError, setPermissionsError] = useState(null);
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
                setSelectedPermissionEvent(null);
                toast.success('Etkinlik başarıyla silindi.');
              } catch (err) {
                console.error('Etkinlik silme hatası:', err);
                toast.error('Etkinlik silinirken bir hata oluştu. Lütfen bu işlem için silme yetkiniz (DELETE) olduğundan emin olun.');
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

    const fetchSharedEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await taskService.getSharedTasks();
        if (!ignore) {
          setEvents(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Paylaşılan etkinlikleri yükleme hatası:', err);
        if (!ignore) {
          setError('Davet edildiğiniz etkinlikler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchSharedEvents();

    return () => {
      ignore = true;
    };
  }, []);

  const handleShowPermissions = async (event) => {
    setSelectedPermissionEvent(event);
    setPermissionsLoading(true);
    setPermissionsError(null);
    setPermissions([]);
    try {
      const data = await taskService.getTaskPermissions(event.id);
      setPermissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('İzinler yüklenirken hata oluştu:', err);
      setPermissionsError('İzin bilgileri yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setPermissionsLoading(false);
    }
  };

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
  const completedCount = events.filter(e => e.completed).length;

  return (
    <section className="w-full max-w-6xl mx-auto pb-10">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Kullanıcı Paneli</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Davet Edildiğim Etkinlikler
        </h1>
        <p className="mt-2 text-gray-500 font-medium">Diğer kullanıcılar tarafından sizinle paylaşılan etkinlikler</p>
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
          <p className="text-sm text-gray-500 font-medium mt-1">Toplam Davet</p>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-sm hover:scale-[1.02] hover:border-amber-500/20 hover:shadow-md transition-all duration-300">
          <p className="text-3xl font-extrabold text-amber-500">{loading ? '...' : activeCount}</p>
          <p className="text-sm text-gray-500 font-medium mt-1">Aktif Davetler</p>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-sm hover:scale-[1.02] hover:border-green-500/20 hover:shadow-md transition-all duration-300">
          <p className="text-3xl font-extrabold text-green-500">{loading ? '...' : completedCount}</p>
          <p className="text-sm text-gray-500 font-medium mt-1">Tamamlananlar</p>
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
                      <h3 className="text-xl font-extrabold text-gray-900 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1">
                        {event.title || 'İsimsiz Etkinlik'}
                      </h3>
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
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-primary">{event.fileCount ?? 0}</p>
                      <p className="text-xs text-gray-500 font-medium">Dosya</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button 
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 hover:shadow-md hover:shadow-primary/20 transition-all duration-300 shadow-sm"
                      >
                        Detayları Gör
                      </button>
                      <button
                        onClick={() => handleShowPermissions(event)}
                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:scale-105 active:scale-95 hover:shadow-sm transition-all duration-300"
                      >
                        İzinleri Gör
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Davet edildiğiniz etkinlik yok</h3>
          <p className="text-gray-500 text-sm mb-4">Size gönderilen etkinlik davetleri burada görüntülenecektir.</p>
        </div>
      )}

      {/* Glassmorphic Permissions Modal */}
      {selectedPermissionEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Etkinlik İzin Detayları</h2>
              <button 
                onClick={() => setSelectedPermissionEvent(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Etkinlik Adı</p>
              <p className="text-lg font-extrabold text-primary mt-0.5">{selectedPermissionEvent.title || 'İsimsiz Etkinlik'}</p>
            </div>

            {permissionsLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-semibold text-gray-500">İzinler yükleniyor...</p>
              </div>
            ) : permissionsError ? (
              <div className="text-center py-8">
                <p className="text-red-500 text-sm font-medium mb-4">{permissionsError}</p>
                <button
                  onClick={() => handleShowPermissions(selectedPermissionEvent)}
                  className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all"
                >
                  Tekrar Dene
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 mb-6 animate-fadeIn">
                {/* Read permission */}
                <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  permissions.includes('READ')
                    ? 'bg-green-50/50 border-green-100/50 text-gray-900'
                    : 'bg-gray-50/40 border-gray-100/40 text-gray-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold shrink-0 ${
                      permissions.includes('READ') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {permissions.includes('READ') ? '✓' : '✕'}
                    </span>
                    <div>
                      <p className="text-sm font-bold">Görüntüleme Yetkisi (READ)</p>
                      <p className="text-[11px] text-gray-500 font-medium">Etkinlik detaylarını inceleyebilirsiniz.</p>
                    </div>
                  </div>
                  <button
                    disabled={!permissions.includes('READ')}
                    onClick={() => {
                      setSelectedPermissionEvent(null);
                      navigate(`/events/${selectedPermissionEvent.id}`);
                    }}
                    className={`w-24 py-1.5 text-xs font-bold rounded-xl shrink-0 transition-all text-center ${
                      permissions.includes('READ')
                        ? 'bg-primary hover:bg-primary/90 text-white active:scale-95 shadow-sm'
                        : 'bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    Görüntüle
                  </button>
                </div>

                {/* Edit permission */}
                <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  permissions.includes('UPDATE')
                    ? 'bg-green-50/50 border-green-100/50 text-gray-900'
                    : 'bg-gray-50/40 border-gray-100/40 text-gray-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold shrink-0 ${
                      permissions.includes('UPDATE') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {permissions.includes('UPDATE') ? '✓' : '✕'}
                    </span>
                    <div>
                      <p className="text-sm font-bold">Düzenleme Yetkisi (UPDATE)</p>
                      <p className="text-[11px] text-gray-500 font-medium">Etkinlik bilgilerini değiştirebilirsiniz.</p>
                    </div>
                  </div>
                  <button
                    disabled={!permissions.includes('UPDATE')}
                    onClick={() => {
                      setSelectedPermissionEvent(null);
                      navigate(`/events/${selectedPermissionEvent.id}/edit`);
                    }}
                    className={`w-24 py-1.5 text-xs font-bold rounded-xl shrink-0 transition-all text-center ${
                      permissions.includes('UPDATE')
                        ? 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95 shadow-sm'
                        : 'bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    Düzenle
                  </button>
                </div>

                {/* Delete permission */}
                <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  permissions.includes('DELETE')
                    ? 'bg-green-50/50 border-green-100/50 text-gray-900'
                    : 'bg-gray-50/40 border-gray-100/40 text-gray-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold shrink-0 ${
                      permissions.includes('DELETE') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {permissions.includes('DELETE') ? '✓' : '✕'}
                    </span>
                    <div>
                      <p className="text-sm font-bold">Silme Yetkisi (DELETE)</p>
                      <p className="text-[11px] text-gray-500 font-medium">Bu etkinliği sistemden silebilirsiniz.</p>
                    </div>
                  </div>
                  <button
                    disabled={!permissions.includes('DELETE') || deletingId === selectedPermissionEvent.id}
                    onClick={() => handleDelete(selectedPermissionEvent.id, selectedPermissionEvent.title)}
                    className={`w-24 py-1.5 text-xs font-bold rounded-xl shrink-0 transition-all text-center ${
                      permissions.includes('DELETE')
                        ? 'bg-red-500 hover:bg-red-600 text-white active:scale-95 shadow-sm'
                        : 'bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {deletingId === selectedPermissionEvent.id ? 'Siliniyor' : 'Sil'}
                  </button>
                </div>

                {/* Add file permission */}
                <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  permissions.includes('ADD_FILE')
                    ? 'bg-green-50/50 border-green-100/50 text-gray-900'
                    : 'bg-gray-50/40 border-gray-100/40 text-gray-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold shrink-0 ${
                      permissions.includes('ADD_FILE') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {permissions.includes('ADD_FILE') ? '✓' : '✕'}
                    </span>
                    <div>
                      <p className="text-sm font-bold">Dosya Ekleme Yetkisi (ADD_FILE)</p>
                      <p className="text-[11px] text-gray-500 font-medium">Etkinliğe yeni dosyalar yükleyebilirsiniz.</p>
                    </div>
                  </div>
                  <button
                    disabled={!permissions.includes('ADD_FILE')}
                    onClick={() => toast.info('Dosya ekleme özelliği yakında aktif edilecektir.')}
                    className={`w-24 py-1.5 text-xs font-bold rounded-xl shrink-0 transition-all text-center ${
                      permissions.includes('ADD_FILE')
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95 shadow-sm'
                        : 'bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    Dosya Ekle
                  </button>
                </div>

                {/* Visibility info */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200/50">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-200 text-gray-600">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Görünürlük Sınırı</p>
                      <p className="text-[11px] text-gray-500 font-medium">
                        {selectedPermissionEvent.visibility === 'PUBLIC' 
                          ? 'Bu etkinlik herkese açık (PUBLIC) olarak ayarlanmıştır.' 
                          : 'Bu etkinlik size özel (PRIVATE) paylaşılmıştır.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedPermissionEvent(null)}
              className="w-full py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 active:scale-98 transition-all text-sm mt-4"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default SharedEventsPage;
