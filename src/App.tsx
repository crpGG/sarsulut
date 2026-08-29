import React, { useEffect, useState } from 'react';
import { StatusRail } from './components/StatusRail';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Ticker } from './components/Ticker';
import { WilayahMap } from './components/WilayahMap';
import { Stats } from './components/Stats';
import { Sambutan } from './components/Sambutan';
import { Layanan } from './components/Layanan';
import { Sejarah } from './components/Sejarah';
import { BeritaGaleri } from './components/BeritaGaleri';
import { Ppid } from './components/Ppid';
import { Kontak } from './components/Kontak';
import { Footer } from './components/Footer';
import { SosFab } from './components/SosFab';
import { CommandMenu } from './components/CommandMenu';
import { AdminDataProvider } from './context/AdminDataContext';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { ToastContainer } from './components/admin/ToastContainer';

function MainApp() {
  const [activeSection, setActiveSection] = useState<string>('Beranda');
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);

  useEffect(() => {
    // Global Cmd+K / Ctrl+K shortcut listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Scroll reveal observer
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    const revealElements = document.querySelectorAll('.rv');
    revealElements.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${Math.min(i, 4) * 60}ms`;
      io.observe(el);
    });

    // Section active tracker for status rail
    const sectionNames: Record<string, string> = {
      atas: 'Beranda',
      wilayah: 'Wilayah',
      sambutan: 'Sambutan',
      layanan: 'Layanan',
      berita: 'Berita',
      ppid: 'PPID',
      kontak: 'Kontak'
    };

    const sections = document.querySelectorAll('section[id], footer');
    const ioRail = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && sectionNames[entry.target.id]) {
            setActiveSection(sectionNames[entry.target.id]);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    sections.forEach((sec) => ioRail.observe(sec));

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      io.disconnect();
      ioRail.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-slate-900 overflow-x-hidden selection:bg-amber-500 selection:text-white">
      {/* Fixed Vertical Left Status Rail */}
      <StatusRail activeSection={activeSection} onOpenCommand={() => setIsCommandOpen(true)} />

      {/* Navigation Topbar with Command Palette Trigger */}
      <Header onOpenCommand={() => setIsCommandOpen(true)} />

      {/* 21st.dev Style Command Palette / Spotlight Search */}
      <CommandMenu isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* Hero Section with Radar Canvas */}
      <main id="main-content">
        <Hero />

        {/* Marquee Ticker */}
        <Ticker />

        {/* Wilayah Operasi & Interactive Map */}
        <WilayahMap />

        {/* Animated Statistics */}
        <Stats />

        {/* Sambutan Kepala Kantor */}
        <Sambutan />

        {/* Layanan Basarnas */}
        <Layanan />

        {/* Sejarah & Jejak Kantor */}
        <Sejarah />

        {/* Berita & Dokumentasi Galeri */}
        <BeritaGaleri />

        {/* PPID Layanan Informasi Publik */}
        <Ppid />

        {/* Kontak & Formulir */}
        <Kontak />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Emergency SOS Action */}
      <SosFab />

      {/* Admin Login Modal */}
      <AdminLoginModal />

      {/* Admin CMS Master Dashboard Modal */}
      <AdminDashboardModal />

      {/* Floating Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AdminDataProvider>
      <MainApp />
    </AdminDataProvider>
  );
}

