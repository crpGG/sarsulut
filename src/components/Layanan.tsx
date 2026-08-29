import React from 'react';
import { LAYANAN_LIST } from '../data/sarData';

export const Layanan: React.FC = () => {
  const handleServiceClick = (title: string) => {
    const contactEl = document.getElementById('kontak');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="band band--dark" id="layanan">
      <div className="wrap">
        <p className="eyebrow rv">Layanan Basarnas</p>
        <div className="split" style={{ alignItems: 'end', marginBottom: 'clamp(24px,4vw,44px)' }}>
          <h2 className="h-lg rv">
            Lima lini<br />kesiapsiagaan.
          </h2>
          <p className="lede dim rv">
            Setiap lini bekerja sepanjang tahun — jauh sebelum sirene berbunyi. Klik untuk menghubungi bidang terkait.
          </p>
        </div>

        <div className="svc rv">
          {LAYANAN_LIST.map((svc) => (
            <article
              className="svc-item group"
              key={svc.code}
              onClick={() => handleServiceClick(svc.title)}
            >
              <h3 className="h-md">{svc.title}</h3>
              <p>{svc.desc}</p>
              <span className="code">{svc.code}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
