import React from 'react';
import { X, Calendar, MapPin, User, Share2, Tag, Pin, Check, ArrowLeft } from 'lucide-react';
import { NewsItem } from '../types';
import { SVG_NEWS_PLACEHOLDER } from '../data/images';

interface NewsDetailModalProps {
  news: NewsItem | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!news) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:border-amber-500 rounded-lg text-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tautan Disalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Bagikan</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 text-xs font-mono font-bold uppercase bg-amber-500 text-slate-950 rounded-md">
              {news.category}
            </span>
            {news.pinned && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-900 rounded-md flex items-center gap-1">
                <Pin className="w-3 h-3 text-amber-700" /> Berita Utama
              </span>
            )}
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {news.date}
            </span>
            {news.location && (
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {news.location}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Big_Shoulders_Display'] uppercase tracking-wide leading-tight">
            {news.title}
          </h1>

          {/* Author info strip */}
          <div className="flex items-center gap-3 py-2 border-y border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-medium">
              <User className="w-4 h-4 text-amber-600" />
              <span>Rilis oleh: <strong className="text-slate-900">{news.author || 'Humas SAR Manado'}</strong></span>
            </div>
            <span>·</span>
            <span className="text-slate-500">Kantor SAR Manado - Basarnas Sulut</span>
          </div>

          {/* Featured Image */}
          <div className="aspect-16/9 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner relative border border-slate-200">
            <img
              src={news.image || SVG_NEWS_PLACEHOLDER}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Lead / Summary */}
          {news.summary && (
            <div className="p-4 bg-amber-50/70 border-l-4 border-amber-500 rounded-r-xl text-slate-800 text-sm font-semibold leading-relaxed">
              {news.summary}
            </div>
          )}

          {/* Main Content Paragraphs */}
          <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-['Plus_Jakarta_Sans']">
            {news.content || news.summary || 'Informasi rilis resmi terkait kegiatan operasional dan kesiapsiagaan dari Kantor Pencarian dan Pertolongan Manado.'}
          </div>

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              {news.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs bg-slate-100 text-slate-700 rounded-lg font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Emergency Note */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-amber-400 uppercase tracking-wider block font-mono">
                Layanan Darurat Basarnas
              </span>
              <span className="text-slate-300">
                Hubungi Call Center 115 (Bebas Pulsa) untuk kondisi membahayakan manusia & musibah laut.
              </span>
            </div>
            <a
              href="tel:115"
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs rounded-lg shadow-md transition-colors"
            >
              Hubungi 115
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
