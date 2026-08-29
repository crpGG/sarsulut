import React from 'react';
import { PEJABAT_LIST } from '../data/sarData';
import { SVG_PLACEHOLDER } from '../data/images';
import { KepalaKantorPortrait } from './KepalaKantorPortrait';

export const Pejabat: React.FC = () => {
  return (
    <section className="band band--light" id="pejabat" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <p className="eyebrow rv">Pejabat Struktural</p>
        <div className="split" style={{ alignItems: 'end', marginBottom: 'clamp(28px,4vw,50px)' }}>
          <h2 className="h-lg rv">
            Wajah di balik<br />setiap operasi.
          </h2>
          <p className="lede dim rv">
            Struktur organisasi Kantor SAR Manado terdiri atas Kepala Kantor, Kepala Sub Bagian Umum, koordinator bidang operasi, kesiapsiagaan, dan sumber daya, serta kepala pos di Amurang dan Tahuna.
          </p>
        </div>

        <div className="roster rv">
          {PEJABAT_LIST.map((p, idx) => (
            <article className="person group" key={p.id}>
              {idx === 0 ? (
                <div className="w-full">
                  <KepalaKantorPortrait aspectRatio="r11" />
                </div>
              ) : (
                <figure
                  className="slot r11"
                  data-label={p.slotLabel || `Foto 0${idx + 1}`}
                  data-slot={p.id}
                >
                  <img
                    alt={`Foto ${p.name}`}
                    src={SVG_PLACEHOLDER}
                    className="transition-all duration-500 group-hover:scale-105"
                  />
                </figure>
              )}
              <div className="person-txt">
                <span className="role">{p.role}</span>
                <span className="nm">{p.name}</span>
                {p.deg && <span className="deg">{p.deg}</span>}
                {p.nip && <span className="nip">{p.nip}</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

