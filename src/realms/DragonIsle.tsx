import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useRealm } from '../context/RealmContext';
import { GoldBtn, ScrollProgress, BackToTop, NeonDivider } from '../components/shared';

const EMBER = '#FF4500', LAVA = '#FF6600', VENOM = '#00FF88', ASH = '#2d2d2d';

const CREATURES = [
  { name:'INFERNO WYVERN',   emoji:'🐉', level:95, hp:9800,  power:'Volcanic Breath',   color:EMBER,  rare:'LEGENDARY',  lore:'The oldest dragon alive. Has burned three kingdoms to ash.' },
  { name:'SHADOW STALKER',   emoji:'👁️', level:72, hp:5200,  power:'Mind Shatter',      color:'#9933FF', rare:'EPIC',    lore:'Lurks in the deepest dungeons. Its gaze paralyzes instantly.' },
  { name:'BONE COLOSSUS',    emoji:'💀', level:80, hp:7600,  power:'Death Slam',        color:'#CCCCCC', rare:'RARE',    lore:'Assembled from the bones of 1000 fallen warriors.' },
  { name:'VENOM HYDRA',      emoji:'🐍', level:68, hp:4900,  power:'Acid Spit',         color:VENOM,  rare:'RARE',       lore:'Three heads. Three venoms. Zero mercy.' },
  { name:'THUNDER GOLEM',    emoji:'⚡', level:77, hp:6200,  power:'Plasma Slam',       color:'#FFD700', rare:'EPIC',    lore:'Built by ancient mages. Powered by captured lightning.' },
  { name:'VOID LEVIATHAN',   emoji:'🌊', level:88, hp:8400,  power:'Reality Tear',      color:'#0066FF', rare:'LEGENDARY', lore:'A sea serpent that swallowed an ocean and kept swimming.' },
];

const REGIONS = [
  { name:'THE ASHEN PEAKS',  emoji:'🌋', color:EMBER,    desc:'Volcanic mountain range where wyverns nest.' },
  { name:'SHADOW MARSHES',   emoji:'🌿', color:VENOM,    desc:'Toxic swamps where visibility drops to zero.' },
  { name:'BONE WASTES',      emoji:'💀', color:'#AAA',   desc:'A desert of skeletal remains. Nothing lives here.' },
  { name:'THE VOID RIFT',    emoji:'🌌', color:'#9933FF',desc:'A tear in reality. Monsters spill from beyond.' },
  { name:'DRAGON\'S THRONE', emoji:'🏯', color:LAVA,     desc:'Ancient fortress ruled by Inferno Wyvern.' },
  { name:'CRYSTAL HOLLOWS',  emoji:'💎', color:'#00BBFF',desc:'Underground caverns with forbidden treasures.' },
];

const EMBERS = Array.from({length:30},(_,i)=>({
  x: Math.random()*100, size: 4+Math.random()*8,
  dur: 3+Math.random()*4, del: Math.random()*4,
}));

export default function DragonIsle() {
  const { navigateToRealm } = useRealm();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background:'#0a0200', color:'#F0F0FF' }}>
      <ScrollProgress color={`linear-gradient(to right,${EMBER},${LAVA},${VENOM})`} />
      <BackToTop show={showTop} color={EMBER} />

      {/* Realm Nav */}
      <div className="fixed top-4 left-4 z-[100]">
        <button onClick={() => navigateToRealm('/','#7C3AED','','THE NEXUS')}
          className="font-display text-[8px] px-4 py-2 flex items-center gap-2"
          style={{ background:'rgba(255,69,0,0.2)', border:'1px solid rgba(255,69,0,0.5)', color:EMBER }}>
          ← THE NEXUS
        </button>
      </div>

      {/* HERO */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
        {/* Lava bg */}
        <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline src="/bg-dragon-video.mp4" style={{ opacity:0.4 }} />
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at 50% 80%,rgba(61,10,0,0.75) 0%,rgba(10,2,0,0.88) 60%)' }} />
        <div className="absolute inset-0" style={{ backgroundSize:'32px 32px', backgroundImage:'linear-gradient(to right,rgba(255,69,0,0.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,69,0,0.05) 1px,transparent 1px)' }} />

        {/* Ember particles */}
        {EMBERS.map((e,i) => (
          <motion.div key={i} className="absolute pointer-events-none rounded-full"
            style={{ left:`${e.x}%`, bottom:0, width:e.size, height:e.size, background:`radial-gradient(circle,${LAVA},${EMBER}88)`, boxShadow:`0 0 ${e.size*2}px ${EMBER}` }}
            animate={{ y:[-20,-window.innerHeight], opacity:[0,1,1,0], scale:[0.5,1,0.8,0] }}
            transition={{ repeat:Infinity, duration:e.dur, delay:e.del, ease:'linear' }} />
        ))}

        {/* Lava glow at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background:`linear-gradient(to top,${EMBER}44,transparent)`, pointerEvents:'none' }} />
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background:`linear-gradient(to right,transparent,${EMBER},transparent)`, boxShadow:`0 0 20px ${EMBER}88` }} />

        <motion.div initial={{y:60,opacity:0,rotateX:25}} animate={{y:0,opacity:1,rotateX:0}} transition={{duration:1.2,ease:[0.16,1,0.3,1]}}
          className="text-center relative z-10 px-6 max-w-3xl">
          <motion.div animate={{scale:[1,1.15,1],filter:[`drop-shadow(0 0 20px ${EMBER})`,`drop-shadow(0 0 60px ${EMBER})`,`drop-shadow(0 0 20px ${EMBER})`]}}
            transition={{repeat:Infinity,duration:3}} className="text-7xl sm:text-8xl mb-6">🐉</motion.div>
          <p className="font-display text-[9px] tracking-[0.5em] text-orange-400/60 mb-4">◆ REALM 02 ◆</p>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-white leading-tight mb-4"
            style={{ textShadow:`0 0 40px ${EMBER}88, 0 0 80px ${EMBER}44` }}>
            DRAGON<br/><span style={{ color:EMBER }}>ISLE</span>
          </h1>
          <p className="font-display text-[10px] sm:text-xs tracking-widest text-orange-300/60 mb-4">
            "WHERE ANCIENT POWER BURNS ETERNAL"
          </p>
          <p className="font-sans text-xl text-white/40 italic max-w-md mx-auto mb-10">
            A volcanic realm of dragons, ancient magic, and impossible legends. Only the worthy survive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GoldBtn size="lg" onClick={() => document.getElementById('creatures')?.scrollIntoView({behavior:'smooth'})}
              color={EMBER} shadowColor="#8B2500">
              ⚔️ FACE THE CREATURES
            </GoldBtn>
            <GoldBtn size="lg" outline onClick={() => document.getElementById('lore')?.scrollIntoView({behavior:'smooth'})}
              color={LAVA} shadowColor="#5a2500">
              📜 READ THE LORE
            </GoldBtn>
          </div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-display text-[8px] tracking-widest flex flex-col items-center gap-2"
          style={{ color:`${EMBER}88` }} animate={{y:[0,8,0]}} transition={{repeat:Infinity,duration:1.8}}>
          <span>ENTER THE ISLE</span><span>↓</span>
        </motion.div>
      </section>

      <NeonDivider colors={`${EMBER},${LAVA},${VENOM}`} />

      {/* WORLD LORE */}
      <section id="lore" className="py-24 px-4 sm:px-8" style={{ background:'linear-gradient(to bottom,#0a0200,#120500)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{y:40,opacity:0}} whileInView={{y:0,opacity:1}} viewport={{once:true}} className="text-center mb-16">
            <span className="font-display text-[10px] tracking-widest text-orange-400">📜 ANCIENT LORE</span>
            <h2 className="font-display text-3xl sm:text-4xl text-white mt-4">THE LEGEND OF DRAGON ISLE</h2>
            <NeonDivider colors={`${EMBER},${LAVA},${VENOM}`} />
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <motion.div initial={{x:-50,opacity:0}} whileInView={{x:0,opacity:1}} viewport={{once:true}} transition={{duration:0.9}} className="space-y-6">
              {[
                { title:'THE FIRST AGE', icon:'🌋', text:'Before humans walked the earth, Dragon Isle rose from the sea in a cataclysmic eruption. The fire itself became alive — the first dragons were born from pure magma.' },
                { title:'THE GREAT WAR', icon:'⚔️', text:'For 1000 years, seven dragon clans fought for dominance. Mountains crumbled. Seas boiled. The war ended only when the Void Rift tore reality apart.' },
                { title:'THE PROPHECY', icon:'📜', text:'The ancient scrolls speak of a pixel warrior who will close the Void Rift — but first must defeat Inferno Wyvern in single combat at the Dragon\'s Throne.' },
              ].map((s,i) => (
                <motion.div key={s.title}
                  initial={{x:-30,opacity:0}} whileInView={{x:0,opacity:1}} viewport={{once:true}} transition={{delay:i*0.15,duration:0.7}}
                  className="p-6 relative overflow-hidden"
                  style={{ background:`linear-gradient(135deg,${EMBER}11,${ASH}88)`, border:`1px solid ${EMBER}33` }}>
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ background:EMBER }} />
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="font-display text-[9px] text-orange-400">{s.title}</span>
                  </div>
                  <p className="font-sans text-base text-white/60 italic leading-relaxed">{s.text}</p>
                </motion.div>
              ))}
            </motion.div>
            {/* World map */}
            <motion.div initial={{x:50,opacity:0}} whileInView={{x:0,opacity:1}} viewport={{once:true}} transition={{duration:0.9}}>
              <div className="p-6" style={{ background:`linear-gradient(135deg,#1a0500,#0a0200)`, border:`2px solid ${EMBER}44` }}>
                <p className="font-display text-[9px] text-orange-400 mb-6 text-center">🗺️ WORLD MAP — DRAGON ISLE</p>
                <div className="grid grid-cols-2 gap-3">
                  {REGIONS.map((r,i) => (
                    <motion.div key={r.name}
                      initial={{scale:0.8,opacity:0}} whileInView={{scale:1,opacity:1}} viewport={{once:true}} transition={{delay:i*0.08}}
                      whileHover={{scale:1.05,boxShadow:`0 0 20px ${r.color}44`}}
                      className="p-4 transition-all duration-200 cursor-pointer"
                      style={{ background:`${r.color}11`, border:`1px solid ${r.color}44` }}>
                      <div className="text-2xl mb-2">{r.emoji}</div>
                      <p className="font-display text-[7px] leading-snug mb-1" style={{ color:r.color }}>{r.name}</p>
                      <p className="font-sans text-xs text-white/40 italic">{r.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <NeonDivider colors={`${EMBER},${LAVA},${VENOM}`} />

      {/* CREATURE CODEX */}
      <section id="creatures" className="py-24 px-4 sm:px-8" style={{ background:'#0a0200' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{y:40,opacity:0,rotateX:18}} whileInView={{y:0,opacity:1,rotateX:0}} viewport={{once:true}} className="text-center mb-16" style={{perspective:800}}>
            <span className="font-display text-[10px] tracking-widest text-orange-400">⚔️ CREATURE CODEX</span>
            <h2 className="font-display text-3xl sm:text-4xl text-white mt-4">THE BEASTS OF DRAGON ISLE</h2>
            <p className="font-sans text-lg text-white/40 italic mt-4 max-w-lg mx-auto">Six of the most dangerous creatures ever pixel-crafted. Enter at your own risk.</p>
            <NeonDivider colors={`${EMBER},${LAVA},${VENOM}`} />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{perspective:1200}}>
            {CREATURES.map((c,i) => (
              <motion.div key={c.name}
                initial={{y:60,opacity:0,rotateX:20,scale:0.9}} whileInView={{y:0,opacity:1,rotateX:0,scale:1}}
                viewport={{once:true,margin:'-40px'}} transition={{delay:i*0.1,duration:0.8,ease:[0.16,1,0.3,1]}}
                whileHover={{y:-10,rotateX:-4,scale:1.03,boxShadow:`0 30px 60px ${c.color}30`}}
                className="relative overflow-hidden" style={{ background:`linear-gradient(135deg,${c.color}11,#0a0200)`, border:`2px solid ${c.color}44`, transformStyle:'preserve-3d' }}>
                {/* Rarity badge */}
                <div className="absolute top-3 right-3 font-display text-[6px] px-2 py-1"
                  style={{ background:c.rare==='LEGENDARY'?`linear-gradient(135deg,${EMBER},${LAVA})`:c.rare==='EPIC'?c.color+'aa':'transparent',
                    color: c.rare==='LEGENDARY'?'#000':'#fff', border:`1px solid ${c.color}66` }}>
                  {c.rare}
                </div>
                <div className="p-6">
                  <motion.div className="text-5xl mb-4"
                    animate={{ filter:[`drop-shadow(0 0 8px ${c.color}88)`,`drop-shadow(0 0 24px ${c.color})`,`drop-shadow(0 0 8px ${c.color}88)`] }}
                    transition={{ repeat:Infinity, duration:2.5+i*0.3 }}>{c.emoji}</motion.div>
                  <p className="font-display text-[9px] mb-1" style={{ color:c.color }}>LVL {c.level}</p>
                  <h3 className="font-display text-sm text-white mb-1">{c.name}</h3>
                  <p className="font-display text-[7px] text-white/40 mb-3">⚡ {c.power}</p>
                  <p className="font-sans text-sm text-white/50 italic leading-relaxed mb-4">{c.lore}</p>
                  {/* HP bar */}
                  <div>
                    <div className="flex justify-between font-display text-[7px] text-white/40 mb-1">
                      <span>HP</span><span>{c.hp.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-white/10 overflow-hidden">
                      <motion.div className="h-full" style={{ background:`linear-gradient(to right,${c.color},${c.color}aa)` }}
                        initial={{ width:0 }} whileInView={{ width:`${(c.hp/9800)*100}%` }}
                        viewport={{ once:true }} transition={{ delay:i*0.1+0.3, duration:1.2, ease:[0.16,1,0.3,1] }} />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background:c.color, boxShadow:`0 0 12px ${c.color}` }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Return */}
      <div className="py-12 text-center" style={{ background:'#000005', borderTop:`2px solid ${EMBER}22` }}>
        <button onClick={() => navigateToRealm('/','#7C3AED','','THE NEXUS')} className="font-display text-[9px] text-orange-400/60 hover:text-orange-400 transition-colors tracking-widest">
          ← RETURN TO THE NEXUS
        </button>
      </div>
    </div>
  );
}
