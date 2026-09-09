import React, { useState, useEffect, useRef } from 'react';
import { POSITIONS } from '../data/sarData';
import L from 'leaflet';
import { Layers, MapPin, Compass, Key, Eye, RefreshCw } from 'lucide-react';

interface TileProvider {
  id: string;
  name: string;
  url: string;
  attribution: string;
  subdomains?: string;
  maxZoom: number;
}

const TILE_PROVIDERS: TileProvider[] = [
  {
    id: 'osm_standard',
    name: 'OpenStreetMap Resmi (Bebas Kunci)',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> kontributor',
    maxZoom: 19
  },
  {
    id: 'esri_satellite',
    name: 'Citra Satelit Resolusi Tinggi (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com" target="_blank" rel="noreferrer">Esri</a>, Earthstar Geographics',
    maxZoom: 19
  },
  {
    id: 'esri_dark',
    name: 'Taktis Gelap (Esri Dark Canvas)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com" target="_blank" rel="noreferrer">Esri</a>, HERE, Garmin',
    maxZoom: 16
  },
  {
    id: 'esri_ocean',
    name: 'Peta Oseanografi & Maritim SAR',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com" target="_blank" rel="noreferrer">Esri</a>, GEBCO, NOAA',
    maxZoom: 13
  },
  {
    id: 'esri_topo',
    name: 'Topografi & Kontur Darat',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com" target="_blank" rel="noreferrer">Esri</a>, USGS, Intermap',
    maxZoom: 19
  }
];

export const WilayahMap: React.FC = () => {
  const [activePos, setActivePos] = useState<number>(0);
  const [hasLeaflet, setHasLeaflet] = useState<boolean>(true);
  const [mapNote, setMapNote] = useState<string>('Memuat peta Leaflet…');
  const [mapHintHidden, setMapHintHidden] = useState<boolean>(false);
  const [currentLayerId, setCurrentLayerId] = useState<string>('osm_standard');
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [cursorCoords, setCursorCoords] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const tileFallbackRef = useRef<boolean>(false);

  // Coastline polygon paths for the schematic fallback canvas
  const land = [
    [
      [122.85, 1.02], [123.30, 1.06], [123.60, 1.02], [123.95, 1.10], [124.25, 1.28],
      [124.50, 1.41], [124.70, 1.48], [124.86, 1.56], [124.99, 1.66], [125.10, 1.73],
      [125.23, 1.66], [125.28, 1.52], [125.20, 1.42], [125.04, 1.34], [124.90, 1.27],
      [124.72, 1.17], [124.58, 1.13], [124.45, 0.95], [124.40, 0.70], [124.25, 0.52],
      [124.00, 0.45], [123.70, 0.44], [123.40, 0.52], [123.10, 0.60], [122.85, 0.70]
    ],
    [[125.34, 2.66], [125.46, 2.62], [125.50, 2.82], [125.38, 2.86]],
    [[125.38, 3.38], [125.56, 3.44], [125.60, 3.78], [125.44, 3.82], [125.36, 3.60]],
    [[126.60, 3.86], [126.86, 3.92], [126.92, 4.16], [126.70, 4.14]]
  ];

  const BB = { lon0: 122.85, lon1: 127.15, lat0: 0.10, lat1: 4.45 };

  const proj = (lon: number, lat: number, w: number, h: number): [number, number] => {
    const lonS = BB.lon1 - BB.lon0;
    const latS = BB.lat1 - BB.lat0;
    const s = Math.min(w / lonS, h / latS) * 0.94;
    const ox = (w - lonS * s) / 2;
    const oy = (h - latS * s) / 2;
    return [ox + (lon - BB.lon0) * s, oy + (BB.lat1 - lat) * s];
  };

  // Switch Tile Layer Helper
  const setTileLayer = (providerId: string, apiKey?: string) => {
    if (!mapInstanceRef.current) return;
    const provider = TILE_PROVIDERS.find((p) => p.id === providerId) || TILE_PROVIDERS[0];
    
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    let url = provider.url;
    if (apiKey) {
      url = url.replace('{key}', apiKey).replace('{apikey}', apiKey);
    }

    const newLayer = L.tileLayer(url, {
      maxZoom: provider.maxZoom,
      subdomains: provider.subdomains || 'abc',
      attribution: provider.attribution
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
    setCurrentLayerId(provider.id);
    setMapNote(`Peta aktif: ${provider.name} · Leaflet 2.0 ready`);
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      if (typeof L === 'undefined' || !L.map) {
        setHasLeaflet(false);
        setMapNote('Peta skematis · bukan untuk navigasi');
        return;
      }

      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
        attributionControl: true,
        zoomControl: true
      });
      mapInstanceRef.current = map;

      // Initial OpenStreetMap Official layer (100% Free, No Watermark, No API Key Required)
      const defaultProvider = TILE_PROVIDERS[0];
      const initialLayer = L.tileLayer(defaultProvider.url, {
        maxZoom: defaultProvider.maxZoom,
        subdomains: defaultProvider.subdomains || 'abc',
        attribution: defaultProvider.attribution
      }).addTo(map);
      tileLayerRef.current = initialLayer;

      // If the OSM tile host is unreachable (blocked by an ISP or rate limited),
      // switch to Esri once so the map never renders as an empty box.
      initialLayer.on('tileerror', () => {
        if (tileFallbackRef.current) return;
        tileFallbackRef.current = true;
        setTileLayer('esri_satellite');
        setMapNote('Sumber peta utama tidak dapat diakses · beralih ke Citra Satelit Esri');
      });

      // Add Markers
      const markers: L.Marker[] = [];
      POSITIONS.forEach((pos, idx) => {
        const marker = L.marker([pos.lat, pos.lon], {
          title: pos.n,
          icon: L.divIcon({
            className: `mkwrap ${idx === 0 ? 'on' : ''}`,
            html: `<i class="mk mk-${pos.kind}"></i>`,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
            popupAnchor: [0, -14]
          })
        }).addTo(map);

        marker.bindPopup(
          `<div class="p-1"><span class="pk">${pos.k}</span><div class="pn text-base font-bold text-amber-500">${pos.n.replace(/^USS /, 'Unit Siaga SAR ')}</div><div class="pd text-xs text-neutral-300 mt-1">${pos.d}</div><div class="mt-2 text-[10px] font-mono text-neutral-400 bg-neutral-900/80 px-2 py-1 rounded border border-neutral-700">📍 ${pos.co} (${pos.lat.toFixed(4)}, ${pos.lon.toFixed(4)})</div></div>`
        );

        marker.on('click', () => {
          handleSelectPos(idx, false);
        });

        markers.push(marker);
      });

      markersRef.current = markers;

      const bounds = L.latLngBounds(POSITIONS.map((p) => [p.lat, p.lon]));
      map.fitBounds(bounds, { padding: [40, 40] });

      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        setCursorCoords(`${e.latlng.lat.toFixed(4)}°N, ${e.latlng.lng.toFixed(4)}°E`);
      });

      map.on('click', () => {
        if (!map.scrollWheelZoom.enabled()) {
          map.scrollWheelZoom.enable();
          setMapHintHidden(true);
        }
      });

      setMapNote('Peta Leaflet Interaktif · klik penanda untuk detail');
      setHasLeaflet(true);

      const resizeTimer = setTimeout(() => {
        map.invalidateSize();
      }, 400);

      return () => {
        clearTimeout(resizeTimer);
        map.remove();
      };
    } catch (err) {
      console.warn('Leaflet map error, falling back to schematic canvas:', err);
      setHasLeaflet(false);
      setMapNote('Peta skematis · bukan untuk navigasi');
    }
  }, []);

  // Fallback Canvas Animation
  useEffect(() => {
    if (hasLeaflet) return;

    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let pulse = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      return dpr;
    };

    let pd = sizeCanvas();

    const drawPeta = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Graticule
      ctx.strokeStyle = 'rgba(244,244,244,0.06)';
      ctx.lineWidth = 1 * pd;
      ctx.font = `${9 * pd}px 'IBM Plex Mono', monospace`;
      ctx.fillStyle = 'rgba(244,244,244,0.22)';

      for (let lo = 123; lo <= 127; lo++) {
        const a = proj(lo, BB.lat1, w, h);
        const b = proj(lo, BB.lat0, w, h);
        ctx.beginPath();
        ctx.moveTo(a[0], 0);
        ctx.lineTo(b[0], h);
        ctx.stroke();
        ctx.textAlign = 'left';
        ctx.fillText(`${lo}°E`, a[0] + 4 * pd, h - 6 * pd);
      }

      for (let la = 1; la <= 4; la++) {
        const c = proj(BB.lon0, la, w, h);
        const d = proj(BB.lon1, la, w, h);
        ctx.beginPath();
        ctx.moveTo(0, c[1]);
        ctx.lineTo(w, d[1]);
        ctx.stroke();
        ctx.textAlign = 'left';
        ctx.fillText(`${la}°N`, 6 * pd, c[1] - 5 * pd);
      }

      // Land polygons
      land.forEach((poly) => {
        ctx.beginPath();
        poly.forEach((p, i) => {
          const q = proj(p[0], p[1], w, h);
          if (i === 0) ctx.moveTo(q[0], q[1]);
          else ctx.lineTo(q[0], q[1]);
        });
        ctx.closePath();
        ctx.fillStyle = 'rgba(234, 88, 12, 0.08)';
        ctx.strokeStyle = 'rgba(234, 88, 12, 0.55)';
        ctx.lineWidth = 1.2 * pd;
        ctx.fill();
        ctx.stroke();
      });

      // Markers
      POSITIONS.forEach((p, i) => {
        const q = proj(p.lon, p.lat, w, h);
        const X = q[0];
        const Y = q[1];
        const on = i === activePos;

        if (on) {
          const t = (pulse % 70) / 70;
          const r = (9 + t * 30) * pd;
          ctx.strokeStyle = `rgba(234, 88, 12, ${(1 - t) * 0.8})`;
          ctx.lineWidth = 1.6 * pd;
          ctx.beginPath();
          ctx.arc(X, Y, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (p.kind === 'kn') {
          const s = (on ? 6.5 : 5) * pd;
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.moveTo(X, Y - s);
          ctx.lineTo(X + s, Y + s * 0.8);
          ctx.lineTo(X - s, Y + s * 0.8);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillStyle = p.kind === 'hq' ? '#0F172A' : p.kind === 'pos' ? '#EA580C' : '#D97706';
          ctx.beginPath();
          ctx.arc(X, Y, (p.kind === 'hq' ? 5.5 : p.kind === 'pos' ? 4.4 : 3.6) * pd, 0, Math.PI * 2);
          ctx.fill();
          if (p.kind === 'uss') {
            ctx.strokeStyle = 'rgba(15,23,42,.45)';
            ctx.lineWidth = 1 * pd;
            ctx.stroke();
          }
        }

        if (on) {
          ctx.font = `600 ${11 * pd}px 'IBM Plex Mono', monospace`;
          ctx.fillStyle = '#F0A500';
          const right = X > w * 0.62;
          ctx.textAlign = right ? 'right' : 'left';
          ctx.fillText(p.n.toUpperCase(), X + (right ? -14 * pd : 14 * pd), Y + 4 * pd);
        }
      });

      pulse++;
      if (!reduceMotion) {
        rafId = requestAnimationFrame(drawPeta);
      }
    };

    drawPeta();
    const handleResize = () => {
      pd = sizeCanvas();
      drawPeta();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [hasLeaflet, activePos]);

  const handleSelectPos = (index: number, fly = true) => {
    setActivePos(index);
    const pos = POSITIONS[index];

    if (hasLeaflet && mapInstanceRef.current) {
      markersRef.current.forEach((marker, j) => {
        const el = marker.getElement();
        if (el) {
          el.classList.toggle('on', j === index);
        }
      });

      if (fly) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
          mapInstanceRef.current.setView([pos.lat, pos.lon], 11);
        } else {
          mapInstanceRef.current.flyTo([pos.lat, pos.lon], 11, { duration: 1.1 });
        }
        markersRef.current[index]?.openPopup();
      }
    }
  };

  const handleResetBounds = () => {
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds(POSITIONS.map((p) => [p.lat, p.lon]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  return (
    <section className="band band--dark" id="wilayah">
      <div className="wrap">
        <p className="eyebrow rv">Wilayah Operasi · <b>±800.000 KM²</b></p>
        <div className="split">
          <div className="rv">
            <h2 className="h-lg">
              Satu provinsi,<br />tiga medan.
            </h2>
            <p className="lede dim" style={{ marginTop: '22px' }}>
              Wilayah pencarian dan pertolongan Kantor SAR Manado membentang dari pegunungan dan danau di daratan Minahasa hingga perairan kepulauan Sangihe–Talaud. Di utara berbatasan langsung dengan wilayah Filipina dan Samudra Pasifik; di selatan bersinggungan dengan Kantor SAR Makassar, Kendari, dan Ambon.
            </p>
            <p className="lede dim" style={{ marginTop: '14px' }}>
              Jangkauan itu dijaga oleh dua Pos SAR, lima Unit Siaga SAR, dan unsur laut KN SAR Bimasena. Pilih salah satu untuk menyorotnya di peta.
            </p>

            <div className="legend" style={{ marginTop: '34px' }}>
              <p className="grp">Kantor</p>
              <button
                className={`pos ${activePos === 0 ? 'on' : ''}`}
                onClick={() => handleSelectPos(0, true)}
                type="button"
              >
                <span className="dot hq"></span>
                <span>
                  <span className="nm">{POSITIONS[0].n}</span>
                  <br />
                  <span className="co">{POSITIONS[0].co}</span>
                </span>
                <span className="co">HQ</span>
              </button>

              <p className="grp">Pos SAR</p>
              <button
                className={`pos ${activePos === 1 ? 'on' : ''}`}
                onClick={() => handleSelectPos(1, true)}
                type="button"
              >
                <span className="dot"></span>
                <span>
                  <span className="nm">{POSITIONS[1].n}</span>
                  <br />
                  <span className="co">{POSITIONS[1].co}</span>
                </span>
                <span className="co">POS</span>
              </button>

              <button
                className={`pos ${activePos === 2 ? 'on' : ''}`}
                onClick={() => handleSelectPos(2, true)}
                type="button"
              >
                <span className="dot"></span>
                <span>
                  <span className="nm">{POSITIONS[2].n}</span>
                  <br />
                  <span className="co">{POSITIONS[2].co}</span>
                </span>
                <span className="co">POS</span>
              </button>

              <p className="grp">Unit Siaga SAR</p>
              {[3, 4, 5, 6, 7].map((idx) => (
                <button
                  key={POSITIONS[idx].id}
                  className={`pos ${activePos === idx ? 'on' : ''}`}
                  onClick={() => handleSelectPos(idx, true)}
                  type="button"
                >
                  <span className="dot sm"></span>
                  <span>
                    <span className="nm">{POSITIONS[idx].n.replace(/^USS /, '')}</span>
                    <br />
                    <span className="co">{POSITIONS[idx].co}</span>
                  </span>
                  <span className="co">USS</span>
                </button>
              ))}

              <p className="grp">Unsur Laut</p>
              <button
                className={`pos ${activePos === 8 ? 'on' : ''}`}
                onClick={() => handleSelectPos(8, true)}
                type="button"
              >
                <span className="dot kn"></span>
                <span>
                  <span className="nm">{POSITIONS[8].n}</span>
                  <br />
                  <span className="co">{POSITIONS[8].co}</span>
                </span>
                <span className="co">KN</span>
              </button>
            </div>
          </div>

          <div className="rv mapcol">
            {/* Map Controls Header Bar */}
            <div className="flex items-center justify-between gap-2 mb-2 px-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                  <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '12s' }} />
                  Leaflet Map GIS
                </span>
                {cursorCoords && (
                  <span className="hidden sm:inline-block text-[10px] font-mono text-neutral-400">
                    {cursorCoords}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 relative">
                {/* Reset View Button */}
                <button
                  type="button"
                  onClick={handleResetBounds}
                  title="Tampilkan seluruh Sulawesi Utara"
                  className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 flex items-center gap-1 transition-colors font-medium shadow-xs"
                >
                  <RefreshCw className="w-3 h-3 text-slate-500" />
                  <span className="hidden sm:inline">Reset Wilayah</span>
                </button>

                {/* Layer Selector Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowLayerMenu(!showLayerMenu)}
                    className="px-2.5 py-1 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 font-semibold rounded border border-amber-500/30 flex items-center gap-1.5 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    <span>Layer Peta</span>
                  </button>

                  {showLayerMenu && (
                    <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 shadow-xl rounded p-1.5 z-100 backdrop-blur-md">
                      <div className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase tracking-wider border-b border-slate-100 mb-1">
                        Pilih Base Layer
                      </div>
                      {TILE_PROVIDERS.map((tp) => (
                        <button
                          key={tp.id}
                          type="button"
                          onClick={() => {
                            setTileLayer(tp.id, customApiKey);
                            setShowLayerMenu(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 text-xs rounded flex items-center justify-between transition-colors ${
                            currentLayerId === tp.id
                              ? 'bg-amber-600 text-white font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{tp.name}</span>
                          {currentLayerId === tp.id && <Eye className="w-3 h-3" />}
                        </button>
                      ))}
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowLayerMenu(false);
                            setShowKeyModal(true);
                          }}
                          className="w-full text-left px-2 py-1 text-[11px] text-amber-700 hover:bg-amber-50 rounded flex items-center gap-1.5 font-medium"
                        >
                          <Key className="w-3 h-3 text-amber-600" />
                          <span>API Key / Kustom Layer</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`mapwrap ${hasLeaflet ? 'has-leaflet' : 'no-leaflet'}`}>
              <div
                id="peta"
                ref={mapContainerRef}
                aria-label="Peta wilayah operasi Kantor SAR Manado"
              />
              <canvas id="petaFallback" ref={fallbackCanvasRef} aria-hidden="true" />
              <span className={`maphint ${mapHintHidden ? 'gone' : ''}`} id="maphint">
                Klik peta untuk memperbesar & navigasi
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-slate-500 font-mono">
              <span id="mapnote" className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {mapNote}
              </span>
              <span className="text-[11px] text-slate-400">
                Leaflet v1.9.4 / 2.0 Architecture
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom API Key & Tile Layer Modal */}
      {showKeyModal && (
        <div
          className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() => setShowKeyModal(false)}
        >
          <div
            className="max-w-md w-full bg-white border border-slate-200 p-6 text-slate-900 relative shadow-2xl rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-4 text-2xl text-slate-400 hover:text-slate-700"
              onClick={() => setShowKeyModal(false)}
            >
              &times;
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Key className="w-5 h-5 text-amber-600" />
              <h4 className="text-xl font-bold font-['Big_Shoulders_Display'] uppercase text-amber-600">
                Konfigurasi Peta Leaflet & API Key
              </h4>
            </div>

            <p className="text-xs text-slate-600 mb-4 font-['Plus_Jakarta_Sans'] leading-relaxed">
              Peta Leaflet Wilayah Operasi SAR Sulut secara bawaan telah terkonfigurasi dengan <strong>OpenStreetMap Resmi</strong>, <strong>Citra Satelit Resolusi Tinggi Esri</strong>, <strong>Esri Light Canvas</strong>, dan <strong>Peta Oseanografi Maritim</strong> tanpa memerlukan API key tambahan.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 mb-1 font-semibold">
                API Key Map Provider (Opsional)
              </label>
              <input
                type="text"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="cth: YOUR_MAPTILER_OR_MAPBOX_KEY"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 font-mono focus:border-amber-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setTileLayer(currentLayerId, customApiKey);
                  setShowKeyModal(false);
                }}
                className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow-xs"
              >
                Terapkan Layer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

