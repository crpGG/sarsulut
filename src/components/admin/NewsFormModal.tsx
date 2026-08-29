import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  Check, 
  Calendar, 
  MapPin, 
  User, 
  Tag, 
  Pin, 
  Eye, 
  Layers,
  AlertCircle
} from 'lucide-react';
import { NewsItem } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';
import { SVG_NEWS_PLACEHOLDER } from '../../data/images';

interface NewsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: NewsItem | null;
}

const CATEGORIES = [
  'Operasi SAR',
  'Bina Potensi',
  'Kesiapsiagaan',
  'Kegiatan Kantor',
  'Info Publik & Kemitraan',
];

const SAR_IMAGE_PRESETS = [
  {
    name: 'Operasi Laut / Kapal SAR',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Pelatihan Water Rescue',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Evakuasi & Rescuer Gunung',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Pusat Komando & Komunikasi',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
  },
];

const TEMPLATES = [
  {
    label: 'Rilis Operasi SAR Laut',
    title: 'Tim SAR Gabungan Berhasil Evakuasi Korban Kecelakaan Kapal di Wilayah Perairan Sulut',
    category: 'Operasi SAR',
    location: 'Perairan Sulawesi Utara',
    summary: 'Operasi pencarian dan pertolongan yang digelar Basarnas Manado bersama unsur gabungan berhasil mengevakuasi korban dalam keadaan selamat.',
    content: 'Kantor Pencarian dan Pertolongan (SAR) Manado mengerahkan unsur rescuer beserta armada laut untuk merespons laporan darurat. Berkat koordinasi terpadu lintas instansi TNI AL, Polairud, dan nelayan setempat, seluruh korban berhasil ditemukan dan dievakuasi ke titik aman untuk mendapatkan pertolongan medis.',
    tags: 'Operasi SAR, Evakuasi Laut, Basarnas Sulut, Kemanusiaan',
  },
  {
    label: 'Pelatihan Bina Potensi',
    title: 'Basarnas Sulut Gelar Pembinaan & Uji Kompetensi Potensi SAR Terpadu',
    category: 'Bina Potensi',
    location: 'Kantor SAR Manado',
    summary: 'Peningkatan kapasitas dan standardisasi kemampuan teknis pertolongan pertama bagi relawan, organisasi kemasyarakatan, dan instansi terkait.',
    content: 'Dalam upaya memperkuat kesiapsiagaan mitigasi bencana, Kantor SAR Manado menyelenggarakan pembinaan potensi SAR. Materi meliputi teknik pertolongan di permukaan air (Water Rescue), evakuasi medis darurat, dan prosedur komunikasi operasi.',
    tags: 'Bina Potensi, Pelatihan, Relawan SAR, Manado',
  },
  {
    label: 'Siaga Cuaca & Patroli',
    title: 'Antisipasi Cuaca Maritim Ekstrem, Basarnas Manado Tingkatkan Kesiagaan Armada',
    category: 'Kesiapsiagaan',
    location: 'Wilayah Perairan Perbatasan',
    summary: 'Piket siaga 24 jam dan patroli rutin armada laut dikerahkan menyusul peringatan dini gelombang tinggi BMKG.',
    content: 'Merespons peringatan dini cuaca maritim, Kantor SAR Manado menyiagakan KN SAR Bimasena beserta unit siaga SAR di berbagai wilayah strategis untuk memastikan respon cepat terhadap potensi musibah pelayaran.',
    tags: 'Kesiapsiagaan, Siaga 24 Jam, BMKG, Cuaca Maritim',
  },
];

export const NewsFormModal: React.FC<NewsFormModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addNews, updateNews } = useAdminData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Operasi SAR');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [author, setAuthor] = useState('Humas SAR Manado');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [pinned, setPinned] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [imageMode, setImageMode] = useState<'preset' | 'upload' | 'url'>('preset');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategory(initialData.category || 'Operasi SAR');
      setDate(initialData.date || getTodayFormatted());
      setLocation(initialData.location || '');
      setAuthor(initialData.author || 'Humas SAR Manado');
      setSummary(initialData.summary || '');
      setContent(initialData.content || '');
      setImage(initialData.image || '');
      setStatus(initialData.status || 'published');
      setPinned(Boolean(initialData.pinned));
      setTagsInput(initialData.tags ? initialData.tags.join(', ') : '');
    } else {
      // Reset defaults for new entry
      setTitle('');
      setCategory('Operasi SAR');
      setDate(getTodayFormatted());
      setLocation('Sulawesi Utara');
      setAuthor('Humas SAR Manado');
      setSummary('');
      setContent('');
      setImage(SAR_IMAGE_PRESETS[0].url);
      setStatus('published');
      setPinned(false);
      setTagsInput('Operasi SAR, Basarnas Sulut, Siaga 115');
    }
  }, [initialData, isOpen]);

  function getTodayFormatted() {
    const d = new Date();
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  if (!isOpen) return null;

  const handleApplyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setTitle(tmpl.title);
    setCategory(tmpl.category);
    setLocation(tmpl.location);
    setSummary(tmpl.summary);
    setContent(tmpl.content);
    setTagsInput(tmpl.tags);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setImage(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      category,
      date: date.trim() || getTodayFormatted(),
      location: location.trim(),
      author: author.trim(),
      summary: summary.trim(),
      content: content.trim(),
      image: image.trim() || undefined,
      status,
      pinned,
      tags: tagsArray,
    };

    if (initialData?.id) {
      updateNews(initialData.id, payload);
    } else {
      addNews(payload);
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-130 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-lg font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Big_Shoulders_Display'] uppercase tracking-wide">
                {initialData ? 'Perbarui Berita / Kegiatan' : 'Tambah Berita Baru'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Sistem Manajemen Informasi Publik Kantor SAR Manado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch Edit vs Preview */}
            <div className="flex items-center p-1 bg-slate-200/80 rounded-lg text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'edit' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Formulir
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === 'edit' ? (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Template Selector */}
            {!initialData && (
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Gunakan Template Siap Pakai (Opsional):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.label}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-amber-600 hover:text-white text-slate-700 border border-amber-300 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{tmpl.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Row 1: Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                Judul Berita <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Tim SAR Gabungan Berhasil Evakuasi Korban Kecelakaan Laut di Bitung"
                className="w-full px-4 py-2.5 text-base font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-slate-900"
              />
            </div>

            {/* Row 2: Category, Date, Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-slate-900 font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tanggal Rilis</span>
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Contoh: 28 Agustus 2026"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Lokasi Kejadian / Kegiatan</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Selat Lembeh, Bitung"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Row 3: Photo / Thumbnail Selector */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-600" />
                  <span>Foto Utama Berita</span>
                </label>

                <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-200/70 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setImageMode('preset')}
                    className={`px-2.5 py-0.5 rounded-md ${imageMode === 'preset' ? 'bg-white text-slate-900 shadow-2xs' : ''}`}
                  >
                    Preset SAR
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
                    Tautan URL
                  </button>
                </div>
              </div>

              {/* Mode: Preset Choice */}
              {imageMode === 'preset' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {SAR_IMAGE_PRESETS.map((p) => {
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

              {/* Mode: File Upload */}
              {imageMode === 'upload' && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-amber-600 p-5 rounded-xl text-center cursor-pointer bg-white transition-colors flex flex-col items-center justify-center"
                >
                  <Upload className="w-6 h-6 text-amber-600 mb-1" />
                  <span className="text-xs font-semibold text-slate-800">
                    Klik untuk memilih foto dari komputer / HP
                  </span>
                  <span className="text-[11px] text-slate-500">Format PNG, JPG, JPEG</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* Mode: Direct URL */}
              {imageMode === 'url' && (
                <div>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Tempel tautan URL gambar resmi (https://...)"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900"
                  />
                </div>
              )}

              {/* Current Image Preview Strip */}
              {image && (
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200">
                  <img src={image} alt="Preview" className="w-16 h-10 object-cover rounded" />
                  <div className="flex-1 text-xs text-slate-600 truncate font-mono">
                    {image.startsWith('data:') ? 'Foto Berhasil Diunggah (Base64)' : image}
                  </div>
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 hover:bg-red-50 rounded"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>

            {/* Row 4: Summary */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                Ringkasan Berita (Lead / Cuplikan)
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Tuliskan 1-2 kalimat ringkasan inti peristiwa..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-slate-900 font-normal leading-relaxed"
              />
            </div>

            {/* Row 5: Full Body Content */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                Isi Lengkap Berita
              </label>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan narasi lengkap berita, kronologi operasi SAR, kutipan pejabat/rescuer, dan himbauan keselamatan..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-slate-900 font-normal leading-relaxed"
              />
            </div>

            {/* Row 6: Author, Tags & Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Penulis / Sumber Rilis</span>
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Contoh: Humas SAR Manado"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tagar (Pisahkan dengan koma)</span>
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Operasi SAR, Bitung, Kemanusiaan"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900"
                />
              </div>
            </div>

            {/* Row 7: Publish Status & Pin Flag */}
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'published'}
                    onChange={() => setStatus('published')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-900">Langsung Terbitkan (Publik)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'draft'}
                    onChange={() => setStatus('draft')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-semibold text-slate-600">Simpan sebagai Draft</span>
                </label>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <Pin className="w-3.5 h-3.5 text-amber-600" />
                  Sematkan sebagai Berita Utama (Pinned)
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{initialData ? 'Simpan Perubahan' : 'Terbitkan Berita'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Live Preview Mode */
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Berikut adalah simulasi tampilan berita pada website publik pengunjung:</span>
            </div>

            <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase bg-amber-500 text-white rounded">
                  {category}
                </span>
                <span className="text-xs text-slate-500 font-mono">{date || getTodayFormatted()}</span>
                {location && (
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-0.5">
                    · <MapPin className="w-3 h-3 text-slate-400" /> {location}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-black text-slate-900 font-['Big_Shoulders_Display'] uppercase tracking-wide leading-tight">
                {title || 'Judul Berita Belum Diisi'}
              </h2>

              <div className="aspect-video w-full bg-slate-100 rounded-xl overflow-hidden relative">
                <img
                  src={image || SVG_NEWS_PLACEHOLDER}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>

              {summary && (
                <p className="text-sm font-semibold text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border-l-4 border-amber-500">
                  {summary}
                </p>
              )}

              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {content || 'Isi artikel berita akan muncul di sini...'}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Rilis: <b>{author}</b></span>
                <span className="font-mono text-amber-700 font-semibold">Basarnas Sulawesi Utara</span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className="px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl"
              >
                Kembali ke Formulir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
