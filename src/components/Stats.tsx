import React, { useEffect, useRef, useState } from 'react';

export const Stats: React.FC = () => {
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);

  const [km, setKm] = useState<number>(0);
  const [year, setYear] = useState<number>(0);
  const [sosNum, setSosNum] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            if (reduce) {
              setKm(800000);
              setYear(1979);
              setSosNum(115);
              setHours(24);
              return;
            }

            const startTime = performance.now();
            const duration = 1600;

            const step = (currentTime: number) => {
              const progress = Math.min(1, (currentTime - startTime) / duration);
              const eased = 1 - Math.pow(1 - progress, 3);

              setKm(Math.round(800000 * eased));
              setYear(Math.round(1979 * eased));
              setSosNum(Math.round(115 * eased));
              setHours(Math.round(24 * eased));

              if (progress < 1) {
                requestAnimationFrame(step);
              }
            };

            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section className="band band--dark" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="stats rv in" ref={statsRef}>
          <div className="stat">
            <div className="num" data-to="800000" data-fmt="id">
              {km.toLocaleString('id-ID')}
            </div>
            <div className="lbl">km² wilayah tanggung jawab</div>
          </div>
          <div className="stat">
            <div className="num" data-to="1979">
              {year}
            </div>
            <div className="lbl">Berdiri sebagai unit SAR</div>
          </div>
          <div className="stat">
            <div className="num" data-to="115">
              {sosNum}
            </div>
            <div className="lbl">Nomor darurat nasional</div>
          </div>
          <div className="stat">
            <div className="num" data-to="24">
              {hours}
              <small>/7</small>
            </div>
            <div className="lbl">Jam siaga operasi</div>
          </div>
        </div>
      </div>
    </section>
  );
};
