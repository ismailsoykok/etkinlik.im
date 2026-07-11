import { useEffect, useState } from 'react';

export default function WelcomeOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Fade in gracefully on mount
    const fadeInTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    // Fade out after 2.6 seconds
    const fadeOutTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 2600);

    // Unmount after 3.3 seconds (allowing animation to finish)
    const unmountTimeout = setTimeout(() => {
      setShouldRender(false);
    }, 3300);

    return () => {
      clearTimeout(fadeInTimeout);
      clearTimeout(fadeOutTimeout);
      clearTimeout(unmountTimeout);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-700 ease-out px-4 ${
        isVisible 
          ? 'bg-[#020e0f]/98 backdrop-blur-2xl opacity-100' 
          : 'bg-[#020e0f]/0 backdrop-blur-0 opacity-0 pointer-events-none'
      }`}
    >
      {/* Dynamic Green & Aqua Radial Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#10b981]/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#35b8b0]/20 rounded-full blur-[140px] animate-[pulse_4s_infinite]" />
      </div>

      <div
        className={`relative max-w-2xl w-full text-center space-y-8 p-6 transition-all duration-700 ease-out ${
          isVisible 
            ? 'scale-100 translate-y-0 opacity-100' 
            : 'scale-95 -translate-y-6 opacity-0'
        }`}
      >
        {/* Pulsating Map Marker Icon */}
        <div className="relative flex justify-center mb-4">
          <div className="absolute w-24 h-24 bg-[#35b8b0]/15 rounded-full animate-ping" />
          <div className="absolute w-32 h-32 bg-[#10b981]/5 rounded-full animate-[ping_3s_infinite]" />
          <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-[#10b981] to-[#35b8b0] rounded-full shadow-lg shadow-[#35b8b0]/20">
            <svg
              className="w-10 h-10 text-white animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        {/* Grand Typography Area */}
        <div className="space-y-6">
          <h1 
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#10b981] via-[#35b8b0] to-[#06b6d4] select-none drop-shadow-[0_2px_15px_rgba(53,184,176,0.15)] whitespace-nowrap"
            style={{ fontFamily: "'Goldman', system-ui, sans-serif" }}
          >
            etkinlik.im
          </h1>
          
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#10b981] to-[#35b8b0] mx-auto rounded-full" />
          
          <p className="text-emerald-50/90 text-2xl md:text-3xl font-light tracking-wider font-sans max-w-xl mx-auto select-none leading-relaxed">
            Yakınında olan bitenleri gör!
          </p>
        </div>
      </div>

      {/* Modern thin progress timer bar at the bottom of the viewport */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-950/30">
        <div 
          className="h-full bg-gradient-to-r from-[#10b981] to-[#35b8b0] transition-all ease-linear"
          style={{
            width: isVisible ? '0%' : '100%',
            transitionDuration: isVisible ? '2550ms' : '0ms'
          }}
        />
      </div>
    </div>
  );
}
