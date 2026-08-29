import { SarPosition, PejabatItem, LayananItem, HistoryItem, NewsItem, GalleryItem, ActivityItem } from '../types';

export const POSITIONS: SarPosition[] = [
  {
    id: 0,
    n: "Kantor SAR Manado",
    lon: 125.05,
    lat: 1.41,
    kind: "hq",
    k: "Kantor",
    d: "Jl. Raya Worang By Pass, Desa Kaasar, Kec. Kauditan, Minahasa Utara",
    co: "Kaasar, Kauditan, Minahasa Utara"
  },
  {
    id: 1,
    n: "Pos SAR Amurang",
    lon: 124.58,
    lat: 1.19,
    kind: "pos",
    k: "Pos SAR",
    d: "Amurang, Kabupaten Minahasa Selatan",
    co: "Minahasa Selatan"
  },
  {
    id: 2,
    n: "Pos SAR Tahuna",
    lon: 125.49,
    lat: 3.60,
    kind: "pos",
    k: "Pos SAR",
    d: "Tahuna, Kabupaten Kepulauan Sangihe",
    co: "Kepulauan Sangihe"
  },
  {
    id: 3,
    n: "USS Kota Manado",
    lon: 124.84,
    lat: 1.49,
    kind: "uss",
    k: "Unit Siaga SAR",
    d: "Kota Manado, Sulawesi Utara",
    co: "Kota Manado"
  },
  {
    id: 4,
    n: "USS Bandara Sam Ratulangi",
    lon: 124.93,
    lat: 1.55,
    kind: "uss",
    k: "Unit Siaga SAR",
    d: "Bandara Internasional Sam Ratulangi, Mapanget, Kota Manado",
    co: "Mapanget, Kota Manado"
  },
  {
    id: 5,
    n: "USS Bitung",
    lon: 125.19,
    lat: 1.44,
    kind: "uss",
    k: "Unit Siaga SAR",
    d: "Kota Bitung, Sulawesi Utara",
    co: "Kota Bitung"
  },
  {
    id: 6,
    n: "USS Likupang",
    lon: 125.06,
    lat: 1.68,
    kind: "uss",
    k: "Unit Siaga SAR",
    d: "Likupang, Kabupaten Minahasa Utara (Kawasan Wisata Bahari)",
    co: "Minahasa Utara"
  },
  {
    id: 7,
    n: "USS Kotamobagu",
    lon: 124.32,
    lat: 0.73,
    kind: "uss",
    k: "Unit Siaga SAR",
    d: "Kota Kotamobagu, Wilayah Bolaang Mongondow Raya",
    co: "Bolaang Mongondow"
  },
  {
    id: 8,
    n: "KN SAR Bimasena",
    lon: 125.46,
    lat: 1.36,
    kind: "kn",
    k: "Unsur Laut",
    d: "Kapal Negara 208 · Homebase Pangkalan Bitung",
    co: "Kapal Negara · homebase Bitung"
  }
];

export const PEJABAT_LIST: PejabatItem[] = [
  {
    id: 'pejabat-1',
    role: 'Kepala Kantor',
    name: 'George L. M. Randang',
    deg: 'S.IP., M.A.P.',
    nip: 'NIP. 197505121998031001',
    slotLabel: 'Foto 01'
  },
  {
    id: 'pejabat-2',
    role: 'Kasubbag Umum',
    name: 'Stevi Lumempouw',
    deg: 'S.E., M.M.',
    slotLabel: 'Foto 02'
  },
  {
    id: 'pejabat-3',
    role: 'Koordinator Operasi & Siaga',
    name: 'Jandry Paendong',
    deg: 'S.T.',
    slotLabel: 'Foto 03'
  },
  {
    id: 'pejabat-4',
    role: 'Koordinator Sumber Daya',
    name: 'Melky Karundeng',
    deg: 'S.Sos.',
    slotLabel: 'Foto 04'
  },
  {
    id: 'pejabat-5',
    role: 'Kepala Pos SAR Amurang',
    name: 'Hartono Ruslan',
    deg: 'S.E.',
    slotLabel: 'Foto 05'
  },
  {
    id: 'pejabat-6',
    role: 'Kepala Pos SAR Tahuna',
    name: 'Steven Lumowa',
    deg: 'S.T.',
    slotLabel: 'Foto 06'
  }
];

export const LAYANAN_LIST: LayananItem[] = [
  {
    code: "OPS",
    title: "Operasi SAR",
    desc: "Pencarian dan pertolongan terhadap kecelakaan pelayaran, penerbangan, bencana, dan kondisi membahayakan manusia di darat, laut, dan udara."
  },
  {
    code: "SIAGA",
    title: "Kesiapsiagaan",
    desc: "Piket siaga 24 jam, latihan berkala, dan penyiapan personel rescuer beserta perlengkapan agar dapat digerakkan dalam hitungan menit."
  },
  {
    code: "POTENSI",
    title: "Bina Potensi SAR",
    desc: "Pelatihan dan pembinaan potensi SAR bagi masyarakat, komunitas, instansi, dan relawan di seluruh Sulawesi Utara."
  },
  {
    code: "SARPRAS",
    title: "Sarana & Prasarana",
    desc: "Pengelolaan rescue boat, rescue truck, rubber boat, serta peralatan SAR air, gunung, dan medis agar selalu siap operasi."
  },
  {
    code: "KOMLEK",
    title: "Sistem Komunikasi",
    desc: "Penerimaan dan pengolahan berita distress, radio SAR, serta koordinasi komunikasi antarinstansi selama operasi berlangsung."
  }
];

export const SEJARAH_LIST: HistoryItem[] = [
  {
    year: "1979",
    desc: "Dibentuk sebagai Sub Koordinasi Rescue (SKR) di bawah Departemen Perhubungan, dengan dua orang pegawai."
  },
  {
    year: "2000",
    desc: "SKR berubah status menjadi Kantor SAR Manado."
  },
  {
    year: "2007",
    desc: "Kantor berpindah dari Bandara Sam Ratulangi ke Desa Kaasar, Kabupaten Minahasa Utara."
  },
  {
    year: "2012",
    desc: "Ternate dan Gorontalo berdiri sebagai kantor SAR mandiri, wilayah kerja terfokus pada Sulawesi Utara."
  },
  {
    year: "Kini",
    desc: "Didukung Pos SAR Amurang dan Pos SAR Tahuna, lima Unit Siaga SAR — Kota Manado, Bandara Sam Ratulangi, Bitung, Likupang, dan Kotamobagu — serta unsur laut KN SAR Bimasena, menjaga wilayah ±800.000 km²."
  }
];

export const NEWS_LIST: NewsItem[] = [
  {
    id: "berita-1",
    title: "Tim SAR Gabungan Evakuasi Korban Kapal Mati Mesin di Perairan Bitung",
    category: "Operasi SAR",
    date: "24 Agustus 2026",
    author: "Humas SAR Manado",
    location: "Selat Lembeh, Bitung",
    summary: "Sebanyak 5 orang nelayan yang terombang-ambing akibat kerusakan mesin kapal di perairan Bitung berhasil dievakuasi dalam keadaan selamat oleh KN SAR Bimasena.",
    content: "Kantor Pencarian dan Pertolongan (SAR) Manado berhasil melaksanakan operasi evakuasi terhadap 5 orang nelayan yang mengalami mati mesin di perairan timur Selat Lembeh, Kota Bitung. Informasi pertama kali diterima dari keluarga korban pada pukul 04.30 WITA. Menindaklanjuti laporan tersebut, KN SAR Bimasena 208 bersama tim Rescue Pos Bitung segera dikerahkan menuju koordinat perkiraan arus laut. Seluruh korban ditemukan pada pukul 08.15 WITA dalam kondisi stabil dan telah dievakuasi ke dermaga perikanan Bitung untuk pemeriksaan medis lanjutan.",
    status: "published",
    pinned: true,
    views: 342,
    tags: ["Operasi SAR", "Bitung", "KN SAR Bimasena", "Kemanusiaan"]
  },
  {
    id: "berita-2",
    title: "Basarnas Sulut Gelar Pelatihan Pertolongan di Permukaan Air Bagi Relawan",
    category: "Bina Potensi",
    date: "18 Agustus 2026",
    author: "Seksi Sumber Daya SAR",
    location: "Danau Tondano, Minahasa",
    summary: "Puluhan peserta dari berbagai organisasi kemasyarakatan dan pecinta alam mengikuti pelatihan Water Rescue bertaraf nasional di Minahasa.",
    content: "Dalam rangka memperkuat sinergitas dan kesiapan potensi SAR di Sulawesi Utara, Kantor SAR Manado menyelenggarakan Pelatihan Potensi SAR Teknik Pertolongan di Permukaan Air (Water Rescue) selama 5 hari. Pelatihan mencakup materi teori keselamatan air, teknik renang pertolongan (defend and release), resusitasi jantung paru (RJP), serta penggunaan perahu karet dan motor tempel dalam kondisi cuaca berombak.",
    status: "published",
    pinned: false,
    views: 218,
    tags: ["Bina Potensi", "Water Rescue", "Pelatihan", "Minahasa"]
  },
  {
    id: "berita-3",
    title: "Kesiapsiagaan Cuaca Ekstrem: KN SAR Bimasena Patroli Rutin di Perairan Perbatasan",
    category: "Kesiapsiagaan",
    date: "12 Agustus 2026",
    author: "Piket Siaga Komunikasi",
    location: "Perairan Kepulauan Sangihe - Talaud",
    summary: "Mengantisipasi gelombang tinggi dan potensi kecelakaan laut, armada laut SAR Manado meningkatkan intensitas pemantauan jalur pelayaran utara.",
    content: "Menghadapi peringatan dini cuaca maritim dari BMKG terkait potensi gelombang tinggi di Laut Maluku dan perairan perbatasan Indonesia-Filipina, KN SAR Bimasena 208 disiagakan berpatroli secara bergantian di titik-titik krusial pelayaran kapal feri dan perahu nelayan. Kesiapan ini bertujuan memastikan Quick Response Time Basarnas dapat tercapai jika terjadi kondisi kedaruratan di laut.",
    status: "published",
    pinned: false,
    views: 189,
    tags: ["Kesiapsiagaan", "Sangihe", "Patroli Laut", "BMKG"]
  }
];

export const GALLERY_LIST: GalleryItem[] = [
  {
    id: "galeri-1",
    label: "Operasi Evakuasi Perairan",
    aspect: "r1610",
    caption: "Simulasi dan Operasi Penyelamatan Korban di Laut Sulawesi",
    date: "20 Agustus 2026",
    category: "Operasi Laut",
    location: "Teluk Manado"
  },
  {
    id: "galeri-2",
    label: "Latihan HART (High Angle Rescue)",
    aspect: "r1610",
    caption: "Pelatihan Teknik Evakuasi Ketinggian dan Gunung Hutan",
    date: "15 Agustus 2026",
    category: "Latihan",
    location: "Gunung Lokon"
  },
  {
    id: "galeri-3",
    label: "Armada KN SAR Bimasena",
    aspect: "r11",
    caption: "Kesiapsiagaan Kapal Negara di Dermaga Bitung",
    date: "10 Agustus 2026",
    category: "Sarpras",
    location: "Pangkalan Bitung"
  },
  {
    id: "galeri-4",
    label: "Piket Komunikasi 24/7",
    aspect: "r11",
    caption: "Ruang Pusat Komando Komunikasi SAR Manado",
    date: "05 Agustus 2026",
    category: "Siaga Komlek",
    location: "Kauditan, Minut"
  },
  {
    id: "galeri-5",
    label: "Pembinaan Potensi SAR",
    aspect: "r11",
    caption: "Sosialisasi Keselamatan dan Pertolongan Pertama",
    date: "01 Agustus 2026",
    category: "Bina Potensi",
    location: "Kantor SAR Manado"
  },
  {
    id: "galeri-6",
    label: "Peralatan Penyelamatan Khusus",
    aspect: "r11",
    caption: "Inspeksi Berkala Peralatan Medis & Aqua Eye",
    date: "28 Juli 2026",
    category: "Sarpras",
    location: "Gudang Peralatan"
  }
];

export const ACTIVITIES_LIST: ActivityItem[] = [
  {
    id: "kegiatan-1",
    title: "Apel Gelar Pasukan Kesiapsiagaan Siaga SAR Khusus",
    type: "Apel Siaga",
    date: "28 Agustus 2026",
    location: "Lapangan Kantor SAR Manado",
    status: "berlangsung",
    desc: "Pemeriksaan kesiapan personel rescuer, alat komunikasi, dan kendaraan operasional untuk pengamanan jalur transportasi darat dan laut.",
    participants: "65 Personel"
  },
  {
    id: "kegiatan-2",
    title: "Simulasi Evakuasi Bencana Gempa Bumi & Tsunami Bersama BPBD Sulut",
    type: "Latihan Gabungan",
    date: "02 September 2026",
    location: "Pesisir Pantai Malalayang, Manado",
    status: "dijadwalkan",
    desc: "Latihan skenario kontinjensi gempa megathrust berkolaborasi dengan TNI, POLRI, BPBD, dan relawan SAR gabungan.",
    participants: "120 Peserta"
  },
  {
    id: "kegiatan-3",
    title: "Pemberian Materi SAR Goes to School di SMA Negeri 1 Manado",
    type: "Sosialisasi Publik",
    date: "22 Agustus 2026",
    location: "Kota Manado",
    status: "selesai",
    desc: "Edukasi dasar pencegahan kecelakaan di lingkungan perairan dan cara menghubungi nomor darurat 115 bagi generasi muda.",
    participants: "200 Siswa"
  }
];
