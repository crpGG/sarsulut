import React, { useEffect, useRef } from 'react';

export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let angle = -Math.PI / 4;
    let blips: { a: number; r: number; s: number }[] = [];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      return dpr;
    };

    let dpr = sizeCanvas();

    for (let i = 0; i < 16; i++) {
      blips.push({
        a: Math.random() * Math.PI * 2,
        r: 0.18 + Math.random() * 0.78,
        s: 0.6 + Math.random() * 0.7
      });
    }

    const drawRadar = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.72;
      const cy = h * 0.44;
      const R = Math.max(w, h) * 0.62;

      ctx.clearRect(0, 0, w, h);
      ctx.save();

      // Grid
      ctx.strokeStyle = "rgba(15, 23, 42, 0.05)";
      ctx.lineWidth = 1 * dpr;
      const step = 46 * dpr;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Rings
      ctx.strokeStyle = "rgba(234, 88, 12, 0.20)";
      for (let k = 1; k <= 5; k++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (R * k) / 5, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(cx - R, cy);
      ctx.lineTo(cx + R, cy);
      ctx.moveTo(cx, cy - R);
      ctx.lineTo(cx, cy + R);
      ctx.stroke();

      // Sweep gradient
      if (ctx.createConicGradient) {
        const g = ctx.createConicGradient(angle, cx, cy);
        g.addColorStop(0, "rgba(234, 88, 12, 0.25)");
        g.addColorStop(0.10, "rgba(234, 88, 12, 0.02)");
        g.addColorStop(1, "rgba(234, 88, 12, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = "rgba(234, 88, 12, 0.70)";
      ctx.lineWidth = 1.6 * dpr;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
      ctx.stroke();

      // Blips glow
      blips.forEach((b) => {
        const d = ((angle - b.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const glow = Math.max(0, 1 - d / 0.9);
        if (glow <= 0.02) return;
        const px = cx + Math.cos(b.a) * R * b.r;
        const py = cy + Math.sin(b.a) * R * b.r;
        ctx.fillStyle = `rgba(234, 88, 12, ${glow * 0.95})`;
        ctx.beginPath();
        ctx.arc(px, py, (2.4 + glow * 2.6) * dpr, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      if (!reduceMotion) {
        angle += 0.0075;
        rafId = requestAnimationFrame(drawRadar);
      }
    };

    const handleResize = () => {
      dpr = sizeCanvas();
      if (reduceMotion) {
        drawRadar();
      }
    };

    window.addEventListener('resize', handleResize);
    drawRadar();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="hero" id="atas">
      <canvas id="radar" ref={canvasRef} aria-hidden="true" />
      <div className="hero-in">
        <div className="hero-tag">
          <span>Badan Nasional Pencarian dan Pertolongan</span>
          <span>Provinsi Sulawesi Utara</span>
          <span>Status siaga <b>24 / 7</b></span>
        </div>
        <h1 className="h-xl">
          <span className="ln"><i>Setiap</i></span>
          <span className="ln"><i className="hollow">detik</i></span>
          <span className="ln"><i>adalah <em>nyawa</em></i></span>
        </h1>
        <div className="hero-foot">
          <p>
            Kantor Pencarian dan Pertolongan Manado menjaga wilayah tanggung jawab seluas ±800.000 km² — dari perbatasan Filipina dan Samudra Pasifik di utara hingga gunung, danau, dan laut Sulawesi Utara.
          </p>
          <a href="#wilayah" className="scrollcue hover:text-amber-400 transition-colors">
            <i></i>
            <span>Gulir</span>
          </a>
        </div>
      </div>
    </section>
  );
};
