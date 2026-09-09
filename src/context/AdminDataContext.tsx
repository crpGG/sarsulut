import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NewsItem, GalleryItem, ActivityItem, AdminUser } from '../types';
import { NEWS_LIST as INITIAL_NEWS, GALLERY_LIST as INITIAL_GALLERY, ACTIVITIES_LIST as INITIAL_ACTIVITIES } from '../data/sarData';
import { 
  db, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  handleFirestoreError, 
  OperationType,
  User
} from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  getDocs
} from 'firebase/firestore';

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AdminDataContextType {
  // Auth
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  firebaseUser: User | null;
  login: (username: string, pass: string) => { success: boolean; message: string };
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;

  // News
  news: NewsItem[];
  addNews: (item: Omit<NewsItem, 'id'>) => Promise<NewsItem>;
  updateNews: (id: string, item: Partial<NewsItem>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  toggleNewsStatus: (id: string) => Promise<void>;
  toggleNewsPin: (id: string) => Promise<void>;

  // Gallery
  galleries: GalleryItem[];
  addGallery: (item: Omit<GalleryItem, 'id'>) => Promise<GalleryItem>;
  updateGallery: (id: string, item: Partial<GalleryItem>) => Promise<void>;
  deleteGallery: (id: string) => Promise<void>;

  // Activities
  activities: ActivityItem[];
  addActivity: (item: Omit<ActivityItem, 'id'>) => Promise<ActivityItem>;
  updateActivity: (id: string, item: Partial<ActivityItem>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;

  // Utilities
  resetToDefaults: () => Promise<void>;
  exportDataJson: () => void;
  toasts: ToastInfo[];
  removeToast: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  isCloudSyncing: boolean;
}

const STORAGE_KEYS = {
  NEWS: 'basarnas_news_store_v2',
  GALLERY: 'basarnas_gallery_store_v2',
  ACTIVITIES: 'basarnas_activities_store_v2',
  AUTH: 'basarnas_admin_session_v2',
};

const DEFAULT_ADMIN: AdminUser = {
  username: 'admin',
  name: 'Admin Humas & TI SAR Manado',
  role: 'Pranata Humas Ahli / Pengelola Konten',
  email: 'humas.manado@basarnas.go.id',
  avatar: 'https://i.ibb.co/rRSd7F05/IMLEK-2026-20260827-115637-0000.jpg',
};

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  // Fallback initial local states
  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_NEWS;
  });

  const [galleries, setGalleries] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_GALLERY;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_ACTIVITIES;
  });

  // Admin Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true' ? DEFAULT_ADMIN : null;
    } catch {
      return null;
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Toast System
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync with Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsAuthenticated(true);
        const fbAdmin: AdminUser = {
          username: user.email?.split('@')[0] || 'admin',
          name: user.displayName || 'Administrator Basarnas',
          role: 'Pengelola Konten (Firebase)',
          email: user.email || 'humas.manado@basarnas.go.id',
          avatar: user.photoURL || DEFAULT_ADMIN.avatar,
        };
        setAdminUser(fbAdmin);
        try {
          localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
        } catch (e) {
          console.warn(e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time updates for news
  useEffect(() => {
    const newsCol = collection(db, 'news');
    const unsubNews = onSnapshot(
      newsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteNews: NewsItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as NewsItem;
            remoteNews.push({ ...data, id: docSnap.id });
          });
          // Sort by date desc or pinned
          remoteNews.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return (b.id > a.id ? 1 : -1);
          });
          setNews(remoteNews);
          try {
            localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(remoteNews));
          } catch (e) {
            console.warn(e);
          }
        }
      },
      (error) => {
        console.warn('Firestore news listener fallback to local', error.message);
      }
    );

    // Listen to Firestore galleries
    const galleryCol = collection(db, 'galleries');
    const unsubGallery = onSnapshot(
      galleryCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteGalleries: GalleryItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as GalleryItem;
            remoteGalleries.push({ ...data, id: docSnap.id });
          });
          setGalleries(remoteGalleries);
          try {
            localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(remoteGalleries));
          } catch (e) {
            console.warn(e);
          }
        }
      },
      (error) => {
        console.warn('Firestore gallery listener fallback to local', error.message);
      }
    );

    // Listen to Firestore activities
    const actCol = collection(db, 'activities');
    const unsubAct = onSnapshot(
      actCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteActivities: ActivityItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as ActivityItem;
            remoteActivities.push({ ...data, id: docSnap.id });
          });
          setActivities(remoteActivities);
          try {
            localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(remoteActivities));
          } catch (e) {
            console.warn(e);
          }
        }
      },
      (error) => {
        console.warn('Firestore activities listener fallback to local', error.message);
      }
    );

    return () => {
      unsubNews();
      unsubGallery();
      unsubAct();
    };
  }, []);

  // Auth Operations
  const login = (username: string, pass: string) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (
      (cleanUser === 'admin' && (cleanPass === 'sarmanado115' || cleanPass === 'admin123' || cleanPass === 'basarnas115' || cleanPass === 'admin')) ||
      (cleanUser === 'humas' && cleanPass === 'sarmanado115')
    ) {
      setIsAuthenticated(true);
      setAdminUser(DEFAULT_ADMIN);
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      } catch (e) {
        console.warn(e);
      }
      setIsLoginModalOpen(false);
      setIsAdminOpen(true);
      showToast('Login berhasil! Terhubung ke Cloud Firestore & Portal SAR Manado.', 'success');
      return { success: true, message: 'Berhasil login' };
    }

    showToast('Username atau password tidak sesuai. Coba username: admin / password: sarmanado115', 'error');
    return { success: false, message: 'Kredensial tidak valid' };
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setIsCloudSyncing(true);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setIsLoginModalOpen(false);
        setIsAdminOpen(true);
        showToast(`Selamat datang ${result.user.displayName || 'Admin'}! Terhubung ke Firebase.`, 'success');
        return true;
      }
      return false;
    } catch (err: unknown) {
      console.warn('Google login error, continuing with fallback:', err);
      showToast('Gagal login dengan Google atau dibatalkan. Anda dapat menggunakan username & password bawaan.', 'error');
      return false;
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn(e);
    }
    setIsAuthenticated(false);
    setAdminUser(null);
    setFirebaseUser(null);
    setIsAdminOpen(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (e) {
      console.warn(e);
    }
    showToast('Anda telah keluar dari Portal Admin.', 'info');
  };

  // News CRUD with Firestore Sync
  const addNews = async (item: Omit<NewsItem, 'id'>): Promise<NewsItem> => {
    const newId = `berita-${Date.now()}`;
    const newItem: NewsItem = {
      ...item,
      id: newId,
      status: item.status || 'published',
      views: 1,
    };
    
    // Update local state first for instant UI response
    setNews((prev) => [newItem, ...prev]);

    // Push to Firestore
    try {
      await setDoc(doc(db, 'news', newId), {
        ...newItem,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      showToast(`Berita "${newItem.title.slice(0, 35)}..." tersimpan di Cloud Firestore!`);
    } catch (err) {
      reportWriteFailure(err, 'berita');
    }

    return newItem;
  };

  const updateNews = async (id: string, updatedFields: Partial<NewsItem>) => {
    setNews((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );

    try {
      await updateDoc(doc(db, 'news', id), {
        ...updatedFields,
        updatedAt: new Date().toISOString(),
      });
      showToast('Berita berhasil diperbarui di Cloud Firestore!');
    } catch (err) {
      reportWriteFailure(err, 'perubahan berita');
    }
  };

  const deleteNews = async (id: string) => {
    setNews((prev) => prev.filter((item) => item.id !== id));

    try {
      await deleteDoc(doc(db, 'news', id));
      showToast('Berita berhasil dihapus dari Cloud Firestore.', 'info');
    } catch (err) {
      reportWriteFailure(err, 'penghapusan berita');
    }
  };

  const toggleNewsStatus = async (id: string) => {
    const target = news.find((n) => n.id === id);
    if (!target) return;
    const newStatus = target.status === 'draft' ? 'published' : 'draft';
    await updateNews(id, { status: newStatus });
    showToast(`Status berita diubah menjadi ${newStatus === 'published' ? 'Terbit' : 'Draft'}.`);
  };

  const toggleNewsPin = async (id: string) => {
    const target = news.find((n) => n.id === id);
    if (!target) return;
    const newPin = !target.pinned;
    await updateNews(id, { pinned: newPin });
    showToast(newPin ? 'Berita disematkan sebagai Berita Utama.' : 'Sematkan berita dilepas.');
  };

  // A rejected write (permission-denied, offline, failed validation) used to
  // surface as a success toast, so the admin had no way to know nothing had
  // persisted. Report the real reason instead.
  const reportWriteFailure = (err: unknown, what: string) => {
    const code = (err as { code?: string })?.code;
    const reason =
      code === 'permission-denied'
        ? 'ditolak oleh aturan keamanan Firestore'
        : code === 'unavailable'
          ? 'koneksi ke Firestore terputus'
          : code || 'kesalahan tidak dikenal';
    console.warn(`Firestore ${what} error:`, err);
    showToast(
      `GAGAL menyimpan ${what} ke Cloud Firestore (${reason}). Perubahan hanya terlihat di perangkat ini dan akan hilang saat halaman dimuat ulang.`,
      'error'
    );
  };

  // Gallery CRUD with Firestore Sync
  const addGallery = async (item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> => {
    const newId = `galeri-${Date.now()}`;
    const newItem: GalleryItem = {
      ...item,
      id: newId,
    };
    setGalleries((prev) => [newItem, ...prev]);

    try {
      await setDoc(doc(db, 'galleries', newId), {
        ...newItem,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      showToast(`Dokumentasi "${newItem.label}" tersimpan di Cloud Firestore!`);
    } catch (err) {
      reportWriteFailure(err, 'dokumentasi galeri');
    }

    return newItem;
  };

  const updateGallery = async (id: string, updatedFields: Partial<GalleryItem>) => {
    setGalleries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );

    try {
      await updateDoc(doc(db, 'galleries', id), {
        ...updatedFields,
        updatedAt: new Date().toISOString(),
      });
      showToast('Data galeri berhasil diperbarui di Cloud Firestore!');
    } catch (err) {
      reportWriteFailure(err, 'perubahan galeri');
    }
  };

  const deleteGallery = async (id: string) => {
    setGalleries((prev) => prev.filter((item) => item.id !== id));

    try {
      await deleteDoc(doc(db, 'galleries', id));
      showToast('Foto dokumentasi berhasil dihapus dari Cloud Firestore.', 'info');
    } catch (err) {
      reportWriteFailure(err, 'penghapusan dokumentasi');
    }
  };

  // Activities CRUD with Firestore Sync
  const addActivity = async (item: Omit<ActivityItem, 'id'>): Promise<ActivityItem> => {
    const newId = `kegiatan-${Date.now()}`;
    const newItem: ActivityItem = {
      ...item,
      id: newId,
    };
    setActivities((prev) => [newItem, ...prev]);

    try {
      await setDoc(doc(db, 'activities', newId), {
        ...newItem,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      showToast(`Kegiatan "${newItem.title.slice(0, 35)}..." tersimpan di Cloud Firestore!`);
    } catch (err) {
      reportWriteFailure(err, 'kegiatan');
    }

    return newItem;
  };

  const updateActivity = async (id: string, updatedFields: Partial<ActivityItem>) => {
    setActivities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );

    try {
      await updateDoc(doc(db, 'activities', id), {
        ...updatedFields,
        updatedAt: new Date().toISOString(),
      });
      showToast('Data kegiatan berhasil diperbarui di Cloud Firestore!');
    } catch (err) {
      reportWriteFailure(err, 'perubahan kegiatan');
    }
  };

  const deleteActivity = async (id: string) => {
    setActivities((prev) => prev.filter((item) => item.id !== id));

    try {
      await deleteDoc(doc(db, 'activities', id));
      showToast('Kegiatan berhasil dihapus dari Cloud Firestore.', 'info');
    } catch (err) {
      reportWriteFailure(err, 'penghapusan kegiatan');
    }
  };

  // Utilities
  const resetToDefaults = async () => {
    setNews(INITIAL_NEWS);
    setGalleries(INITIAL_GALLERY);
    setActivities(INITIAL_ACTIVITIES);
    try {
      localStorage.removeItem(STORAGE_KEYS.NEWS);
      localStorage.removeItem(STORAGE_KEYS.GALLERY);
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    } catch (e) {
      console.warn(e);
    }
    showToast('Data berita, galeri, dan kegiatan telah dikembalikan ke data awal standar.', 'info');
  };

  const exportDataJson = () => {
    const dataBackup = {
      exportedAt: new Date().toISOString(),
      source: 'Kantor SAR Manado - Portal Admin & Firestore Sync',
      news,
      galleries,
      activities,
    };
    const blob = new Blob([JSON.stringify(dataBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_basarnas_sulut_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Cadangan data berhasil diunduh dalam format JSON.');
  };

  return (
    <AdminDataContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        firebaseUser,
        login,
        loginWithGoogle,
        logout,
        isAdminOpen,
        setIsAdminOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        news,
        addNews,
        updateNews,
        deleteNews,
        toggleNewsStatus,
        toggleNewsPin,
        galleries,
        addGallery,
        updateGallery,
        deleteGallery,
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        resetToDefaults,
        exportDataJson,
        toasts,
        removeToast,
        showToast,
        isCloudSyncing,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = (): AdminDataContextType => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
