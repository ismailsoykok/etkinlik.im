import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../api/taskService';
import { toast } from 'react-toastify';

const parseBackendPermissions = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) {
    const grouped = {};
    data.forEach(item => {
      if (!item || typeof item !== 'object') return;
      const username = item.username || item.user?.username || item.targetUsername || item.targetUser?.username;
      if (!username) return;
      const permsList = item.permissions || item.permissionList || item.permissionTypes;
      if (Array.isArray(permsList)) {
        if (!grouped[username]) grouped[username] = new Set();
        permsList.forEach(p => grouped[username].add(p));
      } else {
        const singlePerm = item.permission || item.permissionType || item.type;
        if (singlePerm) {
          if (!grouped[username]) grouped[username] = new Set();
          grouped[username].add(singlePerm);
        }
      }
    });
    return Object.entries(grouped).map(([username, permSet]) => ({
      username,
      permissions: Array.from(permSet)
    }));
  }
  if (typeof data === 'object') {
    return Object.entries(data).map(([username, val]) => {
      const permissions = Array.isArray(val)
        ? val
        : typeof val === 'string'
          ? [val]
          : val?.permissions || val?.permissionType ? [val.permissionType || val.permissions] : [];
      return { username, permissions };
    }).filter(item => item.username && item.permissions.length > 0);
  }
  return [];
};

const MyEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Paylaşım states
  const [sharedUsers, setSharedUsers] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [newShareUser, setNewShareUser] = useState('');
  const [newPermissions, setNewPermissions] = useState({
    READ: true,
    UPDATE: false,
    DELETE: false,
    ADD_FILE: false
  });

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
          const eventsList = Array.isArray(data) ? data : [];
          setEvents(eventsList);

          // Paylaşılanları yükle
          const sharesMap = {};
          await Promise.all(
            eventsList.map(async (event) => {
              try {
                const permsData = await taskService.getTaskAllPermissions(event.id);
                sharesMap[event.id] = parseBackendPermissions(permsData);
              } catch (err) {
                console.error(`Etkinlik ${event.id} izinleri yüklenemedi:`, err);
                sharesMap[event.id] = [];
              }
            })
          );
          if (!ignore) {
            setSharedUsers(sharesMap);
          }
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

  const handleOpenShare = async (event) => {
    setSelectedEvent(event);
    setNewShareUser('');
    setNewPermissions({
      READ: true,
      UPDATE: false,
      DELETE: false,
      ADD_FILE: false
    });
    setModalLoading(true);
    try {
      const data = await taskService.getTaskAllPermissions(event.id);
      const parsed = parseBackendPermissions(data);
      setSharedUsers(prev => ({ ...prev, [event.id]: parsed }));
    } catch (err) {
      console.error('İzinler yüklenirken hata oluştu:', err);
      toast.error('Bu etkinliğe ait paylaşım izinleri yüklenemedi.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseShare = () => {
    setSelectedEvent(null);
  };

  const handleAddShare = async (e) => {
    e.preventDefault();
    if (!newShareUser.trim()) {
      toast.warn('Lütfen geçerli bir kullanıcı adı girin.');
      return;
    }
    const username = newShareUser.trim();
    const activePerms = Object.keys(newPermissions).filter(p => newPermissions[p]);
    if (activePerms.length === 0) {
      toast.warn('Lütfen en az bir yetki seçin.');
      return;
    }
    const eventId = selectedEvent.id;
    const currentShares = sharedUsers[eventId] || [];
    if (currentShares.some(s => s.username.toLowerCase() === username.toLowerCase())) {
      toast.warn(`Bu etkinlik zaten "${username}" ile paylaşılmış.`);
      return;
    }
    setModalLoading(true);
    try {
      const allPermsKeys = ['READ', 'UPDATE', 'DELETE', 'ADD_FILE'];
      const isAllSelected = allPermsKeys.every(p => newPermissions[p]);
      if (isAllSelected) {
        await taskService.grantAllPermissions(eventId, username);
      } else {
        await Promise.all(activePerms.map(perm => taskService.grantPermission(eventId, username, perm)));
      }
      const permsData = await taskService.getTaskAllPermissions(eventId);
      const parsedPerms = parseBackendPermissions(permsData);
      setSharedUsers(prev => ({ ...prev, [eventId]: parsedPerms }));
      toast.success(`Etkinlik "${username}" kullanıcısıyla başarıyla paylaşıldı.`);
      setNewShareUser('');
      setNewPermissions({ READ: true, UPDATE: false, DELETE: false, ADD_FILE: false });
    } catch (err) {
      console.error('Paylaşım ekleme hatası:', err);
      toast.error('Paylaşım eklenirken bir hata oluştu. Kullanıcı adının doğruluğundan emin olun.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleRemoveShare = (eventId, username) => {
    toast.warn(({ closeToast }) => (
      <div className="p-1">
        <p className="font-bold text-sm text-gray-800">
          "{username}" kullanıcısının paylaşım yetkisini kaldırmak istediğinize emin misiniz?
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
              setModalLoading(true);
              try {
                await taskService.revokeAllPermissions(eventId, username);
                const permsData = await taskService.getTaskAllPermissions(eventId);
                const parsedPerms = parseBackendPermissions(permsData);
                setSharedUsers(prev => ({ ...prev, [eventId]: parsedPerms }));
                toast.success(`"${username}" ile olan paylaşım sonlandırıldı.`);
              } catch (err) {
                console.error('Paylaşım kaldırma hatası:', err);
                toast.error('Paylaşım kaldırılırken bir hata oluştu.');
              } finally {
                setModalLoading(false);
              }
            }}
            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-extrabold rounded-lg transition-colors cursor-pointer"
          >
            Evet, Kaldır
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
        <p className="mt-2 text-gray-500 font-medium">Oluşturduğunuz etkinlikleri yönetin ve paylaşın</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-sm hover:scale-[1.02] hover:border-primary/20 hover:shadow-md transition-all duration-300">
          {loading ? <div className="w-12 h-9 ec-shimmer rounded-xl mb-1" /> : <p className="text-3xl font-extrabold text-primary">{totalCount}</p>}
          <p className="text-sm text-gray-500 font-medium mt-1">Toplam Etkinlik</p>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-sm hover:scale-[1.02] hover:border-green-500/20 hover:shadow-md transition-all duration-300">
          {loading ? <div className="w-12 h-9 ec-shimmer rounded-xl mb-1" /> : <p className="text-3xl font-extrabold text-green-500">{activeCount}</p>}
          <p className="text-sm text-gray-500 font-medium mt-1">Aktif Etkinlik</p>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-sm hover:scale-[1.02] hover:border-amber-500/20 hover:shadow-md transition-all duration-300">
          {loading ? <div className="w-12 h-9 ec-shimmer rounded-xl mb-1" /> : <p className="text-3xl font-extrabold text-amber-500">{upcomingCount}</p>}
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
            const shares = sharedUsers[event.id] || [];
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
                      <div className="flex items-center gap-1.5 text-primary">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="font-bold">{shares.length} Paylaşım</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {!event.completed ? (
                      <button className="px-3 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 hover:scale-105 active:scale-95 transition-all shadow-sm">
                        Tamamla
                      </button>
                    ) : (
                      <button disabled className="px-3 py-1.5 bg-gray-100 text-gray-400 text-sm font-semibold rounded-xl cursor-not-allowed">
                        Tamamlandı
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const url = window.location.origin + '/events/' + event.id;
                        if (navigator.share) {
                          navigator.share({
                            title: event.title,
                            text: 'Bu etkinliğe göz at: ' + event.title,
                            url: url,
                          }).catch(console.error);
                        } else {
                           navigator.clipboard.writeText(url);
                           toast.success('Bağlantı kopyalandı!');
                        }
                      }}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                      </svg>
                      Link
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenShare(event); }}
                      className="px-3 py-1.5 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-sm"
                    >
                      Paylaşımı Yönet
                    </button>
                    <button
                      onClick={() => navigate(`/events/${event.id}/edit`)}
                      className="px-3 py-1.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-sm"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(event.id, event.title)}
                      disabled={deletingId === event.id}
                      className="px-3 py-1.5 text-red-500 text-sm font-semibold rounded-xl border border-red-200 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      {deletingId === event.id ? 'Siliniyor...' : 'Sil'}
                    </button>
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

      {/* Share Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Etkinlik Paylaşım Ayarları</h2>
              <button 
                onClick={handleCloseShare}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Etkinlik</p>
              <p className="text-lg font-extrabold text-primary mt-0.5">{selectedEvent.title || 'İsimsiz Etkinlik'}</p>
            </div>

            <form onSubmit={handleAddShare} className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl mb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Yeni Kişi Davet Et</h3>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500">Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={newShareUser}
                    onChange={(e) => setNewShareUser(e.target.value)}
                    placeholder="Örn: ismailsoykok"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="text-xs font-bold text-gray-500">İzin Yetkileri</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {Object.keys(newPermissions).map(perm => {
                      const labels = {
                        READ: 'Görüntüleme (READ)',
                        UPDATE: 'Güncelleme (UPDATE)',
                        DELETE: 'Silme (DELETE)',
                        ADD_FILE: 'Dosya Ekleme (ADD_FILE)'
                      };
                      return (
                        <label key={perm} className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={newPermissions[perm]}
                            onChange={(e) => setNewPermissions(prev => ({ ...prev, [perm]: e.target.checked }))}
                            className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300"
                          />
                          {labels[perm]}
                        </label>
                      );
                    })}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-full mt-2 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-sm active:scale-98 disabled:opacity-50"
                >
                  Paylaş
                </button>
              </div>
            </form>

            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">Paylaşılan Kişiler</h3>
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-gray-500 font-semibold">Yükleniyor...</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {(sharedUsers[selectedEvent.id] || []).length > 0 ? (
                    (sharedUsers[selectedEvent.id] || []).map((share, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all duration-300">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">@{share.username}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {share.permissions.map(p => {
                              const colors = {
                                READ: 'bg-green-50 text-green-600 border-green-100',
                                UPDATE: 'bg-amber-50 text-amber-600 border-amber-100',
                                DELETE: 'bg-red-50 text-red-600 border-red-100',
                                ADD_FILE: 'bg-blue-50 text-blue-600 border-blue-100'
                              };
                              return (
                                <span key={p} className={`px-2 py-0.5 text-[10px] font-black rounded-full border ${colors[p] || 'bg-gray-50 text-gray-500'}`}>
                                  {p}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveShare(selectedEvent.id, share.username)}
                          className="px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 font-bold rounded-lg border border-red-100 transition-colors"
                        >
                          Kaldır
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic text-center py-4">Bu etkinlik henüz kimseyle paylaşılmadı.</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleCloseShare}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-all"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyEventsPage;