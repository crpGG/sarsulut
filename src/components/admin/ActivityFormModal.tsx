import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Check, Clock } from 'lucide-react';
import { ActivityItem } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ActivityItem | null;
}

const ACTIVITY_TYPES = [
  'Apel Siaga',
  'Latihan Gabungan',
  'Sosialisasi Publik',
  'Patroli Kesiapsiagaan',
  'Rapat Koordinasi SAR',
  'Bina Potensi Relawan',
];

export const ActivityFormModal: React.FC<ActivityFormModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addActivity, updateActivity } = useAdminData();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Apel Siaga');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'selesai' | 'berlangsung' | 'dijadwalkan'>('dijadwalkan');
  const [desc, setDesc] = useState('');
  const [participants, setParticipants] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setType(initialData.type || 'Apel Siaga');
      setDate(initialData.date || '');
      setLocation(initialData.location || '');
      setStatus(initialData.status || 'dijadwalkan');
      setDesc(initialData.desc || '');
      setParticipants(initialData.participants || '');
    } else {
      setTitle('');
      setType('Apel Siaga');
      setDate('28 Agustus 2026');
      setLocation('Kantor SAR Manado');
      setStatus('dijadwalkan');
      setDesc('');
      setParticipants('50 Personel');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      type,
      date: date.trim(),
      location: location.trim(),
      status,
      desc: desc.trim(),
      participants: participants.trim() || undefined,
    };

    if (initialData?.id) {
      updateActivity(initialData.id, payload);
    } else {
      addActivity(payload);
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-130 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-lg font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Big_Shoulders_Display'] uppercase tracking-wide">
                {initialData ? 'Perbarui Kegiatan SAR' : 'Tambah Agenda Kegiatan'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Pencatatan Agenda Kesiapsiagaan & Operasi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
              Nama Kegiatan / Agenda <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Apel Gelar Pasukan Kesiapsiagaan Siaga SAR Khusus"
              className="w-full px-4 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/30 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                Jenis Kegiatan
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                Status Keterlaksanaan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
              >
                <option value="dijadwalkan">Dijadwalkan (Akan Datang)</option>
                <option value="berlangsung">Sedang Berlangsung</option>
                <option value="selesai">Selesai Terlaksana</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Tanggal Pelaksanaan</span>
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Contoh: 28 Agustus 2026"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Jumlah Personel / Peserta</span>
              </label>
              <input
                type="text"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="Contoh: 65 Personel Rescuer"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Lokasi Tempat Kegiatan</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Lapangan Apel Kantor SAR Manado, Kaasar"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
              Deskripsi & Catatan Kegiatan
            </label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Tuliskan tujuan, sasaran, dan hasil dari kegiatan ini..."
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900 leading-relaxed"
            />
          </div>

          {/* Action */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Simpan Perubahan' : 'Simpan Kegiatan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
