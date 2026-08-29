import React, { useState, useEffect } from 'react';
import { FOTO_KEPALA_KANTOR_URL, FOTO_KEPALA_KANTOR_FALLBACK } from '../data/images';

interface KepalaKantorPortraitProps {
  className?: string;
  showBadge?: boolean;
  aspectRatio?: 'r34' | 'r11' | 'auto';
}

export const KepalaKantorPortrait: React.FC<KepalaKantorPortraitProps> = ({
  className = '',
  showBadge = false,
  aspectRatio = 'r34',
}) => {
  const [photoSrc, setPhotoSrc] = useState<string>(FOTO_KEPALA_KANTOR_URL);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('basarnas_foto_kepala_kantor');
      if (saved) {
        setPhotoSrc(saved);
      }
    } catch (e) {
      console.warn('Unable to access localStorage', e);
    }
  }, []);

  const handleImageError = () => {
    if (photoSrc !== FOTO_KEPALA_KANTOR_FALLBACK) {
      setPhotoSrc(FOTO_KEPALA_KANTOR_FALLBACK);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <figure
        className={`slot ${aspectRatio === 'r34' ? 'r34' : aspectRatio === 'r11' ? 'r11' : ''} cutout filled overflow-hidden relative shadow-2xl bg-white border border-slate-200`}
        data-slot="kepala-kantor"
      >
        <img
          src={photoSrc}
          alt="George L. M. Randang, S.IP., M.A.P. - Kepala Kantor SAR Manado"
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={handleImageError}
        />
      </figure>

      {showBadge && (
        <div className="badge">
          <b>George L. M. Randang, S.IP., M.A.P.</b>
          <small>Kepala Kantor SAR Manado</small>
        </div>
      )}
    </div>
  );
};


