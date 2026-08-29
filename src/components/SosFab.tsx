import React from 'react';

export const SosFab: React.FC = () => {
  return (
    <a
      className="sos group"
      href="tel:115"
      aria-label="Telepon nomor darurat 115"
    >
      <span className="ring" aria-hidden="true"></span>
      <span>
        <small>Darurat</small>
        <b>115</b>
      </span>
    </a>
  );
};
