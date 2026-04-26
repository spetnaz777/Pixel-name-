import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart, X, Plus, Minus, Menu, ChevronDown,
  Facebook, Twitter, Youtube, Instagram, Star, Heart, Gem, Pencil
} from 'lucide-react';
import { products, Product } from './data';

interface CartItem extends Product { quantity: number; }

// ─── Colored PIXLE MAN logo ───────────────────────────────────────────────────
const PIXLE_COLORS: [string, string][] = [
  ['P', '#FF9F1C'],
  ['I', '#00E5CC'],
  ['X', '#FF2D78'],
  ['L', '#C084FC'],
  ['E', '#38B2F5'],
];

const PixleLogo = ({ scale = 1 }: { scale?: number }) => {
  const base  = Math.round(14 * scale);
  const man   = Math.round(10 * scale);
  const sub   = Math.round(6  * scale);
  return (
    <div className="flex flex-col items-center leading-none select-none">
      <div className="flex items-end gap-px">
        {PIXLE_COLORS.map(([ch, col]) => (
          <span key={ch} className="font-display"
            style={{ fontSize: base, color: col, textShadow: '2px 2px 0 #000,-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000' }}>
            {ch}
          </span>
        ))}
      </div>
      <div className="font-display text-white"
        style={{ fontSize: man, textShadow: '2px 2px 0 #000,-1px -1px 0 #000' }}>
        MAN
      </div>
      <div className="font-display text-pm-gold tracking-[0.35em]"
        style={{ fontSize: sub, textShadow: '1px 1px 0 #000' }}>
        · CREATE ·
      </div>
    </div>
  );
};

// ─── Nav items matching the reference ────────────────────────────────────────
const NAV_ITEMS = [
  { icon: <Star  size={13} fill="currentColor"/>, label: 'EXPLORE',  color: '#FFD700', id: 'gallery'   },
  { icon: <Heart size={13} fill="currentColor"/>, label: 'INSPIRE',  color: '#FF2D78', id: 'about'     },
  { icon: <Gem   size={13} fill="currentColor"/>, label: 'IMAGINE',  color: '#00E5CC', id: 'community' },
  { icon: <Pencil size={13}/>,                    label: 'CREATE',   color: '#FF9F1C', id: 'shop'      },
];

// ─── Sparkle positions (fixed so they don't re-randomise on render) ───────────
const SPARKLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  top:  `${10 + ((i * 37 + 7)  % 78)}%`,
  left: `${5  + ((i * 53 + 11) % 90)}%`,
  dur:  2.8 + (i % 5) * 0.7,
  del:  (i * 0.4) % 5,
  sym:  ['✦','✧','✨','✴','⭐'][i % 5],
}));

export default function App() {
  const [cart,          setCart]          = useState<CartItem[]>([]);
  const [isCartOpen,    setIsCartOpen]    = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [shopFilter,    setShopFilter]    = useState<'All'|'Mugs'|'T-Shirts'|'Accessories'>('All');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const addToCart = (p: Product) =>
    setCart(prev => {
      const hit = prev.find(i => i.id === p.id);
      const next = hit
        ? prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...p, quantity: 1 }];
      setIsCartOpen(true);
      return next;
    });

  const updateQty     = (id: string, d: number) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + d) } : i));
  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const cartTotal      = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount      = cart.reduce((s, i) => s + i.quantity, 0);
  const filtered       = shopFilter === 'All' ? products : products.filter(p => p.category === shopFilter);

  const goto = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-pm-void text-pm-text overflow-x-hidden">
      <div className="scanline" />

      {/* ════════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════════ */}
      <nav className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
        scrolled ? 'bg-pm-void/96 backdrop-blur-md border-b border-pm-purple/40 py-2' : 'py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => goto('hero')}><PixleLogo scale={1} /></button>

          <div className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map(n => (
              <button key={n.label} onClick={() => goto(n.id)}
                className="font-display text-[9px] text-pm-muted hover:text-pm-text transition-colors flex items-center gap-1.5"
                style={{ '--c': n.color } as React.CSSProperties}
                onMouseEnter={e => (e.currentTarget.children[0] as HTMLElement).style.color = n.color}
                onMouseLeave={e => (e.currentTarget.children[0] as HTMLElement).style.color = ''}>
                <span style={{ color: n.color }}>{n.icon}</span>
                {n.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="w-5 h-5 text-pm-cyan" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pm-pink text-white font-display text-[7px] w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden text-pm-cyan" onClick={() => setMobileOpen(o => !o)}>
              <Menu size={20} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="md:hidden bg-pm-surface border-b border-pm-purple/30 px-6 py-5 flex flex-col gap-5">
              {NAV_ITEMS.map(n => (
                <button key={n.label} onClick={() => goto(n.id)}
                  className="font-display text-[9px] flex items-center gap-2.5 text-pm-text">
                  <span style={{ color: n.color }}>{n.icon}</span>{n.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Banner background */}
        <div className="absolute inset-0">
          <img
            src="https://storage.googleapis.com/static.rethink.software/yusefazmoon22/pixle_man_create_original_banner.png"
            className="w-full h-full object-cover object-center"
            alt="Pixle Man World"
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(13,11,30,0.78) 0%, rgba(13,11,30,0.25) 45%, rgba(13,11,30,0.55) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(13,11,30,1) 0%, rgba(13,11,30,0.4) 25%, transparent 60%, rgba(13,11,30,0.25) 100%)' }} />
        </div>

        {/* Left nav panel — matches reference image exactly */}
        <div className="absolute left-4 md:left-10 lg:left-14 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
          {NAV_ITEMS.map((n, i) => (
            <motion.button
              key={n.label}
              initial={{ x: -70, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.12, type: 'spring', stiffness: 90, damping: 15 }}
              onClick={() => goto(n.id)}
              className="flex items-center gap-3 border-2 px-4 py-2.5 font-display text-[8px] md:text-[9px] transition-all hover:-translate-y-0.5"
              style={{
                background: 'rgba(13,11,30,0.85)',
                borderColor: `${n.color}55`,
                boxShadow: `3px 3px 0 #000`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = n.color; e.currentTarget.style.boxShadow = `3px 3px 0 ${n.color}44, 0 0 12px ${n.color}33`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${n.color}55`; e.currentTarget.style.boxShadow = '3px 3px 0 #000'; }}
            >
              <span style={{ color: n.color }} className="flex-shrink-0">{n.icon}</span>
              <span className="text-pm-text tracking-[0.2em]">{n.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Centre: big logo block */}
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center px-4"
        >
          <div className="text-center"
            style={{
              background: 'rgba(13,11,30,0.68)',
              backdropFilter: 'blur(4px)',
              border: '4px solid rgba(13,11,30,0.6)',
              padding: 'clamp(24px, 4vw, 64px) clamp(28px, 6vw, 96px)',
              boxShadow: '8px 8px 0 #000, -2px -2px 0 rgba(255,255,255,0.04)',
            }}>

            {/* PIXLE */}
            <div className="flex items-end justify-center gap-1 sm:gap-2 md:gap-3">
              {PIXLE_COLORS.map(([ch, col], idx) => (
                <motion.span
                  key={ch}
                  className="font-display leading-none select-none"
                  style={{
                    fontSize: 'clamp(52px, 9vw, 112px)',
                    color: col,
                    textShadow: `5px 5px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000`,
                    filter: `drop-shadow(0 0 18px ${col}55)`,
                  }}
                  animate={{ y: [0, -7, 0] }}
                  transition={{ repeat: Infinity, duration: 2.6, delay: idx * 0.22, ease: 'easeInOut' }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>

            {/* MAN */}
            <div className="font-display text-white leading-none mt-1 select-none"
              style={{
                fontSize: 'clamp(32px, 5.5vw, 72px)',
                textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
              }}>
              MAN
            </div>

            {/* · CREATE · */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="h-px flex-1 max-w-[48px]" style={{ background: 'rgba(255,215,0,0.5)' }} />
              <span className="font-display text-pm-gold tracking-[0.45em] select-none"
                style={{ fontSize: 'clamp(10px, 1.5vw, 20px)', textShadow: '2px 2px 0 #000' }}>
                CREATE
              </span>
              <span className="h-px flex-1 max-w-[48px]" style={{ background: 'rgba(255,215,0,0.5)' }} />
            </div>
          </div>

          {/* CTA row */}
          <motion.div initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-4 mt-10">
            <button onClick={() => goto('gallery')}
              className="font-display text-[9px] sm:text-[10px] px-8 py-4 bg-pm-cyan text-black hover:scale-105 active:scale-95 transition-transform"
              style={{ boxShadow: '4px 4px 0 #007a88' }}>
              ⭐ EXPLORE WORLD
            </button>
            <button onClick={() => goto('shop')}
              className="font-display text-[9px] sm:text-[10px] px-8 py-4 bg-transparent text-pm-gold border-2 border-pm-gold hover:bg-pm-gold/10 transition-colors"
              style={{ boxShadow: '4px 4px 0 rgba(255,215,0,0.3)' }}>
              🛒 SHOP MERCH
            </button>
          </motion.div>
        </motion.div>

        {/* Floating sparkles */}
        {SPARKLES.map(s => (
          <motion.div key={s.id}
            className="absolute pointer-events-none select-none text-sm"
            style={{ top: s.top, left: s.left }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.1, 0.4] }}
            transition={{ repeat: Infinity, duration: s.dur, delay: s.del }}>
            {s.sym}
          </motion.div>
        ))}

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-pm-cyan/50"
          animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <span className="font-display text-[7px]">SCROLL</span>
          <ChevronDown size={14} />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          ABOUT / INSPIRE
      ════════════════════════════════════════════ */}
      <section id="about" className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 pixel-grid opacity-100" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(124,58,237,0.18) 0%, transparent 65%)' }} />

        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Character / circular badge */}
          <motion.div initial={{ x: -60, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }} className="flex justify-center">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-6 rounded-full opacity-30"
                style={{ background: 'radial-gradient(circle, #C084FC 0%, transparent 70%)' }} />

              {/* Circle with gradient border */}
              <div className="relative rounded-full overflow-hidden"
                style={{
                  width: 'clamp(260px, 35vw, 400px)',
                  height: 'clamp(260px, 35vw, 400px)',
                  border: '4px solid #C084FC',
                  boxShadow: '0 0 40px rgba(192,132,252,0.55), 0 0 80px rgba(192,132,252,0.2), inset 0 0 40px rgba(192,132,252,0.1)',
                }}>
                <img
                  src="https://storage.googleapis.com/static.rethink.software/yusefazmoon22/pixle_man_create_original_banner.png"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: '38% center', transform: 'scale(1.15)' }}
                  alt="Pixle Man Creator"
                />
                {/* Colour tint overlay */}
                <div className="absolute inset-0 rounded-full"
                  style={{ background: 'radial-gradient(circle at 30% 75%, rgba(255,45,120,0.18) 0%, transparent 60%)' }} />
              </div>

              {/* Floating pixel badges */}
              <motion.div
                className="absolute -top-3 -right-3 font-display text-[7px] bg-pm-gold text-black px-3 py-2"
                style={{ boxShadow: '3px 3px 0 #a07800' }}
                animate={{ rotate: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 3 }}>
                CREATOR
              </motion.div>
              <motion.div
                className="absolute -bottom-3 -left-3 font-display text-[7px] bg-pm-pink text-white px-3 py-2"
                style={{ boxShadow: '3px 3px 0 #8b1042' }}
                animate={{ rotate: [3, -3, 3] }} transition={{ repeat: Infinity, duration: 3.5 }}>
                PIXEL ARTIST
              </motion.div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div initial={{ x: 60, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }} className="space-y-7">
            <div>
              <span className="font-display text-[9px] tracking-widest" style={{ color: '#FF2D78' }}>
                💗 INSPIRE
              </span>
              <h2 className="text-4xl md:text-5xl mt-3 leading-tight">
                MEET THE<br />
                <span style={{ color: '#FF9F1C', textShadow: '3px 3px 0 #000' }}>CREATOR</span>
              </h2>
            </div>

            <div className="w-16 h-1 bg-pm-purple" />

            <p className="font-sans text-xl text-pm-muted leading-relaxed italic">
              Welcome to <span className="text-pm-text not-italic font-bold">Pixle Man</span> — a creative world where pixel art, imagination, and storytelling collide into something magical.
            </p>
            <p className="font-sans text-lg text-pm-muted leading-relaxed italic">
              Born from a love of retro games and fantastical worlds, Pixle Man brings original pixel art to life across merch, digital art, and a growing creative community.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { val: '100+', lbl: 'ARTWORKS',  col: '#00E5CC' },
                { val: '5K+',  lbl: 'COMMUNITY', col: '#FF2D78' },
                { val: '3YRS', lbl: 'CREATING',  col: '#FFD700' },
              ].map(s => (
                <div key={s.lbl} className="text-center border border-pm-surface bg-pm-surface/50 p-4">
                  <div className="font-display text-2xl" style={{ color: s.col }}>{s.val}</div>
                  <div className="font-display text-[7px] text-pm-muted mt-1.5">{s.lbl}</div>
                </div>
              ))}
            </div>

            <button onClick={() => goto('gallery')}
              className="font-display text-[10px] px-8 py-4 bg-pm-purple text-white hover:bg-pm-purple/80 transition-colors"
              style={{ boxShadow: '4px 4px 0 #3b1a8a' }}>
              VIEW GALLERY →
            </button>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          GALLERY / EXPLORE
      ════════════════════════════════════════════ */}
      <section id="gallery" className="relative py-28 md:py-36 bg-pm-surface overflow-hidden">
        <div className="absolute inset-0 pixel-grid-cyan" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-display text-[9px] tracking-widest text-pm-cyan">⭐ EXPLORE</span>
            <h2 className="text-4xl md:text-5xl mt-4">THE PIXEL WORLD</h2>
            <div className="h-1 w-24 bg-pm-cyan mx-auto mt-6" />
          </div>

          {/* Wide featured banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden mb-10 border-2 group cursor-pointer"
            style={{ height: 'clamp(220px, 35vw, 420px)', borderColor: 'rgba(124,58,237,0.4)' }}>
            <img
              src="https://storage.googleapis.com/static.rethink.software/yusefazmoon22/pixle_man_create_original_banner.png"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="The Chromatic Kingdom"
            />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(13,11,30,0.9) 0%, rgba(13,11,30,0.3) 40%, transparent 70%)' }} />
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
              <span className="bg-pm-cyan text-black font-display text-[8px] px-3 py-1.5">FEATURED</span>
              <h3 className="font-display text-xl md:text-3xl text-white mt-3"
                style={{ textShadow: '2px 2px 0 #000' }}>
                THE CHROMATIC KINGDOM
              </h3>
              <p className="text-pm-muted font-sans italic mt-2 text-sm md:text-base">
                A world where every pixel tells a story
              </p>
            </div>
          </motion.div>

          {/* Art grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[
              { title: 'Dragon Isle',      emoji: '🐉', bg: '#120824' },
              { title: 'Crystal Cave',     emoji: '💎', bg: '#071424' },
              { title: 'Pixel Village',    emoji: '🏡', bg: '#14140A' },
              { title: 'Sky Fortress',     emoji: '🏰', bg: '#071414' },
              { title: 'Ocean Depths',     emoji: '🌊', bg: '#070A24' },
              { title: 'Enchanted Forest', emoji: '🌳', bg: '#071410' },
              { title: 'Neon City',        emoji: '🌆', bg: '#140A1C' },
              { title: 'Time Rift',        emoji: '⚡', bg: '#141408' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -7, scale: 1.02 }}
                className="group cursor-pointer border border-pm-void/80 hover:border-pm-purple/60 transition-all overflow-hidden"
                style={{ background: item.bg }}>
                <div className="aspect-square flex items-center justify-center text-5xl sm:text-6xl
                                group-hover:scale-110 transition-transform duration-300 pixelated">
                  {item.emoji}
                </div>
                <div className="px-3 py-2.5 border-t"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <p className="font-display text-[7px] text-pm-muted group-hover:text-pm-cyan transition-colors truncate">
                    {item.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SHOP / CREATE
      ════════════════════════════════════════════ */}
      <section id="shop" className="relative py-28 md:py-36 bg-pm-void overflow-hidden">
        <div className="absolute inset-0 pixel-grid" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-display text-[9px] tracking-widest text-pm-orange">✏️ CREATE</span>
            <h2 className="text-4xl md:text-5xl mt-4">THE MERCH SHOP</h2>
            <p className="text-pm-muted font-sans italic text-xl mt-4">
              Wear your pixels. Live the legend.
            </p>
            <div className="h-1 w-24 mx-auto mt-6" style={{ background: '#FF9F1C' }} />
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-14">
            {(['All','Mugs','T-Shirts','Accessories'] as const).map(cat => {
              const active = shopFilter === cat;
              return (
                <button key={cat} onClick={() => setShopFilter(cat)}
                  className="font-display text-[9px] px-6 py-3 border-2 transition-all"
                  style={{
                    borderColor: active ? '#FFD700' : 'rgba(255,255,255,0.12)',
                    background:  active ? 'rgba(255,215,0,0.12)' : 'transparent',
                    color:       active ? '#FFD700' : '#9B8EC4',
                    boxShadow:   active ? '3px 3px 0 rgba(255,215,0,0.2)' : 'none',
                  }}>
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map(p => (
                <motion.div key={p.id} layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-pm-surface border border-pm-void hover:border-pm-purple/50 transition-all group flex flex-col">
                  <div className="aspect-square bg-pm-deep relative overflow-hidden">
                    <img src={p.image}
                      className="w-full h-full object-contain p-12 pixelated group-hover:scale-110 transition-transform duration-300"
                      alt={p.name} />
                    {p.isBestSeller && (
                      <span className="absolute top-3 left-3 bg-pm-gold text-black font-display text-[7px] px-2 py-1">
                        BEST SELLER
                      </span>
                    )}
                    {p.isNew && (
                      <span className="absolute top-3 right-3 bg-pm-pink text-white font-display text-[7px] px-2 py-1">
                        NEW DROP
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display text-[10px] text-pm-text mb-2 group-hover:text-pm-cyan transition-colors">
                      {p.name}
                    </h3>
                    <p className="font-sans text-sm text-pm-muted italic mb-6 leading-relaxed flex-1">
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between border border-pm-void/60 p-3 bg-pm-deep/50">
                      <span className="font-display text-lg text-pm-gold">{p.price}G</span>
                      <button onClick={() => addToCart(p)}
                        className="font-display text-[8px] px-5 py-2.5 bg-pm-purple text-white hover:bg-pm-purple/80 transition-colors"
                        style={{ boxShadow: '3px 3px 0 #3b1a8a' }}>
                        ADD TO BAG
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          COMMUNITY / IMAGINE
      ════════════════════════════════════════════ */}
      <section id="community" className="relative py-28 md:py-36 bg-pm-surface overflow-hidden">
        <div className="absolute inset-0"
          style={{
            backgroundSize: '32px 32px',
            backgroundImage: 'linear-gradient(to right, rgba(255,45,120,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,45,120,0.07) 1px, transparent 1px)',
          }} />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="font-display text-[9px] tracking-widest text-pm-cyan">💎 IMAGINE</span>
          <h2 className="text-4xl md:text-5xl mt-4">JOIN THE GUILD</h2>
          <p className="text-pm-muted font-sans italic text-xl mt-5 max-w-xl mx-auto">
            Connect with fellow pixel artists, share creations, and unlock exclusive content from the Chromatic Kingdom.
          </p>

          {/* Social cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-14">
            {[
              { Icon: Youtube,   label: 'YOUTUBE',   color: '#FF2020', sub: 'Videos & Tutorials' },
              { Icon: Instagram, label: 'INSTAGRAM', color: '#E1306C', sub: 'Art & Behind Scenes' },
              { Icon: Twitter,   label: 'TWITTER',   color: '#1DA1F2', sub: 'Updates & News' },
              { Icon: Facebook,  label: 'FACEBOOK',  color: '#1877F2', sub: 'Community Hub' },
            ].map(({ Icon, label, color, sub }) => (
              <motion.div key={label} whileHover={{ y: -7, scale: 1.03 }}
                className="bg-pm-void border-2 border-pm-void p-7 flex flex-col items-center gap-4 cursor-pointer transition-all"
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 20px ${color}33`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-pm-void)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <Icon size={30} style={{ color }} className="group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-display text-[8px] text-pm-text">{label}</p>
                  <p className="font-sans text-xs text-pm-muted mt-1 italic">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Newsletter box */}
          <div className="mt-16 bg-pm-void border-2 border-pm-purple/40 p-10 md:p-14 max-w-2xl mx-auto"
            style={{ boxShadow: '0 0 50px rgba(124,58,237,0.22)' }}>
            <h3 className="font-display text-xl md:text-2xl text-white mb-4">SCROLL OF NEWS</h3>
            <p className="text-pm-muted font-sans italic mb-8 text-base leading-relaxed">
              Subscribe for art drops, new merch launches, and<br />
              <span className="text-pm-gold">10 Gold Coins</span> off your first order.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pm-cyan font-display text-xs animate-pulse">&gt;</span>
                <input type="email" placeholder="Enter hero email..."
                  className="w-full bg-pm-surface border-2 border-pm-purple/40 p-4 pl-10 text-pm-text font-display text-[9px] outline-none focus:border-pm-cyan transition-colors" />
              </div>
              <button className="font-display text-[9px] px-8 py-4 bg-pm-gold text-black hover:scale-105 transition-transform whitespace-nowrap"
                style={{ boxShadow: '4px 4px 0 #a07800' }}>
                JOIN GUILD
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
      <footer className="bg-pm-deep border-t-4 border-pm-surface py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <PixleLogo scale={1.15} />
              <p className="font-sans text-pm-muted italic text-sm leading-relaxed mt-6">
                Premium pixel art & merch for<br />the digital generation.
              </p>
            </div>
            <div>
              <h4 className="font-display text-[8px] text-pm-cyan mb-6">NAVIGATE</h4>
              <ul className="space-y-3 font-display text-[9px] text-pm-muted">
                {NAV_ITEMS.map(n => (
                  <li key={n.label}>
                    <button onClick={() => goto(n.id)} className="hover:text-pm-cyan transition-colors flex items-center gap-2">
                      <span style={{ color: n.color }}>{n.icon}</span>{n.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-[8px] text-pm-pink mb-6">SOCIAL ORBS</h4>
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <button key={i}
                    className="w-10 h-10 border-2 border-pm-surface flex items-center justify-center hover:border-pm-pink hover:text-pm-pink transition-all">
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-pm-surface pt-8 text-center">
            <p className="font-display text-[7px] text-pm-muted tracking-widest">
              © 2025 PIXLE MAN · ALL PIXELS PROTECTED BY 8-BIT MAGIC
            </p>
          </div>
        </div>
      </footer>

      {/* ════════════════════════════════════════════
          CART DRAWER
      ════════════════════════════════════════════ */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]" />

            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-pm-surface z-[201] flex flex-col border-l-4 border-pm-purple">

              <div className="p-7 bg-pm-deep border-b-4 border-pm-purple flex justify-between items-center">
                <h2 className="font-display text-base text-pm-text">INVENTORY</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-pm-pink hover:rotate-90 transition-transform">
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-7 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 opacity-40 space-y-3">
                    <p className="font-display text-[10px]">Your inventory is empty.</p>
                    <p className="font-sans text-sm text-pm-muted italic">Go forth and collect loot!</p>
                  </div>
                ) : cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center bg-pm-deep border border-pm-surface p-4">
                    <div className="w-16 h-16 border-2 border-pm-purple p-1.5 bg-pm-void">
                      <img src={item.image} className="w-full h-full object-contain pixelated" alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-[9px] text-pm-text uppercase mb-1 truncate">{item.name}</h4>
                      <p className="text-pm-gold font-display text-xs">{item.price}G</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => updateQty(item.id, -1)}
                        className="w-6 h-6 border border-pm-muted flex items-center justify-center hover:border-pm-cyan transition-colors">
                        <Minus size={10} />
                      </button>
                      <span className="font-display text-xs w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, +1)}
                        className="w-6 h-6 border border-pm-muted flex items-center justify-center hover:border-pm-cyan transition-colors">
                        <Plus size={10} />
                      </button>
                      <button onClick={() => removeFromCart(item.id)} className="ml-1 text-pm-pink hover:scale-110 transition-transform">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-7 bg-pm-deep border-t-4 border-pm-purple space-y-5">
                <div className="flex justify-between items-center">
                  <span className="font-display text-[9px] text-pm-muted">TOTAL GOLD</span>
                  <span className="font-display text-3xl text-pm-gold">{cartTotal}G</span>
                </div>
                <button className="w-full font-display text-[10px] py-5 bg-pm-gold text-black hover:scale-[1.02] transition-transform"
                  style={{ boxShadow: '4px 4px 0 #a07800' }}>
                  CHECKOUT (QUEST START)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
