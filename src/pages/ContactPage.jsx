import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Building2, Globe, CheckCircle2, Send, Crown } from "lucide-react";
import { SOCIALS } from "../config";

const C = {
  bg:"#02020c", bg2:"#07071a", surface:"rgba(255,255,255,0.03)",
  border:"rgba(255,255,255,0.07)", borderHi:"rgba(139,127,255,0.35)",
  violet:"#8b7fff", cyan:"#22d3ee", mint:"#10d9a0", rose:"#f43f5e",
  text:"#f0efff", muted:"rgba(240,239,255,0.55)", dim:"rgba(240,239,255,0.25)",
};

const REASONS = [
  "Tokenizing equities",
  "Tokenizing bonds / fixed income",
  "Tokenizing real estate / funds",
  "White-label deployment",
  "Compliance consultation",
  "Partnership / integration",
  "Other",
];

const SIZES = ["1–10", "11–50", "51–250", "250+"];

export default function ContactPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", company:"", size:"", reason:"", message:"" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState(null);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.reason) return;
    setSending(true);
    // mailto fallback — opens the user's mail client with everything pre-filled
    const body = `Name: ${form.name}
Company: ${form.company || "—"}
Team size: ${form.size || "—"}
Reason: ${form.reason}

${form.message}`;
    const mailto = `mailto:mrprada0007@gmail.com?subject=Wyvern Issuer Enquiry — ${encodeURIComponent(form.company || form.name)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    await new Promise(r => setTimeout(r, 800));
    setSending(false);
    setSent(true);
  }

  const inputStyle = (k) => ({
    width: "100%", boxSizing: "border-box",
    background: focused === k ? "rgba(139,127,255,0.06)" : C.surface,
    border: `1px solid ${focused === k ? C.violet : C.border}`,
    borderRadius: 10, padding: "12px 16px",
    fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.text,
    outline: "none", transition: "all .18s",
  });

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::placeholder{color:rgba(240,239,255,0.22);}
        select option{background:#08081a;color:#f0efff;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
        .fu{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) both;}
      `}</style>

      {/* nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: `1px solid ${C.border}`, background: "rgba(2,2,12,0.9)", backdropFilter: "blur(16px)", padding: "0 48px", height: 64, display: "flex", alignItems: "center", gap: 20 }}>
        <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, padding: 0, transition: "color .18s" }}
          onMouseEnter={e => e.currentTarget.style.color = C.text}
          onMouseLeave={e => e.currentTarget.style.color = C.muted}>
          <ArrowLeft size={14} /> Back to Wyvern
        </button>
        <div style={{ width: 1, height: 16, background: C.border }} />
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: C.text }}>Issuer Enquiry</span>
      </nav>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 64, alignItems: "start" }}>

          {/* left — context */}
          <div className="fu">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: C.cyan, border: "1px solid rgba(34,211,238,0.25)", borderRadius: 99, padding: "5px 14px", marginBottom: 28 }}>
              <Crown size={11} /> Issuer tier
            </div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(34px,3.8vw,52px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 20 }}>
              Tokenize your<br />
              <span style={{ background: `linear-gradient(90deg,${C.violet},${C.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                securities on-chain.
              </span>
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: C.muted, marginBottom: 40 }}>
              Tell us about your project and we'll reach out within one business day to discuss how Wyvern can power your issuance.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: Building2, title: "Equities & bonds", body: "Tokenize shares, convertible notes, or fixed-income instruments with built-in compliance." },
                { icon: Globe,     title: "Funds & real estate", body: "Fractional LP interests and property assets with programmable redemption windows." },
                { icon: Mail,      title: "Dedicated support", body: "A solutions engineer walks you through KYC, custody, and smart contract deployment." },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} style={{ display: "flex", gap: 14, padding: "18px 20px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(139,127,255,0.12)", border: "1px solid rgba(139,127,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} color={C.violet} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, color: C.muted }}>{body}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* right — form */}
          <div className="fu" style={{ animationDelay: "120ms" }}>
            {sent ? (
              <div style={{ padding: "60px 40px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,217,160,0.12)", border: "1px solid rgba(16,217,160,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <CheckCircle2 size={28} color={C.mint} />
                </div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 10 }}>Message sent</h2>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 28 }}>Your mail client should have opened with a pre-filled email. We'll get back to you within one business day.</p>
                <button onClick={() => navigate("/")} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, padding: "11px 28px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.violet},${C.cyan})`, color: "#fff", cursor: "pointer" }}>
                  Back to homepage
                </button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 4 }}>Get in touch</div>
                  <div style={{ fontSize: 13, color: C.muted }}>We respond within one business day.</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, marginBottom: 7 }}>Full name *</label>
                    <input required value={form.name} onChange={e => set("name", e.target.value)}
                      placeholder="Jane Smith"
                      onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                      style={inputStyle("name")} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, marginBottom: 7 }}>Email *</label>
                    <input required type="email" value={form.email} onChange={e => set("email", e.target.value)}
                      placeholder="jane@firm.com"
                      onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                      style={inputStyle("email")} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, marginBottom: 7 }}>Company</label>
                    <input value={form.company} onChange={e => set("company", e.target.value)}
                      placeholder="Acme Capital"
                      onFocus={() => setFocused("company")} onBlur={() => setFocused(null)}
                      style={inputStyle("company")} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, marginBottom: 7 }}>Team size</label>
                    <select value={form.size} onChange={e => set("size", e.target.value)}
                      onFocus={() => setFocused("size")} onBlur={() => setFocused(null)}
                      style={{ ...inputStyle("size"), appearance: "none" }}>
                      <option value="">Select…</option>
                      {SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, marginBottom: 7 }}>What are you looking to tokenize? *</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {REASONS.map(r => (
                      <button type="button" key={r} onClick={() => set("reason", r)}
                        style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, padding: "6px 14px", borderRadius: 99, border: `1px solid ${form.reason === r ? C.violet : C.border}`, background: form.reason === r ? "rgba(139,127,255,0.15)" : "transparent", color: form.reason === r ? C.violet : C.muted, cursor: "pointer", transition: "all .15s" }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, marginBottom: 7 }}>Tell us more</label>
                  <textarea value={form.message} onChange={e => set("message", e.target.value)}
                    placeholder="Asset type, size, timeline, regulatory jurisdiction…"
                    rows={4}
                    onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                    style={{ ...inputStyle("message"), resize: "vertical", minHeight: 100 }} />
                </div>

                <button type="submit" disabled={sending || !form.name || !form.email || !form.reason}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, padding: "14px", borderRadius: 11, border: "none", background: (sending || !form.name || !form.email || !form.reason) ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg,${C.violet},${C.cyan})`, color: (sending || !form.name || !form.email || !form.reason) ? C.dim : "#fff", cursor: (sending || !form.name || !form.email || !form.reason) ? "not-allowed" : "pointer", transition: "all .2s" }}>
                  <Send size={14} />
                  {sending ? "Opening mail client…" : "Send enquiry"}
                </button>

                <p style={{ fontSize: 11, color: C.dim, textAlign: "center", lineHeight: 1.6 }}>
                  By submitting you agree to be contacted by the Wyvern team. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
