import React from 'react';
import { Shield } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

export const Footer: React.FC = () => {
  const { isAuthenticated, setIsAdminOpen, setIsLoginModalOpen } = useAdminData();

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <p className="foot-word">
            Basarnas<br />Sulut
          </p>
          <div className="socials">
            <a
              href="https://www.instagram.com/kantorsar_manado/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/humasbasarnasmanado/"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
            <a href="https://basarnas.go.id/" target="_blank" rel="noreferrer">
              basarnas.go.id
            </a>
            <a href="#atas">Kembali ke atas</a>
            <button
              type="button"
              onClick={handleAdminClick}
              className="text-amber-500 hover:text-amber-400 font-mono text-xs flex items-center gap-1 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? 'Panel Admin CMS' : 'Portal Login Pengelola'}</span>
            </button>
          </div>
        </div>

        <div className="foot-bot">
          <span>
            © <span id="yr">{new Date().getFullYear()}</span> Kantor Pencarian dan Pertolongan Manado
          </span>
          <span className="text-amber-500 font-semibold tracking-wider">
            Avignam Jagat Samagram
          </span>
        </div>
      </div>
    </footer>
  );
};
