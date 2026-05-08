import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useRealm } from '../context/RealmContext';
import { GoldBtn, ScrollProgress, BackToTop, NeonDivider, Counter, useTilt } from '../components/shared';

const EMBER = '#FF4500', LAVA = '#FF6600', VENOM = '#00FF88', GOLD = '#FFD700';

const CREATURES = [
  { name:'INFERNO WYVERN',  emoji:'🐉', level:95, hp:9800, power:'Volcanic Breath', color:EMBER,    rare:'LEGENDARY', lore:'The oldest dragon alive. Has burned three kingdoms to ash.' },
  { name:'SHADOW STALKER',  emoji:'👁️', level:72, hp:5200, power:'Mind Shatter',    color:'#9933FF', rare:'EPIC',      lore:'Lurks in the deepest dungeons. Its gaze paralyzes instantly.' },
  { name:'BONE COLOSSUS',   emoji:'💀', level:80, hp:7600, power:'Death Slam',      color:'#CCCCCC', rare:'RARE',      lore:'Assembled from the bones of 1000 fallen warriors.' },
  { name:'VENOM HYDRA',     emoji:'🐍', level:68, hp:4900, power:'Acid Spit',       color:VENOM,     rare:'RARE',      lore:'Three heads. Three venoms. Zero mercy.' },
  { name:'THUNDER GOLEM',   emoji:'⚡', level:77, hp:6200, power:'Plasma Slam',     color:GOLD,      rare:'EPIC',      lore:'Built by ancient mages. Powered by captured lightning.' },
  { name:'VOID LEVIATHAN',  emoji:'🌊', level:88, hp:8400, power:'Reality Tear',    color:'#0066FF', rare:'LEGENDARY', lore:'A sea serpent that swallowed an ocean and kept swimming.' },
];

const REGIONS = [
  { name:'THE ASHEN PEAKS',  emoji:'🌋', color:EMBER,    desc:'Volcanic mountain range where wyverns nest.' },
  { name:'SHADOW MARSHES',   emoji:'🌿', color:VENOM,    desc:'Toxic swamps where visibility drops to zero.' },
  { name:'BONE WASTES',      emoji:'💀', color:'#AAA',   desc:'A desert of skeletal remains. Nothing lives here.' },
  { name:'THE VOID RIFT',    emoji:'🌌', color:'#9933FF',desc:'A tear in reality. Monsters spill from beyond.' },
  { name:"DRAGON'S THRONE",  emoji:'🏯', color:LAVA,     desc:'Ancient fortress ruled by Inferno Wyvern.' },
  { name:'CRYSTAL HOLLOWS',  emoji:'💎', color:'#00BBFF',desc:'Underground caverns with forbidden treasures.' },
];

const EMBERS = Array.from({ length: 40 }, (_, i) => ({
  x: Math.random() * 100, size: 3 + Math.random() * 9,
  dur: 2.5 + Math.random() * 4, del: Math.random() * 5,
}));

const CreatureCard = ({ c, i }: { c: typeof CREATURES[0]; i: number }) => {
  const ref = useTilt(6);
  return (
    <motion.div ref={ref}
      initial={{ y: 60, opacity: 0, rotateX: 20, scale: 0.9 }}
      whileInView={{ y: 0, opacity: 1, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -10, scale: 1.03, boxShadow: `0 30px 60px ${c.color}35` }}
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(135deg,${c.color}14,#0a0200)`, border: `2px solid ${c.color}55`, transformStyle: 'preserve-3d' }}>
      <div className="absolute top-3 right-3 font-display text-[6px] px-2 py-1"
        style={{
          background: c.rare === 'LEGENDARY' ? `linear-gradient(135deg,${EMBER},${LAVA})` : c.rare === 'EPIC' ? `${c.color}bb` : 'transparent',
          color: c.rare === 'LEGENDARY' ? '#000' : '#fff', border: `1px solid ${c.color}66`,
        }}>
        {c.rare}
      </div>
      <div className="p-5 sm:p-6">
        <motion.div className="text-5xl mb-4"
          animate={{ filter: [`drop-shadow(0 0 8px ${c.color}88)`, `drop-shadow(0 0 28px ${c.color})`, `drop-shadow(0 0 8px ${c.color}88)`] }}
          transition={{ repeat: Infinity, duration: 2.5 + i * 0.3 }}>{c.emoji}</motion.div>
        <p className="font-display text-[8px] mb-1.5" style={{ color: c.color }}>LVL {c.level}</p>
        <h3 className="font-display text-[10px] text-white mb-1.5 leading-snug">{c.name}</h3>
        <p className="font-display text-[7px] mb-3" style={{ color: `${EMBER}99` }}>⚡ {c.power}</p>
        <p className="font-display text-[7px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>{c.lore}</p>
        <div>
          <div className="flex justify-between font-display text-[7px] mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span>HP</span><span>{c.hp.toLocaleString()}</span>
          </div>
          <div className="h-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div className="h-full"
              style={{ background: `linear-gradient(to right,${c.color},${c.color}88)`, boxShadow: `0 0 8px ${c.color}` }}
              initial={{ width: 0 }}
              whileInView={{ width: `${(c.hp / 9800) * 100}%` }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.4, duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: c.color, boxShadow: `0 0 14px ${c.color}` }} />
    </motion.div>
  );
};

export default function DragonIsle() {
  const { navigateToRealm } = useRealm();
  const [showTop, setShowTop] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const play = () => { v.play().catch(() => {}); };
    if (v.readyState >= 2) play();
    else v.addEventListener('loadeddata', play, { once: true });
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0a0200', color: '#F0F0FF' }}>
      <ScrollProgress color={`linear-gradient(to right,${EMBER},${LAVA},${GOLD})`} />
      <BackToTop show={showTop} color={EMBER} />

      {/* Realm Nav */}
      <div className="fixed top-4 left-4 z-[100]">
        <button onClick={() => navigateToRealm('/', '#7C3AED', '', 'THE NEXUS')}
          className="font-display text-[8px] px-4 py-2 flex items-center gap-2 transition-all duration-200"
          style={{ background: 'rgba(255,69,0,0.2)', border: '1px solid rgba(255,69,0,0.5)', color: EMBER }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,69,0,0.4)'; e.currentTarget.style.boxShadow = `0 0 16px ${EMBER}66`; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,69,0,0.2)'; e.currentTarget.style.boxShadow = ''; }}>
          ← THE NEXUS
        </button>
      </div>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
        {/* Full-bleed video — high visibility */}
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover"
          muted loop playsInline preload="auto"
          style={{ opacity: 0.82 }}>
          <source src="/bg-dragon-video.mp4" type="video/mp4" />
        </video>

        {/* Thin dark vignette — keeps text readable but video stays vivid */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(10,2,0,0.45) 0%,rgba(10,2,0,0.22) 40%,rgba(10,2,0,0.55) 100%)' }} />

        {/* Edge ember glow */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: `linear-gradient(to top,${EMBER}55,transparent)` }} />
        <div className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(to right,transparent,${EMBER},${LAVA},transparent)`, boxShadow: `0 0 24px ${EMBER}` }} />

        {/* Ember particle sparks */}
        {EMBERS.map((e, i) => (
          <motion.div key={i} className="absolute pointer-events-none rounded-full"
            style={{ left: `${e.x}%`, bottom: 0, width: e.size, height: e.size, background: `radial-gradient(circle,${LAVA},${EMBER}88)`, boxShadow: `0 0 ${e.size * 2}px ${EMBER}` }}
            animate={{ y: [-20, -600], opacity: [0, 0.9, 0.9, 0], scale: [0.4, 1, 0.7, 0] }}
            transition={{ repeat: Infinity, duration: e.dur, delay: e.del, ease: 'linear' }} />
        ))}

        <motion.div initial={{ y: 60, opacity: 0, rotateX: 25 }} animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center relative z-10 px-6 max-w-3xl">
          <motion.div
            animate={{ scale: [1, 1.18, 1], filter: [`drop-shadow(0 0 24px ${EMBER})`, `drop-shadow(0 0 70px ${EMBER})`, `drop-shadow(0 0 24px ${EMBER})`] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-7xl sm:text-8xl mb-6">🐉</motion.div>

          <p className="font-display text-[9px] tracking-[0.5em] mb-4" style={{ color: `${LAVA}cc` }}>◆ REALM 02 ◆</p>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-white leading-tight mb-4"
            style={{ textShadow: `0 0 40px ${EMBER}, 0 0 80px ${EMBER}88, 2px 2px 0 #000` }}>
            DRAGON<br /><span style={{ color: EMBER, textShadow: `0 0 40px ${EMBER}, 0 0 100px ${LAVA}` }}>ISLE</span>
          </h1>

          <p className="font-display text-[9px] sm:text-[10px] tracking-widest mb-6" style={{ color: `${LAVA}cc`, textShadow: '1px 1px 0 #000' }}>
            ◆ WHERE ANCIENT POWER BURNS ETERNAL ◆
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GoldBtn size="lg" color={EMBER} shadowColor="#8B2500"
              onClick={() => document.getElementById('creatures')?.scrollIntoView({ behavior: 'smooth' })}>
              ⚔️ FACE THE CREATURES
            </GoldBtn>
            <GoldBtn size="lg" outline color={LAVA} shadowColor="#5a2500"
              onClick={() => document.getElementById('lore')?.scrollIntoView({ behavior: 'smooth' })}>
              📜 READ THE LORE
            </GoldBtn>
          </div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-display text-[8px] tracking-widest flex flex-col items-center gap-2 z-10"
          style={{ color: `${EMBER}cc`, textShadow: '1px 1px 0 #000' }}
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <span>ENTER THE ISLE</span><span>↓</span>
        </motion.div>
      </section>

      <NeonDivider colors={`${EMBER},${LAVA},${GOLD}`} />

      {/* ── WORLD LORE ───────────────────────────────────── */}
      <section id="lore" className="py-20 sm:py-24 px-4 sm:px-8" style={{ background: 'linear-gradient(to bottom,#0a0200,#140600)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ y: 40, opacity: 0, rotateX: 16 }} whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9 }}
            className="text-center mb-14" style={{ perspective: 800 }}>
            <span className="font-display text-[10px] tracking-widest" style={{ color: EMBER }}>📜 ANCIENT LORE</span>
            <h2 className="font-display text-2xl sm:text-4xl text-white mt-4">THE LEGEND OF DRAGON ISLE</h2>
            <NeonDivider colors={`${EMBER},${LAVA},${GOLD}`} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-5">
              {[
                { title: 'THE FIRST AGE', icon: '🌋', text: 'Before humans walked the earth, Dragon Isle rose from the sea in a cataclysmic eruption. The fire itself became alive — the first dragons were born from pure magma.' },
                { title: 'THE GREAT WAR', icon: '⚔️', text: 'For 1000 years, seven dragon clans fought for dominance. Mountains crumbled. Seas boiled. The war ended only when the Void Rift tore reality apart.' },
                { title: 'THE PROPHECY',  icon: '📜', text: "The ancient scrolls speak of a pixel warrior who will close the Void Rift — but first must defeat Inferno Wyvern in single combat at the Dragon's Throne." },
              ].map((s, i) => (
                <motion.div key={s.title}
                  initial={{ x: -40, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.75 }}
                  className="p-5 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg,${EMBER}12,rgba(45,0,0,0.6))`, border: `1px solid ${EMBER}44` }}>
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ background: `linear-gradient(to bottom,${EMBER},${LAVA})` }} />
                  <div className="flex items-center gap-3 mb-3 pl-2">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="font-display text-[9px]" style={{ color: EMBER }}>{s.title}</span>
                  </div>
                  <p className="font-display text-[7px] leading-relaxed pl-2" style={{ color: 'rgba(255,200,160,0.6)' }}>{s.text}</p>
                </motion.div>
              ))}
            </div>

            {/* World map */}
            <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.9 }}>
              <div className="p-6" style={{ background: `linear-gradient(135deg,#1a0500,#0a0200)`, border: `2px solid ${EMBER}55`, boxShadow: `0 0 40px ${EMBER}18` }}>
                <p className="font-display text-[9px] mb-6 text-center" style={{ color: EMBER }}>🗺️ WORLD MAP — DRAGON ISLE</p>
                <div className="grid grid-cols-2 gap-3">
                  {REGIONS.map((r, i) => (
                    <motion.div key={r.name}
                      initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${r.color}55` }}
                      className="p-4 transition-all duration-200 cursor-pointer"
                      style={{ background: `${r.color}12`, border: `1px solid ${r.color}55` }}>
                      <div className="text-2xl mb-2">{r.emoji}</div>
                      <p className="font-display text-[7px] leading-snug mb-1.5" style={{ color: r.color }}>{r.name}</p>
                      <p className="font-display text-[6px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>{r.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <NeonDivider colors={`${EMBER},${LAVA},${GOLD}`} />

      {/* ── CREATURE CODEX ───────────────────────────────── */}
      <section id="creatures" className="py-20 sm:py-24 px-4 sm:px-8" style={{ background: '#0a0200' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ y: 40, opacity: 0, rotateX: 18 }} whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9 }}
            className="text-center mb-14" style={{ perspective: 800 }}>
            <span className="font-display text-[10px] tracking-widest" style={{ color: EMBER }}>⚔️ CREATURE CODEX</span>
            <h2 className="font-display text-2xl sm:text-4xl text-white mt-4">THE BEASTS OF DRAGON ISLE</h2>
            <p className="font-display text-[8px] mt-4 max-w-lg mx-auto" style={{ color: 'rgba(255,150,80,0.5)', lineHeight: '1.8' }}>
              SIX OF THE MOST DANGEROUS CREATURES EVER PIXEL-CRAFTED.
            </p>
            <NeonDivider colors={`${EMBER},${LAVA},${GOLD}`} />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6" style={{ perspective: 1200 }}>
            {CREATURES.map((c, i) => <CreatureCard key={c.name} c={c} i={i} />)}
          </div>
        </div>
      </section>

      <NeonDivider colors={`${EMBER},${LAVA},${GOLD}`} />

      {/* ── THE CREATOR ──────────────────────────────────── */}
      <section className="py-20 sm:py-24 px-4 sm:px-8" style={{ background: 'linear-gradient(to bottom,#0a0200,#140800)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ x: -60, opacity: 0, rotateY: -18 }} whileInView={{ x: 0, opacity: 1, rotateY: 0 }}
            viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <div className="relative mx-auto" style={{ maxWidth: 380 }}>
              <div className="absolute -inset-6 rounded-full opacity-20"
                style={{ background: `radial-gradient(circle,${EMBER},transparent 70%)` }} />
              <div className="rounded-full overflow-hidden"
                style={{ border: `4px solid ${EMBER}`, boxShadow: `0 0 60px ${EMBER}55, 0 30px 60px rgba(0,0,0,0.6)` }}>
                <img src="https://storage.googleapis.com/static.rethink.software/yusefazmoon22/pixle_man_create_original_banner.png"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: '38% center', transform: 'scale(1.1)' }} alt="Creator" />
              </div>
              <motion.div className="absolute -top-3 -right-3 font-display text-[8px] px-3 py-2"
                style={{ background: EMBER, color: '#000', boxShadow: `3px 3px 0 #8B2500` }}
                animate={{ rotate: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 3 }}>CREATOR</motion.div>
              <motion.div className="absolute -bottom-3 -left-3 font-display text-[8px] px-3 py-2"
                style={{ background: LAVA, color: '#000', boxShadow: `3px 3px 0 #5a2500` }}
                animate={{ rotate: [3, -3, 3] }} transition={{ repeat: Infinity, duration: 3.5 }}>PIXEL ARTIST</motion.div>
            </div>
          </motion.div>

          <motion.div initial={{ x: 60, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6">
            <span className="font-display text-[10px] tracking-widest" style={{ color: EMBER }}>🐉 THE ARTIST</span>
            <h2 className="font-display text-2xl sm:text-3xl mt-2 text-white">
              MEET THE <span style={{ color: EMBER }}>CREATOR</span>
            </h2>
            <div className="w-16 h-1" style={{ background: `linear-gradient(to right,${EMBER},${LAVA})` }} />
            <p className="font-display text-[8px] leading-relaxed" style={{ color: 'rgba(255,200,150,0.7)' }}>
              WELCOME TO PIXLE MAN — A CREATIVE UNIVERSE WHERE PIXEL ART, IMAGINATION, AND STORYTELLING COLLIDE.
            </p>
            <p className="font-display text-[8px] leading-relaxed" style={{ color: 'rgba(255,200,150,0.5)' }}>
              EVERY PIECE IS CRAFTED PIXEL BY PIXEL. NO FILTERS. NO SHORTCUTS. BORN FROM A LOVE OF RETRO GAMES AND FANTASTICAL WORLDS.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <Counter value={100} suffix="+" label="ARTWORKS" color={EMBER} />
              <Counter value={5000} suffix="+" label="COMMUNITY" color={LAVA} />
              <Counter value={3} suffix="YRS" label="CREATING" color={GOLD} />
            </div>
            <GoldBtn color={EMBER} shadowColor="#8B2500"
              onClick={() => navigateToRealm('/sanctum', '#FF9F1C', '/bg-sunset-castle.png', "CREATOR'S SANCTUM")}>
              🎨 CREATOR'S SANCTUM →
            </GoldBtn>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <div className="py-12 text-center" style={{ background: '#000005', borderTop: `2px solid ${EMBER}22` }}>
        <button onClick={() => navigateToRealm('/', '#7C3AED', '', 'THE NEXUS')}
          className="font-display text-[9px] tracking-widest transition-colors"
          style={{ color: `${EMBER}55` }}
          onMouseEnter={e => { e.currentTarget.style.color = EMBER; }}
          onMouseLeave={e => { e.currentTarget.style.color = `${EMBER}55`; }}>
          ← RETURN TO THE NEXUS
        </button>
      </div>
    </div>
  );
}
