import { useState, useMemo } from 'react';

// --- 10 Gradient Palettes ---
const PALETTES = [
  { from: '#35b8b0', via: '#009688', to: '#00796b', accent: '#80cbc4' }, // Su Mavisi / Teal (Theme Primary)
  { from: '#f8c210', via: '#ffb300', to: '#f57c00', accent: '#ffe082' }, // Sarı / Amber (Theme Secondary)
  { from: '#ff7043', via: '#f4511e', to: '#d84315', accent: '#ffab91' }, // Coral / Sunset Orange
  { from: '#4f46e5', via: '#3f51b5', to: '#283593', accent: '#9fa8da' }, // Indigo / Royal Blue
  { from: '#d81b60', via: '#ad1457', to: '#880e4f', accent: '#f48fb1' }, // Rose / Deep Pink
  { from: '#059669', via: '#00897b', to: '#004d40', accent: '#a5d6a7' }, // Emerald / Forest Green
  { from: '#0288d1', via: '#0277bd', to: '#01579b', accent: '#81d4fa' }, // Sky / Ocean Blue
  { from: '#8e24aa', via: '#7b1fa2', to: '#4a148c', accent: '#ce93d8' }, // Purple / Amethyst
  { from: '#c0ca33', via: '#afb42b', to: '#fbc02d', accent: '#e6ee9c' }, // Lime / Sunburst Gold
  { from: '#26a69a', via: '#00897b', to: '#00695c', accent: '#b2dfdb' }, // Mint / Soft Turquoise
];

// --- Decorative SVG icon paths ---
const ICON_PATHS = [
  'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
  'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z',
  'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z',
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  'M7 2v11h3v9l7-12h-4l4-8z',
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  'M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2z',
  'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
  'M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-5-4l1-1 1 1v2h-2V7zm-4 10H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V7h2v2zm6 8H8v-2h4v2zm0-4H8v-2h4v2zm0-4H8V7h4v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2z',
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getRelativeLabel(rawDate) {
  if (!rawDate) return null;
  const now = new Date();
  const eventDate = new Date(rawDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  const diffDays = Math.ceil((eventDay - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: 'Geçmiş', bg: 'bg-gray-500' };
  if (diffDays === 0) return { text: 'Bugün', bg: 'bg-red-500' };
  if (diffDays === 1) return { text: 'Yarın', bg: 'bg-orange-500' };
  if (diffDays <= 7) return { text: 'Bu Hafta', bg: 'bg-amber-500' };
  if (diffDays <= 30) return { text: 'Yaklaşıyor', bg: 'bg-blue-500' };
  return null;
}

const EventCard = ({ event, onSelect, layout = 'horizontal' }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const isVertical = layout === 'vertical';

  const hash = useMemo(() => hashString(event.title || ''), [event.title]);
  const palette = PALETTES[hash % PALETTES.length];
  const iconPath = ICON_PATHS[hash % ICON_PATHS.length];
  const label = useMemo(() => getRelativeLabel(event.startDateRaw), [event.startDateRaw]);

  // Deterministic floating shape positions
  const shapes = useMemo(() => [
    { top: `${(hash % 30) + 10}%`, left: `${(hash % 40) + 5}%`, size: (hash % 20) + 30 },
    { top: `${((hash * 7) % 40) + 5}%`, right: `${((hash * 3) % 30) + 10}%`, size: ((hash * 5) % 15) + 20 },
    { bottom: `${((hash * 11) % 20) + 20}%`, left: `${((hash * 13) % 50) + 10}%`, size: ((hash * 2) % 12) + 15 },
  ], [hash]);

  return (
    <div
      className={`group flex ${isVertical ? 'flex-col' : 'flex-col md:flex-row'} bg-white/80 backdrop-blur-md p-6 border border-white/60 rounded-3xl elevation-2 hover:elevation-4 elevation-hover active:scale-[0.985] transition-all duration-300 ease-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 gap-6 w-full items-stretch`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(event.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(event.id);
        }
      }}
    >
      {/* --- Visual Header (Left / Top) --- */}
      <div
        className={`w-full ${isVertical ? '' : 'md:w-56'} h-56 md:h-auto shrink-0 relative overflow-hidden rounded-2xl ${isVertical ? 'h-48 md:h-48' : ''}`}
        style={{ background: `linear-gradient(135deg, ${palette.from}, ${palette.via}, ${palette.to})` }}
      >
        {/* Floating Shapes */}
        {shapes.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 ec-float"
            style={{
              top: s.top, left: s.left, right: s.right, bottom: s.bottom,
              width: s.size, height: s.size,
              background: palette.accent,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}

        {/* Large Decorative Icon */}
        <svg
          viewBox="0 0 24 24"
          fill={palette.accent}
          className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700"
        >
          <path d={iconPath} />
        </svg>

        {/* Dot Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, ${palette.accent} 1px, transparent 1px)`,
            backgroundSize: '14px 14px',
          }}
        />

        {/* Relative Label Badge - top left */}
        {label && (
          <div className={`absolute top-4 left-4 z-20 ${label.bg} text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-lg`}>
            {label.text}
          </div>
        )}

        {/* Bookmark - top right */}
        <button
          onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
          className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-110 ${
            bookmarked
              ? 'bg-secondary text-white shadow-lg shadow-secondary/30'
              : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/40'
          }`}
        >
          <svg className="w-5 h-5" fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* --- Content (Right / Bottom) --- */}
      <div className="flex-grow flex flex-col justify-between min-w-0 md:py-1">
        <div>
          {/* Title */}
          <h3 className="mb-3 text-2xl font-black tracking-tight text-gray-900 line-clamp-1 group-hover:text-primary group-hover:translate-x-1.5 transition-all duration-300 ease-out">
            {event.title}
          </h3>
          
          {/* Description */}
          <p className="mb-5 text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {event.desc || <span className="italic text-gray-300">Açıklama belirtilmemiş</span>}
          </p>

          {/* Date & Time Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="bg-gray-100/60 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-gray-200 transition-colors group-hover:border-primary/20">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {event.date}
            </div>
            <div className="bg-gray-100/60 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-gray-200 transition-colors group-hover:border-primary/20">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              {event.time}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Location & Action Button */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100 mt-auto">
          {/* Location */}
          <div className="flex items-center gap-1.5 min-w-0">
            <svg className="w-4 h-4 text-primary shrink-0 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-gray-400 truncate">{event.address}, {event.city}</span>
          </div>

          {/* Action Button */}
          <div className="shrink-0">
            <button
              type="button"
              className="inline-flex items-center w-auto bg-gray-100/80 text-gray-700 font-bold border border-gray-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-md group-hover:shadow-primary/20 active:scale-95 transition-all duration-300 text-xs px-4 py-2.5 rounded-xl focus:outline-none"
            >
              Detaylar
              <svg className="w-4 h-4 ms-1 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m14 0-4 4m4-4-4-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
