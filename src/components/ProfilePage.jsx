import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../api/taskService';
import { userService } from '../api/userService';
import { authService } from '../api/authService';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // States for Event Stats
  const [myEvents, setMyEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // States for Profile Data
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Form States (Edit Profile)
  const [editForm, setEditForm] = useState({
    displayName: '',
    username: '',
    bio: '',
    location: ''
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Form States (Security)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch Data on Mount
  useEffect(() => {
    let ignore = false;
    
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const data = await userService.getProfile();
        if (!ignore) {
          setProfile(data);
          setEditForm({
            displayName: data.displayName || '',
            username: data.username || '',
            bio: data.bio || '',
            location: data.location || ''
          });
        }
      } catch (err) {
        console.error('Profil bilgileri yüklenemedi:', err);
        if (!ignore) toast.error('Profil bilgileri yüklenemedi.');
      } finally {
        if (!ignore) setProfileLoading(false);
      }
    };

    const fetchMyEvents = async () => {
      try {
        setEventsLoading(true);
        const data = await taskService.getMyTasks();
        if (!ignore) setMyEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Profil etkinlik sayisi yukleme hatasi:', err);
        if (!ignore) setMyEvents([]);
      } finally {
        if (!ignore) setEventsLoading(false);
      }
    };

    fetchProfile();
    fetchMyEvents();
    
    return () => { ignore = true; };
  }, []);

  const createdEventsCount = myEvents.length;
  const activeEventsCount = myEvents.filter(event => !event.completed).length;
  const upcomingEventsCount = myEvents.filter(event => event.startDate && new Date(event.startDate) > new Date()).length;

  // Handlers
  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setEditSubmitting(true);
      const updatedProfile = await userService.updateProfile(editForm);
      setProfile(updatedProfile);
      // Update local storage if username changes (authService relies on this)
      if (updatedProfile.username) {
        localStorage.setItem('username', updatedProfile.username);
      }
      toast.success('Profiliniz başarıyla güncellendi.');
    } catch (error) {
      console.error('Profil güncellenemedi:', error);
      toast.error('Profil güncellenirken bir hata oluştu.');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('Yeni şifreler eşleşmiyor!');
    }
    try {
      setPasswordSubmitting(true);
      await authService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword
      );
      toast.success('Şifreniz başarıyla değiştirildi.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Şifre değiştirme hatası:', error);
      toast.error('Şifre değiştirilemedi. Lütfen eski şifrenizi kontrol edin.');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Hesabınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        setDeleting(true);
        await userService.deleteAccount();
        authService.logout();
        toast.success('Hesabınız kalıcı olarak silindi.');
        navigate('/login');
      } catch (error) {
        console.error('Hesap silme hatası:', error);
        toast.error('Hesabınız silinirken bir hata oluştu.');
        setDeleting(false);
      }
    }
  };

  const handleExportData = () => {
    toast.info('Veri dışa aktarma işlemi çok yakında eklenecektir.');
  };

  // Safe defaults while loading
  const displayTitle = profile?.displayName || profile?.username || 'Kullanıcı';
  const displayUsername = profile?.username || 'kullanici';
  const initial = displayTitle.charAt(0).toUpperCase();

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Bilinmiyor';
    return new Date(dateStr).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
  };

  return (
    <section className="w-full max-w-6xl mx-auto pb-12">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>

      {/* 1. Hero / Cover Section */}
      <div className="relative w-full h-48 md:h-64 rounded-[3rem] overflow-hidden mb-16 shadow-lg border-2 border-white/80">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald-400 to-secondary opacity-90" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/20 blur-3xl rounded-full" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-black/10 blur-3xl rounded-full" />
      </div>

      {/* 2. Main Layout (Sidebar + Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] gap-8 px-4 md:px-8">
        
        {/* Left Column: Profile Card */}
        <aside className="relative -mt-32 lg:-mt-40 z-10 flex flex-col gap-6">
          <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-8 shadow-xl text-center">
            <div className="relative inline-block mx-auto mb-5">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-emerald-500 to-secondary flex items-center justify-center text-white text-6xl font-black shadow-2xl shadow-primary/30 border-4 border-white">
                {profileLoading ? <span className="animate-pulse">...</span> : initial}
              </div>
              <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white shadow-md flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {profileLoading ? <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mx-auto" /> : displayTitle}
            </h1>
            <p className="text-primary font-bold text-sm mb-4">
              {profileLoading ? <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto mt-2" /> : `@${displayUsername}`}
            </p>
            
            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
              {profileLoading ? (
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6 mx-auto" />
                </div>
              ) : (
                profile?.bio || 'Biyografi henüz eklenmemiş.'
              )}
            </p>

            <div className="flex flex-col gap-2 pt-6 border-t border-gray-100/80">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-semibold">Katılım Tarihi</span>
                <span className="text-gray-900 font-bold">{profileLoading ? '...' : formatDate(profile?.joinedAt)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-semibold">Konum</span>
                <span className="text-gray-900 font-bold">{profileLoading ? '...' : (profile?.location || 'Belirtilmedi')}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[2rem] p-3 shadow-md flex flex-row lg:flex-col gap-2 overflow-x-auto ec-scrollbar">
            {[
              { id: 'overview', label: 'Genel Bakış', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
              { id: 'edit', label: 'Profili Düzenle', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
              { id: 'security', label: 'Hesap & Güvenlik', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 font-bold whitespace-nowrap lg:whitespace-normal shrink-0 ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-gray-500 hover:bg-white hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Right Column: Tab Content */}
        <div className="flex flex-col gap-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="animate-fadeIn space-y-6">
              <h2 className="text-2xl font-black text-gray-900">Etkinlik İstatistikleri</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Oluşturulan', value: createdEventsCount, color: 'text-primary' },
                  { label: 'Aktif', value: activeEventsCount, color: 'text-emerald-500' },
                  { label: 'Yaklaşan', value: upcomingEventsCount, color: 'text-amber-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-6 shadow-sm hover:scale-[1.02] transition-transform duration-300">
                    {eventsLoading ? (
                      <div className="w-16 h-10 ec-shimmer rounded-xl mb-1" />
                    ) : (
                      <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                    )}
                    <p className="text-sm font-bold text-gray-500 mt-1">{stat.label} Etkinlik</p>
                  </div>
                ))}
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-sm mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Hakkımda</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  {profileLoading ? 'Yükleniyor...' : (profile?.bio || 'Henüz biyografi eklemediniz. Profili Düzenle sekmesinden kendiniz hakkında bilgi ekleyebilirsiniz.')}
                </p>
              </div>
            </div>
          )}

          {/* EDIT PROFILE TAB */}
          {activeTab === 'edit' && (
            <div className="animate-fadeIn">
              <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[2.5rem] p-8 shadow-sm">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Profili Düzenle</h2>
                <p className="text-gray-500 font-medium text-sm mb-8">Kişisel bilgilerinizi ve tercihlerinizi buradan güncelleyebilirsiniz.</p>
                
                <form onSubmit={handleProfileSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider pl-2">Görünen Ad</label>
                      <input 
                        type="text" 
                        value={editForm.displayName} 
                        onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                        className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider pl-2">Kullanıcı Adı</label>
                      <input 
                        type="text" 
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider pl-2">Biyografi</label>
                    <textarea 
                      rows="4" 
                      placeholder="Kendinizden bahsedin..." 
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider pl-2">Konum</label>
                    <input 
                      type="text" 
                      placeholder="Örn: İstanbul, TR" 
                      value={editForm.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                    />
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={editSubmitting}
                      className="px-8 py-3.5 bg-primary text-white font-bold rounded-2xl shadow-md shadow-primary/20 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {editSubmitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="animate-fadeIn space-y-8">
              
              <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[2.5rem] p-8 shadow-sm">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Şifre Değiştir</h2>
                <p className="text-gray-500 font-medium text-sm mb-6">Hesabınızın güvenliği için şifrenizi düzenli olarak değiştirin.</p>
                
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <input 
                    type="password" 
                    placeholder="Mevcut Şifre" 
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    required
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  />
                  <input 
                    type="password" 
                    placeholder="Yeni Şifre" 
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    required
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  />
                  <input 
                    type="password" 
                    placeholder="Yeni Şifre (Tekrar)" 
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    required
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  />
                  <button 
                    type="submit" 
                    disabled={passwordSubmitting}
                    className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 active:scale-95 transition-all shadow-md mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {passwordSubmitting ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                  </button>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50/50 backdrop-blur-md border border-red-100 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h2 className="text-xl font-black text-red-600">Tehlikeli Bölge</h2>
                </div>
                <p className="text-red-900/70 font-medium text-sm mb-6">Buradaki işlemler geri alınamaz. Lütfen dikkatli olun.</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleExportData} 
                    className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all text-center"
                  >
                    Verilerimi İndir
                  </button>
                  <button 
                    onClick={handleDeleteAccount} 
                    disabled={deleting}
                    className="flex-1 px-6 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 active:scale-95 transition-all shadow-md shadow-red-500/20 text-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {deleting ? 'Siliniyor...' : 'Hesabımı Kalıcı Olarak Sil'}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
