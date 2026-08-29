import React, { useState, useEffect } from 'react';

interface StatusRailProps {
  activeSection: string;
  onOpenCommand?: () => void;
}

export const StatusRail: React.FC<StatusRailProps> = ({ activeSection, onOpenCommand }) => {
  const [witaTime, setWitaTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      // Calculate WITA (UTC+8)
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const wita = new Date(utc + 3600000 * 8);
      const hours = String(wita.getHours()).padStart(2, '0');
      const mins = String(wita.getMinutes()).padStart(2, '0');
      const secs = String(wita.getSeconds()).padStart(2, '0');
      setWitaTime(`${hours}:${mins}:${secs} WITA`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="rail cursor-pointer group" aria-hidden="true" onClick={onOpenCommand} title="Klik untuk membuka Pencarian Cepat SAR (Cmd+K)">
      <span className="group-hover:text-amber-600 transition-colors">1°30′N · 125°04′E</span>
      <span className="pulse" title="Sistem Siaga Aktif 24/7"></span>
      <span id="railSec">{activeSection || 'Beranda'}</span>
      {witaTime && (
        <span className="hidden xl:inline text-[10px] text-amber-700 font-mono tracking-widest pl-2 border-l border-slate-300">
          {witaTime}
        </span>
      )}
    </aside>
  );
};

