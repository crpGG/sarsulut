import React, { useState } from 'react';
import { 
  Pin, 
  Calendar, 
  MapPin, 
  Plus, 
  Shield, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Eye, 
  Camera, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { NewsDetailModal } from './NewsDetailModal';
import { NewsItem, GalleryItem } from '../types';
import { SVG_NEWS_PLACEHOLDER, SVG_PLACEHOLDER } from '../data/images';

export const BeritaGaleri: React.FC = () => {
  const { 
    news, 
    galleries, 
    activities, 
    isAuthenticated, 
    setIsAdminOpen, 
    setIsLoginModalOpen 
  } = useAdminData();

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
  const [activeTab, setActiveTab] = useState<'berita' | 'kegiatan'>('berita');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  // Filter news for public view (if not admin, only published; sorted with pinned first)
  const displayNews = [...news]
    .filter((n) => isAuthenticated || n.status !== 'draft')
    .filter((n) => categoryFilter === 'Semua' || n.category === categoryFilter)
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const categories = ['Semua', 'Operasi SAR', 'Bina Potensi', 'Kesiapsiagaan', 'Kegiatan Kantor'];

  return (
    <section className="band band--light relative" id="berita">
      <div className="wrap">
        {/* Section Top Header with Admin Quick Access */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <p className="eyebrow rv">Informasi & Publikasi Resmi</p>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Buka Panel Admin (Kelola Berita)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 border border-slate-200 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Portal Pengelola</span>
              </button>
            )}
          </div>
        </div>

        <div className="split" style={{ alignItems: 'end', marginBottom: 'clamp(24px,3.5vw,40px)' }}>
          <h2 className="h-lg rv">
            Kabar dari<br />lapangan.
          </h2>
          <p className="lede dim rv">
            Informasi rilis resmi mengenai respon kedaruratan, kesiapsiagaan patroli armada laut, latihan terpadu, dan pembinaan potensi SAR di seluruh Sulawesi Utara.
          </p>
        </div>

        {/* Tab Switcher: Berita vs Agenda Kegiatan */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6 rv">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('berita')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'berita'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Rilis Berita ({displayNews.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('kegiatan')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'kegiatan'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agenda Kesiapsiagaan ({activities.length})</span>
            </button>
          </div>

          {/* Category Filter Chips for News */}
          {activeTab === 'berita' && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    categoryFilter === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab 1: News Grid */}
        {activeTab === 'berita' && (
          <div className="cards rv">
            {displayNews.map((newsItem) => (
              <div
                key={newsItem.id}
                onClick={() => setSelectedNews(newsItem)}
                className="card group cursor-pointer relative flex flex-col justify-between"
              >
                <div>
                  <figure className="slot r1610 relative overflow-hidden" data-label="Gambar berita" data-slot={newsItem.id}>
                    <img
                      alt={newsItem.title}
                      src={newsItem.image || SVG_NEWS_PLACEHOLDER}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {newsItem.pinned && (
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.8 bg-amber-500 text-slate-950 rounded text-[10px] font-bold font-mono uppercase flex items-center gap-1 shadow-md">
                        <Pin className="w-3 h-3" /> Berita Utama
                      </div>
                    )}

                    {newsItem.status === 'draft' && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.8 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[10px] font-bold font-mono uppercase">
                        Draft (Admin View)
                      </div>
                    )}
                  </figure>

                  <div className="meta">
                    <span className="chip">{newsItem.category}</span>
                    <span className="font-mono text-xs">{newsItem.date}</span>
                  </div>

                  <h3 className="h-sm group-hover:text-amber-600 transition-colors line-clamp-2">
                    {newsItem.title}
                  </h3>

                  {newsItem.summary && (
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {newsItem.summary}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-semibold group-hover:text-amber-700">
                  <span className="flex items-center gap-1">
                    Baca Selengkapnya
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  {newsItem.location && (
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" /> {newsItem.location}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Activities List */}
        {activeTab === 'kegiatan' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rv">
            {activities.map((act) => {
              let badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
              let badgeLabel = 'Dijadwalkan';
              if (act.status === 'berlangsung') {
                badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse';
                badgeLabel = 'Sedang Berlangsung';
              } else if (act.status === 'selesai') {
                badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
                badgeLabel = 'Selesai Terlaksana';
              }

              return (
                <div
                  key={act.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 bg-slate-900 text-amber-400 rounded text-[11px] font-mono font-bold uppercase">
                        {act.type}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${badgeColor}`}>
                        {badgeLabel}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 font-['Big_Shoulders_Display'] uppercase tracking-wide leading-snug">
                      {act.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {act.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{act.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{act.location}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Photo Gallery Grid */}
        <div className="flex items-center justify-between mt-14 mb-4 flex-wrap gap-2 rv">
          <p className="eyebrow !mb-0">
            Galeri Dokumentasi
          </p>
          <span className="text-xs text-slate-500 font-mono">
            {galleries.length} Dokumentasi Resmi Operasi & Kegiatan
          </span>
        </div>

        <div className="gallery rv">
          {galleries.map((g) => (
            <figure
              className={`slot ${g.aspect} cursor-pointer group relative overflow-hidden rounded-lg`}
              data-label={g.label}
              data-slot={g.id}
              key={g.id}
              onClick={() => setSelectedGallery(g)}
            >
              <img
                alt={g.label}
                src={g.image || SVG_PLACEHOLDER}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                  {g.category || 'Dokumentasi'}
                </span>
                <span className="text-xs font-bold leading-tight line-clamp-1">
                  {g.label}
                </span>
              </div>
            </figure>
          ))}
        </div>

        {/* News Detail Reader Modal */}
        <NewsDetailModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />

        {/* Gallery Lightbox Modal */}
        {selectedGallery && (
          <div
            className="fixed inset-0 z-120 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedGallery(null)}
          >
            <div
              className="max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 text-slate-100 relative shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-white transition-colors"
                onClick={() => setSelectedGallery(null)}
                aria-label="Tutup"
              >
                &times;
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-bold font-mono text-xs uppercase rounded">
                  {selectedGallery.category || 'Dokumentasi Resmi'}
                </span>
                {selectedGallery.date && (
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {selectedGallery.date}
                  </span>
                )}
              </div>

              <h4 className="text-xl font-bold font-['Big_Shoulders_Display'] uppercase text-white mb-3">
                {selectedGallery.label}
              </h4>

              <div className="aspect-16/10 bg-black rounded-xl flex items-center justify-center border border-slate-800 mb-4 overflow-hidden">
                <img
                  src={selectedGallery.image || SVG_PLACEHOLDER}
                  alt={selectedGallery.label}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300">
                <p className="font-['Plus_Jakarta_Sans'] leading-relaxed">
                  {selectedGallery.caption || 'Dokumentasi kesiagaan dan aksi kemanusiaan Kantor Pencarian dan Pertolongan Manado.'}
                </p>
                {selectedGallery.location && (
                  <span className="font-mono text-amber-400 shrink-0 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {selectedGallery.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
