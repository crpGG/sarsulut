import React from 'react';
import { KepalaKantorPortrait } from './KepalaKantorPortrait';

export const Sambutan: React.FC = () => {
  return (
    <section className="band band--light" id="sambutan">
      <div className="wrap">
        <p className="eyebrow rv">Sambutan Kepala Kantor</p>
        <div className="split">
          <div className="portrait-fig rv">
            <KepalaKantorPortrait showBadge={true} aspectRatio="r34" />
          </div>

          <div className="rv">
            <p className="quote">
              “Kami hadir di titik ketika <span>harapan</span> paling dibutuhkan.”
            </p>
            <div className="body-col text-neutral-800 space-y-4">
              <p>
                Assalamualaikum warahmatullahi wabarakatuh, salam sejahtera bagi kita semua.
              </p>
              <p>
                Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas hadirnya laman resmi Kantor Pencarian dan Pertolongan Manado. Situs ini kami hadirkan sebagai jembatan informasi antara Basarnas Sulawesi Utara dengan masyarakat — tempat publik dapat mengenal tugas, kesiapsiagaan, serta layanan yang kami selenggarakan setiap hari.
              </p>
              <p>
                Sesuai amanat Undang-Undang, Basarnas menyelenggarakan operasi pencarian dan pertolongan terhadap kecelakaan pelayaran dan penerbangan, bencana, serta kondisi membahayakan manusia. Tugas itu tidak dapat kami emban sendiri: keberhasilan operasi SAR selalu lahir dari sinergi bersama TNI, Polri, pemerintah daerah, dan potensi SAR di tengah masyarakat.
              </p>
              <p>
                Kepada seluruh masyarakat Sulawesi Utara, kami mengajak untuk turut menjaga keselamatan bersama — melapor cepat melalui nomor darurat <strong>115</strong>, dan tidak ragu menghubungi kami kapan pun dibutuhkan. Semoga laman ini bermanfaat.
              </p>
              <p className="italic font-medium text-amber-800">
                Avignam Jagat Samagram — semoga selamatlah alam semesta.
              </p>
            </div>

            <div className="sign">
              <div className="slot" data-label="TTD" data-slot="ttd-kepala">
                <svg viewBox="0 0 130 60" className="w-full h-full text-amber-700 stroke-current fill-none">
                  <path d="M 10 40 Q 30 10 50 35 T 90 20 Q 110 45 120 25" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M 35 45 Q 60 52 105 40" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <b>George L. M. Randang, S.IP., M.A.P.</b>
                <small>Kepala Kantor SAR Manado</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
