import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { useRealm } from '../context/RealmContext';
import { useCart } from '../context/CartContext';
import { products } from '../data';
import { ScrollProgress, BackToTop, NeonDivider, GoldBtn } from '../components/shared';

const CYAN = '#00E5FF', PINK = '#FF2D78', MATRIX = '#00FF41';
type Filter = 'All'|'Mugs'|'T-Shirts'|'Accessories';

const GLITCH_LINES = Array.from({length:8},(_,i)=>({
  top:`${10+i*11}%`, dur:0.08+Math.random()*0.12, del:Math.random()*5, w:`${20+Math.random()*60}%`, left:`${Math.random()*40}%`
}));

export default function NeonAbyss() {
  const { navigateToRealm } = useRealm();
  const { addToCart } = useCart();
  const [filter, setFilter] = useState<Filter>('All');
  const [showTop, setShowTop] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Random glitch flash
  useEffect(() => {
    const tick = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
      setTimeout(tick, 4000 + Math.random()*6000);
    };
    const t = setTimeout(tick, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background:'#000814', color:'#E0F0FF' }}>
      <ScrollProgress color={`linear-gradient(to right,${CYAN},${PINK},${CYAN})`} />
      <BackToTop show={showTop} color={CYAN} />

      {/* Glitch overlay */}
      {glitchActive && (
        <div className="fixed inset-0 z-[9990] pointer-events-none">
          {GLITCH_LINES.map((g,i) => (
            <motion.div key={i} className="absolute h-[2px] opacity-70"
              style={{ top:g.top, left:g.left, width:g.w, background:`${i%2===0?CYAN:PINK}` }}
              initial={{scaleX:0}} animate={{scaleX:1}} exit={{scaleX:0}}
              transition={{duration:0.06}} />
          ))}
        </div>
      )}

      {/* Realm Nav */}
      <div className="fixed top-4 left-4 z-[100]">
        <button onClick={() => navigateToRealm('/','#7C3AED','','THE NEXUS')}
          className="font-display text-[8px] px-4 py-2 flex items-center gap-2"
          style={{ background:`rgba(0,229,255,0.1)`, border:`1px solid ${CYAN}55`, color:CYAN }}>
          ← THE NEXUS
        </button>
      </div>

      {/* HERO */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
        {/* Cyber grid floor */}
        <div className="absolute inset-0" style={{ backgroundImage:'url(/bg-neon-abyss.png)', backgroundSize:'cover', backgroundPosition:'center' }} />
        <div className="absolute inset-0" style={{ background:'rgba(0,8,20,0.78)' }} />
        <div className="absolute inset-0" style={{ backgroundSize:'60px 60px', backgroundImage:`linear-gradient(to right,${CYAN}12 1px,transparent 1px),linear-gradient(to bottom,${CYAN}12 1px,transparent 1px)` }} />
        {/* Radial spotlight */}
        <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse at 50% 50%,${CYAN}18 0%,transparent 70%)` }} />
        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:'repeating-linear-gradient(transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)', zIndex:1 }} />
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background:`linear-gradient(to right,transparent,${CYAN},${PINK},transparent)`, boxShadow:`0 0 20px ${CYAN}` }} />

        {/* Floating fragments */}
        {['◈','◆','▲','◉','▸','◀'].map((s,i)=>(
          <motion.div key={i} className="absolute font-display text-xl pointer-events-none select-none"
            style={{ left:`${5+i*16}%`, top:`${10+i*12}%`, color:i%2===0?CYAN:PINK, opacity:0.3 }}
            animate={{ y:[-15,15,-15], rotate:[-10,10,-10] }}
            transition={{ repeat:Infinity, duration:3+i, delay:i*0.7 }}>{s}</motion.div>
        ))}

        <motion.div initial={{y:80,opacity:0,rotateX:30}} animate={{y:0,opacity:1,rotateX:0}} transition={{duration:1.2,ease:[0.16,1,0.3,1]}}
          className="text-center relative z-10 px-6">
          <motion.div className="font-display text-[9px] tracking-[0.5em] mb-4"
            style={{ color:`${CYAN}aa` }} animate={{ opacity:[0.5,1,0.5] }} transition={{ repeat:Infinity, duration:2 }}>
            ◆ REALM 03 ◆
          </motion.div>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-white leading-tight mb-4"
            style={{ textShadow:`0 0 40px ${CYAN}88, 0 0 80px ${CYAN}44` }}>
            THE NEON<br/><span style={{ color:CYAN, textShadow:`0 0 40px ${CYAN},0 0 80px ${CYAN}` }}>ABYSS</span>
          </h1>
          <p className="font-display text-[10px] tracking-widest mb-4" style={{ color:`${PINK}aa` }}>
            // CYBERPUNK_MERCH.EXE — LOADING...
          </p>
          <p className="font-sans text-xl text-white/40 italic max-w-md mx-auto mb-10">
            Digital artifacts. Holographic merch. Pixel gear that bends reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GoldBtn size="lg" color={CYAN} shadowColor="#006677" onClick={() => document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}>
              ⚡ BROWSE THE ABYSS
            </GoldBtn>
            <a href="https://www.etsy.com/shop/PixleManCreate" target="_blank" rel="noopener noreferrer">
              <GoldBtn size="lg" outline color={PINK} shadowColor="#8B0040">
                🛍️ ETSY STORE ↗
              </GoldBtn>
            </a>
          </div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-display text-[8px] tracking-widest flex flex-col items-center gap-2"
          style={{ color:`${CYAN}66` }} animate={{y:[0,8,0]}} transition={{repeat:Infinity,duration:1.8}}>
          <span>JACK IN</span><span>↓</span>
        </motion.div>
      </section>

      <NeonDivider colors={`${CYAN},${PINK},${CYAN}`} />

      {/* SHOP */}
      <section id="shop" className="py-24 px-4 sm:px-8" style={{ background:'#000814' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{y:40,opacity:0,rotateX:18}} whileInView={{y:0,opacity:1,rotateX:0}} viewport={{once:true}} transition={{duration:0.9}}
            className="text-center mb-10" style={{perspective:800}}>
            <span className="font-display text-[10px] tracking-widest" style={{ color:CYAN }}>// INVENTORY.DAT</span>
            <h2 className="font-display text-3xl sm:text-4xl text-white mt-4">DIGITAL ARTIFACTS</h2>
            <p className="font-sans text-lg italic mt-4 max-w-lg mx-auto" style={{ color:`${CYAN}66` }}>Materialized from the digital void. Wear the code.</p>
            <NeonDivider colors={`${CYAN},${PINK},${CYAN}`} />
          </motion.div>

          {/* Etsy banner */}
          <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 border px-6 py-4 max-w-2xl mx-auto"
            style={{ borderColor:`${CYAN}33`, background:`${CYAN}08` }}>
            <p className="font-display text-[8px] text-center" style={{ color:CYAN }}>⚡ ALL ARTIFACTS AVAILABLE ON ETSY</p>
            <a href="https://www.etsy.com/shop/PixleManCreate" target="_blank" rel="noopener noreferrer"
              className="font-display text-[8px] px-5 py-2.5 flex items-center gap-2 shrink-0 transition-all duration-150"
              style={{ background:CYAN, color:'#000', boxShadow:`3px 3px 0 #006677` }}
              onMouseEnter={e=>{ e.currentTarget.style.boxShadow=`3px 3px 0 #006677,0 0 16px ${CYAN}99`; }}
              onMouseLeave={e=>{ e.currentTarget.style.boxShadow=`3px 3px 0 #006677`; }}>
              VISIT ETSY <ExternalLink size={10}/>
            </a>
          </motion.div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {(['All','Mugs','T-Shirts','Accessories'] as Filter[]).map(cat => {
              const active = filter === cat;
              return (
                <button key={cat} onClick={() => setFilter(cat)}
                  className="font-display text-[10px] px-7 py-3 border-2 transition-all duration-200"
                  style={{ borderColor:active?CYAN:'rgba(255,255,255,0.12)', background:active?`${CYAN}1a`:'transparent',
                    color:active?CYAN:'#9B8EC4', boxShadow:active?`3px 3px 0 ${CYAN}44`:'' }}>
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" style={{perspective:1200}}>
            <AnimatePresence mode="popLayout">
              {filtered.map((p,i) => (
                <motion.div key={p.id} layout
                  initial={{opacity:0,scale:0.88,y:40,rotateX:20}} animate={{opacity:1,scale:1,y:0,rotateX:0}}
                  exit={{opacity:0,scale:0.88}} transition={{delay:i*0.06,duration:0.75,ease:[0.16,1,0.3,1]}}
                  whileHover={{y:-12,rotateX:-4,scale:1.02,boxShadow:`0 32px 64px ${CYAN}22,0 0 0 1px ${CYAN}66`}}
                  className="flex flex-col group transition-colors duration-200"
                  style={{ background:'#001122', border:`1px solid ${CYAN}22`, transformStyle:'preserve-3d' }}>
                  <div className="aspect-square relative overflow-hidden" style={{ background:'#000' }}>
                    {/* Holographic shimmer */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                      style={{ background:`linear-gradient(135deg,transparent,${CYAN}22,${PINK}11,transparent)` }} />
                    <img src={p.image} className="w-full h-full object-contain p-10 transition-transform duration-300 group-hover:scale-110" style={{ imageRendering:'pixelated' }} alt={p.name} />
                    {p.isBestSeller && <span className="absolute top-3 left-3 font-display text-[7px] px-2 py-1" style={{ background:CYAN, color:'#000' }}>⭐ BEST SELLER</span>}
                    {p.isNew && <span className="absolute top-3 right-3 font-display text-[7px] px-2 py-1" style={{ background:PINK, color:'#fff' }}>✨ NEW DROP</span>}
                    {/* Scan line on hover */}
                    <motion.div className="absolute left-0 right-0 h-0.5 pointer-events-none opacity-0 group-hover:opacity-60"
                      style={{ background:CYAN, boxShadow:`0 0 8px ${CYAN}` }}
                      animate={{ top:['0%','100%'] }} transition={{ repeat:Infinity, duration:2, ease:'linear' }} />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="font-display text-[7px] mb-1" style={{ color:`${CYAN}66` }}>// {p.category.toUpperCase()}</p>
                    <h3 className="font-display text-[10px] text-white mb-2 group-hover:text-cyan-300 transition-colors leading-relaxed">{p.name}</h3>
                    <p className="font-sans text-sm italic mb-6 leading-relaxed flex-1" style={{ color:'rgba(255,255,255,0.4)' }}>{p.description}</p>
                    <div className="flex items-center justify-between border p-3" style={{ borderColor:`${CYAN}22`, background:'rgba(0,229,255,0.04)' }}>
                      <span className="font-display text-xl" style={{ color:CYAN }}>{p.price}G</span>
                      <button onClick={() => addToCart(p)}
                        className="font-display text-[9px] px-5 py-2.5 transition-all duration-150 active:scale-95"
                        style={{ background:CYAN, color:'#000', boxShadow:`3px 3px 0 #006677` }}
                        onMouseEnter={e=>{ e.currentTarget.style.boxShadow=`4px 4px 0 #006677,0 0 16px ${CYAN}99`; e.currentTarget.style.filter='brightness(1.1)'; }}
                        onMouseLeave={e=>{ e.currentTarget.style.boxShadow=`3px 3px 0 #006677`; e.currentTarget.style.filter=''; }}>
                        ADD TO BAG
                      </button>
                    </div>
                  </div>
                  <div className="h-[1px]" style={{ background:`linear-gradient(to right,transparent,${CYAN}88,transparent)` }} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Perks */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon:'🏆', title:'PREMIUM QUALITY', desc:'High-grade materials. Fade-resistant inks. Built to last the digital apocalypse.', color:CYAN },
              { icon:'🔒', title:'SECURE CHECKOUT', desc:'Encrypted payments via Etsy. Your data is protected in the Abyss.', color:PINK },
              { icon:'⚡', title:'FAST SHIPPING', desc:'Dispatched worldwide. Track every step through the digital realm.', color:'#FFD700' },
            ].map((f,i) => (
              <motion.div key={f.title} initial={{opacity:0,y:20,rotateX:18}} whileInView={{opacity:1,y:0,rotateX:0}}
                viewport={{once:true}} transition={{delay:i*0.1,duration:0.8}}
                whileHover={{y:-8,boxShadow:`0 20px 40px ${f.color}22`}}
                className="flex flex-col items-center text-center gap-4 border p-7"
                style={{ borderColor:`${f.color}33`, background:`${f.color}08` }}>
                <div className="text-3xl">{f.icon}</div>
                <div className="font-display text-[8px]" style={{ color:f.color }}>{f.title}</div>
                <p className="font-sans text-sm italic leading-relaxed" style={{ color:'rgba(255,255,255,0.4)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="py-12 text-center" style={{ background:'#000005', borderTop:`1px solid ${CYAN}22` }}>
        <button onClick={() => navigateToRealm('/','#7C3AED','','THE NEXUS')} className="font-display text-[9px] tracking-widest transition-colors"
          style={{ color:`${CYAN}44` }}
          onMouseEnter={e=>{e.currentTarget.style.color=CYAN;}} onMouseLeave={e=>{e.currentTarget.style.color=`${CYAN}44`;}}>
          ← RETURN TO THE NEXUS
        </button>
      </div>
    </div>
  );
}
