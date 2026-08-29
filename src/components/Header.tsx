import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  MapPin, 
  UserCheck, 
  LifeBuoy, 
  Newspaper, 
  FileText, 
  PhoneCall, 
  ChevronRight, 
  Phone,
  Radio,
  Clock,
  Shield,
  KeyRound
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

interface HeaderProps {
  onOpenCommand?: () => void;
}

interface NavItem {
  href: string;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { href: '#wilayah', label: 'Wilayah Kerja', sub: 'Peta Interaktif & Pos SAR', icon: MapPin },
  { href: '#sambutan', label: 'Sambutan', sub: 'Kepala Kantor SAR Manado', icon: UserCheck },
  { href: '#layanan', label: 'Layanan SAR', sub: 'Siaga Operasi 24 Jam', icon: LifeBuoy },
  { href: '#berita', label: 'Berita & Galeri', sub: 'Operasi & Informasi Terkini', icon: Newspaper },
  { href: '#ppid', label: 'PPID & Prosedur', sub: 'Keterbukaan Informasi Publik', icon: FileText },
  { href: '#kontak', label: 'Kontak & Darurat', sub: 'Hotline 115 & Frekuensi', icon: PhoneCall },
];

export const Header: React.FC<HeaderProps> = ({ onOpenCommand }) => {
  const { isAuthenticated, setIsAdminOpen, setIsLoginModalOpen } = useAdminData();
  const [isStuck, setIsStuck] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsStuck(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isNavOpen]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNavOpen) {
        setIsNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNavOpen]);

  const handleNavClick = () => {
    setIsNavOpen(false);
  };

  const handleSearchClick = () => {
    setIsNavOpen(false);
    if (onOpenCommand) {
      onOpenCommand();
    }
  };

  const handleAdminClick = () => {
    setIsNavOpen(false);
    if (isAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <header className={`topbar ${isStuck ? 'stuck' : ''}`} id="topbar">
        {/* Brand Logo & Title */}
        <a className="brand" href="#atas" onClick={handleNavClick}>
          <svg className="mark shrink-0" viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18.5" fill="none" stroke="#EA580C" strokeWidth="1.6" />
            <circle cx="20" cy="20" r="11" fill="none" stroke="rgba(15,23,42,.25)" strokeWidth="1" />
            <path d="M20 3.5v33M3.5 20h33" stroke="rgba(15,23,42,.15)" strokeWidth="1" />
            <path d="M20 9 L27 27 L20 22.5 L13 27 Z" fill="#EA580C" />
          </svg>
          <span className="brand-txt">
            <b className="text-slate-900 tracking-tight">BASARNAS SULUT</b>
            <small className="text-slate-500 font-mono">Kantor SAR Manado</small>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="nav hidden lg:flex items-center" id="nav">
          <a href="#wilayah">Wilayah</a>
          <a href="#sambutan">Sambutan</a>
          <a href="#layanan">Layanan</a>
          <a href="#berita">Berita</a>
          <a href="#ppid">PPID</a>
          <a href="#kontak">Kontak</a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onOpenCommand && (
            <button
              type="button"
              onClick={onOpenCommand}
              aria-label="Pencarian Cepat SAR"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/90 border border-slate-200 rounded-full transition-all hover:border-amber-500/50 hover:text-amber-700 shadow-xs"
            >
              <Search className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden sm:inline text-slate-600">Cari SAR</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[9px] font-mono bg-white text-slate-600 rounded border border-slate-200">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Admin CMS Access Button */}
          <button
            type="button"
            onClick={handleAdminClick}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-mono transition-all ${
              isAuthenticated
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
            }`}
            title="Portal Pengelola Konten Berita & Kegiatan"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAuthenticated ? 'Panel Admin' : 'Admin'}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-md font-mono text-xs tracking-wider uppercase transition-colors shadow-xs"
            aria-expanded={isNavOpen}
            aria-label={isNavOpen ? 'Tutup menu' : 'Buka menu'}
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            {isNavOpen ? (
              <>
                <X className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-slate-800">Tutup</span>
              </>
            ) : (
              <>
                <Menu className="w-4 h-4 text-slate-700" />
                <span className="font-semibold text-slate-800">Menu</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Modal / Drawer */}
      {isNavOpen && (
        <div
          className="fixed inset-0 z-100 lg:hidden flex flex-col bg-slate-900/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsNavOpen(false)}
        >
          <div
            className="w-full max-h-[92vh] mt-auto sm:mt-0 bg-white border-b sm:border-r border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900 rounded-t-2xl sm:rounded-none sm:w-80 md:w-96"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <svg className="w-7 h-7" viewBox="0 0 40 40" aria-hidden="true">
                  <circle cx="20" cy="20" r="18.5" fill="none" stroke="#EA580C" strokeWidth="1.6" />
                  <path d="M20 9 L27 27 L20 22.5 L13 27 Z" fill="#EA580C" />
                </svg>
                <div>
                  <span className="block font-bold text-sm text-slate-900 leading-tight">BASARNAS SULUT</span>
                  <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">Menu Navigasi</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNavOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                aria-label="Tutup menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search inside Mobile Menu */}
            <div className="p-4 border-b border-slate-100 space-y-2">
              <button
                type="button"
                onClick={handleSearchClick}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-600 transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-amber-600" />
                  <span>Pencarian Cepat Info SAR...</span>
                </div>
                <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-white text-slate-500 rounded border border-slate-200">
                  Cari
                </kbd>
              </button>

              {/* Admin Access inside Mobile Drawer */}
              <button
                type="button"
                onClick={handleAdminClick}
                className="w-full flex items-center justify-between p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-left text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold">
                    {isAuthenticated ? 'Buka Panel Admin Pengelola' : 'Portal Login Admin'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
                  {isAuthenticated ? 'Aktif' : 'Login'}
                </span>
              </button>
            </div>

            {/* Nav Items List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-slate-800 transition-all group border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-amber-500/10 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {item.sub}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                  </a>
                );
              })}
            </div>

            {/* Emergency & Status Box in Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60 space-y-2.5">
              <a
                href="tel:115"
                className="flex items-center justify-between p-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <div>
                    <div className="text-xs uppercase tracking-wider font-mono opacity-90 leading-tight">Panggilan Darurat SAR</div>
                    <div className="text-base font-extrabold font-['Big_Shoulders_Display'] tracking-wide">115 (Bebas Pulsa)</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] uppercase font-mono bg-white/20 rounded">
                  24 Jam
                </span>
              </a>

              <div className="flex items-center justify-between px-2 text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Siaga SAR Sulut
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  WITA (UTC+8)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


