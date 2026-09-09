import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Check, MapPin, Calendar, Tag } from 'lucide-react';
import { GalleryItem } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';
import { uploadImage } from '../../lib/firebase';
import { SVG_PLACEHOLDER } from '../../data/images';

interface GalleryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: GalleryItem | null;
}

const GALLERY_PRESETS = [
  {
    name: 'Operasi Laut & Penyelamatan',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Latihan Ketinggian / Gunung',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Kapal Patroli KN SAR Bimasena',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ruang Pusat Komunikasi',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
  },
];

export const GalleryFormModal: React.FC<GalleryFormModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addGallery, updateGallery } = useAdminData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [label, setLabel] = useState('');
  const [caption, setCaption] = useState('');
  const [aspect, setAspect] = useState<'r1610' | 'r11'>('r1610');
  const [category, setCategory] = useState('Dokumentasi Operasi');
  const [location, setLocation] = useState('Sulawesi Utara');
  const [date, setDate] = useState('Agustus 2026');
  const [image, setImage] = useState('');
  const [imageMode, setImageMode] = useState<'preset' | 'upload' | 'url'>('preset');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setLabel(initialData.label || '');
      setCaption(initialData.caption || '');
      setAspect(initialData.aspect || 'r1610');
      setCategory(initialData.category || 'Dokumentasi Operasi');
      setLocation(initialData.location || 'Sulawesi Utara');
      setDate(initialData.date || 'Agustus 2026');
      setImage(initialData.image || '');
    } else {
      setLabel('');
      setCaption('');
      setAspect('r1610');
      setCategory('Dokumentasi Operasi');
      setLocation('Sulawesi Utara');
      setDate('Agustus 2026');
      setImage(GALLERY_PRESETS[0].url);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setUploadError(null);
    setIsUploading(true);
    try {
      // Upload to Firebase Storage and keep only the URL in Firestore.
      setImage(await uploadImage(file, 'galleries'));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengunggah gambar.';
      setUploadError(message);
      console.warn('Image upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const payload = {
      label: label.trim(),
      caption: caption.trim() || undefined,
      aspect,
      category,
      location: location.trim(),
      date: date.trim(),
      image: image.trim() || undefined,
    };

    if (initialData?.id) {
      updateGallery(initialData.id, payload);
    } else {
      addGallery(payload);
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-130 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-lg font-bold">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Big_Shoulders_Display'] uppercase tracking-wide">
                {initialData ? 'Perbarui Galeri Dokumentasi' : 'Tambah Foto Galeri Baru'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Publikasi Dokumentasi Foto Resmi Kantor SAR Manado
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
              Judul Foto Dokumentasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Contoh: Operasi Evakuasi Perairan Bitung"
              className="w-full px-4 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>Kategori Foto</span>
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Operasi Laut / Latihan / Sarpras"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                Format Rasio Tampilan
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAspect('r1610')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    aspect === 'r1610'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  16:10 (Lanskap Luas)
                </button>
                <button
                  type="button"
                  onClick={() => setAspect('r11')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    aspect === 'r11'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  1:1 (Kotak Presisi)
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
              Keterangan Foto (Caption)
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Jelaskan secara singkat momen kegiatan atau operasi pada foto..."
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900 leading-relaxed"
            />
          </div>

          {/* Photo Source */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                Pilih atau Unggah Foto
              </label>

              <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-200/70 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setImageMode('preset')}
                  className={`px-2.5 py-0.5 rounded-md ${imageMode === 'preset' ? 'bg-white text-slate-900 shadow-2xs' : ''}`}
                >
                  Preset
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-2.5 py-0.5 rounded-md ${imageMode === 'upload' ? 'bg-white text-slate-900 shadow-2xs' : ''}`}
                >
                  Unggah File
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-2.5 py-0.5 rounded-md ${imageMode === 'url' ? 'bg-white text-slate-900 shadow-2xs' : ''}`}
                >
                  URL
                </button>
              </div>
            </div>

            {imageMode === 'preset' && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {GALLERY_PRESETS.map((p) => {
                  const isSelected = image === p.url;
                  return (
                    <div
                      key={p.name}
                      onClick={() => setImage(p.url)}
                      className={`cursor-pointer rounded-lg border-2 overflow-hidden relative group transition-all ${
                        isSelected ? 'border-amber-600 ring-2 ring-amber-500/30' : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <div className="aspect-video bg-slate-200 overflow-hidden">
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-1.5 bg-white text-[11px] font-medium text-slate-800 truncate">
                        {p.name}
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 p-1 bg-amber-600 text-white rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {imageMode === 'upload' && (
              <div
                onClick={() => { if (!isUploading) fileInputRef.current?.click(); }}
                className="border-2 border-dashed border-slate-300 hover:border-amber-600 p-5 rounded-xl text-center cursor-pointer bg-white transition-colors flex flex-col items-center justify-center"
              >
                <Upload className="w-6 h-6 text-amber-600 mb-1" />
                <span className="text-xs font-semibold text-slate-800">
                  Pilih foto dokumentasi dari komputer / HP
                </span>
                <span className="text-[11px] text-slate-500">Format PNG, JPG, JPEG</span>
                {isUploading && (
                  <span className="mt-2 text-[11px] font-mono text-amber-700">
                    Mengunggah ke Firebase Storage…
                  </span>
                )}
                {uploadError && (
                  <span className="mt-2 text-[11px] font-semibold text-red-600">{uploadError}</span>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {imageMode === 'url' && (
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Tempel tautan URL gambar (https://...)"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
              />
            )}

            {image && (
              <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200">
                <img src={image} alt="Preview" className="w-16 h-10 object-cover rounded" />
                <div className="flex-1 text-xs text-slate-600 truncate font-mono">
                  {image.startsWith('data:') ? 'Foto Berhasil Diunggah' : image}
                </div>
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Lokasi Pengambilan</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Pangkalan Bitung"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Waktu / Bulan</span>
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Contoh: Agustus 2026"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Simpan Perubahan' : 'Simpan ke Galeri'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
