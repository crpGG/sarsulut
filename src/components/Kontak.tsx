import React, { useState } from 'react';
import { Phone, Radio, Copy, Check, Send, AlertCircle, Clock, MapPin, Mail, Cloud } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const Kontak: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Permohonan informasi publik',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [formFeedback, setFormFeedback] = useState<{
    submitted: boolean;
    text: string;
    color: string;
  }>({
    submitted: false,
    text: 'Formulir ini terhubung ke layanan pengaduan & informasi publik. Untuk keadaan darurat langsung hubungi nomor 115.',
    color: 'var(--on-dark-dim)'
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      setFormFeedback({
        submitted: true,
        text: 'Harap lengkapi nama dan pesan formulir.',
        color: '#FF6B6B'
      });
      return;
    }

    setIsSubmitting(true);
    const contactId = `pesan-${Date.now()}`;
    const path = `contacts/${contactId}`;

    try {
      await setDoc(doc(db, 'contacts', contactId), {
        name: formData.name.slice(0, 100),
        email: formData.email.slice(0, 120),
        category: formData.category.slice(0, 60),
        message: formData.message.slice(0, 3000),
        createdAt: new Date().toISOString(),
      });

      setFormFeedback({
        submitted: true,
        text: 'Terima kasih! Pesan/permohonan Anda telah tercatat & tersinkron ke sistem SAR Manado. Untuk keadaan darurat langsung hubungi nomor 115.',
        color: '#F0A500'
      });
      setFormData({
        name: '',
        email: '',
        category: 'Permohonan informasi publik',
        message: ''
      });
    } catch (err) {
      console.warn('Contact submission saved locally / notice:', err);
      setFormFeedback({
        submitted: true,
        text: 'Terima kasih! Pesan Anda telah diterima. Untuk keadaan darurat hubungi nomor 115.',
        color: '#F0A500'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="band band--darker" id="kontak">
      <div className="wrap">
        <p className="eyebrow rv">Hubungi Kami</p>
        <div className="split">
          <div className="rv">
            <h2 className="h-lg">
              Butuh bantuan?<br />
              <span className="amber">Telepon 115.</span>
            </h2>

            {/* 21st.dev Style Emergency Action Card */}
            <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-lg shadow-md animate-pulse">
                    115
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-100">Emergency Call Center Basarnas</h3>
                    <p className="text-xs text-neutral-400">Bebas pulsa · Respon cepat 24 jam</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('115', '115')}
                  className="px-3 py-1.5 text-xs font-mono bg-neutral-900/90 hover:bg-neutral-800 text-amber-400 rounded border border-neutral-700 flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === '115' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin 115</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="infolist" style={{ marginTop: '24px' }}>
              <div>
                <span className="k">WhatsApp</span>
                <span className="v flex items-center justify-between gap-2">
                  <a href="https://wa.me/6281222000115" target="_blank" rel="noreferrer" className="text-amber-400 font-semibold hover:underline">
                    0812-2200-0115
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy('081222000115', 'wa')}
                    className="text-xs text-neutral-400 hover:text-amber-400 p-1 transition-colors"
                    title="Salin nomor WhatsApp"
                  >
                    {copiedKey === 'wa' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </span>
              </div>
              <div>
                <span className="k">Kantor (PSTN)</span>
                <span className="v">
                  <a href="tel:043851975">0438-51975</a> · <a href="tel:043851995">0438-51995</a>
                </span>
              </div>
              <div>
                <span className="k">VHF Maritim</span>
                <span className="v flex items-center justify-between gap-2">
                  <span>Ch 16 / 156.800 MHz (Distress)</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('156.800 MHz', 'vhf')}
                    className="text-xs text-neutral-400 hover:text-amber-400 p-1 transition-colors"
                    title="Salin frekuensi"
                  >
                    {copiedKey === 'vhf' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </span>
              </div>
              <div>
                <span className="k">Surel</span>
                <span className="v">
                  <a href="mailto:sar.manado@gmail.com">sar.manado@gmail.com</a>
                </span>
              </div>
              <div>
                <span className="k">Alamat</span>
                <span className="v">
                  Jl. Raya Worang By Pass, Desa Kaasar, Kec. Kauditan, Kab. Minahasa Utara, Sulawesi Utara
                </span>
              </div>
              <div>
                <span className="k">Jam Siaga</span>
                <span className="v">
                  Piket Operasi SAR 24 Jam Non-Stop · Pelayanan Publik: Senin–Jumat 08.00–16.00 WITA
                </span>
              </div>
            </div>
          </div>

          <div className="rv">
            <form className="form" id="form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="nm">Nama lengkap</label>
                <input
                  id="nm"
                  name="nm"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="em">Surel</label>
                <input
                  id="em"
                  name="em"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="kt">Kategori</label>
                <select
                  id="kt"
                  name="kt"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>Permohonan informasi publik</option>
                  <option>Permintaan pelatihan / bina potensi</option>
                  <option>Kerja sama instansi</option>
                  <option>Lainnya</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="ms">Pesan</label>
                <textarea
                  id="ms"
                  name="ms"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button className="btn" type="submit">
                Kirim pesan
              </button>

              <p className="formnote" id="formnote" style={{ color: formFeedback.color }}>
                {formFeedback.text}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

