import type { ReactNode } from 'react';

export interface SarPosition {
  id: number;
  n: string;
  lon: number;
  lat: number;
  kind: 'hq' | 'pos' | 'uss' | 'kn';
  k: string;
  d: string;
  co: string;
}

export interface PejabatItem {
  id: string;
  role: string;
  name: string;
  deg?: string;
  nip?: string;
  image?: string;
  slotLabel?: string;
}

export interface LayananItem {
  code: string;
  title: string;
  desc: string;
}

export interface HistoryItem {
  year: string;
  desc: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  author?: string;
  location?: string;
  summary?: string;
  content?: string;
  image?: string;
  status?: 'published' | 'draft';
  pinned?: boolean;
  views?: number;
  tags?: string[];
}

export interface GalleryItem {
  id: string;
  label: string;
  aspect: 'r1610' | 'r11';
  colSpan?: string;
  image?: string;
  caption?: string;
  date?: string;
  category?: string;
  location?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  status: 'selesai' | 'berlangsung' | 'dijadwalkan';
  desc: string;
  participants?: string;
  image?: string;
}

export interface AdminUser {
  username: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

export interface PpidAccordion {
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

