import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart, X, Plus, Minus, Menu, ChevronDown,
  Facebook, Twitter, Youtube, Instagram, Star, Heart, Gem, Pencil,
  ArrowUp, Zap, Shield, Award, ExternalLink, ChevronRight,
} from 'lucide-react';
import { products, Product } from './data';

interface CartItem extends Product { quantity: number; }

/* ─────────────────────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────────────────────── */
const ScrollProgress = () => {
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
    <div
      className="fixed top-0 left-0 z-[9998] h-[3px] transition-all duration-75"
      style={{ width: `${pct}%`, background: 'linear-gradient(to right,#7C3AED,#FFD700,#FF2D78)', boxShadow: '0 0 10px rgba(255,215,0,0.6)' }}
    />
  );
};

/* ─────────────────────────────────────────────────────────────
   BACK TO TOP
───────────────────────────────────────────────────────────── */
const BackToTop = ({ show }: { show: boolean }) => (
  <AnimatePresence>
    {show && (
      <motion.button
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-[150] w-12 h-12 bg-pm-gold text-black font-display text-xs flex items-center justify-center"
        style={{ boxShadow: '4px 4px 0 #a07800' }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(255,215,0,0.6), 4px 4px 0 #a07800'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '4px 4px 0 #a07800'; e.currentTarget.style.filter = ''; }}
      >
        <ArrowUp size={18} />
      </motion.button>
    )}
  </AnimatePresence>
);

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────────── */
const Counter = ({ value, suffix = '', label, color }: { value: number; suffix?: string; label: string; color: string }) => {
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
    const dur = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, value]);

  return (
    <div ref={ref} className="text-center border border-pm-surface bg-pm-surface/60 p-5 bracket-hover transition-all duration-200 hover:border-pm-gold/40">
      <div className="font-display text-3xl mb-2" style={{ color }}>{count}{suffix}</div>
      <div className="font-display text-[7px] text-pm-muted tracking-widest">{label}</div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   GOLD BUTTON
───────────────────────────────────────────────────────────── */
const GoldBtn = ({ onClick, children, className = '', outline = false, size = 'md' }: {
  onClick?: () => void; children: React.ReactNode; className?: string; outline?: boolean; size?: 'sm' | 'md' | 'lg';
}) => {
  const pad = size === 'lg' ? 'px-12 py-5 text-sm' : size === 'sm' ? 'px-5 py-2.5 text-[9px]' : 'px-9 py-4 text-xs';
  return (
    <button onClick={onClick} className={`font-display transition-all duration-150 active:scale-95 ${pad} ${className}`}
      style={{
        background: outline ? 'transparent' : '#FFD700',
        color: outline ? '#FFD700' : '#000',
        border: outline ? '2px solid #FFD700' : 'none',
        boxShadow: '5px 5px 0 #a07800',
        letterSpacing: '0.1em',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.transform = 'scale(1.06) translate(-2px,-2px)';
        el.style.boxShadow = '7px 7px 0 #a07800, 0 0 28px rgba(255,215,0,0.5)';
        if (outline) el.style.background = 'rgba(255,215,0,0.12)';
        else el.style.filter = 'brightness(1.1)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.transform = '';
        el.style.boxShadow = '5px 5px 0 #a07800';
        el.style.background = outline ? 'transparent' : '#FFD700';
        el.style.filter = '';
      }}
    >{children}</button>
  );
};

/* ─────────────────────────────────────────────────────────────
   PIXEL DIVIDER
───────────────────────────────────────────────────────────── */
const PixelDivider = ({ color = '#FFD700' }: { color?: string }) => (
  <div className="flex items-center gap-2 justify-center py-2">
    {['◆','·','◆','·','◆'].map((s, i) => (
      <span key={i} className="font-display text-[8px]" style={{ color, opacity: i === 2 ? 1 : 0.4 }}>{s}</span>
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   PIXLE LOGO (text)
───────────────────────────────────────────────────────────── */
const PIXLE_COLORS: [string, string][] = [
  ['P','#FF9F1C'],['I','#00E5CC'],['X','#FF2D78'],['L','#C084FC'],['E','#38B2F5'],
];
const PixleLogo = ({ scale = 1 }: { scale?: number }) => {
  const base = Math.round(16 * scale), man = Math.round(11 * scale), sub = Math.round(7 * scale);
  return (
    <div className="flex flex-col items-center leading-none select-none">
      <div className="flex items-end gap-px">
        {PIXLE_COLORS.map(([ch, col]) => (
          <span key={ch} className="font-display" style={{ fontSize: base, color: col, textShadow: '2px 2px 0 #000,-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000' }}>{ch}</span>
        ))}
      </div>
      <div className="font-display text-white" style={{ fontSize: man, textShadow: '2px 2px 0 #000' }}>MAN</div>
      <div className="font-display text-pm-gold tracking-[0.35em]" style={{ fontSize: sub, textShadow: '1px 1px 0 #000' }}>· CREATE ·</div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MARQUEE TICKER
───────────────────────────────────────────────────────────── */
const TICKER_ITEMS = ['⭐ PIXEL PERFECTION','✦ HANDCRAFTED ART','💛 GOLD QUALITY MERCH','🎮 RETRO VIBES','✨ CHROMATIC KINGDOM','🐉 LEGENDARY DROPS','💎 LIMITED EDITIONS','🔥 NEW SEASON INCOMING','⚡ LEVEL UP YOUR STYLE','✦ MADE WITH HEART'];
const Ticker = () => (
  <div className="overflow-hidden border-y-4 border-black py-3" style={{ background: '#FFD700' }}>
    <div className="flex whitespace-nowrap animate-marquee gap-0">
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
        <span key={i} className="font-display text-[9px] text-black mx-8 shrink-0">{t}</span>
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   NAV CONFIG
───────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: <Star  size={14} fill="currentColor"/>, label: 'EXPLORE',  color: '#FFD700', id: 'gallery'    },
  { icon: <Heart size={14} fill="currentColor"/>, label: 'INSPIRE',  color: '#FF2D78', id: 'about'      },
  { icon: <Gem   size={14} fill="currentColor"/>, label: 'IMAGINE',  color: '#00E5CC', id: 'community'  },
  { icon: <Pencil size={14}/>,                    label: 'CREATE',   color: '#FF9F1C', id: 'shop'       },
];

/* ─────────────────────────────────────────────────────────────
   SPARKLES
───────────────────────────────────────────────────────────── */
const SPARKLES = Array.from({ length: 24 }, (_, i) => ({
  id: i, top: `${8 + ((i * 37 + 7) % 82)}%`, left: `${3 + ((i * 53 + 11) % 93)}%`,
  dur: 2.5 + (i % 6) * 0.6, del: (i * 0.35) % 5, sym: ['✦','✧','✨','✴','⭐','◆'][i % 6],
}));

/* ═══════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [cart,       setCart]       = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [showTop,    setShowTop]    = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopFilter, setShopFilter] = useState<'All'|'Mugs'|'T-Shirts'|'Accessories'>('All');
  const [openFaq,    setOpenFaq]    = useState<number|null>(null);

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 55); setShowTop(window.scrollY > 400); };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const addToCart = (p: Product) =>
    setCart(prev => {
      const hit = prev.find(i => i.id === p.id);
      setIsCartOpen(true);
      return hit ? prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { ...p, quantity: 1 }];
    });

  const updateQty      = (id: string, d: number) => setCart(p => p.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + d) } : i));
  const removeFromCart = (id: string) => setCart(p => p.filter(i => i.id !== id));
  const cartTotal      = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount      = cart.reduce((s, i) => s + i.quantity, 0);
  const filtered       = shopFilter === 'All' ? products : products.filter(p => p.category === shopFilter);

  const goto = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  }, []);

  const FAQS = [
    { q: 'Where are products made?', a: 'All Pixle Man merch is print-on-demand through our trusted production partners, shipped directly to you worldwide.' },
    { q: 'How do I place an order?', a: 'Click any "ADD TO BAG" button or visit our Etsy store. We handle payments securely through Etsy\'s checkout system.' },
    { q: 'Do you do custom art commissions?', a: 'Yes! DM us on Instagram or email via Etsy. Custom pixel portraits, character art, and merch designs are available.' },
    { q: 'How long does shipping take?', a: 'Standard shipping is 5–10 business days (US). International orders take 10–20 business days. Express options available at checkout.' },
    { q: 'Can I return or exchange an item?', a: 'Since items are made-to-order we can\'t accept general returns, but we always fix production errors. Reach out within 14 days of delivery.' },
  ];

  const TESTIMONIALS = [
    { name: 'DungeonBrush', tag: '@dungeonbrush', text: 'The dragon mug sits on my desk every single day. The pixel art detail is absolutely insane — you can see every pixel perfectly. Worth every coin.', stars: 5, color: '#00E5CC' },
    { name: 'NeonCrusader', tag: '@neoncrusader', text: 'Got the Glitch Guardian tee and it\'s genuinely my favourite shirt now. Print quality is premium, ships fast. Pixle Man never misses.', stars: 5, color: '#FF2D78' },
    { name: 'PixelSage', tag: '@pixelsage77', text: 'Been following the art for 2 years. Finally bought merch and it exceeded all expectations. The style is completely one of a kind.', stars: 5, color: '#FFD700' },
    { name: 'DragonPixel', tag: '@dragonpixel_', text: 'Ordered 4 items and every single one is perfect. The colours are vibrant, the quality is premium. Already planning my next order.', stars: 5, color: '#C084FC' },
  ];

  const PROCESS_STEPS = [
    { icon: '💡', title: 'CONCEPT', desc: 'Every piece starts with a world-building idea — a creature, a landscape, a legend.' },
    { icon: '🎨', title: 'PIXEL CRAFT', desc: 'Painted pixel by pixel using custom palettes, building depth and atmosphere by hand.' },
    { icon: '✨', title: 'BRING TO LIFE', desc: 'The artwork is animated, refined, and dropped into merch that carries the story.' },
  ];

  const GALLERY_ITEMS = [
    { title: 'Dragon Isle',       emoji: '🐉', bg: '#120824', col: '#FF2D78' },
    { title: 'Crystal Cave',      emoji: '💎', bg: '#071424', col: '#38B2F5' },
    { title: 'Pixel Village',     emoji: '🏡', bg: '#14140A', col: '#FF9F1C' },
    { title: 'Sky Fortress',      emoji: '🏰', bg: '#071414', col: '#00E5CC' },
    { title: 'Ocean Depths',      emoji: '🌊', bg: '#070A24', col: '#38B2F5' },
    { title: 'Enchanted Forest',  emoji: '🌳', bg: '#071410', col: '#00E5CC' },
    { title: 'Neon City',         emoji: '🌆', bg: '#140A1C', col: '#C084FC' },
    { title: 'Time Rift',         emoji: '⚡', bg: '#141408', col: '#FFD700' },
    { title: 'Lava Caverns',      emoji: '🌋', bg: '#1a0808', col: '#FF9F1C' },
    { title: 'Phantom Realm',     emoji: '👻', bg: '#0d0d1f', col: '#C084FC' },
    { title: 'Moon Garden',       emoji: '🌙', bg: '#080d1a', col: '#38B2F5' },
    { title: 'Pixel Colosseum',   emoji: '⚔️', bg: '#100814', col: '#FF2D78' },
  ];

  return (
    <div className="min-h-screen bg-pm-void text-pm-text overflow-x-hidden">
      <ScrollProgress />
      <div className="scanline" />
      <BackToTop show={showTop} />

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <nav className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
        scrolled
          ? 'bg-pm-void/98 backdrop-blur-md border-b-2 border-pm-gold/30 py-3'
          : 'bg-pm-void/80 backdrop-blur-sm py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">

          {/* Logo */}
          <button onClick={() => goto('hero')}
            onMouseEnter={e => { e.currentTarget.style.filter = 'drop-shadow(0 0 14px rgba(255,215,0,0.6))'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
            style={{ transition: 'filter 0.2s' }}>
            <PixleLogo scale={1.4} />
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map(n => (
              <button key={n.label} onClick={() => goto(n.id)}
                className="font-display text-sm text-pm-text flex items-center gap-2.5 relative group bracket-hover tracking-widest"
                style={{ transition: 'color 0.2s, text-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.color = n.color; el.style.textShadow = `0 0 16px ${n.color}cc`; el.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.color = ''; el.style.textShadow = ''; el.style.transform = ''; }}>
                <span style={{ color: n.color, display: 'flex' }}>{n.icon}</span>
                {n.label}
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-full" style={{ background: n.color }} />
              </button>
            ))}
          </div>

          {/* Right: cart + hamburger */}
          <div className="flex items-center gap-6">
            <button className="relative" onClick={() => setIsCartOpen(true)}
              onMouseEnter={e => { e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(255,215,0,0.8))'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
              style={{ transition: 'filter 0.2s' }}>
              <ShoppingCart className="w-7 h-7 text-pm-gold" />
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-2.5 -right-2.5 bg-pm-gold text-black font-display text-[8px] w-6 h-6 flex items-center justify-center gold-pulse">
                  {cartCount}
                </motion.span>
              )}
            </button>
            <button className="md:hidden text-pm-gold" onClick={() => setMobileOpen(o => !o)}
              onMouseEnter={e => { e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(255,215,0,0.7))'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
              style={{ transition: 'filter 0.2s' }}>
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="md:hidden bg-pm-void border-b-2 border-pm-gold/25 px-8 py-7 flex flex-col gap-7">
              {NAV_ITEMS.map(n => (
                <button key={n.label} onClick={() => goto(n.id)}
                  className="font-display text-sm flex items-center gap-4 text-pm-text tracking-widest"
                  onMouseEnter={e => { e.currentTarget.style.color = n.color; }}
                  onMouseLeave={e => { e.currentTarget.style.color = ''; }}
                  style={{ transition: 'color 0.2s' }}>
                  <span style={{ color: n.color }}>{n.icon}</span>{n.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══════════════════════════════════════
          HERO — full-screen video
      ══════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex items-end justify-center overflow-hidden bg-pm-void">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover object-center">
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,11,30,0.97) 0%, rgba(13,11,30,0.3) 30%, transparent 60%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,11,30,0.55) 0%, transparent 20%)' }} />
        </div>

        {/* Floating pixel badges */}
        <motion.div className="absolute top-28 left-6 md:left-16 z-10 float"
          initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}>
          <div className="font-display text-[8px] bg-pm-pink text-white px-4 py-2" style={{ boxShadow: '3px 3px 0 #8b1042' }}>🔥 NEW DROP</div>
        </motion.div>
        <motion.div className="absolute top-36 right-6 md:right-16 z-10 float-delayed"
          initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>
          <div className="font-display text-[8px] bg-pm-gold text-black px-4 py-2" style={{ boxShadow: '3px 3px 0 #a07800' }}>⭐ CREATOR</div>
        </motion.div>
        <motion.div className="absolute top-52 left-8 md:left-24 z-10 hidden md:block"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <div className="font-display text-[7px] border border-pm-cyan/40 text-pm-cyan px-3 py-1.5" style={{ background: 'rgba(0,229,204,0.08)' }}>💎 LIMITED</div>
        </motion.div>

        {/* Sparkles */}
        {SPARKLES.map(s => (
          <motion.div key={s.id} className="absolute pointer-events-none select-none"
            style={{ top: s.top, left: s.left, fontSize: '14px' }}
            animate={{ opacity: [0, 1, 0], scale: [0.3, 1.2, 0.3] }}
            transition={{ repeat: Infinity, duration: s.dur, delay: s.del }}>
            {s.sym}
          </motion.div>
        ))}

        {/* CTA */}
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16,1,0.3,1] }}
          className="relative z-10 flex flex-col items-center gap-6 pb-20 px-4 w-full">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="font-display text-[9px] text-pm-gold tracking-widest opacity-80">
            ◆ WELCOME TO THE CHROMATIC KINGDOM ◆
          </motion.p>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-5 justify-center w-full max-w-md">
            <GoldBtn onClick={() => goto('gallery')} size="lg" className="w-full sm:w-auto text-center">⭐ EXPLORE WORLD</GoldBtn>
            <GoldBtn onClick={() => goto('shop')} size="lg" outline className="w-full sm:w-auto text-center">🛒 SHOP MERCH</GoldBtn>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="flex gap-6 font-display text-[8px] text-pm-muted">
            <span className="flex items-center gap-1.5"><span style={{ color: '#FFD700' }}>★★★★★</span> 5.0 Rating</span>
            <span className="text-pm-surface">|</span>
            <span>5K+ Community</span>
            <span className="text-pm-surface">|</span>
            <span>100+ Artworks</span>
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
          style={{ color: 'rgba(255,215,0,0.6)' }}
          animate={{ y: [0,8,0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <span className="font-display text-[8px] tracking-widest">SCROLL</span>
          <ChevronDown size={16} />
        </motion.div>
      </section>

      {/* TICKER */}
      <Ticker />

      {/* ══════════════════════════════════════
          ABOUT / INSPIRE
      ══════════════════════════════════════ */}
      <section id="about" className="relative py-28 md:py-36 overflow-hidden about-parallax-bg">
        {/* Subtle overlay — keeps text readable while showing the space art */}
        <div className="absolute inset-0" style={{ background: 'rgba(13,11,30,0.58)' }} />

        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image badge */}
          <motion.div initial={{ x: -60, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-8 rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #C084FC 0%, transparent 70%)' }} />
              <div className="relative rounded-full overflow-hidden"
                style={{ width: 'clamp(260px,35vw,420px)', height: 'clamp(260px,35vw,420px)', border: '4px solid #C084FC', boxShadow: '0 0 50px rgba(192,132,252,0.5), 0 0 100px rgba(192,132,252,0.18)' }}>
                <img src="https://storage.googleapis.com/static.rethink.software/yusefazmoon22/pixle_man_create_original_banner.png"
                  className="w-full h-full object-cover" style={{ objectPosition: '38% center', transform: 'scale(1.15)' }} alt="Pixle Man Creator" />
                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 30% 75%, rgba(255,45,120,0.15) 0%, transparent 60%)' }} />
              </div>
              <motion.div className="absolute -top-4 -right-4 font-display text-[8px] bg-pm-gold text-black px-3 py-2"
                style={{ boxShadow: '3px 3px 0 #a07800' }} animate={{ rotate: [-4,4,-4] }} transition={{ repeat: Infinity, duration: 3 }}>CREATOR</motion.div>
              <motion.div className="absolute -bottom-4 -left-4 font-display text-[8px] bg-pm-pink text-white px-3 py-2"
                style={{ boxShadow: '3px 3px 0 #8b1042' }} animate={{ rotate: [3,-3,3] }} transition={{ repeat: Infinity, duration: 3.5 }}>PIXEL ARTIST</motion.div>
              <motion.div className="absolute top-1/2 -right-6 font-display text-[7px] bg-pm-cyan text-black px-2 py-1"
                style={{ boxShadow: '2px 2px 0 #007a88' }} animate={{ y: [-4,4,-4] }} transition={{ repeat: Infinity, duration: 4 }}>ORIGINAL</motion.div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div initial={{ x: 60, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="space-y-7">
            <div>
              <span className="font-display text-[10px] tracking-widest" style={{ color: '#FF2D78' }}>💗 INSPIRE</span>
              <h2 className="text-4xl md:text-5xl mt-4 leading-tight">
                MEET THE<br /><span className="shimmer-gold">CREATOR</span>
              </h2>
            </div>
            <div className="w-20 h-1 bg-pm-gold" />
            <p className="font-sans text-xl text-pm-muted leading-relaxed italic">
              Welcome to <span className="text-pm-text not-italic font-bold">Pixle Man</span> — a creative world where pixel art, imagination, and storytelling collide into something truly magical.
            </p>
            <p className="font-sans text-lg text-pm-muted leading-relaxed italic">
              Born from a love of retro games and fantastical worlds, every piece is crafted pixel by pixel — no filters, no shortcuts. Just raw creativity and obsessive detail.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <Counter value={100} suffix="+" label="ARTWORKS"  color="#00E5CC" />
              <Counter value={5000} suffix="+"  label="COMMUNITY" color="#FF2D78" />
              <Counter value={3}   suffix="YRS" label="CREATING"  color="#FFD700" />
            </div>
            <GoldBtn onClick={() => goto('gallery')}>VIEW GALLERY →</GoldBtn>
          </motion.div>
        </div>

        {/* Process strip */}
        <div className="relative max-w-7xl mx-auto px-6 mt-24">
          <PixelDivider />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {PROCESS_STEPS.map((s, i) => (
              <motion.div key={s.title} initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="bg-pm-surface/50 border border-pm-surface p-7 text-center bracket-hover transition-all duration-200 hover:border-pm-gold/40"
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(255,215,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; }}>
                <div className="text-4xl mb-4">{s.icon}</div>
                <div className="font-display text-[9px] text-pm-gold mb-3 tracking-wider">{`0${i+1}. ${s.title}`}</div>
                <p className="font-sans text-sm text-pm-muted italic leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          GALLERY / EXPLORE
      ══════════════════════════════════════ */}
      <section id="gallery" className="relative py-28 md:py-36 bg-pm-surface overflow-hidden">
        <div className="absolute inset-0 pixel-grid-cyan" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="font-display text-[10px] tracking-widest text-pm-gold">⭐ EXPLORE</span>
            <h2 className="text-4xl md:text-5xl mt-4">THE PIXEL WORLD</h2>
            <p className="font-sans text-lg text-pm-muted italic mt-4 max-w-lg mx-auto">Every artwork is a portal into the Chromatic Kingdom — explore the realms.</p>
            <div className="h-1 w-28 bg-pm-gold mx-auto mt-6" />
          </motion.div>

          {/* Featured wide banner */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden mb-10 border-2 group cursor-pointer transition-all duration-300"
            style={{ height: 'clamp(220px,35vw,440px)', borderColor: 'rgba(255,215,0,0.25)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.7)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(255,215,0,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.25)'; e.currentTarget.style.boxShadow = ''; }}>
            <img src="https://storage.googleapis.com/static.rethink.software/yusefazmoon22/pixle_man_create_original_banner.png"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="The Chromatic Kingdom" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,11,30,0.92) 0%, rgba(13,11,30,0.25) 45%, transparent 70%)' }} />
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
              <span className="bg-pm-gold text-black font-display text-[8px] px-3 py-1.5">✦ FEATURED</span>
              <h3 className="font-display text-xl md:text-3xl text-white mt-3" style={{ textShadow: '2px 2px 0 #000' }}>THE CHROMATIC KINGDOM</h3>
              <p className="text-pm-muted font-sans italic mt-2 text-sm md:text-base">A world where every pixel tells a legend</p>
            </div>
            <div className="absolute top-4 right-4 font-display text-[7px] bg-pm-pink text-white px-2 py-1" style={{ boxShadow: '2px 2px 0 #8b1042' }}>ORIGINAL</div>
          </motion.div>

          {/* 12-item grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {GALLERY_ITEMS.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, scale: 0.85, y: 20 }} whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: (i % 4) * 0.08 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group cursor-pointer border border-pm-void/80 transition-all duration-200 overflow-hidden bracket-hover"
                style={{ background: item.bg }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${item.col}66`; e.currentTarget.style.boxShadow = `0 0 20px ${item.col}22`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(13,11,30,0.8)'; e.currentTarget.style.boxShadow = ''; }}>
                <div className="aspect-square flex items-center justify-center text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-300">
                  {item.emoji}
                </div>
                <div className="px-3 py-2.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <p className="font-display text-[7px] text-pm-muted transition-colors truncate group-hover:text-pm-gold">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
            <GoldBtn onClick={() => goto('shop')}>🛒 BROWSE THE MERCH SHOP</GoldBtn>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SHOP — parallax fixed background
      ══════════════════════════════════════ */}
      <section id="shop" className="relative py-28 md:py-36 overflow-hidden shop-parallax-bg">
        {/* Subtle overlay — keep image visible but text readable */}
        <div className="absolute inset-0" style={{ background: 'rgba(13,11,30,0.58)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="text-center mb-6">
            <span className="font-display text-[10px] tracking-widest text-pm-gold">✏️ CREATE</span>
            <h2 className="text-4xl md:text-5xl mt-4">THE MERCH SHOP</h2>
            <p className="text-pm-muted font-sans italic text-xl mt-4">Wear your pixels. Live the legend.</p>
            <div className="h-1 w-28 mx-auto mt-5 bg-pm-gold" />
          </motion.div>

          {/* Etsy callout */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 mt-8 border border-pm-gold/30 bg-pm-gold/5 px-6 py-4 max-w-2xl mx-auto">
            <p className="font-display text-[8px] text-pm-gold text-center sm:text-left">🛍️ FIND ALL OUR PRODUCTS ON ETSY</p>
            <a href="https://www.etsy.com/shop/PixleManCreate" target="_blank" rel="noopener noreferrer"
              className="font-display text-[8px] px-5 py-2.5 bg-pm-gold text-black flex items-center gap-2 shrink-0 transition-all duration-150"
              style={{ boxShadow: '3px 3px 0 #a07800' }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.boxShadow = '3px 3px 0 #a07800, 0 0 16px rgba(255,215,0,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.boxShadow = '3px 3px 0 #a07800'; }}>
              VISIT ETSY STORE <ExternalLink size={10} />
            </a>
          </motion.div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-14">
            {(['All','Mugs','T-Shirts','Accessories'] as const).map(cat => {
              const active = shopFilter === cat;
              return (
                <button key={cat} onClick={() => setShopFilter(cat)}
                  className="font-display text-[10px] px-7 py-3 border-2 transition-all duration-200"
                  style={{
                    borderColor: active ? '#FFD700' : 'rgba(255,255,255,0.12)',
                    background:  active ? 'rgba(255,215,0,0.14)' : 'transparent',
                    color:       active ? '#FFD700' : '#9B8EC4',
                    boxShadow:   active ? '3px 3px 0 rgba(255,215,0,0.25), 0 0 16px rgba(255,215,0,0.18)' : 'none',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.color = '#FFD700'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#9B8EC4'; } }}>
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.div key={p.id} layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                  className="bg-pm-void/90 border border-pm-surface transition-all duration-200 group flex flex-col backdrop-blur-sm"
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.45)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(255,215,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-pm-surface)'; e.currentTarget.style.boxShadow = ''; }}>
                  <div className="aspect-square bg-pm-deep relative overflow-hidden">
                    <img src={p.image} className="w-full h-full object-contain p-12 pixelated group-hover:scale-110 transition-transform duration-300" alt={p.name} />
                    {p.isBestSeller && <span className="absolute top-3 left-3 bg-pm-gold text-black font-display text-[7px] px-2 py-1">⭐ BEST SELLER</span>}
                    {p.isNew && <span className="absolute top-3 right-3 bg-pm-pink text-white font-display text-[7px] px-2 py-1">✨ NEW DROP</span>}
                    <div className="absolute bottom-0 inset-x-0 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3"
                      style={{ background: 'linear-gradient(to top, rgba(13,11,30,0.9) 0%, transparent 100%)' }}>
                      <span className="font-display text-[7px] text-pm-gold tracking-widest">VIEW DETAILS</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display text-[10px] text-pm-text mb-2 group-hover:text-pm-gold transition-colors leading-relaxed">{p.name}</h3>
                    <p className="font-sans text-sm text-pm-muted italic mb-6 leading-relaxed flex-1">{p.description}</p>
                    <div className="flex items-center justify-between border border-pm-void/60 p-3 bg-pm-deep/60">
                      <span className="font-display text-xl text-pm-gold">{p.price}G</span>
                      <button onClick={() => addToCart(p)}
                        className="font-display text-[9px] px-5 py-2.5 bg-pm-gold text-black transition-all duration-150 active:scale-95"
                        style={{ boxShadow: '3px 3px 0 #a07800' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06) translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0 #a07800, 0 0 16px rgba(255,215,0,0.5)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 #a07800'; e.currentTarget.style.filter = ''; }}>
                        ADD TO BAG
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Why Pixle Man features */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Award size={28}/>, title: 'PREMIUM QUALITY', desc: 'Every item is printed on high-grade materials with vibrant, fade-resistant inks.', col: '#FFD700' },
              { icon: <Shield size={28}/>, title: 'SECURE CHECKOUT', desc: 'Shop confidently through Etsy\'s trusted, encrypted payment system.', col: '#00E5CC' },
              { icon: <Zap size={28}/>, title: 'FAST SHIPPING', desc: 'Made fresh and dispatched worldwide. Track your order every step of the way.', col: '#FF9F1C' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-4 border border-pm-surface/60 p-7 bg-pm-void/60 backdrop-blur-sm bracket-hover"
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${f.col}44`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ''; }}>
                <div style={{ color: f.col }}>{f.icon}</div>
                <div className="font-display text-[8px] text-pm-text">{f.title}</div>
                <p className="font-sans text-sm text-pm-muted italic leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 bg-pm-void overflow-hidden">
        <div className="absolute inset-0 pixel-grid" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(255,215,0,0.06) 0%, transparent 65%)' }} />

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="font-display text-[10px] tracking-widest text-pm-gold">💬 REVIEWS</span>
            <h2 className="text-4xl md:text-5xl mt-4">WHAT THE GUILD SAYS</h2>
            <div className="h-1 w-28 bg-pm-gold mx-auto mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-pm-surface border border-pm-surface p-6 flex flex-col gap-4 bracket-hover transition-all duration-200"
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${t.color}55`; e.currentTarget.style.boxShadow = `0 0 24px ${t.color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-pm-surface)'; e.currentTarget.style.boxShadow = ''; }}>
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={12} fill="#FFD700" style={{ color: '#FFD700' }} />
                  ))}
                </div>
                {/* Quote */}
                <p className="font-sans text-sm text-pm-muted italic leading-relaxed flex-1">"{t.text}"</p>
                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-pm-void">
                  <div className="w-9 h-9 flex items-center justify-center font-display text-[10px]"
                    style={{ background: `${t.color}22`, border: `2px solid ${t.color}66`, color: t.color }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-display text-[8px] text-pm-text">{t.name}</div>
                    <div className="font-display text-[6px] text-pm-muted mt-0.5">{t.tag}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section className="relative py-20 bg-pm-surface overflow-hidden">
        <div className="absolute inset-0 pixel-grid-cyan" />
        <div className="relative max-w-3xl mx-auto px-6">
          <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="font-display text-[10px] tracking-widest text-pm-cyan">❓ FAQ</span>
            <h2 className="text-3xl md:text-4xl mt-4">QUEST LOG</h2>
            <div className="h-1 w-20 bg-pm-cyan mx-auto mt-5" />
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="border border-pm-void bg-pm-void/70 overflow-hidden transition-all duration-200"
                style={openFaq === i ? { borderColor: 'rgba(255,215,0,0.4)' } : {}}>
                <button className="w-full flex items-center justify-between px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-display text-[9px] text-pm-text pr-4">{f.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 90 : 0 }} transition={{ duration: 0.2 }}
                    className="text-pm-gold shrink-0">
                    <ChevronRight size={16} />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      style={{ overflow: 'hidden' }}>
                      <p className="font-sans text-base text-pm-muted italic px-6 pb-5 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMMUNITY / IMAGINE
      ══════════════════════════════════════ */}
      <section id="community" className="relative py-28 md:py-36 bg-pm-void overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundSize:'32px 32px', backgroundImage:'linear-gradient(to right,rgba(255,215,0,0.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,215,0,0.05) 1px,transparent 1px)' }} />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
            <span className="font-display text-[10px] tracking-widest text-pm-gold">💎 IMAGINE</span>
            <h2 className="text-4xl md:text-5xl mt-4">JOIN THE GUILD</h2>
            <p className="text-pm-muted font-sans italic text-xl mt-5 max-w-xl mx-auto">
              Connect with fellow pixel artists, share creations, and unlock exclusive content from the Chromatic Kingdom.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-14">
            {[
              { Icon: Youtube,   label:'YOUTUBE',   color:'#FF2020', sub:'Videos & Tutorials' },
              { Icon: Instagram, label:'INSTAGRAM', color:'#E1306C', sub:'Art & Behind Scenes' },
              { Icon: Twitter,   label:'TWITTER',   color:'#1DA1F2', sub:'Updates & News' },
              { Icon: Facebook,  label:'FACEBOOK',  color:'#1877F2', sub:'Community Hub' },
            ].map(({ Icon, label, color, sub }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.04 }}
                className="bg-pm-surface border-2 border-pm-surface p-7 flex flex-col items-center gap-4 cursor-pointer transition-all duration-200"
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 24px ${color}40`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-pm-surface)'; e.currentTarget.style.boxShadow = ''; }}>
                <Icon size={32} style={{ color }} />
                <div>
                  <p className="font-display text-[9px] text-pm-text">{label}</p>
                  <p className="font-sans text-xs text-pm-muted mt-1 italic">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Newsletter */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-16 bg-pm-surface border-2 border-pm-gold/25 p-10 md:p-14 max-w-2xl mx-auto"
            style={{ boxShadow: '0 0 50px rgba(255,215,0,0.08)' }}>
            <div className="font-display text-[8px] text-pm-gold tracking-widest mb-3">📜 SCROLL OF NEWS</div>
            <h3 className="font-display text-xl md:text-2xl text-white mb-4">STAY IN THE LOOP</h3>
            <p className="text-pm-muted font-sans italic mb-8 text-base leading-relaxed">
              Art drops, new merch launches, and community events — plus
              <span className="text-pm-gold"> 10 Gold Coins</span> off your first order.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pm-gold font-display text-xs animate-pulse blink">&gt;</span>
                <input type="email" placeholder="Enter hero email..."
                  className="w-full bg-pm-void border-2 border-pm-gold/25 p-4 pl-10 text-pm-text font-display text-[9px] outline-none focus:border-pm-gold transition-colors" />
              </div>
              <button className="font-display text-[10px] px-8 py-4 bg-pm-gold text-black transition-all duration-150 active:scale-95 whitespace-nowrap"
                style={{ boxShadow: '4px 4px 0 #a07800' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05) translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #a07800, 0 0 22px rgba(255,215,0,0.5)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 #a07800'; e.currentTarget.style.filter = ''; }}>
                JOIN GUILD
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-pm-deep border-t-4 border-pm-gold/15 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <PixleLogo scale={1.15} />
              <p className="font-sans text-pm-muted italic text-sm leading-relaxed mt-6 max-w-xs">
                Premium pixel art & merch for the digital generation. Every item carries a piece of the Chromatic Kingdom.
              </p>
              <div className="flex gap-3 mt-6">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 border-2 border-pm-surface flex items-center justify-center transition-all duration-200"
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.color = '#FFD700'; e.currentTarget.style.boxShadow = '0 0 12px rgba(255,215,0,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; e.currentTarget.style.boxShadow = ''; }}>
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display text-[8px] text-pm-gold mb-6">NAVIGATE</h4>
              <ul className="space-y-3 font-display text-[9px] text-pm-muted">
                {NAV_ITEMS.map(n => (
                  <li key={n.label}>
                    <button onClick={() => goto(n.id)} className="flex items-center gap-2 transition-colors duration-200"
                      onMouseEnter={e => { e.currentTarget.style.color = '#FFD700'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = ''; }}>
                      <span style={{ color: n.color }}>{n.icon}</span>{n.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-[8px] text-pm-gold mb-6">THE KINGDOM</h4>
              <ul className="space-y-3 font-display text-[9px] text-pm-muted">
                {['Etsy Store','Commissions','Pixel Art Blog','Fan Art','Press Kit'].map(l => (
                  <li key={l}>
                    <a href="#" className="hover:text-pm-gold transition-colors duration-200 flex items-center gap-1.5">
                      <ChevronRight size={9} />
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <PixelDivider />
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-display text-[7px] text-pm-muted tracking-widest">© 2025 PIXLE MAN · ALL PIXELS PROTECTED BY 8-BIT MAGIC</p>
            <p className="font-display text-[7px] text-pm-muted">CRAFTED WITH 💛 + ☕</p>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          CART DRAWER
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]" />
            <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-pm-surface z-[201] flex flex-col border-l-4 border-pm-gold">
              <div className="p-7 bg-pm-deep border-b-4 border-pm-gold flex justify-between items-center">
                <div>
                  <h2 className="font-display text-base text-pm-gold">INVENTORY</h2>
                  {cartCount > 0 && <p className="font-display text-[7px] text-pm-muted mt-1">{cartCount} ITEM{cartCount !== 1 ? 'S' : ''} IN BAG</p>}
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-pm-pink hover:rotate-90 transition-transform"><X /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-7 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 opacity-40 space-y-3">
                    <div className="text-5xl">🎒</div>
                    <p className="font-display text-[10px]">Your inventory is empty.</p>
                    <p className="font-sans text-sm text-pm-muted italic">Go forth and collect loot!</p>
                  </div>
                ) : cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center bg-pm-deep border border-pm-surface p-4">
                    <div className="w-16 h-16 border-2 border-pm-gold/30 p-1.5 bg-pm-void shrink-0">
                      <img src={item.image} className="w-full h-full object-contain pixelated" alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-[9px] text-pm-text uppercase mb-1 truncate">{item.name}</h4>
                      <p className="text-pm-gold font-display text-xs">{item.price}G</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => updateQty(item.id,-1)} className="w-7 h-7 border border-pm-muted flex items-center justify-center hover:border-pm-gold hover:text-pm-gold transition-colors"><Minus size={10}/></button>
                      <span className="font-display text-xs w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id,+1)} className="w-7 h-7 border border-pm-muted flex items-center justify-center hover:border-pm-gold hover:text-pm-gold transition-colors"><Plus size={10}/></button>
                      <button onClick={() => removeFromCart(item.id)} className="ml-1 text-pm-pink hover:scale-110 transition-transform"><X size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-7 bg-pm-deep border-t-4 border-pm-gold space-y-5">
                <div className="flex justify-between items-center">
                  <span className="font-display text-[9px] text-pm-muted">TOTAL GOLD</span>
                  <span className="font-display text-3xl text-pm-gold">{cartTotal}G</span>
                </div>
                <a href="https://www.etsy.com/shop/PixleManCreate" target="_blank" rel="noopener noreferrer"
                  className="block w-full font-display text-[10px] py-5 bg-pm-gold text-black text-center transition-all duration-150"
                  style={{ boxShadow: '4px 4px 0 #a07800' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '6px 6px 0 #a07800, 0 0 24px rgba(255,215,0,0.45)'; e.currentTarget.style.filter = 'brightness(1.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '4px 4px 0 #a07800'; e.currentTarget.style.filter = ''; }}>
                  CHECKOUT ON ETSY ↗
                </a>
                <p className="font-display text-[6px] text-pm-muted text-center">SECURE CHECKOUT VIA ETSY</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
