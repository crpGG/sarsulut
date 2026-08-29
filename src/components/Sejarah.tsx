import React from 'react';
import { SEJARAH_LIST } from '../data/sarData';

export const Sejarah: React.FC = () => {
  return (
    <section className="band band--darker">
      <div className="wrap">
        <p className="eyebrow rv">Jejak Kantor · <b>1979 — Sekarang</b></p>
        <div className="split">
          <h2 className="h-lg rv">
            Dari dua orang,<br />menjadi satu<br />provinsi.
          </h2>
          <div className="rv">
            <div className="infolist">
              {SEJARAH_LIST.map((item) => (
                <div key={item.year}>
                  <span className="k">{item.year}</span>
                  <span className="v">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
