import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRealm } from '../context/RealmContext';
import { GoldBtn, NeonDivider, ScrollProgress, BackToTop, useTilt } from '../components/shared';

const GOLD = '#FFD700', PURPLE = '#C084FC', CRIMSON = '#FF2D78';

const ARTWORKS = [
  { title:'Dragon Isle',       emoji:'🐉', color:'#FF4500', frame:'#8B0000', desc:'The original dragon world. Hand-crafted pixel by pixel over 40 hours.' },
  { title:'Crystal Depths',    emoji:'💎', color:'#00E5FF', frame:'#004466', desc:'A submerged crystal palace in an ancient ocean realm.' },
  { title:'The Golden Keep',   emoji:'🏰', color:'#FFD700', frame:'#7a5800', desc:'The royal fortress at the heart of the Chromatic Kingdom.' },
  { title:'Neon Void',         emoji:'⚡', color:'#FF2D78', frame:'#8B0040', desc:'When retro meets cyber — a dimension of pure electricity.' },
  { title:'Pixel Colosseum',   emoji:'⚔️', color:'#C084FC', frame:'#4a2080', desc:'Ancient arena where pixel warriors compete for legend.' },
  { title:'Moon Garden',       emoji:'🌙', color:'#87CEEB', frame:'#1a4060', desc:'A mystical garden that only blooms under the pixel moon.' },
  { title:'Lava Forge',        emoji:'🌋', color:'#FF6600', frame:'#5a1a00', desc:'Deep underground, where the world\'s most powerful weapons are born.' },
  { title:'The Void Gate',     emoji:'🌌', color:'#9C27B0', frame:'#3d0060', desc:'The portal between realms. Only the bravest dare to cross.' },
  { title:'Sky Temple',        emoji:'☁️', color:'#E0F0FF', frame:'#2a4060', desc:'A floating sanctuary high above the clouds.' },
  { title:'Shadow Market',     emoji:'🎭', color:'#666699', frame:'#1a1a3a', desc:'Where merchants trade in secrets, spells, and forbidden art.' },
  { title:'Enchanted Coast',   emoji:'🌊', color:'#00CED1', frame:'#003344', desc:'Where the pixel ocean meets the pixel sky at the edge of the world.' },
  { title:'The Nexus Core',    emoji:'✦',  color:'#FFD700', frame:'#7a5800', desc:'The very heart of the Chromatic Multiverse.' },
];

const ArtCard = ({ art, i }: { art: typeof ARTWORKS[0]; i: number }) => {
  const ref = useTilt(8);
  const [open, setOpen] = useState(false);
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:50, rotateX:20 }}
      whileInView={{ opacity:1, y:0, rotateX:0 }}
      viewport={{ once:true, margin:'-40px' }}
      transition={{ delay:(i%4)*0.07, duration:0.8, ease:[0.16,1,0.3,1] }}
      className="cursor-pointer group"
      style={{ transformStyle:'preserve-3d' }}
      onClick={() => setOpen(true)}>
      {/* Gold frame */}
      <div className="relative p-3 transition-all duration-300"
        style={{ background:`linear-gradient(135deg,${art.frame},${art.frame}cc)`, border:`3px solid ${art.color}66`,
          boxShadow: `0 0 0 1px ${art.frame}, inset 0 0 0 2px ${art.color}22` }}>
        <div className="absolute top-1 left-1 right-1 bottom-1 border" style={{ borderColor:`${art.color}33`, pointerEvents:'none' }} />
        {/* Art area */}
        <div className="aspect-square flex items-center justify-center relative overflow-hidden"
          style={{ background:`radial-gradient(circle at 50% 60%,${art.color}22,${art.frame}88)`, minHeight:140 }}>
          <motion.span className="text-6xl sm:text-7xl"
            animate={{ scale:[1,1.08,1], filter:[`drop-shadow(0 0 8px ${art.color}88)`,`drop-shadow(0 0 24px ${art.color})`,`drop-shadow(0 0 8px ${art.color}88)`] }}
            transition={{ repeat:Infinity, duration:3+i*0.3 }}>
            {art.emoji}
          </motion.span>
          {/* Shimmer overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background:`linear-gradient(135deg,transparent 30%,${art.color}18 50%,transparent 70%)`,
              animation:'shimmer-fast 1.5s linear infinite', backgroundSize:'200% 200%' }} />
        </div>
        <div className="pt-3 pb-1 px-1">
          <p className="font-display text-[7px] truncate" style={{ color: art.color }}>{art.title}</p>
          <p className="font-display text-[6px] text-white/30 mt-0.5 truncate italic">{art.desc.slice(0,28)}…</p>
        </div>
        {/* ORIGINAL badge */}
        <div className="absolute top-4 right-4 font-display text-[5px] px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: art.color, color:'#000' }}>ORIGINAL</div>
      </div>
    </motion.div>
  );
};

const LightboxModal = ({ art, onClose }: { art: typeof ARTWORKS[0]|null; onClose:()=>void }) => (
  <AnimatePresence>
    {art && (
      <>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          onClick={onClose} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[300]" />
        <motion.div initial={{scale:0.7,opacity:0,rotateX:20}} animate={{scale:1,opacity:1,rotateX:0}} exit={{scale:0.7,opacity:0}}
          transition={{type:'spring',stiffness:300,damping:25}}
          className="fixed inset-0 z-[301] flex items-center justify-center p-6" onClick={onClose}>
          <div className="max-w-lg w-full p-8 relative" style={{ background:`linear-gradient(135deg,${art.frame},#1a0d2e)`, border:`3px solid ${art.color}`, boxShadow:`0 0 80px ${art.color}55` }}
            onClick={e=>e.stopPropagation()}>
            <div className="text-center mb-6">
              <span className="text-8xl">{art.emoji}</span>
            </div>
            <h3 className="font-display text-lg text-white text-center mb-2">{art.title}</h3>
            <p className="font-sans text-base text-white/60 italic text-center leading-relaxed">{art.desc}</p>
            <div className="mt-6 flex justify-center">
              <button onClick={onClose} className="font-display text-[9px] px-8 py-3" style={{ background:art.color, color:'#000' }}>CLOSE ✕</button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function ChromaticKingdom() {
  const { navigateToRealm } = useRealm();
  const [showTop, setShowTop] = useState(false);
  const [selectedArt, setSelectedArt] = useState<typeof ARTWORKS[0]|null>(null);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background:'#0d0818', color:'#F0F0FF' }}>
      <ScrollProgress color={`linear-gradient(to right,${GOLD},${PURPLE},${CRIMSON})`} />
      <BackToTop show={showTop} color={GOLD} />
      <LightboxModal art={selectedArt} onClose={() => setSelectedArt(null)} />

      {/* Realm Nav */}
      <div className="fixed top-4 left-4 z-[100]">
        <button onClick={() => navigateToRealm('/', '#7C3AED', '', 'THE NEXUS')}
          className="font-display text-[8px] px-4 py-2 flex items-center gap-2 transition-all duration-200"
          style={{ background:'rgba(124,58,237,0.2)', border:'1px solid rgba(124,58,237,0.5)', color:'#C084FC' }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(124,58,237,0.4)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(124,58,237,0.2)';}}>
          ← THE NEXUS
        </button>
      </div>

      {/* HERO */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden" style={{ perspective:'1200px' }}>
        {/* BG layers */}
        <div className="absolute inset-0" style={{ backgroundImage:'url(/bg-pixleman-banner.png)', backgroundSize:'cover', backgroundPosition:'center' }} />
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at 50% 40%,rgba(45,27,78,0.82) 0%,rgba(13,8,24,0.93) 70%)' }} />
        <div className="absolute inset-0" style={{ backgroundSize:'40px 40px', backgroundImage:'linear-gradient(to right,rgba(255,215,0,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,215,0,0.04) 1px,transparent 1px)' }} />
        {/* Floating crowns */}
        {['👑','⭐','💛','✦','👑'].map((e,i) => (
          <motion.div key={i} className="absolute text-2xl pointer-events-none select-none opacity-20"
            style={{ left:`${10+i*20}%`, top:`${15+i*12}%` }}
            animate={{ y:[-10,10,-10], rotate:[-5,5,-5] }}
            transition={{ repeat:Infinity, duration:3+i, delay:i*0.5 }}>
            {e}
          </motion.div>
        ))}
        {/* Royal arch line */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background:`linear-gradient(to right,transparent,${GOLD},transparent)`, boxShadow:`0 0 20px ${GOLD}88` }} />

        <motion.div initial={{y:60,opacity:0,rotateX:25}} animate={{y:0,opacity:1,rotateX:0}} transition={{duration:1.1,ease:[0.16,1,0.3,1]}}
          className="text-center relative z-10 px-6">
          <motion.div animate={{rotate:[-3,3,-3]}} transition={{repeat:Infinity,duration:4}} className="text-6xl mb-6">👑</motion.div>
          <p className="font-display text-[9px] tracking-[0.5em] text-yellow-400/60 mb-4">◆ REALM 01 ◆</p>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-white leading-tight mb-4" style={{ textShadow:`0 0 40px ${GOLD}88, 0 0 80px ${GOLD}44` }}>
            THE CHROMATIC<br /><span style={{ color:GOLD, textShadow:`0 0 40px ${GOLD}` }}>KINGDOM</span>
          </h1>
          <p className="font-sans text-xl text-white/50 italic max-w-md mx-auto mb-10">
            Where every pixel tells a legend. Original artwork forged in the fires of pure creativity.
          </p>
          <GoldBtn size="lg" onClick={() => document.getElementById('gallery')?.scrollIntoView({behavior:'smooth'})}>
            ⭐ VIEW THE GALLERY
          </GoldBtn>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-yellow-400/40 font-display text-[8px] tracking-widest flex flex-col items-center gap-2"
          animate={{y:[0,8,0]}} transition={{repeat:Infinity,duration:1.8}}>
          <span>SCROLL</span><span>↓</span>
        </motion.div>
      </section>

      {/* FEATURED ARTWORK */}
      <section className="relative py-20 px-4 sm:px-8" style={{ background:'linear-gradient(to bottom,#0d0818,#1a0d2e)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{y:40,opacity:0}} whileInView={{y:0,opacity:1}} viewport={{once:true}} transition={{duration:0.9}} className="text-center mb-12">
            <span className="font-display text-[10px] tracking-widest text-yellow-400">✦ FEATURED PIECE</span>
            <h2 className="font-display text-3xl sm:text-4xl text-white mt-4">THE ORIGINAL BANNER</h2>
            <NeonDivider colors={`${GOLD},${PURPLE},${CRIMSON}`} />
          </motion.div>
          <motion.div initial={{opacity:0,scale:0.9,rotateX:12}} whileInView={{opacity:1,scale:1,rotateX:0}} viewport={{once:true}} transition={{duration:1}}
            className="relative overflow-hidden group cursor-pointer mx-auto max-w-4xl"
            style={{ border:`3px solid ${GOLD}88`, boxShadow:`0 0 60px ${GOLD}22` }}>
            <img src="https://storage.googleapis.com/static.rethink.software/yusefazmoon22/pixle_man_create_original_banner.png"
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ maxHeight:520 }} alt="Original Banner" />
            <div className="absolute inset-0" style={{ background:'linear-gradient(to top,rgba(13,8,24,0.85) 0%,transparent 50%)' }} />
            <div className="absolute bottom-6 left-6">
              <div className="font-display text-[8px] px-3 py-1.5 mb-3" style={{ background:GOLD, color:'#000' }}>✦ ORIGINAL</div>
              <h3 className="font-display text-2xl text-white" style={{ textShadow:'2px 2px 0 #000' }}>THE CHROMATIC KINGDOM</h3>
            </div>
          </motion.div>
        </div>
      </section>

      <NeonDivider colors={`${GOLD},${PURPLE},${CRIMSON}`} />

      {/* GALLERY GRID */}
      <section id="gallery" className="py-24 px-4 sm:px-8" style={{ background:'#0d0818' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{y:40,opacity:0,rotateX:18}} whileInView={{y:0,opacity:1,rotateX:0}} viewport={{once:true}} transition={{duration:0.9}}
            className="text-center mb-16" style={{ perspective:800 }}>
            <span className="font-display text-[10px] tracking-widest text-yellow-400">🖼️ THE GALLERY</span>
            <h2 className="font-display text-3xl sm:text-4xl text-white mt-4">ORIGINAL ART COLLECTION</h2>
            <p className="font-sans text-lg text-white/40 italic mt-4 max-w-lg mx-auto">12 worlds. Each one crafted pixel by pixel. Hover to reveal — click to enter.</p>
            <NeonDivider colors={`${GOLD},${PURPLE},${CRIMSON}`} />
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5" style={{ perspective:1200 }}>
            {ARTWORKS.map((art, i) => (
              <div key={art.title} onClick={() => setSelectedArt(art)}>
                <ArtCard art={art} i={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <NeonDivider colors={`${GOLD},${PURPLE},${CRIMSON}`} />

      {/* ABOUT THE ART */}
      <section className="py-24 px-4 sm:px-8" style={{ background:'linear-gradient(to bottom,#1a0d2e,#0d0818)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{x:-60,opacity:0,rotateY:-18}} whileInView={{x:0,opacity:1,rotateY:0}} viewport={{once:true}} transition={{duration:1,ease:[0.16,1,0.3,1]}}>
            <div className="relative mx-auto" style={{ maxWidth:380 }}>
              <div className="absolute -inset-6 rounded-full opacity-20" style={{ background:`radial-gradient(circle,${PURPLE},transparent 70%)` }} />
              <div className="rounded-full overflow-hidden" style={{ border:`4px solid ${PURPLE}`, boxShadow:`0 0 60px ${PURPLE}55` }}>
                <img src="https://storage.googleapis.com/static.rethink.software/yusefazmoon22/pixle_man_create_original_banner.png"
                  className="w-full h-full object-cover" style={{ objectPosition:'38% center', transform:'scale(1.1)' }} alt="Creator" />
              </div>
              <motion.div className="absolute -top-3 -right-3 font-display text-[8px] px-3 py-2" style={{ background:GOLD,color:'#000',boxShadow:`3px 3px 0 #a07800` }}
                animate={{rotate:[-4,4,-4]}} transition={{repeat:Infinity,duration:3}}>CREATOR</motion.div>
              <motion.div className="absolute -bottom-3 -left-3 font-display text-[8px] px-3 py-2" style={{ background:CRIMSON,color:'#fff',boxShadow:`3px 3px 0 #8b1042` }}
                animate={{rotate:[3,-3,3]}} transition={{repeat:Infinity,duration:3.5}}>PIXEL ARTIST</motion.div>
            </div>
          </motion.div>
          <motion.div initial={{x:60,opacity:0}} whileInView={{x:0,opacity:1}} viewport={{once:true}} transition={{duration:1,ease:[0.16,1,0.3,1]}} className="space-y-6">
            <span className="font-display text-[10px] tracking-widest" style={{ color:CRIMSON }}>💗 THE ARTIST</span>
            <h2 className="font-display text-3xl sm:text-4xl mt-2 text-white">MEET THE <span style={{ color:GOLD }}>CREATOR</span></h2>
            <div className="w-16 h-1" style={{ background:GOLD }} />
            <p className="font-sans text-xl text-white/60 italic leading-relaxed">
              Welcome to <span className="text-white not-italic font-bold">Pixle Man</span> — a creative universe where pixel art, imagination, and storytelling collide.
            </p>
            <p className="font-sans text-lg text-white/50 italic leading-relaxed">
              Every piece is crafted pixel by pixel, no filters, no shortcuts. Born from a love of retro games and fantastical worlds.
            </p>
            <GoldBtn onClick={() => navigateToRealm('/sanctum','#FF9F1C','/bg-sunset-castle.png',"CREATOR'S SANCTUM")} outline color={GOLD} shadowColor="#a07800">
              🎨 CREATOR'S SANCTUM →
            </GoldBtn>
          </motion.div>
        </div>
      </section>

      {/* Footer / Return */}
      <div className="py-12 text-center" style={{ background:'#000005', borderTop:`2px solid ${GOLD}22` }}>
        <button onClick={() => navigateToRealm('/','#7C3AED','','THE NEXUS')} className="font-display text-[9px] text-purple-400/60 hover:text-purple-400 transition-colors tracking-widest">
          ← RETURN TO THE NEXUS
        </button>
      </div>
    </div>
  );
}
