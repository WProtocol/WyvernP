import { X } from "lucide-react";
import { C } from "../../theme/colors";

export function WatchDemoModal({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        padding: 24,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          position: "relative",
          width: "min(1200px, 100%)",
          aspectRatio: "16 / 9",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(139,127,255,0.35), 0 0 0 1px rgba(139,127,255,0.25)",
          background: C.bg,
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 10,
            color: C.text,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
          }}
        >
          <X size={18} />
        </button>
        <video
          src="/wyvern-howto.mp4"
          autoPlay
          controls
          playsInline
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            background: C.bg,
          }}
        />
      </div>
    </div>
  );
}
