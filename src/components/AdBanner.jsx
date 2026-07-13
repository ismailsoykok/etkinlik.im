import { useEffect, useRef } from 'react';

const AdBanner = ({ slot, format = 'auto', className = '', layout = '', layoutKey = '' }) => {
  const adRef = useRef(null);
  const isAdReady = useRef(false);

  useEffect(() => {
    if (!slot || isAdReady.current) return;

    try {
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
      isAdReady.current = true;
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <div className={`flex justify-center overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3642714140922802"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layout ? { 'data-ad-layout': layout } : {})}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
      />
    </div>
  );
};

export default AdBanner;
