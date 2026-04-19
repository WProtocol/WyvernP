import { useEffect, useRef } from "react";
import { C } from "../../theme/colors";

// Rotating 3D wireframe icosahedron, drawn in plain canvas (no three.js).
// Lives next to the CTA as a visual signature element.
export function Wireframe3D({ size = 360 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d");
    let raf;

    function resize() {
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // Icosahedron geometry
    const t = (1 + Math.sqrt(5)) / 2;
    const verts = [
      [-1,  t,  0], [1,  t,  0], [-1, -t,  0], [1, -t,  0],
      [0, -1,  t], [0,  1,  t], [0, -1, -t], [0,  1, -t],
      [ t,  0, -1], [t,  0,  1], [-t,  0, -1], [-t,  0,  1],
    ];
    const edges = [
      [0,1],[0,5],[0,7],[0,10],[0,11],
      [1,5],[1,7],[1,8],[1,9],
      [2,3],[2,4],[2,6],[2,10],[2,11],
      [3,4],[3,6],[3,8],[3,9],
      [4,5],[4,9],[4,11],
      [5,9],[5,11],
      [6,7],[6,8],[6,10],
      [7,8],[7,10],
      [8,9],
      [10,11],
    ];

    function rotateY(p, a) {
      const [x, y, z] = p; const c = Math.cos(a), s = Math.sin(a);
      return [c * x + s * z, y, -s * x + c * z];
    }
    function rotateX(p, a) {
      const [x, y, z] = p; const c = Math.cos(a), s = Math.sin(a);
      return [x, c * y - s * z, s * y + c * z];
    }

    function project(p, w, h) {
      const f = w * 0.32;
      const z = p[2] + 5;
      return [w / 2 + (p[0] * f) / z, h / 2 + (p[1] * f) / z, p[2]];
    }

    function frame() {
      const w = size, h = size;
      const t0 = performance.now() / 1000;
      ctx.clearRect(0, 0, w, h);

      // Soft glow behind
      const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * 0.55);
      grad.addColorStop(0, "rgba(139,127,255,0.18)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(w / 2, h / 2, w * 0.55, 0, Math.PI * 2); ctx.fill();

      // Project vertices
      const rotated = verts.map(v => {
        let p = rotateY(v, t0 * 0.32);
        p = rotateX(p, t0 * 0.18);
        return p;
      });
      const projected = rotated.map(p => project(p, w, h));

      // Edges with depth-based opacity
      edges.forEach(([a, b]) => {
        const pa = projected[a], pb = projected[b];
        const za = rotated[a][2], zb = rotated[b][2];
        const depth = (za + zb) / 2;
        const alpha = Math.max(0.12, Math.min(1, (depth + 2) / 4));
        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.strokeStyle = `rgba(139,127,255,${alpha * 0.85})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Vertex dots
      projected.forEach((p, i) => {
        const z = rotated[i][2];
        const alpha = Math.max(0.25, Math.min(1, (z + 2) / 4));
        const r = 2 + alpha * 2;
        ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${alpha})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(frame);
    }
    frame();
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return (
    <canvas
      ref={ref}
      style={{
        width: size,
        height: size,
        display: "block",
      }}
    />
  );
}
