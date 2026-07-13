import EventMap from './EventMap';

function formatFileSize(size) {
  if (!size || Number.isNaN(Number(size))) return null;

  const numericSize = Number(size);
  if (numericSize < 1024) return `${numericSize} B`;
  if (numericSize < 1024 * 1024) return `${(numericSize / 1024).toFixed(1)} KB`;
  return `${(numericSize / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(file) {
  const type = file.type?.toLowerCase() ?? '';
  const name = file.name?.toLowerCase() ?? '';
  const url = file.url?.toLowerCase() ?? '';

  return (
    type.startsWith('image/') ||
    /\.(png|jpe?g|webp|gif|avif|bmp|svg)(\?.*)?$/.test(name) ||
    /\.(png|jpe?g|webp|gif|avif|bmp|svg)(\?.*)?$/.test(url)
  );
}

function dataUrlToObjectUrl(dataUrl) {
  const [header, base64Data] = dataUrl.split(',');
  const mimeType = header.match(/data:(.*?);base64/)?.[1] || 'application/octet-stream';
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return URL.createObjectURL(new Blob([bytes], { type: mimeType }));
}

function openFile(file) {
  if (!file.url) return;

  const targetUrl = file.url.startsWith('data:')
    ? dataUrlToObjectUrl(file.url)
    : file.url;

  window.open(targetUrl, '_blank');
}

const InfoTile = ({ icon, label, value }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-extrabold">{label}</p>
      <p className="text-sm text-gray-800 font-bold mt-1 break-words">{value}</p>
    </div>
  </div>
);

const EventDetail = ({ event, loading, error, onBack }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 ec-shimmer rounded-2xl w-40" />
        <div className="h-72 ec-shimmer rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-24 ec-shimmer rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const isForbidden = error === '403_FORBIDDEN';

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        {isForbidden ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a8.25 8.25 0 0 1 15 0" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Etkinlik Yüklenemedi</h1>
            <p className="text-gray-400 font-medium mt-2">Bu etkinliğin detaylarını görmek için giriş yapmalısınız.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => window.location.href = '/login'}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                Giriş Yap
              </button>
              <button
                onClick={onBack}
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-all"
              >
                Geri Dön
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Etkinlik Yuklenemedi</h1>
            <p className="text-gray-400 font-medium mt-2">{error}</p>
            <button
              onClick={onBack}
              className="mt-6 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              Geri Don
            </button>
          </>
        )}
      </div>
    );
  }

  if (!event) return null;

  const hasCoordinates = event.lat != null && event.lng != null && !Number.isNaN(Number(event.lat)) && !Number.isNaN(Number(event.lng));
  const locationText = [event.address, event.city, event.country].filter(Boolean).join(', ');
  const heroImage = event.files.find((file) => file.url && isImageFile(file));

  return (
    <div className="space-y-8 pb-12 max-w-[1500px] mx-auto">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(35px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .delay-100 { animation-delay: 80ms; }
        .delay-200 { animation-delay: 160ms; }
        .delay-300 { animation-delay: 240ms; }
        .delay-400 { animation-delay: 320ms; }
        .delay-500 { animation-delay: 400ms; }
      `}</style>

      {/* Back Button */}
      <div className="animate-fade-in-up delay-100">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2.5 px-5 py-3 bg-white border border-gray-200 text-gray-700 font-black rounded-full hover:bg-gray-50 hover:text-primary hover:border-gray-300 hover:scale-105 active:scale-95 transition-all duration-300 text-sm shadow-sm hover:shadow-md"
        >
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Etkinliklere Dön
        </button>
      </div>

      {/* 1. SEPARATED PHOTO BANNER AT THE TOP */}
      <div className="animate-fade-in-up delay-200 relative overflow-hidden rounded-[2.5rem] h-[320px] md:h-[420px] border border-white/60 shadow-lg hover:shadow-xl hover:border-white transition-all duration-500 group">
        {heroImage ? (
          <img
            src={heroImage.url}
            alt={heroImage.name}
            className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-950 via-slate-900 to-primary flex items-center justify-center relative">
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl animate-pulse" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl animate-pulse" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
            <svg className="w-20 h-20 text-white/10 transition-transform duration-700 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* 2. COMBINED MASTER DETAILS CARD (MINIMALIST) */}
      <div className="animate-fade-in-up delay-300 bg-white/80 backdrop-blur-md border border-white/60 rounded-[2.5rem] elevation-2 p-8 md:p-12 flex flex-col gap-6 w-full hover:shadow-xl hover:border-white transition-all duration-500">
        
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform duration-300 cursor-default">
            {event.visibility}
          </span>
          {event.category && (
            <span className="px-3.5 py-1.5 rounded-full bg-secondary/20 text-amber-700 text-[10px] font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform duration-300 cursor-default">
              {event.category}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight transition-all duration-300 hover:translate-x-0.5">
          {event.title}
        </h1>

        {/* Horizontal Minimalist Meta Rows */}
        <div className="flex flex-wrap items-center gap-y-4 gap-x-8 py-6 border-y border-gray-100 text-sm md:text-base font-bold text-gray-600">
          <div className="flex items-center gap-2.5 hover:bg-gray-50/80 hover:scale-105 active:scale-95 transition-all duration-300 p-2 -m-2 rounded-2xl cursor-pointer group/item">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover/item:scale-110 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
              </svg>
            </div>
            <span className="group-hover/item:text-gray-900 transition-colors duration-300">{event.fullDate}</span>
          </div>

          <div className="flex items-center gap-2.5 hover:bg-gray-50/80 hover:scale-105 active:scale-95 transition-all duration-300 p-2 -m-2 rounded-2xl cursor-pointer group/item">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover/item:scale-110 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
            </div>
            <span className="group-hover/item:text-gray-900 transition-colors duration-300">{event.time}</span>
          </div>

          <div className="flex items-center gap-2.5 hover:bg-gray-50/80 hover:scale-105 active:scale-95 transition-all duration-300 p-2 -m-2 rounded-2xl cursor-pointer group/item">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover/item:scale-110 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a8.25 8.25 0 0 1 15 0" />
              </svg>
            </div>
            <span className="group-hover/item:text-gray-900 transition-colors duration-300">Düzenleyen: <span className="text-gray-900 font-extrabold">{event.username || 'Belirtilmedi'}</span></span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-2">
          <p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed whitespace-pre-line hover:text-gray-800 transition-colors duration-300">
            {event.desc || 'Etkinlik açıklaması bulunmuyor.'}
          </p>
        </div>

      </div>

      {/* 3. WIDE FILES CARD */}
      <div className="animate-fade-in-up delay-400 bg-white/80 backdrop-blur-md border border-white/60 rounded-[2.5rem] elevation-2 p-8 md:p-10 flex flex-col gap-6 w-full hover:shadow-xl hover:border-white transition-all duration-500">
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Dosyalar ve Ekler</h2>
            <p className="text-sm text-gray-400 font-semibold mt-1.5">{event.fileCount} dosya eklenmiş</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-secondary/20 text-amber-600 flex items-center justify-center shrink-0 hover:rotate-6 transition-transform duration-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H8.25m2.25 0H5.625A1.875 1.875 0 0 0 3.75 4.125v15.75c0 1.036.839 1.875 1.875 1.875h12.75a1.875 1.875 0 0 0 1.875-1.875V11.25A9 9 0 0 0 10.5 2.25z" />
            </svg>
          </div>
        </div>

        {event.files.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {event.files.map((file) => (
              <div key={file.id} className="py-4 flex items-center gap-4 hover:bg-gray-50/70 hover:scale-[1.006] transition-all duration-300 rounded-2xl px-4 -mx-4 group/row">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 border border-gray-100 flex items-center justify-center shrink-0 group-hover/row:bg-primary/10 group-hover/row:text-primary group-hover/row:border-primary/20 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H6.75A2.25 2.25 0 0 0 4.5 4.5v15a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-5.25z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-gray-800 truncate group-hover/row:text-gray-900 transition-colors duration-300">{file.name}</p>
                  <p className="text-sm text-gray-400 font-semibold mt-1">
                    {[file.type, formatFileSize(file.size)].filter(Boolean).join(' • ') || 'Dosya bilgisi'}
                  </p>
                </div>
                {file.url && (
                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => openFile(file)}
                      className="px-4.5 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-black hover:bg-primary hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm"
                    >
                      Aç
                    </button>
                    <a
                      href={file.url}
                      download={file.name}
                      className="px-4.5 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 text-xs font-black hover:bg-gray-100 hover:text-gray-900 hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm"
                    >
                      İndir
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border border-dashed border-gray-200 rounded-3xl bg-gray-50/20">
            <p className="text-gray-400 font-bold">Bu etkinlik için henüz dosya eklenmemiş.</p>
          </div>
        )}
      </div>

      {/* 4. FULL-WIDTH MAP & LOCATION SECTION AT THE BOTTOM */}
      <div className="animate-fade-in-up delay-500 bg-white/80 backdrop-blur-md border border-white/60 rounded-[2.5rem] elevation-2 p-8 md:p-10 flex flex-col gap-6 w-full hover:shadow-xl hover:border-white transition-all duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Ulaşım ve Harita</h2>
            <p className="text-gray-500 text-base font-bold mt-1.5 leading-relaxed">{locationText || 'Adres bilgisi girilmemiş.'}</p>
          </div>
          {hasCoordinates && (
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black tracking-wide shrink-0 hover:scale-105 transition-transform duration-300">
              {Number(event.lat).toFixed(5)}, {Number(event.lng).toFixed(5)}
            </span>
          )}
        </div>

        <div className="h-[450px] rounded-3xl overflow-hidden border border-white/60 shadow-inner relative z-0">
          <EventMap events={hasCoordinates ? [event] : []} />
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
