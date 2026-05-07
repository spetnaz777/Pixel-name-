import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useRealm } from '../context/RealmContext';
import { Counter, GoldBtn, ScrollProgress, BackToTop, NeonDivider, PixleLogo } from '../components/shared';

const AMBER = '#FF9F1C', WARM = '#C084FC', CREAM = '#FFF8E7';

const PROCESS = [
  { icon:'💡', step:'01', title:'THE CONCEPT', desc:'Every piece starts with a vision — a world, a creature, a legend. The idea lives in imagination before a single pixel is placed.' },
  { icon:'🎨', step:'02', title:'PIXEL CRAFT', desc:'Painted pixel by pixel using custom palettes. No shortcuts. No filters. Every dot is intentional, every colour chosen with obsession.' },
  { icon:'✨', step:'03', title:'BRING TO LIFE', desc:'The artwork is animated, refined, and infused with soul. Then it finds its home — on a screen, a mug, a tee, or a legend.' },
  { icon:'🌍', step:'04', title:'RELEASE TO WORLD', desc:'Every drop is a new chapter in the Chromatic Kingdom. Merch, prints, digital art — the universe expands with each release.' },
];

const TOOLS = [
  { name:'Aseprite',     icon:'🖼️', desc:'Primary pixel art editor. Every canvas starts here.' },
  { name:'Procreate',    icon:'📱', desc:'Concept sketches and rough ideation.' },
  { name:'Photoshop',    icon:'🖌️', desc:'Final polishing and merch mockups.' },
  { name:'Vite + React', icon:'⚡', desc:'This very website — built from scratch.' },
];

const DUST = Array.from({length:20},(_,i)=>({
  x:Math.random()*100, size:2+Math.random()*6,
  dur:4+Math.random()*5, del:Math.random()*6,
}));

export default function CreatorSanctum() {
  const { navigateToRealm } = useRealm();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background:'#100a00', color:'#FFF8E7' }}>
      <ScrollProgress color={`linear-gradient(to right,${AMBER},${WARM},${AMBER})`} />
      <BackToTop show={showTop} color={AMBER} />

      {/* Floating dust motes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {DUST.map((d,i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ left:`${d.x}%`, bottom:0, width:d.size, height:d.size, background:`radial-gradient(circle,${AMBER}66,${AMBER}22)` }}
            animate={{ y:[-50,-300], opacity:[0,0.4,0] }}
            transition={{ repeat:Infinity, duration:d.dur, delay:d.del, ease:'linear' }} />
        ))}
      </div>

      {/* Realm Nav */}
      <div className="fixed top-4 left-4 z-[100]">
        <button onClick={() => navigateToRealm('/','#7C3AED','','THE NEXUS')}
          className="font-display text-[8px] px-4 py-2 flex items-center gap-2"
          style={{ background:`rgba(255,159,28,0.15)`, border:`1px solid ${AMBER}44`, color:AMBER }}>
          ← THE NEXUS
        </button>
      </div>

      {/* HERO */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage:'url(/bg-sunset-castle.png)', backgroundSize:'cover', backgroundPosition:'center' }} />
        <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse at 50% 40%,rgba(255,159,28,0.15) 0%,rgba(16,10,0,0.88) 70%)` }} />
        <div className="absolute inset-0" style={{ backgroundSize:'36px 36px', backgroundImage:`linear-gradient(to right,${AMBER}06 1px,transparent 1px),linear-gradient(to bottom,${AMBER}06 1px,transparent 1px)` }} />
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background:`linear-gradient(to right,transparent,${AMBER},${WARM},transparent)`, boxShadow:`0 0 20px ${AMBER}88` }} />

        {/* Floating art tools */}
        {['✏️','🖌️','🎨','✨','💡'].map((e,i)=>(
          <motion.div key={i} className="absolute text-xl pointer-events-none select-none opacity-20"
            style={{ left:`${8+i*19}%`, top:`${15+i*10}%` }}
            animate={{ y:[-10,10,-10], rotate:[-8,8,-8] }}
            transition={{ repeat:Infinity, duration:4+i, delay:i*0.6 }}>{e}</motion.div>
        ))}

        <motion.div initial={{y:60,opacity:0,rotateX:25}} animate={{y:0,opacity:1,rotateX:0}} transition={{duration:1.2,ease:[0.16,1,0.3,1]}}
          className="text-center relative z-10 px-6 max-w-3xl">
          <motion.div animate={{ rotate:[-3,3,-3], scale:[1,1.05,1] }} transition={{repeat:Infinity,duration:4}} className="text-6xl mb-6">🎨</motion.div>
          <p className="font-display text-[9px] tracking-[0.5em] mb-4" style={{ color:`${AMBER}66` }}>◆ REALM 05 ◆</p>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl leading-tight mb-4"
            style={{ color:CREAM, textShadow:`0 0 40px ${AMBER}88, 0 0 80px ${AMBER}44` }}>
            THE CREATOR'S<br/><span style={{ color:AMBER }}>SANCTUM</span>
          </h1>
          <p className="font-display text-[9px] tracking-widest mb-6" style={{ color:`${WARM}aa` }}>
            "WHERE EVERY PIXEL HAS A STORY"
          </p>
          <p className="font-sans text-xl italic max-w-md mx-auto mb-10" style={{ color:'rgba(255,248,231,0.5)' }}>
            Step behind the canvas. Discover the origin of the Chromatic Kingdom and the creator who built it.
          </p>
          <GoldBtn size="lg" color={AMBER} shadowColor="#8B5e00" onClick={() => document.getElementById('story')?.scrollIntoView({behavior:'smooth'})}>
            🎨 ENTER THE SANCTUM
          </GoldBtn>
        </motion.div>
      </section>

      <NeonDivider colors={`${AMBER},${WARM},${AMBER}`} />

      {/* THE STORY */}
      <section id="story" className="py-24 px-4 sm:px-8" style={{ background:'linear-gradient(to bottom,#100a00,#1a0d00)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{x:-60,opacity:0,rotateY:-18}} whileInView={{x:0,opacity:1,rotateY:0}} viewport={{once:true}} transition={{duration:1,ease:[0.16,1,0.3,1]}}>
            <div className="relative mx-auto" style={{ maxWidth:400 }}>
              <div className="absolute -inset-8 rounded-full opacity-15" style={{ background:`radial-gradient(circle,${AMBER},transparent 70%)` }} />
              <div className="rounded-full overflow-hidden" style={{ border:`4px solid ${AMBER}`, boxShadow:`0 0 60px ${AMBER}55, 0 30px 60px rgba(0,0,0,0.6)` }}>
                <img src="https://storage.googleapis.com/static.rethink.software/yusefazmoon22/pixle_man_create_original_banner.png"
                  className="w-full h-full object-cover" style={{ objectPosition:'38% center', transform:'scale(1.15)' }} alt="Creator" />
              </div>
              <motion.div className="absolute -top-3 -right-3 font-display text-[8px] px-3 py-2" style={{ background:AMBER,color:'#000',boxShadow:`3px 3px 0 #8B5e00` }}
                animate={{rotate:[-4,4,-4]}} transition={{repeat:Infinity,duration:3}}>CREATOR</motion.div>
              <motion.div className="absolute -bottom-3 -left-3 font-display text-[8px] px-3 py-2" style={{ background:WARM,color:'#fff',boxShadow:`3px 3px 0 #6a2090` }}
                animate={{rotate:[3,-3,3]}} transition={{repeat:Infinity,duration:3.5}}>PIXEL ARTIST</motion.div>
            </div>
          </motion.div>
          <motion.div initial={{x:60,opacity:0}} whileInView={{x:0,opacity:1}} viewport={{once:true}} transition={{duration:1,ease:[0.16,1,0.3,1]}} className="space-y-6">
            <p className="font-display text-[10px] tracking-widest" style={{ color:AMBER }}>✨ THE ORIGIN</p>
            <h2 className="font-display text-3xl sm:text-4xl mt-2" style={{ color:CREAM }}>
              MEET THE <span style={{ color:AMBER }}>CREATOR</span>
            </h2>
            <div className="w-16 h-1" style={{ background:AMBER }} />
            <p className="font-sans text-xl italic leading-relaxed" style={{ color:'rgba(255,248,231,0.6)' }}>
              Welcome to <span style={{ color:CREAM }} className="not-italic font-bold">Pixle Man</span> — a creative universe where pixel art, imagination, and storytelling collide into something truly magical.
            </p>
            <p className="font-sans text-lg italic leading-relaxed" style={{ color:'rgba(255,248,231,0.5)' }}>
              Born from a lifelong love of retro games and fantastical worlds. Every piece is crafted pixel by pixel — no filters, no shortcuts. Just raw creativity and obsessive detail.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <Counter value={100} suffix="+" label="ARTWORKS"  color={AMBER} />
              <Counter value={5000} suffix="+" label="COMMUNITY" color={WARM} />
              <Counter value={3}   suffix="YRS" label="CREATING"  color="#FFD700" />
            </div>
          </motion.div>
        </div>
      </section>

      <NeonDivider colors={`${AMBER},${WARM},${AMBER}`} />

      {/* PROCESS */}
      <section className="py-24 px-4 sm:px-8" style={{ background:'#100a00' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{y:40,opacity:0}} whileInView={{y:0,opacity:1}} viewport={{once:true}} className="text-center mb-16">
            <span className="font-display text-[10px] tracking-widest" style={{ color:AMBER }}>⚙️ THE PROCESS</span>
            <h2 className="font-display text-3xl sm:text-4xl mt-4" style={{ color:CREAM }}>HOW THE MAGIC HAPPENS</h2>
            <NeonDivider colors={`${AMBER},${WARM},${AMBER}`} />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{perspective:1200}}>
            {PROCESS.map((s,i) => (
              <motion.div key={s.step}
                initial={{y:60,opacity:0,rotateX:28,scale:0.9}} whileInView={{y:0,opacity:1,rotateX:0,scale:1}}
                viewport={{once:true,margin:'-40px'}} transition={{delay:i*0.15,duration:0.85,ease:[0.16,1,0.3,1]}}
                whileHover={{y:-10,rotateX:-6,scale:1.04,boxShadow:`0 24px 48px ${AMBER}22`}}
                className="p-7 text-center relative overflow-hidden transition-colors duration-200"
                style={{ background:`${AMBER}08`, border:`1px solid ${AMBER}33`, transformStyle:'preserve-3d' }}>
                <div className="absolute top-3 right-3 font-display text-[10px] opacity-20" style={{ color:AMBER }}>{s.step}</div>
                <motion.div className="text-4xl mb-4"
                  animate={{rotateY:[0,360]}} transition={{repeat:Infinity,duration:6+i,ease:'linear'}}>
                  {s.icon}
                </motion.div>
                <div className="font-display text-[9px] mb-3 tracking-wider" style={{ color:AMBER }}>{s.title}</div>
                <p className="font-sans text-sm italic leading-relaxed" style={{ color:'rgba(255,248,231,0.5)' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NeonDivider colors={`${AMBER},${WARM},${AMBER}`} />

      {/* TOOLS */}
      <section className="py-24 px-4 sm:px-8" style={{ background:'linear-gradient(to bottom,#1a0d00,#100a00)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{y:30,opacity:0}} whileInView={{y:0,opacity:1}} viewport={{once:true}} className="text-center mb-12">
            <span className="font-display text-[10px] tracking-widest" style={{ color:WARM }}>🛠️ THE TOOLKIT</span>
            <h2 className="font-display text-3xl sm:text-4xl mt-4" style={{ color:CREAM }}>TOOLS OF THE TRADE</h2>
            <NeonDivider colors={`${AMBER},${WARM},${AMBER}`} />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TOOLS.map((t,i) => (
              <motion.div key={t.name}
                initial={{opacity:0,x:i%2===0?-40:40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.1,duration:0.8}}
                whileHover={{x:6,boxShadow:`0 0 20px ${WARM}22`}}
                className="flex items-center gap-5 p-6"
                style={{ background:`${WARM}08`, border:`1px solid ${WARM}33` }}>
                <div className="text-3xl shrink-0">{t.icon}</div>
                <div>
                  <p className="font-display text-[10px] mb-1" style={{ color:WARM }}>{t.name}</p>
                  <p className="font-sans text-sm italic" style={{ color:'rgba(255,248,231,0.5)' }}>{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA & Return */}
      <section className="py-20 px-4 text-center" style={{ background:'#100a00' }}>
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="space-y-6">
          <PixleLogo scale={1.5} />
          <p className="font-sans text-lg italic max-w-md mx-auto mt-4" style={{ color:'rgba(255,248,231,0.4)' }}>
            The Chromatic Kingdom grows with every pixel. Every purchase fuels the next chapter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <GoldBtn color={AMBER} shadowColor="#8B5e00" onClick={() => navigateToRealm('/shop','#00E5FF','/bg-neon-abyss.png','NEON ABYSS')}>⚡ VISIT THE NEON ABYSS</GoldBtn>
            <GoldBtn color={WARM}  shadowColor="#6a2090" onClick={() => navigateToRealm('/kingdom','#FFD700','/bg-pixleman-banner.png','CHROMATIC KINGDOM')} outline>👑 SEE THE ARTWORK</GoldBtn>
          </div>
        </motion.div>
      </section>

      <div className="py-12 text-center" style={{ background:'#000005', borderTop:`1px solid ${AMBER}22` }}>
        <button onClick={() => navigateToRealm('/','#7C3AED','','THE NEXUS')} className="font-display text-[9px] tracking-widest transition-colors"
          style={{ color:`${AMBER}44` }}
          onMouseEnter={e=>{e.currentTarget.style.color=AMBER;}} onMouseLeave={e=>{e.currentTarget.style.color=`${AMBER}44`;}}>
          ← RETURN TO THE NEXUS
        </button>
      </div>
    </div>
  );
}
