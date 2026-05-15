import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet default icon fix for React/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom bubble marker icon with bounce and pulse effect
const customIcon = new L.DivIcon({
  className: 'custom-bubble-icon',
  html: `<div class="marker-container">
          <div class="marker-pulse"></div>
          <div class="marker-card">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 44],
  popupAnchor: [0, -48],
});

/**
 * Haritayı geçerli koordinatlara sahip etkinliklerin sınırlarına
 * otomatik olarak sığdıran iç bileşen.
 */
function FitBounds({ markers }) {
  const map = useMap();

  useEffect(() => {
    if (!markers || markers.length === 0) return;

    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 12);
      return;
    }

    const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
    map.fitBounds(bounds, { padding: [48, 48] });
  }, [markers, map]);

  return null;
}

const EventMap = ({ events = [], onEventSelect }) => {
  const defaultCenter = [41.0082, 28.9784]; // İstanbul fallback

  // Geçerli koordinatlara sahip etkinlikleri filtrele
  const markers = events.filter(
    e => e.lat != null && e.lng != null && !isNaN(e.lat) && !isNaN(e.lng)
  );

  return (
    <div className="w-full h-full min-h-[400px] rounded-[2rem] overflow-hidden shadow-inner border-4 border-white relative z-0 group">

      {/* Dekoratif gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/10 pointer-events-none z-[1000] mix-blend-overlay transition-opacity duration-500 group-hover:opacity-50" />

      <MapContainer
        center={defaultCenter}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{
          height: '100%',
          minHeight: '400px',
          width: '100%',
          filter: 'hue-rotate(-10deg) saturate(1.4) contrast(1.1) brightness(1.05)',
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Otomatik sınır ayarı */}
        {markers.length > 0 && <FitBounds markers={markers} />}

        {/* API'den gelen etkinlik işaretçileri */}
        {markers.map(event => (
          <Marker key={event.id} position={[event.lat, event.lng]} icon={customIcon}>
            <Popup className="premium-popup">
              <div className="w-64 overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Mini Header Gradient */}
                <div className="h-16 w-full bg-gradient-to-r from-primary to-secondary relative flex items-center justify-center">
                   <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                   <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-lg">
                      {event.date}
                   </div>
                </div>
                
                {/* Content */}
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-extrabold text-gray-900 text-sm leading-tight line-clamp-1">
                    {event.title}
                  </h3>
                  
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                      <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="truncate">{event.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                      <svg className="w-3.5 h-3.5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{event.time}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onEventSelect?.(event.id)}
                    className="mt-2 w-full bg-primary text-white text-[11px] font-bold py-2 rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                  >
                    Detayları Gör
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Koordinatı olmayan ama harita açıkken gösterilen fallback */}
        {markers.length === 0 && (
          <Marker position={defaultCenter} icon={customIcon}>
            <Popup className="premium-popup">
              <div className="px-4 py-3 bg-white rounded-xl shadow-lg text-center">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Etkinlik Bulunmadı</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Marker Animations */
        .marker-container {
          position: relative;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marker-card {
          width: 44px;
          height: 44px;
          background: #35b8b0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid white;
          box-shadow: 0 10px 25px rgba(53,184,176,0.5);
          animation: marker-bounce 2s ease-in-out infinite;
          position: relative;
          z-index: 2;
        }
        .marker-pulse {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 10px;
          background: rgba(53,184,176,0.3);
          border-radius: 50%;
          animation: marker-pulse-kf 2s ease-in-out infinite;
          z-index: 1;
        }
        
        @keyframes marker-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        
        @keyframes marker-pulse-kf {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.3; }
          50% { transform: translateX(-50%) scale(2.5); opacity: 0; }
        }

        .premium-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .premium-popup .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .premium-popup .leaflet-popup-tip-container {
          display: none !important;
        }
        .premium-popup .leaflet-popup-close-button {
          padding: 8px !important;
          color: white !important;
          z-index: 100;
        }
      `}} />
    </div>
  );
};

export default EventMap;
