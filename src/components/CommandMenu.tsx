import React, { useState, useEffect, useRef } from 'react';
import { Search, Phone, MapPin, Radio, FileText, ArrowRight, CornerDownLeft, Shield, AlertTriangle, Copy, Check, Sparkles, PlusCircle } from 'lucide-react';
import { POSITIONS } from '../data/sarData';
import { useAdminData } from '../context/AdminDataContext';

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Darurat' | 'Wilayah & Armada' | 'Layanan & PPID' | 'Pengelola & Admin' | 'Navigasi';
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  badge?: string;
  copyValue?: string;
}

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, setIsAdminOpen, setIsLoginModalOpen } = useAdminData();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleCopy = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const commandItems: CommandItem[] = [
    // Admin Actions
    {
      id: 'admin-portal',
      title: isAuthenticated ? 'Buka Panel Dashboard Admin' : 'Portal Login Admin Pengelola',
      subtitle: 'Kelola rilis berita SAR, agenda kegiatan, & galeri dokumentasi',
      category: 'Pengelola & Admin',
      icon: Shield,
      badge: isAuthenticated ? 'Admin Online' : 'Login',
      action: () => {
        if (isAuthenticated) {
          setIsAdminOpen(true);
        } else {
          setIsLoginModalOpen(true);
        }
        onClose();
      }
    },
    // Emergency Actions
    {
      id: 'call-115',
      title: 'Emergency Call 115 (Bebas Pulsa)',
      subtitle: 'Siaga 24 Jam Operator Basarnas Manado',
      category: 'Darurat',
      icon: Phone,
      badge: '24/7',
      copyValue: '115',
      action: () => {
        window.location.href = 'tel:115';
        onClose();
      }
    },
    {
      id: 'wa-emergency',
      title: 'WhatsApp Siaga SAR (0812-2200-0115)',
      subtitle: 'Kirim koordinat GPS, foto musibah, & informasi cepat',
      category: 'Darurat',
      icon: Phone,
      badge: 'Chat',
      copyValue: '081222000115',
      action: () => {
        window.open('https://wa.me/6281222000115', '_blank');
        onClose();
      }
    },
    {
      id: 'radio-maritime',
      title: 'Frekuensi Maritim VHF Ch 16 (156.800 MHz)',
      subtitle: 'Kanal Distress & Keselamatan Pelayaran Internasional',
      category: 'Darurat',
      icon: Radio,
      badge: 'Radio',
      copyValue: '156.800 MHz',
      action: () => {
        const el = document.getElementById('kontak');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    // Pos SAR & Unit Siaga
    ...POSITIONS.map((pos) => ({
      id: `pos-${pos.id}-${pos.kind}-${pos.n.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      title: `${pos.n.replace(/^USS /, 'Unit Siaga SAR ')} (${pos.k})`,
      subtitle: `${pos.d} · Koordinat: ${pos.co}`,
      category: 'Wilayah & Armada' as const,
      icon: MapPin,
      badge: pos.k,
      copyValue: `${pos.lat}, ${pos.lon}`,
      action: () => {
        const el = document.getElementById('wilayah');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    })),
    // Layanan & PPID
    {
      id: 'service-op-sar',
      title: 'Operasi SAR Kecelakaan Kapal & Pesawat',
      subtitle: 'SOP Pencarian dan Pertolongan Maritim & Dirgantara',
      category: 'Layanan & PPID',
      icon: Shield,
      action: () => {
        const el = document.getElementById('layanan');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'service-bina-potensi',
      title: 'Pelatihan & Pembinaan Potensi SAR',
      subtitle: 'Permohonan diklat Medical First Responder (MFR) & Water Rescue',
      category: 'Layanan & PPID',
      icon: FileText,
      action: () => {
        const el = document.getElementById('layanan');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'service-ppid',
      title: 'Permohonan Informasi Publik (PPID)',
      subtitle: 'Akses laporan kinerja, anggaran, dan dokumen resmi',
      category: 'Layanan & PPID',
      icon: FileText,
      action: () => {
        const el = document.getElementById('ppid');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    // Navigation
    {
      id: 'nav-wilayah',
      title: 'Peta Wilayah Kerja & Armada GIS',
      subtitle: 'Jelajahi jangkauan SAR Sulawesi Utara di peta interaktif',
      category: 'Navigasi',
      icon: ArrowRight,
      action: () => {
        const el = document.getElementById('wilayah');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'nav-sambutan',
      title: 'Sambutan Kepala Kantor SAR Manado',
      subtitle: 'George L. M. Randang, S.IP., M.A.P.',
      category: 'Navigasi',
      icon: ArrowRight,
      action: () => {
        const el = document.getElementById('sambutan');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'nav-berita',
      title: 'Berita Operasi SAR Terkini & Galeri',
      subtitle: 'Dokumentasi evakuasi dan latihan kesiapsiagaan',
      category: 'Navigasi',
      icon: ArrowRight,
      action: () => {
        const el = document.getElementById('berita');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'nav-kontak',
      title: 'Formulir Kontak & Alamat Kantor',
      subtitle: 'Kirim pesan atau permohonan ke Kantor SAR Manado',
      category: 'Navigasi',
      icon: ArrowRight,
      action: () => {
        const el = document.getElementById('kontak');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    }
  ];

  const filteredItems = commandItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-200 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden text-slate-900 flex flex-col max-h-[80vh] backdrop-blur-xl ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <Search className="w-5 h-5 text-amber-600 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Ketik pencarian (cth: 115, Bitung, PPID, Pos SAR, Frekuensi)..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none font-['Plus_Jakarta_Sans']"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono bg-slate-200 text-slate-600 rounded border border-slate-300">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="overflow-y-auto p-2 divide-y divide-slate-100 focus:outline-none"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Tidak ditemukan hasil untuk "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Coba cari dengan kata kunci lain atau nomor kontak 115</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-l-2 border-amber-600 text-slate-900 translate-x-0.5'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-md ${
                        isSelected
                          ? 'bg-amber-600 text-white font-bold'
                          : 'bg-slate-100 text-amber-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate text-slate-900">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase bg-slate-100 text-amber-700 rounded border border-slate-200">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {item.copyValue && (
                      <button
                        type="button"
                        onClick={(e) => handleCopy(item.copyValue!, item.id, e)}
                        title="Salin ke clipboard"
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-amber-600 transition-colors"
                      >
                        {copiedId === item.id ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-mono font-bold">
                            <Check className="w-3.5 h-3.5" /> Salin
                          </span>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-amber-600" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-slate-200 rounded text-slate-700 text-[9px]">↑↓</kbd> Navigasi
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-slate-200 rounded text-slate-700 text-[9px]">↵</kbd> Pilih
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-slate-200 rounded text-slate-700 text-[9px]">ESC</kbd> Tutup
            </span>
          </div>
          <span className="text-amber-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Access SAR
          </span>
        </div>
      </div>
    </div>
  );
};
