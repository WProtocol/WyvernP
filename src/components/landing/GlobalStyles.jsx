import { C } from "../../theme/colors";

export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@300;400;500&display=swap');
      html{scroll-behavior:smooth;}
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:${C.bg};}::-webkit-scrollbar-thumb{background:rgba(139,127,255,.35);border-radius:2px;}
      .gradient-text{background:linear-gradient(135deg,${C.violet} 0%,${C.cyan} 60%,${C.mint} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
      .glass-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(12px);}
      .glass-card:hover{border-color:rgba(139,127,255,0.25);background:rgba(139,127,255,0.05);}
      .btn-gradient{background:linear-gradient(135deg,${C.violet} 0%,#5b52ff 50%,${C.cyan} 100%);color:#fff;transition:opacity .2s,transform .2s,box-shadow .2s;box-shadow:0 0 0 rgba(139,127,255,0);}
      .btn-gradient:hover{opacity:.92;transform:translateY(-2px);box-shadow:0 8px 32px rgba(139,127,255,0.35);}
      .grid-bg{background-image:linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px);background-size:48px 48px;}
      .orb{position:absolute;border-radius:50%;filter:blur(120px);animation:orb-float 20s ease-in-out infinite;}
      .orb-1{width:600px;height:600px;top:-200px;left:-100px;background:rgba(139,127,255,0.08);animation-duration:22s;}
      .orb-2{width:500px;height:500px;top:30%;right:-150px;background:rgba(34,211,238,0.06);animation-duration:18s;animation-delay:-6s;}
      .orb-3{width:400px;height:400px;bottom:10%;left:30%;background:rgba(16,217,160,0.05);animation-duration:25s;animation-delay:-12s;}
      @keyframes orb-float{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(40px,-30px) scale(1.05);}66%{transform:translate(-20px,20px) scale(0.96);}}
      @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-33.333%)}}
      .ticker-track{display:flex;white-space:nowrap;animation:ticker 40s linear infinite;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
      .fade-up{animation:fadeUp .8s cubic-bezier(.16,1,.3,1) both;}
      .fade-in-stagger{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) both;}
      @keyframes pulse-dot{0%,100%{box-shadow:0 0 0 0 rgba(16,217,160,0.5);}50%{box-shadow:0 0 0 5px rgba(16,217,160,0);}}
      @keyframes float{0%,100%{transform:translateY(0px);}50%{transform:translateY(-10px);}}
      .float-card{animation:float 4s ease-in-out infinite;}
      .step-cell:hover{background:rgba(139,127,255,0.06)!important;}
    `}</style>
  );
}
