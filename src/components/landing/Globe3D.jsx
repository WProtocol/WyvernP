import { useEffect, useRef } from "react";

export function Globe3D() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let rot = 0, raf;
    const nodes = Array.from({ length: 48 }, (_, i) => {
      const phi = Math.acos(-1 + (2 * i) / 48);
      const theta = Math.sqrt(48 * Math.PI) * phi;
      return { lat: phi - Math.PI / 2, lon: theta % (Math.PI * 2), pulse: Math.random() * Math.PI * 2, size: Math.random() * 1.5 + 0.8 };
    });
    function proj(lat, lon, R, cx, cy, r) {
      const cl = Math.cos(lat), sl = Math.sin(lat), cl2 = Math.cos(lon + r), sl2 = Math.sin(lon + r);
      const x = R * cl * cl2, y = R * cl * sl2, z = R * sl;
      return { px: cx + x, py: cy - z * 0.9, visible: y > -R * 0.05, depth: y };
    }
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    function draw() {
      const W = canvas.width, H = canvas.height, cx = W * 0.5, cy = H * 0.5, R = Math.min(W, H) * 0.38, t = Date.now() / 1000;
      ctx.clearRect(0, 0, W, H);
      const atmo = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.4);
      atmo.addColorStop(0, "rgba(139,127,255,0.10)");
      atmo.addColorStop(0.6, "rgba(34,211,238,0.04)");
      atmo.addColorStop(1, "transparent");
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.4, 0, Math.PI * 2); ctx.fillStyle = atmo; ctx.fill();
      for (let lat = -80; lat <= 80; lat += 20) {
        const lr = lat * Math.PI / 180, r2 = R * Math.cos(lr), y2 = cy - R * Math.sin(lr) * 0.9;
        ctx.beginPath(); ctx.ellipse(cx, y2, r2, r2 * 0.12, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(139,127,255,0.10)"; ctx.lineWidth = 0.6; ctx.stroke();
      }
      for (let lon = 0; lon < Math.PI; lon += Math.PI / 9) {
        const a = lon + rot, c = Math.abs(Math.cos(a));
        ctx.beginPath(); ctx.ellipse(cx, cy, R * c, R * 0.9, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(139,127,255,${0.04 + 0.09 * c})`; ctx.lineWidth = 0.5; ctx.stroke();
      }
      const fill = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, 0, cx, cy, R);
      fill.addColorStop(0, "rgba(139,127,255,0.04)");
      fill.addColorStop(0.7, "rgba(34,211,238,0.02)");
      fill.addColorStop(1, "rgba(139,127,255,0.06)");
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.strokeStyle = "rgba(139,127,255,0.18)"; ctx.lineWidth = 1; ctx.stroke();
      const projected = nodes.map(n => ({ ...n, ...proj(n.lat, n.lon, R, cx, cy, rot) }));
      projected.forEach((n1, i) => {
        projected.slice(i + 1).forEach(n2 => {
          const dl = n1.lat - n2.lat, dl2 = n1.lon - n2.lon;
          if (Math.sqrt(dl * dl + dl2 * dl2) > 0.7 || !n1.visible || !n2.visible) return;
          ctx.beginPath(); ctx.moveTo(n1.px, n1.py); ctx.lineTo(n2.px, n2.py);
          ctx.strokeStyle = "rgba(34,211,238,0.07)"; ctx.lineWidth = 0.5; ctx.stroke();
        });
      });
      projected.filter(n => n.visible).forEach(n => {
        const alpha = 0.3 + 0.7 * Math.max(0, (n.depth + R) / (2 * R));
        const pulse = 0.6 + 0.4 * Math.sin(t * 2.2 + n.pulse), r = n.size * pulse;
        const glow = ctx.createRadialGradient(n.px, n.py, 0, n.px, n.py, r * 5);
        glow.addColorStop(0, `rgba(34,211,238,${alpha * 0.5})`); glow.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(n.px, n.py, r * 5, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill();
        ctx.beginPath(); ctx.arc(n.px, n.py, r, 0, Math.PI * 2); ctx.fillStyle = `rgba(34,211,238,${alpha})`; ctx.fill();
      });
      const ox = cx + R * 1.2 * Math.cos(rot * 1.5), oy = cy + R * 0.15 + R * 0.28 * Math.sin(rot * 1.5);
      ctx.beginPath(); ctx.ellipse(cx, cy + R * 0.15, R * 1.2, R * 0.28, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(139,127,255,0.08)"; ctx.lineWidth = 0.8; ctx.stroke();
      const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, 8);
      og.addColorStop(0, "rgba(139,127,255,0.9)"); og.addColorStop(1, "transparent");
      ctx.beginPath(); ctx.arc(ox, oy, 8, 0, Math.PI * 2); ctx.fillStyle = og; ctx.fill();
      ctx.beginPath(); ctx.arc(ox, oy, 3, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill();
      rot += 0.0035;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }}/>;
}
