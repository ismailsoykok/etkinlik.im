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

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Etkinlik yuklenemedi</h1>
        <p className="text-gray-400 font-medium mt-2">{error}</p>
        <button
          onClick={onBack}
          className="mt-6 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          Geri Don
        </button>
      </div>
    );
  }

  if (!event) return null;

  const hasCoordinates = event.lat != null && event.lng != null && !Number.isNaN(Number(event.lat)) && !Number.isNaN(Number(event.lng));
  const locationText = [event.address, event.city, event.country].filter(Boolean).join(', ');
  const heroImage = event.files.find((file) => file.url && isImageFile(file));

  return (
    <div className="space-y-6 pb-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-primary transition-all text-sm shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Etkinliklere Don
      </button>

      <section
        className={`relative overflow-hidden rounded-3xl min-h-[300px] flex items-end border border-gray-100 shadow-sm ${
          heroImage ? 'bg-gray-950' : 'bg-gradient-to-br from-gray-950 via-slate-800 to-primary'
        }`}
      >
        {heroImage && (
          <img
            src={heroImage.url}
            alt={heroImage.name}
            className="absolute inset-0 w-full h-full object-cover"
            decoding="async"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
        {!heroImage && (
          <>
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-secondary/25 blur-3xl" />
            <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
          </>
        )}

        <div className="relative z-10 p-6 md:p-8 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-lg bg-white/15 backdrop-blur-sm text-white text-[11px] font-extrabold uppercase tracking-wider">
              {event.visibility}
            </span>
            {event.category && (
              <span className="px-3 py-1 rounded-lg bg-secondary text-gray-900 text-[11px] font-extrabold uppercase tracking-wider">
                {event.category}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {event.title}
          </h1>
          <p className="mt-4 text-white/75 text-sm md:text-base leading-relaxed max-w-2xl">
            {event.desc}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <InfoTile
          label="Tarih"
          value={event.fullDate}
          icon={(
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
            </svg>
          )}
        />
        <InfoTile
          label="Saat"
          value={event.time}
          icon={(
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
          )}
        />
        <InfoTile
          label="Duzenleyen"
          value={event.username || 'Belirtilmedi'}
          icon={(
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a8.25 8.25 0 0 1 15 0" />
            </svg>
          )}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Dosyalar</h2>
              <p className="text-sm text-gray-400 font-medium mt-1">{event.fileCount} dosya listeleniyor</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-secondary/20 text-amber-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H8.25m2.25 0H5.625A1.875 1.875 0 0 0 3.75 4.125v15.75c0 1.036.839 1.875 1.875 1.875h12.75a1.875 1.875 0 0 0 1.875-1.875V11.25A9 9 0 0 0 10.5 2.25z" />
              </svg>
            </div>
          </div>

          {event.files.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {event.files.map((file) => (
                <div key={file.id} className="py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H6.75A2.25 2.25 0 0 0 4.5 4.5v15a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-5.25z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {[file.type, formatFileSize(file.size)].filter(Boolean).join(' • ') || 'Dosya bilgisi'}
                    </p>
                  </div>
                  {file.url && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => openFile(file)}
                        className="px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-extrabold hover:bg-primary hover:text-white transition-all"
                      >
                        Ac
                      </button>
                      <a
                        href={file.url}
                        download={file.name}
                        className="px-3 py-2 rounded-xl bg-gray-100 text-gray-500 text-xs font-extrabold hover:bg-gray-200 hover:text-gray-700 transition-all"
                      >
                        Indir
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-gray-200 rounded-2xl">
              <p className="text-gray-400 font-bold">Bu etkinlik icin dosya yok</p>
            </div>
          )}
        </section>

        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Konum</h2>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">{locationText || 'Konum bilgisi yok'}</p>
            {hasCoordinates && (
              <p className="mt-3 text-xs text-gray-400 font-bold">
                {Number(event.lat).toFixed(5)}, {Number(event.lng).toFixed(5)}
              </p>
            )}
          </div>

          <div className="h-[360px] rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
            <EventMap events={hasCoordinates ? [event] : []} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EventDetail;
