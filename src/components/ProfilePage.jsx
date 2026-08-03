import { useEffect, useMemo, useState } from 'react';
import { taskService } from '../api/taskService';

const ProfilePage = ({ user }) => {
  const displayName = user || 'Kullanıcı';
  const initial = displayName.charAt(0).toUpperCase();
  const [myEvents, setMyEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const profileInfo = useMemo(() => [
    { label: 'Görünen Ad', value: displayName },
    { label: 'Kullanıcı Adı', value: `@${displayName}` },
  ], [displayName]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let ignore = false;

    const fetchMyEvents = async () => {
      try {
        setEventsLoading(true);
        const data = await taskService.getMyTasks();
        if (!ignore) {
          setMyEvents(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Profil etkinlik sayisi yukleme hatasi:', err);
        if (!ignore) {
          setMyEvents([]);
        }
      } finally {
        if (!ignore) {
          setEventsLoading(false);
        }
      }
    };

    fetchMyEvents();

    return () => {
      ignore = true;
    };
  }, [user]);

  const createdEventsCount = myEvents.length;
  const activeEventsCount = myEvents.filter(event => !event.completed).length;
  const upcomingEventsCount = myEvents.filter(event => event.startDate && new Date(event.startDate) > new Date()).length;
  const profileStats = useMemo(() => ([
    { label: 'Oluşturduğu Etkinlik', value: eventsLoading ? '...' : createdEventsCount, tone: 'text-primary', border: 'hover:border-primary/20' },
    { label: 'Aktif Etkinlik', value: eventsLoading ? '...' : activeEventsCount, tone: 'text-emerald-600', border: 'hover:border-emerald-500/20' },
    { label: 'Yaklaşan Etkinlik', value: eventsLoading ? '...' : upcomingEventsCount, tone: 'text-amber-500', border: 'hover:border-amber-500/20' },
  ]), [activeEventsCount, createdEventsCount, eventsLoading, upcomingEventsCount]);

  return (
    <section className="w-full max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Kullanıcı Paneli</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Profilim</h1>
        <p className="mt-2 max-w-2xl text-gray-500 font-medium">
          Hesap özeti, etkinlik durumu ve güvenlik ayarlarını düzenli bir panelden takip edin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
        <aside className="lg:sticky lg:top-6">
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-6 elevation-2">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary via-emerald-500 to-secondary flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-primary/20">
                  {initial}
                </div>
                <div className="absolute -right-1 bottom-2 w-8 h-8 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-gray-900">{displayName}</h2>
              <p className="mt-1 text-sm font-semibold text-gray-400">@{displayName.toLowerCase()}</p>
              <span className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-full bg-primary/10 px-4 text-sm font-black text-primary">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Aktif Üye
              </span>
            </div>
          </div>
        </aside>

        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {profileStats.map(stat => (
              <div key={stat.label} className={`min-h-32 bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-5 shadow-sm hover:scale-[1.02] hover:shadow-md ${stat.border} transition-all duration-300 flex flex-col justify-between`}>
                <p className={`text-4xl font-extrabold ${stat.tone}`}>{stat.value}</p>
                <p className="text-sm text-gray-500 font-bold">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-6 elevation-2">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">Kişisel Bilgiler</h3>
                <p className="mt-1 text-sm text-gray-500 font-medium">Hesap görünümü ve temel profil detayları</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profileInfo.map(item => (
                <div key={item.label} className="min-h-16 rounded-2xl bg-gray-50/70 border border-gray-100 px-4 py-3 flex flex-col justify-center">
                  <span className="text-xs font-black uppercase text-gray-400">{item.label}</span>
                  <span className="mt-1 text-sm font-extrabold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
