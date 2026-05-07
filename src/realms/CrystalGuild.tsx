import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Facebook, Twitter, Youtube, Instagram, ChevronRight } from 'lucide-react';
import { useRealm } from '../context/RealmContext';
import { ScrollProgress, BackToTop, NeonDivider, GoldBtn } from '../components/shared';

const ICE = '#87CEEB', TEAL = '#00CED1', CRYSTAL = '#E8F4FF', AMETHYST = '#9B59B6';

const TESTIMONIALS = [
  { name:'DungeonBrush', tag:'@dungeonbrush', text:'The dragon mug sits on my desk every single day. The pixel art detail is absolutely insane — every pixel is perfect. Worth every coin.', stars:5, color:TEAL },
  { name:'NeonCrusader', tag:'@neoncrusader', text:'Got the Glitch Guardian tee and it\'s genuinely my favourite shirt now. Print quality is premium, ships fast. Pixle Man never misses.', stars:5, color:'#FF2D78' },
  { name:'PixelSage',   tag:'@pixelsage77',   text:'Been following the art for 2 years. Finally bought merch and it exceeded all expectations. The style is completely one of a kind.', stars:5, color:'#FFD700' },
  { name:'DragonPixel', tag:'@dragonpixel_',  text:'Ordered 4 items and every single one is perfect. The colours are vibrant, the quality is premium. Already planning my next order.', stars:5, color:AMETHYST },
];

const FAQS = [
  { q:'Where are products made?',          a:'All Pixle Man merch is print-on-demand through trusted production partners, shipped directly to you worldwide.' },
  { q:'How do I place an order?',          a:'Click any "ADD TO BAG" button or visit our Etsy store. We handle payments securely through Etsy\'s checkout.' },
  { q:'Do you do custom art commissions?', a:'Yes! DM us on Instagram or email via Etsy. Custom pixel portraits, character art, and merch designs available.' },
  { q:'How long does shipping take?',      a:'Standard shipping is 5–10 business days (US). International orders take 10–20 business days. Express options at checkout.' },
  { q:'Can I return or exchange?',         a:'Items are made-to-order so we can\'t accept general returns, but we always fix production errors within 14 days of delivery.' },
];

const CRYSTALS = Array.from({length:20},(_,i)=>({
  x:Math.random()*100, y:Math.random()*100, size:4+Math.random()*10,
  dur:3+Math.random()*4, del:Math.random()*5,
}));

export default function CrystalGuild() {
  const { navigateToRealm } = useRealm();
  const [showTop, setShowTop] = useState(false);
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background:'#020d1a', color:'#E8F4FF' }}>
      <ScrollProgress color={`linear-gradient(to right,${ICE},${TEAL},${AMETHYST})`} />
      <BackToTop show={showTop} color={ICE} />

      {/* Realm Nav */}
      <div className="fixed top-4 left-4 z-[100]">
        <button onClick={() => navigateToRealm('/','#7C3AED','','THE NEXUS')}
          className="font-display text-[8px] px-4 py-2 flex items-center gap-2"
          style={{ background:`rgba(135,206,235,0.1)`, border:`1px solid ${ICE}44`, color:ICE }}>
          ← THE NEXUS
        </button>
      </div>

      {/* Crystal sparkles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {CRYSTALS.map((c,i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ left:`${c.x}%`, top:`${c.y}%`, width:c.size, height:c.size, background:`radial-gradient(circle,${ICE},${TEAL}88)` }}
            animate={{ opacity:[0,0.6,0], scale:[0.5,1.5,0.5] }}
            transition={{ repeat:Infinity, duration:c.dur, delay:c.del }} />
        ))}
      </div>

      {/* HERO */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage:'url(/bg-cosmos.png)', backgroundSize:'cover', backgroundPosition:'center' }} />
        <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse at 50% 40%,rgba(0,206,209,0.12) 0%,rgba(2,13,26,0.88) 70%)` }} />
        <div className="absolute inset-0" style={{ backgroundSize:'28px 28px', backgroundImage:`linear-gradient(to right,${ICE}08 1px,transparent 1px),linear-gradient(to bottom,${ICE}08 1px,transparent 1px)` }} />
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background:`linear-gradient(to right,transparent,${ICE},${TEAL},transparent)`, boxShadow:`0 0 20px ${ICE}` }} />

        {/* Floating crystals */}
        {['💎','❄️','💠','✦','💎'].map((e,i)=>(
          <motion.div key={i} className="absolute text-2xl pointer-events-none select-none opacity-20"
            style={{ left:`${8+i*20}%`, top:`${12+i*14}%` }}
            animate={{ y:[-8,8,-8], rotate:[-6,6,-6] }}
            transition={{ repeat:Infinity, duration:4+i, delay:i*0.6 }}>{e}</motion.div>
        ))}

        <motion.div initial={{y:60,opacity:0,rotateX:25}} animate={{y:0,opacity:1,rotateX:0}} transition={{duration:1.2,ease:[0.16,1,0.3,1]}}
          className="text-center relative z-10 px-6">
          <motion.div animate={{ scale:[1,1.1,1], filter:[`drop-shadow(0 0 20px ${ICE})`,`drop-shadow(0 0 50px ${ICE})`,`drop-shadow(0 0 20px ${ICE})`] }}
            transition={{repeat:Infinity,duration:3}} className="text-7xl mb-6">💎</motion.div>
          <p className="font-display text-[9px] tracking-[0.5em] mb-4" style={{ color:`${ICE}66` }}>◆ REALM 04 ◆</p>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-white leading-tight mb-4"
            style={{ textShadow:`0 0 40px ${ICE}88, 0 0 80px ${TEAL}44` }}>
            THE CRYSTAL<br/><span style={{ color:ICE }}>GUILD</span>
          </h1>
          <p className="font-display text-[9px] tracking-widest mb-4" style={{ color:`${TEAL}aa` }}>
            "FORGED IN ICE. BOUND BY PIXELS."
          </p>
          <p className="font-sans text-xl text-white/40 italic max-w-md mx-auto mb-10">
            The gathering place of pixel adventurers. Reviews, lore, scrolls, and the Guild newsletter.
          </p>
          <GoldBtn size="lg" color={ICE} shadowColor="#2a6080" onClick={() => document.getElementById('reviews')?.scrollIntoView({behavior:'smooth'})}>
            💎 ENTER THE GUILD HALL
          </GoldBtn>
        </motion.div>
      </section>

      <NeonDivider colors={`${ICE},${TEAL},${AMETHYST}`} />

      {/* REVIEWS */}
      <section id="reviews" className="py-24 px-4 sm:px-8" style={{ background:'#020d1a' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{y:40,opacity:0,rotateX:18}} whileInView={{y:0,opacity:1,rotateX:0}} viewport={{once:true}} transition={{duration:0.9}}
            className="text-center mb-16" style={{perspective:800}}>
            <span className="font-display text-[10px] tracking-widest" style={{ color:ICE }}>💬 GUILD INSCRIPTIONS</span>
            <h2 className="font-display text-3xl sm:text-4xl text-white mt-4">WHAT THE GUILD SAYS</h2>
            <NeonDivider colors={`${ICE},${TEAL},${AMETHYST}`} />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{perspective:1200}}>
            {TESTIMONIALS.map((t,i) => (
              <motion.div key={t.name}
                initial={{opacity:0,y:50,rotateY:-20,scale:0.9}} whileInView={{opacity:1,y:0,rotateY:0,scale:1}}
                viewport={{once:true,margin:'-40px'}} transition={{delay:i*0.12,duration:0.8,ease:[0.16,1,0.3,1]}}
                whileHover={{y:-10,rotateY:4,boxShadow:`0 24px 48px ${t.color}25`}}
                className="p-6 flex flex-col gap-4 transition-colors duration-200"
                style={{ background:`${t.color}0a`, border:`1px solid ${t.color}33`, transformStyle:'preserve-3d' }}>
                <div className="flex gap-0.5">
                  {Array.from({length:t.stars}).map((_,j)=>(
                    <Star key={j} size={12} fill="#FFD700" style={{ color:'#FFD700' }} />
                  ))}
                </div>
                <p className="font-sans text-sm italic leading-relaxed flex-1" style={{ color:'rgba(255,255,255,0.6)' }}>"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor:'rgba(255,255,255,0.08)' }}>
                  <div className="w-9 h-9 flex items-center justify-center font-display text-[10px]"
                    style={{ background:`${t.color}22`, border:`2px solid ${t.color}66`, color:t.color }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-display text-[8px] text-white">{t.name}</div>
                    <div className="font-display text-[6px] mt-0.5" style={{ color:'rgba(255,255,255,0.3)' }}>{t.tag}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NeonDivider colors={`${ICE},${TEAL},${AMETHYST}`} />

      {/* SOCIAL */}
      <section className="py-24 px-4 sm:px-8" style={{ background:'linear-gradient(to bottom,#020d1a,#051929)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{y:40,opacity:0}} whileInView={{y:0,opacity:1}} viewport={{once:true}} className="mb-12">
            <span className="font-display text-[10px] tracking-widest" style={{ color:ICE }}>🌐 GUILD PORTALS</span>
            <h2 className="font-display text-3xl sm:text-4xl text-white mt-4">FIND US IN THE REALMS</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5" style={{perspective:1200}}>
            {[
              { Icon:Youtube,   label:'YOUTUBE',   color:'#FF2020', sub:'Videos & Tutorials' },
              { Icon:Instagram, label:'INSTAGRAM', color:'#E1306C', sub:'Art & Behind Scenes' },
              { Icon:Twitter,   label:'TWITTER',   color:'#1DA1F2', sub:'Updates & News' },
              { Icon:Facebook,  label:'FACEBOOK',  color:'#1877F2', sub:'Community Hub' },
            ].map(({ Icon,label,color,sub },i) => (
              <motion.div key={label}
                initial={{opacity:0,y:40,rotateX:20,scale:0.88}} whileInView={{opacity:1,y:0,rotateX:0,scale:1}}
                viewport={{once:true,margin:'-40px'}} transition={{delay:i*0.1,duration:0.8,ease:[0.16,1,0.3,1]}}
                whileHover={{y:-12,rotateX:-8,scale:1.07,boxShadow:`0 28px 56px ${color}35`}}
                className="p-7 flex flex-col items-center gap-4 cursor-pointer transition-colors duration-200"
                style={{ background:`${color}0a`, border:`2px solid ${color}33`, transformStyle:'preserve-3d' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=color;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=`${color}33`;}}>
                <motion.div animate={{rotateY:[0,360]}} transition={{repeat:Infinity,duration:4+i,ease:'linear'}}>
                  <Icon size={32} style={{ color }} />
                </motion.div>
                <div>
                  <p className="font-display text-[9px] text-white">{label}</p>
                  <p className="font-sans text-xs mt-1 italic" style={{ color:'rgba(255,255,255,0.4)' }}>{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NeonDivider colors={`${ICE},${TEAL},${AMETHYST}`} />

      {/* FAQ */}
      <section className="py-24 px-4 sm:px-8" style={{ background:'#020d1a' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{y:20,opacity:0}} whileInView={{y:0,opacity:1}} viewport={{once:true}} className="text-center mb-12">
            <span className="font-display text-[10px] tracking-widest" style={{ color:TEAL }}>❓ QUEST LOG</span>
            <h2 className="font-display text-3xl sm:text-4xl text-white mt-4">FREQUENTLY ASKED</h2>
            <NeonDivider colors={`${ICE},${TEAL},${AMETHYST}`} />
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((f,i) => (
              <motion.div key={i} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.07}}
                className="border overflow-hidden transition-all duration-200"
                style={{ borderColor: openFaq===i?`${ICE}66`:'rgba(255,255,255,0.1)', background:'rgba(135,206,235,0.04)' }}>
                <button className="w-full flex items-center justify-between px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq===i?null:i)}>
                  <span className="font-display text-[9px] text-white pr-4">{f.q}</span>
                  <motion.span animate={{rotate:openFaq===i?90:0}} transition={{duration:0.2}} style={{ color:ICE }}>
                    <ChevronRight size={16}/>
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq===i && (
                    <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} style={{overflow:'hidden'}}>
                      <p className="font-sans text-base italic px-6 pb-5 leading-relaxed" style={{ color:'rgba(255,255,255,0.5)' }}>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NeonDivider colors={`${ICE},${TEAL},${AMETHYST}`} />

      {/* NEWSLETTER */}
      <section className="py-24 px-4 sm:px-8" style={{ background:'linear-gradient(to bottom,#051929,#020d1a)' }}>
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{opacity:0,y:30,scale:0.95}} whileInView={{opacity:1,y:0,scale:1}} viewport={{once:true}}
            className="p-10 md:p-14 text-center border-2"
            style={{ borderColor:`${ICE}44`, background:`${ICE}06`, boxShadow:`0 0 60px ${ICE}18` }}>
            <div className="text-4xl mb-4">📜</div>
            <div className="font-display text-[8px] tracking-widest mb-3" style={{ color:ICE }}>SCROLL OF NEWS</div>
            <h3 className="font-display text-2xl text-white mb-4">JOIN THE GUILD</h3>
            <p className="text-white/40 font-sans italic mb-8 leading-relaxed">
              Art drops, merch launches, community events — plus
              <span style={{ color:ICE }}> 10 Gold Coins</span> off your first order.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-xs animate-pulse" style={{ color:ICE }}>&gt;</span>
                <input type="email" placeholder="Enter hero email..."
                  className="w-full border-2 p-4 pl-10 font-display text-[9px] outline-none transition-colors"
                  style={{ background:'#020d1a', borderColor:`${ICE}33`, color:'#E8F4FF' }}
                  onFocus={e=>{e.currentTarget.style.borderColor=ICE;}}
                  onBlur={e=>{e.currentTarget.style.borderColor=`${ICE}33`;}} />
              </div>
              <button className="font-display text-[10px] px-8 py-4 whitespace-nowrap transition-all duration-150 active:scale-95"
                style={{ background:ICE, color:'#020d1a', boxShadow:`4px 4px 0 ${TEAL}` }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow=`6px 6px 0 ${TEAL},0 0 22px ${ICE}99`;}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow=`4px 4px 0 ${TEAL}`;}}>
                JOIN GUILD
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <div className="py-12 text-center" style={{ background:'#000005', borderTop:`1px solid ${ICE}22` }}>
        <button onClick={() => navigateToRealm('/','#7C3AED','','THE NEXUS')} className="font-display text-[9px] tracking-widest transition-colors"
          style={{ color:`${ICE}44` }}
          onMouseEnter={e=>{e.currentTarget.style.color=ICE;}} onMouseLeave={e=>{e.currentTarget.style.color=`${ICE}44`;}}>
          ← RETURN TO THE NEXUS
        </button>
      </div>
    </div>
  );
}
