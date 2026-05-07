import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

/* ── JS PARALLAX (iOS-safe) ── */
export function useParallax(speed = 0.28) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const section = el.parentElement as HTMLElement;
    if (!section) return;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const relPos = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.backgroundPositionY = `${Math.max(5, Math.min(95, 50 + relPos * speed * 100))}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [speed]);
  return ref;
}

/* ── 3D TILT (desktop only) ── */
export function useTilt(strength = 14) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover:none)').matches) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x*strength}deg) rotateX(${-y*strength}deg) scale3d(1.03,1.03,1.03)`;
    };
    const onLeave = () => { el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)'; };
    el.style.transition = 'transform 0.12s ease-out';
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [strength]);
  return ref;
}

/* ── SCROLL PROGRESS BAR ── */
export const ScrollProgress = ({ color = 'linear-gradient(to right,#7C3AED,#FFD700,#FF2D78)' }: { color?: string }) => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const d = document.documentElement;
      setPct((window.scrollY / (d.scrollHeight - d.clientHeight)) * 100);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div className="fixed top-0 left-0 z-[9998] h-[3px] transition-all duration-75"
      style={{ width: `${pct}%`, background: color, boxShadow: '0 0 10px rgba(255,215,0,0.6)' }} />
  );
};

/* ── BACK TO TOP ── */
export const BackToTop = ({ show, color = '#FFD700' }: { show: boolean; color?: string }) => (
  <AnimatePresence>
    {show && (
      <motion.button
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-[150] w-12 h-12 font-display text-xs flex items-center justify-center"
        style={{ background: color, color: '#000', boxShadow: '4px 4px 0 rgba(0,0,0,0.5)' }}
      >
        <ArrowUp size={18} />
      </motion.button>
    )}
  </AnimatePresence>
);

/* ── ANIMATED COUNTER ── */
export const Counter = ({ value, suffix = '', label, color }: { value: number; suffix?: string; label: string; color: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const dur = 1400, start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, value]);
  return (
    <div ref={ref} className="text-center border border-white/10 bg-white/5 p-5">
      <div className="font-display text-3xl mb-2" style={{ color }}>{count}{suffix}</div>
      <div className="font-display text-[7px] text-white/40 tracking-widest">{label}</div>
    </div>
  );
};

/* ── GOLD BUTTON ── */
export const GoldBtn = ({ onClick, children, className = '', outline = false, size = 'md', color = '#FFD700', shadowColor = '#a07800' }: {
  onClick?: () => void; children: React.ReactNode; className?: string;
  outline?: boolean; size?: 'sm'|'md'|'lg'; color?: string; shadowColor?: string;
}) => {
  const pad = size === 'lg' ? 'px-12 py-5 text-sm' : size === 'sm' ? 'px-5 py-2.5 text-[9px]' : 'px-9 py-4 text-xs';
  return (
    <button onClick={onClick} className={`font-display transition-all duration-150 active:scale-95 ${pad} ${className}`}
      style={{
        background: outline ? 'transparent' : color,
        color: outline ? color : '#000',
        border: outline ? `2px solid ${color}` : 'none',
        boxShadow: `5px 5px 0 ${shadowColor}`,
        letterSpacing: '0.1em',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.transform = 'scale(1.06) translate(-2px,-2px)';
        el.style.boxShadow = `7px 7px 0 ${shadowColor}, 0 0 28px ${color}80`;
        if (outline) el.style.background = `${color}22`;
        else el.style.filter = 'brightness(1.1)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.transform = '';
        el.style.boxShadow = `5px 5px 0 ${shadowColor}`;
        el.style.background = outline ? 'transparent' : color;
        el.style.filter = '';
      }}
    >{children}</button>
  );
};

/* ── PIXLE LOGO ── */
const PIXLE_COLORS: [string,string][] = [
  ['P','#FF9F1C'],['I','#00E5CC'],['X','#FF2D78'],['L','#C084FC'],['E','#38B2F5'],
];
export const PixleLogo = ({ scale = 1 }: { scale?: number }) => {
  const base = Math.round(16 * scale), man = Math.round(11 * scale), sub = Math.round(7 * scale);
  return (
    <div className="flex flex-col items-center leading-none select-none">
      <div className="flex items-end gap-px">
        {PIXLE_COLORS.map(([ch, col]) => (
          <span key={ch} className="font-display" style={{ fontSize: base, color: col, textShadow: '2px 2px 0 #000,-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000' }}>{ch}</span>
        ))}
      </div>
      <div className="font-display text-white" style={{ fontSize: man, textShadow: '2px 2px 0 #000' }}>MAN</div>
      <div className="font-display text-yellow-400 tracking-[0.35em]" style={{ fontSize: sub }}>· CREATE ·</div>
    </div>
  );
};

/* ── PIXEL DIVIDER ── */
export const PixelDivider = ({ color = '#FFD700' }: { color?: string }) => (
  <div className="flex items-center gap-2 justify-center py-2">
    {['◆','·','◆','·','◆'].map((s, i) => (
      <span key={i} className="font-display text-[8px]" style={{ color, opacity: i === 2 ? 1 : 0.4 }}>{s}</span>
    ))}
  </div>
);

/* ── NEON DIVIDER ── */
export const NeonDivider = ({ colors = '#FFD700,#FF2D78,#00E5CC' }: { colors?: string }) => (
  <motion.div
    initial={{ scaleX: 0, opacity: 0 }}
    whileInView={{ scaleX: 1, opacity: 1 }}
    viewport={{ once: true, margin: '-20px' }}
    transition={{ duration: 1.1, ease: [0.16,1,0.3,1] }}
    className="w-full h-[3px]"
    style={{ background: `linear-gradient(to right,transparent,${colors},transparent)`, boxShadow: `0 0 18px ${colors.split(',')[0]}88`, transformOrigin:'left' }}
  />
);

/* ── TICKER ── */
const TICKER_ITEMS = ['⭐ PIXEL PERFECTION','✦ HANDCRAFTED ART','💛 GOLD QUALITY MERCH','🎮 RETRO VIBES','✨ CHROMATIC KINGDOM','🐉 LEGENDARY DROPS','💎 LIMITED EDITIONS','🔥 NEW SEASON INCOMING','⚡ LEVEL UP YOUR STYLE','✦ MADE WITH HEART'];
export const Ticker = ({ bg = '#FFD700', textColor = '#000' }: { bg?: string; textColor?: string }) => (
  <div className="overflow-hidden border-y-4 border-black py-3" style={{ background: bg }}>
    <div className="flex whitespace-nowrap animate-marquee gap-0">
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
        <span key={i} className="font-display text-[9px] mx-8 shrink-0" style={{ color: textColor }}>{t}</span>
      ))}
    </div>
  </div>
);
