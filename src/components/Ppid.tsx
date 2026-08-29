import React from 'react';

export const Ppid: React.FC = () => {
  return (
    <section className="band band--dark" id="ppid">
      <div className="wrap">
        <p className="eyebrow rv">PPID · Layanan Informasi Publik</p>
        <div className="split" style={{ alignItems: 'start' }}>
          <div className="rv">
            <h2 className="h-lg">
              Terbuka,<br />cepat,<br />akuntabel.
            </h2>
            <p className="lede dim" style={{ marginTop: '22px' }}>
              “Mewujudkan Pelayanan Informasi Publik dengan Cepat dan Akuntabel.” Pejabat Pengelola Informasi dan Dokumentasi melayani permohonan informasi publik sesuai UU No. 14 Tahun 2008.
            </p>
            <a className="btn ghost" href="#kontak" style={{ marginTop: '26px' }}>
              Ajukan permohonan
            </a>
          </div>

          <div className="acc rv">
            <details open>
              <summary>
                <h3 className="h-sm">Misi PPID</h3>
                <span className="plus"></span>
              </summary>
              <div className="ans">
                <ol>
                  <li>Meningkatkan pengelolaan dokumentasi informasi publik.</li>
                  <li>Memenuhi kebutuhan masyarakat terhadap akses informasi.</li>
                  <li>Meningkatkan sarana dan prasarana pelayanan informasi publik.</li>
                  <li>Memberikan informasi yang akurat dan bertanggung jawab kepada masyarakat.</li>
                </ol>
              </div>
            </details>

            <details>
              <summary>
                <h3 className="h-sm">Cara mengajukan permohonan informasi</h3>
                <span className="plus"></span>
              </summary>
              <div className="ans">
                <ol>
                  <li>Isi formulir permohonan informasi publik beserta identitas pemohon.</li>
                  <li>Sertakan salinan KTP atau identitas badan hukum.</li>
                  <li>Kirim melalui formulir di halaman Kontak, surel, atau datang langsung ke kantor pada jam kerja.</li>
                  <li>Permohonan diproses sesuai jangka waktu yang diatur UU KIP.</li>
                </ol>
              </div>
            </details>

            <details>
              <summary>
                <h3 className="h-sm">Jenis informasi publik</h3>
                <span className="plus"></span>
              </summary>
              <div className="ans">
                <ul>
                  <li>Informasi yang wajib disediakan dan diumumkan secara berkala.</li>
                  <li>Informasi yang wajib diumumkan serta-merta.</li>
                  <li>Informasi yang wajib tersedia setiap saat.</li>
                  <li>Informasi yang dikecualikan sesuai ketentuan peraturan perundang-undangan.</li>
                </ul>
              </div>
            </details>

            <details>
              <summary>
                <h3 className="h-sm">Prosedur keberatan</h3>
                <span className="plus"></span>
              </summary>
              <div className="ans">
                <p>
                  Pemohon yang tidak puas atas tanggapan PPID dapat mengajukan keberatan tertulis kepada atasan PPID, dan selanjutnya menyampaikan sengketa informasi kepada Komisi Informasi sesuai ketentuan yang berlaku.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
};
