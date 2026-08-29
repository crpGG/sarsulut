import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Pin, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Image as ImageIcon, 
  Calendar, 
  Settings, 
  LogOut, 
  Download, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  MapPin,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { NewsItem, GalleryItem, ActivityItem } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';
import { NewsFormModal } from './NewsFormModal';
import { GalleryFormModal } from './GalleryFormModal';
import { ActivityFormModal } from './ActivityFormModal';
import { NewsDetailModal } from '../NewsDetailModal';
import { SVG_NEWS_PLACEHOLDER, SVG_PLACEHOLDER } from '../../data/images';

export const AdminDashboardModal: React.FC = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    adminUser, 
    logout, 
    news, 
    deleteNews, 
    toggleNewsStatus, 
    toggleNewsPin,
    galleries, 
    deleteGallery,
    activities, 
    deleteActivity,
    resetToDefaults,
    exportDataJson,
    showToast
  } = useAdminData();

  // Active Top Menu Tab
  const [activeTab, setActiveTab] = useState<'news' | 'gallery' | 'activities' | 'settings'>('news');

  // Search and Filter State
  const [newsSearch, setNewsSearch] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState('Semua');
  const [newsStatusFilter, setNewsStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Sub-Modals
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);

  const [previewNews, setPreviewNews] = useState<NewsItem | null>(null);

  // Confirm Delete Dialog
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'news' | 'gallery' | 'activity';
    id: string;
    title: string;
  } | null>(null);

  if (!isAdminOpen) return null;

  // Filtered News
  const filteredNews = news.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      (item.summary && item.summary.toLowerCase().includes(newsSearch.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(newsSearch.toLowerCase()));
    const matchCategory = newsCategoryFilter === 'Semua' || item.category === newsCategoryFilter;
    const matchStatus =
      newsStatusFilter === 'all' ||
      (newsStatusFilter === 'published' && item.status !== 'draft') ||
      (newsStatusFilter === 'draft' && item.status === 'draft');
    return matchSearch && matchCategory && matchStatus;
  });

  const handleOpenAddNews = () => {
    setEditingNews(null);
    setIsNewsModalOpen(true);
  };

  const handleOpenEditNews = (item: NewsItem) => {
    setEditingNews(item);
    setIsNewsModalOpen(true);
  };

  const handleOpenAddGallery = () => {
    setEditingGallery(null);
    setIsGalleryModalOpen(true);
  };

  const handleOpenEditGallery = (item: GalleryItem) => {
    setEditingGallery(item);
    setIsGalleryModalOpen(true);
  };

  const handleOpenAddActivity = () => {
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleOpenEditActivity = (item: ActivityItem) => {
    setEditingActivity(item);
    setIsActivityModalOpen(true);
  };

  const confirmDeleteAction = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'news') {
      deleteNews(deleteConfirm.id);
    } else if (deleteConfirm.type === 'gallery') {
      deleteGallery(deleteConfirm.id);
    } else if (deleteConfirm.type === 'activity') {
      deleteActivity(deleteConfirm.id);
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="fixed inset-0 z-110 flex flex-col bg-slate-100 text-slate-900 overflow-hidden">
      {/* Top Main Navigation Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow-sm">
            SAR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold">
                Portal Admin CMS
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Online
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black font-['Big_Shoulders_Display'] uppercase tracking-wide text-white leading-tight">
              Kantor Pencarian & Pertolongan Manado
            </h1>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-200">
              {adminUser?.name || 'Admin Pengelola'}
            </span>
            <span className="text-[11px] text-amber-400/90 font-mono">
              {adminUser?.role || 'Pranata Humas & TI'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAdminOpen(false)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Lihat Web Publik</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="p-2 sm:px-3 sm:py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-800/60"
            title="Keluar dari Panel Admin"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Tabs Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('news')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'news'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Berita & Publikasi</span>
            <span className="px-1.5 py-0.2 bg-black/10 rounded-full text-[11px] font-mono">
              {news.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'gallery'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Galeri Foto</span>
            <span className="px-1.5 py-0.2 bg-black/10 rounded-full text-[11px] font-mono">
              {galleries.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('activities')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'activities'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agenda Kegiatan</span>
            <span className="px-1.5 py-0.2 bg-black/10 rounded-full text-[11px] font-mono">
              {activities.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan & Data</span>
          </button>
        </div>

        {/* Quick CTA Button based on Active Tab */}
        {activeTab === 'news' && (
          <button
            type="button"
            onClick={handleOpenAddNews}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Berita Baru</span>
          </button>
        )}

        {activeTab === 'gallery' && (
          <button
            type="button"
            onClick={handleOpenAddGallery}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Foto Galeri</span>
          </button>
        )}

        {activeTab === 'activities' && (
          <button
            type="button"
            onClick={handleOpenAddActivity}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Agenda Baru</span>
          </button>
        )}
      </div>

      {/* Tab Contents Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* ======================= TAB 1: NEWS ======================= */}
        {activeTab === 'news' && (
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  placeholder="Cari judul berita, lokasi, atau isi ringkasan..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Kategori:</span>
                </div>
                <select
                  value={newsCategoryFilter}
                  onChange={(e) => setNewsCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Operasi SAR">Operasi SAR</option>
                  <option value="Bina Potensi">Bina Potensi</option>
                  <option value="Kesiapsiagaan">Kesiapsiagaan</option>
                  <option value="Kegiatan Kantor">Kegiatan Kantor</option>
                </select>

                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
                  <button
                    onClick={() => setNewsStatusFilter('all')}
                    className={`px-2.5 py-1 rounded-md ${newsStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : ''}`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setNewsStatusFilter('published')}
                    className={`px-2.5 py-1 rounded-md ${newsStatusFilter === 'published' ? 'bg-white text-slate-900 shadow-2xs' : ''}`}
                  >
                    Terbit
                  </button>
                  <button
                    onClick={() => setNewsStatusFilter('draft')}
                    className={`px-2.5 py-1 rounded-md ${newsStatusFilter === 'draft' ? 'bg-white text-slate-900 shadow-2xs' : ''}`}
                  >
                    Draft
                  </button>
                </div>
              </div>
            </div>

            {/* News Cards Grid / List */}
            {filteredNews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Tidak ada berita yang cocok</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Coba ubah kata kunci pencarian atau buat berita baru dengan menekan tombol di bawah.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddNews}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Berita Baru</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNews.map((item) => {
                  const isDraft = item.status === 'draft';
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative"
                    >
                      {/* Image Thumbnail Header */}
                      <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                        <img
                          src={item.image || SVG_NEWS_PLACEHOLDER}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-0.8 bg-slate-900/90 text-amber-400 rounded-md text-[11px] font-mono font-bold uppercase backdrop-blur-xs">
                            {item.category}
                          </span>
                          {item.pinned && (
                            <span className="px-2 py-0.8 bg-amber-500 text-slate-950 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-xs">
                              <Pin className="w-3 h-3" /> Pinned
                            </span>
                          )}
                        </div>

                        <div className="absolute top-2.5 right-2.5">
                          <span
                            className={`px-2 py-0.8 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                              isDraft
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {isDraft ? 'Draft' : 'Terbit'}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                            <span>{item.date}</span>
                            {item.location && (
                              <span className="flex items-center gap-0.5 truncate max-w-[140px]">
                                <MapPin className="w-3 h-3 text-slate-400" /> {item.location}
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-bold text-slate-900 font-['Big_Shoulders_Display'] uppercase tracking-wide leading-snug line-clamp-2">
                            {item.title}
                          </h4>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {item.summary || item.content || 'Klik edit untuk melengkapi ringkasan berita ini.'}
                          </p>
                        </div>

                        {/* Action Toolbar */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => toggleNewsPin(item.id)}
                              title={item.pinned ? 'Lepas Sematan' : 'Sematkan sebagai Berita Utama'}
                              className={`p-1.5 rounded-lg text-xs transition-colors ${
                                item.pinned
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <Pin className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleNewsStatus(item.id)}
                              title={isDraft ? 'Terbitkan Sekarang' : 'Ubah ke Draft'}
                              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                                isDraft
                                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{isDraft ? 'Publikasikan' : 'Jadikan Draft'}</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setPreviewNews(item)}
                              title="Pratinjau Berita"
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditNews(item)}
                              title="Edit Berita"
                              className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'news',
                                  id: item.id,
                                  title: item.title,
                                })
                              }
                              title="Hapus Berita"
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB 2: GALLERY ======================= */}
        {activeTab === 'gallery' && (
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Koleksi Galeri Dokumentasi Publik</h3>
                <p className="text-xs text-slate-500">
                  Foto-foto resmi kegiatan operasi, latihan, dan pembinaan potensi SAR.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddGallery}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Unggah Foto Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleries.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className={`relative ${item.aspect === 'r11' ? 'aspect-square' : 'aspect-16/10'} bg-slate-100 overflow-hidden`}>
                    <img
                      src={item.image || SVG_PLACEHOLDER}
                      alt={item.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 bg-slate-900/80 text-amber-400 rounded text-[10px] font-mono font-bold uppercase backdrop-blur-xs">
                        {item.category || 'Dokumentasi'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {item.label}
                      </h4>
                      {item.caption && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                          {item.caption}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono text-[11px]">{item.date || 'Agustus 2026'}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditGallery(item)}
                          className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                          title="Edit Foto"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirm({
                              type: 'gallery',
                              id: item.id,
                              title: item.label,
                            })
                          }
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                          title="Hapus Foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 3: ACTIVITIES ======================= */}
        {activeTab === 'activities' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Agenda & Kesiapsiagaan Operasi SAR</h3>
                <p className="text-xs text-slate-500">
                  Daftar agenda latihan gabungan, apel kesiapsiagaan, dan sosialisasi publik.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddActivity}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Agenda</span>
              </button>
            </div>

            <div className="space-y-3">
              {activities.map((act) => {
                let statusBadge = {
                  label: 'Dijadwalkan',
                  class: 'bg-amber-100 text-amber-800 border-amber-300',
                };
                if (act.status === 'berlangsung') {
                  statusBadge = {
                    label: 'Sedang Berlangsung',
                    class: 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse',
                  };
                } else if (act.status === 'selesai') {
                  statusBadge = {
                    label: 'Selesai Terlaksana',
                    class: 'bg-slate-100 text-slate-700 border-slate-300',
                  };
                }

                return (
                  <div
                    key={act.id}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-slate-900 text-amber-400 rounded text-[11px] font-mono font-bold uppercase">
                          {act.type}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusBadge.class}`}
                        >
                          {statusBadge.label}
                        </span>
                        <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {act.date}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 font-['Big_Shoulders_Display'] uppercase tracking-wide">
                        {act.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {act.desc}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {act.location}
                        </span>
                        {act.participants && (
                          <span>· Peserta: <strong>{act.participants}</strong></span>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center justify-end gap-1.5 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
                      <button
                        type="button"
                        onClick={() => handleOpenEditActivity(act)}
                        className="px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg flex items-center gap-1 w-full justify-center"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'activity',
                            id: act.id,
                            title: act.title,
                          })
                        }
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1 w-full justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= TAB 4: SETTINGS & BACKUP ======================= */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Account Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-xl font-mono">
                  SAR
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-['Big_Shoulders_Display'] uppercase tracking-wide">
                    {adminUser?.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{adminUser?.role}</p>
                  <p className="text-xs text-amber-700 font-mono mt-0.5">{adminUser?.email}</p>
                </div>
              </div>
            </div>

            {/* Content Summary Card */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                <span className="text-2xl font-black text-slate-900 font-['Big_Shoulders_Display'] block">
                  {news.length}
                </span>
                <span className="text-xs text-slate-500 font-medium">Total Berita</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                <span className="text-2xl font-black text-slate-900 font-['Big_Shoulders_Display'] block">
                  {galleries.length}
                </span>
                <span className="text-xs text-slate-500 font-medium">Foto Galeri</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                <span className="text-2xl font-black text-slate-900 font-['Big_Shoulders_Display'] block">
                  {activities.length}
                </span>
                <span className="text-xs text-slate-500 font-medium">Agenda Kegiatan</span>
              </div>
            </div>

            {/* Backup & Reset Action Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-mono">
                Cadangan Data & Pemulihan
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seluruh berita, dokumentasi foto, dan agenda tersimpan otomatis pada memori peramban Anda. Anda dapat mengunduh salinan cadangan dalam format JSON kapan saja.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={exportDataJson}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Unduh Cadangan Data (JSON)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Kembalikan seluruh berita, galeri, dan kegiatan ke data awal resmi Basarnas?')) {
                      resetToDefaults();
                    }
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 hover:border-red-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  <span>Reset ke Data Awal Standar</span>
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 space-y-2 text-xs text-amber-900">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Panduan Cepat Pengelola Konten:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Gunakan kategori yang sesuai agar berita terorganisir dengan rapi di halaman utama.</li>
                <li>Fitur <strong>Sematkan (Pin)</strong> akan menempatkan rilis berita paling krusial di urutan teratas.</li>
                <li>Untuk menyimpan konsep sementara tanpa dilihat publik, pilih opsi <strong>Simpan sebagai Draft</strong>.</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Sub-Modals */}
      <NewsFormModal
        isOpen={isNewsModalOpen}
        onClose={() => {
          setIsNewsModalOpen(false);
          setEditingNews(null);
        }}
        initialData={editingNews}
      />

      <GalleryFormModal
        isOpen={isGalleryModalOpen}
        onClose={() => {
          setIsGalleryModalOpen(false);
          setEditingGallery(null);
        }}
        initialData={editingGallery}
      />

      <ActivityFormModal
        isOpen={isActivityModalOpen}
        onClose={() => {
          setIsActivityModalOpen(false);
          setEditingActivity(null);
        }}
        initialData={editingActivity}
      />

      <NewsDetailModal
        news={previewNews}
        onClose={() => setPreviewNews(null)}
      />

      {/* Confirm Delete Dialog */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-140 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Konfirmasi Hapus Data</h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data <strong>"{deleteConfirm.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Ya, Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
