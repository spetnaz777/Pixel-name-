import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown, ShoppingCart, Menu, X, Star, Heart, Gem, Pencil,
  Facebook, Twitter, Youtube, Instagram, ChevronRight, ExternalLink,
  Award, Shield, Zap,
} from 'lucide-react';
import { useRealm } from '../context/RealmContext';
import { useCart } from '../context/CartContext';
import {
  PixleLogo, Ticker, NeonDivider, GoldBtn, Counter,
  PixelDivider, ScrollProgress, BackToTop, useTilt, useParallax,
} from '../components/shared';

/* ─────────────────────────────────────────────── DATA ── */
const SPARKLES = Array.from({ length: 24 }, (_, i) => ({
  id: i, top: `${8+((i*37+7)%82)}%`, left: `${3+((i*53+11)%93)}%`,
  dur: 2.5+(i%6)*0.6, del: (i*0.35)%5, sym: ['✦','✧','✨','✴','⭐','◆'][i%6],
}));

const NAV_ITEMS = [
  { icon:<Star size={14} fill="currentColor"/>,  label:'EXPLORE', color:'#FFD700', id:'gallery'   },
  { icon:<Heart size={14} fill="currentColor"/>, label:'INSPIRE', color:'#FF2D78', id:'about'     },
  { icon:<Gem size={14} fill="currentColor"/>,   label:'IMAGINE', color:'#00E5CC', id:'community' },
  { icon:<Pencil size={14}/>,                    label:'CREATE',  color:'#FF9F1C', id:'portals'   },
];

const GALLERY_ITEMS = [
  { title:'Dragon Isle',      emoji:'🐉', bg:'#120824', col:'#FF2D78' },
  { title:'Crystal Cave',     emoji:'💎', bg:'#071424', col:'#38B2F5' },
  { title:'Pixel Village',    emoji:'🏡', bg:'#14140A', col:'#FF9F1C' },
  { title:'Sky Fortress',     emoji:'🏰', bg:'#071414', col:'#00E5CC' },
  { title:'Ocean Depths',     emoji:'🌊', bg:'#070A24', col:'#38B2F5' },
  { title:'Enchanted Forest', emoji:'🌳', bg:'#071410', col:'#00E5CC' },
  { title:'Neon City',        emoji:'🌆', bg:'#140A1C', col:'#C084FC' },
  { title:'Time Rift',        emoji:'⚡', bg:'#141408', col:'#FFD700' },
  { title:'Lava Caverns',     emoji:'🌋', bg:'#1a0808', col:'#FF9F1C' },
  { title:'Phantom Realm',    emoji:'👻', bg:'#0d0d1f', col:'#C084FC' },
  { title:'Moon Garden',      emoji:'🌙', bg:'#080d1a', col:'#38B2F5' },
  { title:'Pixel Colosseum',  emoji:'⚔️', bg:'#100814', col:'#FF2D78' },
];

const TESTIMONIALS = [
  { name:'DungeonBrush', tag:'@dungeonbrush', text:'The dragon mug sits on my desk every day. The pixel art detail is absolutely insane — every pixel is perfect. Worth every coin.', stars:5, color:'#00E5CC' },
  { name:'NeonCrusader', tag:'@neoncrusader', text:'Got the Glitch Guardian tee and it\'s my favourite shirt. Print quality is premium, ships fast. Pixle Man never misses.', stars:5, color:'#FF2D78' },
  { name:'PixelSage',    tag:'@pixelsage77',  text:'Been following the art for 2 years. Finally bought merch and it exceeded all expectations. Completely one of a kind.', stars:5, color:'#FFD700' },
  { name:'DragonPixel',  tag:'@dragonpixel_', text:'Ordered 4 items, every one is perfect. Colours are vibrant, quality is premium. Already planning my next order.', stars:5, color:'#C084FC' },
];

const FAQS = [
  { q:'Where are products made?',          a:'All Pixle Man merch is print-on-demand through trusted partners, shipped directly to you worldwide.' },
  { q:'How do I place an order?',          a:'Click "ADD TO BAG" or visit our Etsy store. We handle payments securely through Etsy\'s checkout system.' },
  { q:'Do you do custom art commissions?', a:'Yes! DM us on Instagram or email via Etsy. Custom pixel portraits, character art, and merch designs available.' },
  { q:'How long does shipping take?',      a:'Standard shipping is 5–10 business days (US). International orders take 10–20 business days. Express options available.' },
  { q:'Can I return or exchange?',         a:'Items are made-to-order so we can\'t accept general returns, but we always fix production errors within 14 days.' },
];

const PROCESS_STEPS = [
  { icon:'💡', title:'CONCEPT',      desc:'Every piece starts with a world-building idea — a creature, a landscape, a legend.' },
  { icon:'🎨', title:'PIXEL CRAFT',  desc:'Painted pixel by pixel using custom palettes, building depth and atmosphere by hand.' },
  { icon:'✨', title:'BRING TO LIFE',desc:'The artwork is animated, refined, and dropped into merch that carries the story.' },
];

const REALMS = [
  { path:'/kingdom',    color:'#FFD700', shadow:'rgba(255,215,0,0.6)',   name:'CHROMATIC KINGDOM',  sub:'Original Pixel Art',    emoji:'👑', bg:'/bg-pixleman-banner.png',  particle:'✦', lore:'Enter the royal halls of original pixel art. Gold-framed masterpieces and the Creator\'s greatest works.' },
  { path:'/dragon-isle',color:'#FF4500', shadow:'rgba(255,69,0,0.6)',    name:'DRAGON ISLE',         sub:'The Fantasy World',      emoji:'🐉', bg:'/bg-dragon-isle.png',     particle:'🔥',lore:'A volcanic ancient realm where dragons rule the sky and ancient magic tears through the land.' },
  { path:'/shop',       color:'#00E5FF', shadow:'rgba(0,229,255,0.6)',   name:'NEON ABYSS',          sub:'Cyberpunk Merch Shop',   emoji:'⚡', bg:'/bg-neon-abyss.png',      particle:'◈', lore:'A digital marketplace in cyberspace. Holographic products and pixel merch that bends reality.' },
  { path:'/guild',      color:'#87CEEB', shadow:'rgba(135,206,235,0.6)', name:'CRYSTAL GUILD',       sub:'The Community',          emoji:'💎', bg:'/bg-cosmos.png',          particle:'❄️',lore:'Deep beneath the ice, the Guild Hall — where pixel adventurers gather and forge eternal bonds.' },
  { path:'/sanctum',    color:'#FF9F1C', shadow:'rgba(255,159,28,0.6)',  name:"CREATOR'S SANCTUM",   sub:'The Origin Story',       emoji:'🎨', bg:'/bg-sunset-castle.png',   particle:'✨',lore:'Step into the studio where every pixel is born. The creator\'s process and the story behind it all.' },
];

/* ─────────────────────────────────────────────── SUB-COMPONENTS ── */
const GalleryCard = ({ item, index }: { item: typeof GALLERY_ITEMS[0]; index: number }) => {
  const ref = useTilt(11);
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, scale:0.84, y:28, rotateX:20 }}
      whileInView={{ opacity:1, scale:1, y:0, rotateX:0 }}
      viewport={{ once:true, margin:'-40px' }}
      transition={{ delay:(index%4)*0.07, duration:0.75, ease:[0.16,1,0.3,1] }}
      className="group cursor-pointer border border-[#0D0B1E]/80 overflow-hidden bracket-hover"
      style={{ background:item.bg, transformStyle:'preserve-3d' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${item.col}88`; e.currentTarget.style.boxShadow=`0 20px 50px ${item.col}30`; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(13,11,30,0.8)'; e.currentTarget.style.boxShadow=''; }}>
      <div className="aspect-square flex items-center justify-center text-5xl sm:text-6xl group-hover:scale-125 transition-transform duration-300">{item.emoji}</div>
      <div className="px-3 py-2.5 border-t" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
        <p className="font-display text-[7px] text-[#9B8EC4] truncate group-hover:text-yellow-400 transition-colors">{item.title}</p>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────── MAIN PAGE ── */
export default function Nexus() {
  const { navigateToRealm } = useRealm();
  const { cartCount, setIsCartOpen } = useCart();
  const videoRef     = useRef<HTMLVideoElement>(null);
  const aboutBgRef   = useParallax(0.28);
  const [scrolled,   setScrolled]   = useState(false);
  const [showTop,    setShowTop]    = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq,    setOpenFaq]    = useState<number|null>(null);
  const [hoveredRealm, setHoveredRealm] = useState<string|null>(null);

  /* force-play video immediately */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    const play = () => vid.play().catch(()=>{});
    if (vid.readyState >= 2) play();
    else vid.addEventListener('loadeddata', play, { once:true });
  }, []);

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 55); setShowTop(window.scrollY > 400); };
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const goto = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });
    setMobileOpen(false);
  };

  const enterRealm = (realm: typeof REALMS[0], e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const ox = ((rect.left + rect.width / 2) / window.innerWidth)  * 100;
    const oy = ((rect.top  + rect.height/ 2) / window.innerHeight) * 100;
    navigateToRealm(realm.path, realm.color, realm.bg, realm.name, { x:ox, y:oy });
  };

  return (
    <div className="min-h-screen bg-[#0D0B1E] text-[#F0F0FF] overflow-x-hidden">
      <ScrollProgress color="linear-gradient(to right,#7C3AED,#FFD700,#FF2D78)" />
      <div className="scanline" />
      <BackToTop show={showTop} color="#FFD700" />

      {/* ══════ NAVBAR ══════ */}
      <nav className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
        scrolled ? 'bg-[#0D0B1E]/98 backdrop-blur-md border-b-2 border-yellow-400/30 py-3' : 'bg-[#0D0B1E]/80 backdrop-blur-sm py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <button onClick={() => window.scrollTo({top:0,behavior:'smooth'})}
            onMouseEnter={e=>{e.currentTarget.style.filter='drop-shadow(0 0 14px rgba(255,215,0,0.6))';}}
            onMouseLeave={e=>{e.currentTarget.style.filter='';}} style={{transition:'filter 0.2s'}}>
            <PixleLogo scale={1.4} />
          </button>
          <div className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map(n => (
              <button key={n.label} onClick={()=>goto(n.id)}
                className="font-display text-sm text-[#F0F0FF] flex items-center gap-2.5 relative group tracking-widest"
                style={{transition:'color 0.2s,transform 0.2s'}}
                onMouseEnter={e=>{e.currentTarget.style.color=n.color;e.currentTarget.style.transform='translateY(-2px)';}}
                onMouseLeave={e=>{e.currentTarget.style.color='';e.currentTarget.style.transform='';}}>
                <span style={{color:n.color}}>{n.icon}</span>{n.label}
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-full" style={{background:n.color}} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <button className="relative" onClick={()=>setIsCartOpen(true)}>
              <ShoppingCart className="w-7 h-7 text-yellow-400" />
              {cartCount > 0 && (
                <motion.span initial={{scale:0}} animate={{scale:1}}
                  className="absolute -top-2.5 -right-2.5 bg-yellow-400 text-black font-display text-[8px] w-6 h-6 flex items-center justify-center">
                  {cartCount}
                </motion.span>
              )}
            </button>
            <button className="md:hidden text-yellow-400" onClick={()=>setMobileOpen(o=>!o)}>
              {mobileOpen ? <X size={28}/> : <Menu size={28}/>}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
              className="md:hidden bg-[#0D0B1E] border-b-2 border-yellow-400/25 px-8 py-7 flex flex-col gap-7">
              {NAV_ITEMS.map(n => (
                <button key={n.label} onClick={()=>goto(n.id)}
                  className="font-display text-sm flex items-center gap-4 tracking-widest" style={{color:n.color}}>
                  {n.icon}{n.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══════ HERO ══════ */}
      <section id="hero" className="relative min-h-[100dvh] flex items-end justify-center overflow-hidden bg-[#0D0B1E]">
        <div className="absolute inset-0">
          <video ref={videoRef} autoPlay muted loop playsInline preload="auto" poster="/hero-bg.png"
            className="w-full h-full object-cover object-center">
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(13,11,30,0.97) 0%,rgba(13,11,30,0.3) 30%,transparent 60%)'}} />
          <div className="absolute inset-0" style={{background:'linear-gradient(to bottom,rgba(13,11,30,0.55) 0%,transparent 20%)'}} />
        </div>
        <motion.div className="absolute top-24 left-4 sm:left-16 z-10 float"
          initial={{x:-60,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:1,duration:0.8}}>
          <div className="font-display text-[7px] sm:text-[8px] bg-[#FF2D78] text-white px-3 sm:px-4 py-2" style={{boxShadow:'3px 3px 0 #8b1042'}}>🔥 NEW DROP</div>
        </motion.div>
        <motion.div className="absolute top-24 right-4 sm:right-16 z-10 float-delayed"
          initial={{x:60,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:1.2,duration:0.8}}>
          <div className="font-display text-[7px] sm:text-[8px] bg-yellow-400 text-black px-3 sm:px-4 py-2" style={{boxShadow:'3px 3px 0 #a07800'}}>⭐ CREATOR</div>
        </motion.div>
        <motion.div className="absolute top-40 left-4 sm:left-24 z-10 hidden sm:block"
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5}}>
          <div className="font-display text-[7px] border border-[#00E5CC]/40 text-[#00E5CC] px-3 py-1.5" style={{background:'rgba(0,229,204,0.08)'}}>💎 LIMITED</div>
        </motion.div>
        {SPARKLES.map(s=>(
          <motion.div key={s.id} className="absolute pointer-events-none select-none" style={{top:s.top,left:s.left,fontSize:'14px'}}
            animate={{opacity:[0,1,0],scale:[0.3,1.2,0.3]}} transition={{repeat:Infinity,duration:s.dur,delay:s.del}}>{s.sym}</motion.div>
        ))}
        <div className="scene-3d relative z-10 flex flex-col items-center gap-5 pb-16 sm:pb-20 px-5 w-full max-w-lg mx-auto">
          <motion.p initial={{opacity:0,y:-12,rotateX:30}} animate={{opacity:1,y:0,rotateX:0}} transition={{delay:0.6,duration:0.8,ease:[0.16,1,0.3,1]}}
            className="font-display text-[7px] sm:text-[9px] text-yellow-400 tracking-widest opacity-80 text-center">
            ◆ WELCOME TO THE CHROMATIC KINGDOM ◆
          </motion.p>
          <motion.div initial={{opacity:0,y:60,rotateX:25,scale:0.9}} animate={{opacity:1,y:0,rotateX:0,scale:1}} transition={{delay:0.4,duration:1,ease:[0.16,1,0.3,1]}}
            className="flex flex-col sm:flex-row gap-4 w-full">
            <GoldBtn onClick={()=>goto('portals')} size="lg" className="w-full text-center">⭐ EXPLORE WORLDS</GoldBtn>
            <GoldBtn onClick={()=>goto('portals')} size="lg" outline className="w-full text-center">🌌 CHOOSE REALM</GoldBtn>
          </motion.div>
          <motion.div initial={{opacity:0,y:20,rotateX:15}} animate={{opacity:1,y:0,rotateX:0}} transition={{delay:0.9,duration:0.8}}
            className="flex flex-wrap justify-center gap-3 sm:gap-6 font-display text-[7px] sm:text-[8px] text-[#9B8EC4]">
            <span className="flex items-center gap-1"><span className="text-yellow-400">★★★★★</span> 5.0</span>
            <span className="hidden sm:inline text-[#14112E]">|</span>
            <span>5K+ Community</span>
            <span className="hidden sm:inline text-[#14112E]">|</span>
            <span>100+ Artworks</span>
          </motion.div>
        </div>
        <motion.div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10 cursor-pointer"
          style={{color:'rgba(255,215,0,0.6)'}} animate={{y:[0,8,0]}} transition={{repeat:Infinity,duration:1.8}}
          onClick={()=>goto('portals')}>
          <span className="font-display text-[8px] tracking-widest">SCROLL</span>
          <ChevronDown size={16}/>
        </motion.div>
      </section>

      {/* ══════ TICKER ══════ */}
      <NeonDivider />
      <Ticker />

      {/* ══════ REALM PORTALS ══════ */}
      <section id="portals" className="relative py-28 overflow-hidden" style={{background:'#000005'}}>
        <div className="absolute inset-0 pointer-events-none">
          {/* Portal section bg: the Pixle Man banner, very dark */}
          <div className="absolute inset-0" style={{backgroundImage:'url(/bg-pixleman-banner.png)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.07}} />
          <div className="absolute inset-0" style={{background:'linear-gradient(to bottom,#000005,rgba(0,0,5,0.85),#000005)'}} />
          {/* Stars */}
          {Array.from({length:80},(_,i)=>(
            <motion.div key={i} className="absolute rounded-full bg-white"
              style={{ left:`${(i*37+7)%100}%`, top:`${(i*53+11)%100}%`, width:(i%3)+1, height:(i%3)+1, opacity:0.3 }}
              animate={{opacity:[0.1,0.6,0.1]}} transition={{repeat:Infinity,duration:2+(i%4),delay:(i*0.15)%5}} />
          ))}
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-8" style={{background:'radial-gradient(circle,#7C3AED,transparent 70%)',filter:'blur(80px)'}} />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full opacity-6" style={{background:'radial-gradient(circle,#FF2D78,transparent 70%)',filter:'blur(80px)'}} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div initial={{y:50,opacity:0,rotateX:22}} whileInView={{y:0,opacity:1,rotateX:0}}
            viewport={{once:true,margin:'-60px'}} transition={{duration:0.9,ease:[0.16,1,0.3,1]}}
            className="text-center mb-20 scene-3d">
            <span className="font-display text-[9px] sm:text-[11px] tracking-[0.5em] text-[#9B8EC4]">◆ THE CHROMATIC MULTIVERSE ◆</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mt-4" style={{textShadow:'0 0 40px rgba(255,215,0,0.3)'}}>
              CHOOSE YOUR <span style={{color:'#FFD700',textShadow:'0 0 30px #FFD700'}}>REALM</span>
            </h2>
            <p className="font-sans text-lg text-[#9B8EC4] italic mt-5 max-w-xl mx-auto">
              Five universes. Each portal leads to a completely different world. Which realm calls to you?
            </p>
            <motion.div className="h-px w-64 mx-auto mt-6" style={{background:'linear-gradient(to right,transparent,rgba(255,215,0,0.6),transparent)'}}
              animate={{scaleX:[0.4,1,0.4],opacity:[0.4,1,0.4]}} transition={{repeat:Infinity,duration:3,ease:'easeInOut'}} />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{perspective:1400}}>
            {REALMS.map((realm,i) => (
              <motion.div key={realm.path}
                initial={{opacity:0,y:80,rotateX:32,scale:0.85}}
                whileInView={{opacity:1,y:0,rotateX:0,scale:1}}
                viewport={{once:true,margin:'-40px'}}
                transition={{delay:i*0.1,duration:1,ease:[0.16,1,0.3,1]}}
                className="cursor-pointer group" style={{perspective:'1000px'}}
                onMouseEnter={()=>setHoveredRealm(realm.path)}
                onMouseLeave={()=>setHoveredRealm(null)}
                onClick={(e)=>enterRealm(realm,e)}>
                <motion.div
                  animate={{ rotateY:hoveredRealm===realm.path?3:0, rotateX:hoveredRealm===realm.path?-5:0, scale:hoveredRealm===realm.path?1.05:1, y:hoveredRealm===realm.path?-12:0 }}
                  transition={{type:'spring',stiffness:260,damping:22}}
                  style={{ transformStyle:'preserve-3d',
                    background:hoveredRealm===realm.path?`linear-gradient(135deg,${realm.color},${realm.color}55,${realm.color})`:`linear-gradient(135deg,${realm.color}44,${realm.color}11,${realm.color}44)`,
                    boxShadow:hoveredRealm===realm.path?`0 0 80px ${realm.shadow},0 40px 80px rgba(0,0,0,0.85),inset 0 0 30px ${realm.color}22`:`0 0 20px ${realm.color}22,0 10px 40px rgba(0,0,0,0.6)`,
                    padding:'2px' }}>
                  {/* Portal interior with REAL background image preview */}
                  <div className="relative overflow-hidden" style={{minHeight:300}}>
                    <div className="absolute inset-0" style={{backgroundImage:`url(${realm.bg})`,backgroundSize:'cover',backgroundPosition:'center',
                      filter:`brightness(${hoveredRealm===realm.path?0.55:0.3}) saturate(1.4)`,
                      transform:hoveredRealm===realm.path?'scale(1.08)':'scale(1)',transition:'all 0.5s ease'}} />
                    <div className="absolute inset-0" style={{background:hoveredRealm===realm.path?`linear-gradient(to top,${realm.color}44,rgba(0,0,0,0.55))`:'linear-gradient(to top,rgba(0,0,0,0.75),rgba(0,0,0,0.55))'}} />
                    {/* Hover particles */}
                    {hoveredRealm===realm.path && Array.from({length:10},(_,k)=>(
                      <motion.div key={k} className="absolute text-lg pointer-events-none"
                        initial={{x:`${Math.random()*80+10}%`,y:'110%',opacity:0}}
                        animate={{y:'-20%',opacity:[0,1,0]}}
                        transition={{duration:1.5+Math.random(),delay:Math.random()*0.4,repeat:Infinity,repeatDelay:Math.random()}}>
                        {realm.particle}
                      </motion.div>
                    ))}
                    {/* Corner brackets */}
                    {[['top-3 left-3','border-t-2 border-l-2'],['top-3 right-3','border-t-2 border-r-2'],['bottom-3 left-3','border-b-2 border-l-2'],['bottom-3 right-3','border-b-2 border-r-2']].map(([pos,bdr],k)=>(
                      <div key={k} className={`absolute w-5 h-5 transition-all duration-300 ${pos} ${bdr}`}
                        style={{borderColor:realm.color,opacity:hoveredRealm===realm.path?1:0.3}} />
                    ))}
                    <div className="p-7 flex flex-col h-full relative z-10" style={{minHeight:300}}>
                      <motion.div className="text-5xl mb-4"
                        animate={{scale:hoveredRealm===realm.path?1.3:1,rotateY:hoveredRealm===realm.path?[0,15,-15,0]:0}}
                        transition={{duration:0.6}}>{realm.emoji}</motion.div>
                      <div className="font-display text-[8px] tracking-[0.3em] mb-1" style={{color:realm.color,opacity:0.7}}>◆ REALM 0{i+1} ◆</div>
                      <h3 className="font-display text-sm text-white mb-1 leading-tight" style={{textShadow:`0 0 20px ${realm.color}88`}}>{realm.name}</h3>
                      <p className="font-display text-[8px] mb-3" style={{color:realm.color}}>{realm.sub}</p>
                      <p className="font-sans text-sm text-white/60 italic leading-relaxed flex-1">{realm.lore}</p>
                      <motion.div className="mt-5 font-display text-[9px] flex items-center gap-3" style={{color:realm.color}}
                        animate={{x:hoveredRealm===realm.path?6:0}}>
                        <span>ENTER REALM</span>
                        <motion.span animate={{x:hoveredRealm===realm.path?[0,8,0]:0}} transition={{repeat:Infinity,duration:0.7}}>→</motion.span>
                      </motion.div>
                    </div>
                    <motion.div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{background:realm.color,boxShadow:`0 0 10px ${realm.color}`}}
                      animate={{opacity:hoveredRealm===realm.path?1:0.2,scaleX:hoveredRealm===realm.path?1:0.3}} transition={{duration:0.3}} />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
          <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:0.5}}
            className="font-display text-[7px] text-white/15 tracking-widest text-center mt-14">
            ◆ EACH PORTAL LEADS TO A COMPLETELY DIFFERENT UNIVERSE ◆
          </motion.p>
        </div>
      </section>

      <NeonDivider />

      {/* ══════ ABOUT / INSPIRE ══════ */}
      <section id="about" className="relative py-20 md:py-36 overflow-hidden">
        <div ref={aboutBgRef} className="absolute inset-0" style={{backgroundImage:'url(/about-bg.png)',backgroundSize:'cover',backgroundPositionX:'50%',backgroundPositionY:'50%',willChange:'background-position-y'}} />
        <div className="absolute inset-0" style={{background:'rgba(13,11,30,0.60)'}} />
        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div initial={{x:-60,opacity:0,rotateY:-25,scale:0.88}} whileInView={{x:0,opacity:1,rotateY:0,scale:1}}
            viewport={{once:true,margin:'-80px'}} transition={{duration:1,ease:[0.16,1,0.3,1]}} className="flex justify-center scene-3d">
            <div className="relative preserve-3d depth-float">
              <div className="absolute -inset-8 rounded-full opacity-25" style={{background:'radial-gradient(circle,#C084FC 0%,transparent 70%)'}} />
              <div className="relative rounded-full overflow-hidden"
                style={{width:'clamp(240px,33vw,420px)',height:'clamp(240px,33vw,420px)',border:'4px solid #C084FC',boxShadow:'0 0 50px rgba(192,132,252,0.5),0 0 100px rgba(192,132,252,0.18),0 30px 60px rgba(0,0,0,0.6)'}}>
                <img src="https://storage.googleapis.com/static.rethink.software/yusefazmoon22/pixle_man_create_original_banner.png"
                  className="w-full h-full object-cover" style={{objectPosition:'38% center',transform:'scale(1.15)'}} alt="Pixle Man Creator" />
              </div>
              <motion.div className="absolute -top-4 -right-4 font-display text-[8px] bg-yellow-400 text-black px-3 py-2"
                style={{boxShadow:'3px 3px 0 #a07800'}} animate={{rotate:[-4,4,-4]}} transition={{repeat:Infinity,duration:3}}>CREATOR</motion.div>
              <motion.div className="absolute -bottom-4 -left-4 font-display text-[8px] bg-[#FF2D78] text-white px-3 py-2"
                style={{boxShadow:'3px 3px 0 #8b1042'}} animate={{rotate:[3,-3,3]}} transition={{repeat:Infinity,duration:3.5}}>PIXEL ARTIST</motion.div>
              <motion.div className="absolute top-1/2 -right-6 font-display text-[7px] bg-[#00E5CC] text-black px-2 py-1"
                style={{boxShadow:'2px 2px 0 #007a88'}} animate={{y:[-4,4,-4]}} transition={{repeat:Infinity,duration:4}}>ORIGINAL</motion.div>
            </div>
          </motion.div>
          <motion.div initial={{x:80,opacity:0,rotateY:20}} whileInView={{x:0,opacity:1,rotateY:0}} viewport={{once:true,margin:'-80px'}}
            transition={{duration:1,ease:[0.16,1,0.3,1]}} className="space-y-7 scene-3d">
            <div>
              <span className="font-display text-[10px] tracking-widest" style={{color:'#FF2D78'}}>💗 INSPIRE</span>
              <h2 className="text-4xl md:text-5xl mt-4 leading-tight">MEET THE<br/><span className="shimmer-gold">CREATOR</span></h2>
            </div>
            <div className="w-20 h-1 bg-yellow-400" />
            <p className="font-sans text-xl text-[#9B8EC4] leading-relaxed italic">
              Welcome to <span className="text-[#F0F0FF] not-italic font-bold">Pixle Man</span> — a creative world where pixel art, imagination, and storytelling collide into something truly magical.
            </p>
            <p className="font-sans text-lg text-[#9B8EC4] leading-relaxed italic">
              Born from a love of retro games and fantastical worlds, every piece is crafted pixel by pixel — no filters, no shortcuts. Just raw creativity and obsessive detail.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <Counter value={100} suffix="+" label="ARTWORKS"  color="#00E5CC" />
              <Counter value={5000} suffix="+" label="COMMUNITY" color="#FF2D78" />
              <Counter value={3}   suffix="YRS" label="CREATING"  color="#FFD700" />
            </div>
            <GoldBtn onClick={()=>goto('gallery')}>VIEW GALLERY →</GoldBtn>
          </motion.div>
        </div>
        {/* Process strip */}
        <div className="relative max-w-7xl mx-auto px-6 mt-24">
          <PixelDivider />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 scene-3d">
            {PROCESS_STEPS.map((s,i)=>(
              <motion.div key={s.title}
                initial={{y:60,opacity:0,rotateX:30,scale:0.9}} whileInView={{y:0,opacity:1,rotateX:0,scale:1}}
                viewport={{once:true,margin:'-60px'}} transition={{delay:i*0.18,duration:0.85,ease:[0.16,1,0.3,1]}}
                whileHover={{y:-10,rotateX:-6,scale:1.04,boxShadow:'0 24px 48px rgba(255,215,0,0.18)'}}
                className="bg-[#14112E]/50 border border-[#14112E] p-7 text-center bracket-hover card-3d cursor-default">
                <motion.div className="text-4xl mb-4" animate={{rotateY:[0,360]}} transition={{repeat:Infinity,duration:6+i,ease:'linear'}}>{s.icon}</motion.div>
                <div className="font-display text-[9px] text-yellow-400 mb-3 tracking-wider">{`0${i+1}. ${s.title}`}</div>
                <p className="font-sans text-sm text-[#9B8EC4] italic leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NeonDivider />

      {/* ══════ GALLERY / EXPLORE ══════ */}
      <section id="gallery" className="relative py-28 md:py-36 bg-[#14112E] overflow-hidden">
        <div className="absolute inset-0 pixel-grid-cyan" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div initial={{y:50,opacity:0,rotateX:20}} whileInView={{y:0,opacity:1,rotateX:0}}
            viewport={{once:true,margin:'-60px'}} transition={{duration:0.9,ease:[0.16,1,0.3,1]}} className="text-center mb-16 scene-3d">
            <span className="font-display text-[10px] tracking-widest text-yellow-400">⭐ EXPLORE</span>
            <h2 className="text-4xl md:text-5xl mt-4">THE PIXEL WORLD</h2>
            <p className="font-sans text-lg text-[#9B8EC4] italic mt-4 max-w-lg mx-auto">Every artwork is a portal into the Chromatic Kingdom — explore the realms.</p>
            <NeonDivider />
          </motion.div>
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            className="relative overflow-hidden mb-10 border-2 group cursor-pointer transition-all duration-300"
            style={{height:'clamp(220px,35vw,440px)',borderColor:'rgba(255,215,0,0.25)'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,215,0,0.7)';e.currentTarget.style.boxShadow='0 0 40px rgba(255,215,0,0.18)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,215,0,0.25)';e.currentTarget.style.boxShadow='';}}>
            <img src="https://storage.googleapis.com/static.rethink.software/yusefazmoon22/pixle_man_create_original_banner.png"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="The Chromatic Kingdom" />
            <div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(13,11,30,0.92) 0%,rgba(13,11,30,0.25) 45%,transparent 70%)'}} />
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
              <span className="bg-yellow-400 text-black font-display text-[8px] px-3 py-1.5">✦ FEATURED</span>
              <h3 className="font-display text-xl md:text-3xl text-white mt-3" style={{textShadow:'2px 2px 0 #000'}}>THE CHROMATIC KINGDOM</h3>
              <p className="text-[#9B8EC4] font-sans italic mt-2 text-sm md:text-base">A world where every pixel tells a legend</p>
            </div>
            <div className="absolute top-4 right-4 font-display text-[7px] bg-[#FF2D78] text-white px-2 py-1" style={{boxShadow:'2px 2px 0 #8b1042'}}>ORIGINAL</div>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 scene-3d">
            {GALLERY_ITEMS.map((item,i)=><GalleryCard key={item.title} item={item} index={i} />)}
          </div>
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} className="text-center mt-12">
            <GoldBtn onClick={()=>{ const r=REALMS[0]; navigateToRealm(r.path,r.color,r.bg,r.name); }}>
              👑 ENTER THE CHROMATIC KINGDOM
            </GoldBtn>
          </motion.div>
        </div>
      </section>

      <NeonDivider />

      {/* ══════ TESTIMONIALS ══════ */}
      <section className="relative py-28 md:py-36 bg-[#0D0B1E] overflow-hidden">
        <div className="absolute inset-0 pixel-grid" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div initial={{y:50,opacity:0,rotateX:18}} whileInView={{y:0,opacity:1,rotateX:0}}
            viewport={{once:true,margin:'-60px'}} transition={{duration:0.9}} className="text-center mb-16 scene-3d">
            <span className="font-display text-[10px] tracking-widest text-yellow-400">💬 REVIEWS</span>
            <h2 className="text-4xl md:text-5xl mt-4">WHAT THE GUILD SAYS</h2>
            <NeonDivider />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 scene-3d">
            {TESTIMONIALS.map((t,i)=>(
              <motion.div key={t.name}
                initial={{opacity:0,y:50,rotateY:-20,scale:0.9}} whileInView={{opacity:1,y:0,rotateY:0,scale:1}}
                viewport={{once:true,margin:'-40px'}} transition={{delay:i*0.12,duration:0.8,ease:[0.16,1,0.3,1]}}
                whileHover={{y:-10,rotateY:4,scale:1.03,boxShadow:`0 24px 48px ${t.color}25`}}
                className="bg-[#14112E] border border-[#14112E] p-6 flex flex-col gap-4 bracket-hover transition-colors duration-200 card-3d"
                onMouseEnter={e=>{e.currentTarget.style.borderColor=`${t.color}55`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--color-pm-surface)';}}>
                <div className="flex gap-0.5">
                  {Array.from({length:t.stars}).map((_,j)=><Star key={j} size={12} fill="#FFD700" style={{color:'#FFD700'}}/>)}
                </div>
                <p className="font-sans text-sm text-[#9B8EC4] italic leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-[#0D0B1E]">
                  <div className="w-9 h-9 flex items-center justify-center font-display text-[10px]"
                    style={{background:`${t.color}22`,border:`2px solid ${t.color}66`,color:t.color}}>{t.name[0]}</div>
                  <div>
                    <div className="font-display text-[8px] text-[#F0F0FF]">{t.name}</div>
                    <div className="font-display text-[6px] text-[#9B8EC4] mt-0.5">{t.tag}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NeonDivider />

      {/* ══════ FAQ ══════ */}
      <section className="relative py-20 bg-[#14112E] overflow-hidden">
        <div className="absolute inset-0 pixel-grid-cyan" />
        <div className="relative max-w-3xl mx-auto px-6">
          <motion.div initial={{y:20,opacity:0}} whileInView={{y:0,opacity:1}} viewport={{once:true}} className="text-center mb-12">
            <span className="font-display text-[10px] tracking-widest text-[#00E5CC]">❓ FAQ</span>
            <h2 className="text-3xl md:text-4xl mt-4">QUEST LOG</h2>
            <div className="h-1 w-20 bg-[#00E5CC] mx-auto mt-5" />
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((f,i)=>(
              <motion.div key={i} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.07}}
                className="border border-[#0D0B1E] bg-[#0D0B1E]/70 overflow-hidden transition-all duration-200"
                style={openFaq===i?{borderColor:'rgba(255,215,0,0.4)'}:{}}>
                <button className="w-full flex items-center justify-between px-6 py-4 text-left" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  <span className="font-display text-[9px] text-[#F0F0FF] pr-4">{f.q}</span>
                  <motion.span animate={{rotate:openFaq===i?90:0}} transition={{duration:0.2}} className="text-yellow-400 shrink-0">
                    <ChevronRight size={16}/>
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq===i && (
                    <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} style={{overflow:'hidden'}}>
                      <p className="font-sans text-base text-[#9B8EC4] italic px-6 pb-5 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NeonDivider />

      {/* ══════ COMMUNITY / IMAGINE ══════ */}
      <section id="community" className="relative py-28 md:py-36 bg-[#0D0B1E] overflow-hidden">
        <div className="absolute inset-0" style={{backgroundSize:'32px 32px',backgroundImage:'linear-gradient(to right,rgba(255,215,0,0.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,215,0,0.05) 1px,transparent 1px)'}} />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{y:60,opacity:0,rotateX:24,scale:0.92}} whileInView={{y:0,opacity:1,rotateX:0,scale:1}}
            viewport={{once:true,margin:'-60px'}} transition={{duration:1,ease:[0.16,1,0.3,1]}} className="scene-3d">
            <span className="font-display text-[10px] tracking-widest text-yellow-400">💎 IMAGINE</span>
            <h2 className="text-4xl md:text-5xl mt-4">JOIN THE GUILD</h2>
            <p className="text-[#9B8EC4] font-sans italic text-xl mt-5 max-w-xl mx-auto">
              Connect with fellow pixel artists, share creations, and unlock exclusive content from the Chromatic Kingdom.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-14 scene-3d">
            {[{Icon:Youtube,label:'YOUTUBE',color:'#FF2020',sub:'Videos & Tutorials'},
              {Icon:Instagram,label:'INSTAGRAM',color:'#E1306C',sub:'Art & Behind Scenes'},
              {Icon:Twitter,label:'TWITTER',color:'#1DA1F2',sub:'Updates & News'},
              {Icon:Facebook,label:'FACEBOOK',color:'#1877F2',sub:'Community Hub'},
            ].map(({Icon,label,color,sub},i)=>(
              <motion.div key={label}
                initial={{opacity:0,y:40,rotateX:22,scale:0.88}} whileInView={{opacity:1,y:0,rotateX:0,scale:1}}
                viewport={{once:true,margin:'-40px'}} transition={{delay:i*0.1,duration:0.8,ease:[0.16,1,0.3,1]}}
                whileHover={{y:-12,rotateX:-8,scale:1.07,boxShadow:`0 28px 56px ${color}35`}}
                className="bg-[#14112E] border-2 border-[#14112E] p-7 flex flex-col items-center gap-4 cursor-pointer transition-colors duration-200 card-3d"
                onMouseEnter={e=>{e.currentTarget.style.borderColor=color;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--color-pm-surface)';}}>
                <motion.div animate={{rotateY:[0,360]}} transition={{repeat:Infinity,duration:4+i,ease:'linear'}}>
                  <Icon size={32} style={{color}} />
                </motion.div>
                <div>
                  <p className="font-display text-[9px] text-[#F0F0FF]">{label}</p>
                  <p className="font-sans text-xs text-[#9B8EC4] mt-1 italic">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Newsletter */}
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            className="mt-16 bg-[#14112E] border-2 border-yellow-400/25 p-10 md:p-14 max-w-2xl mx-auto"
            style={{boxShadow:'0 0 50px rgba(255,215,0,0.08)'}}>
            <div className="font-display text-[8px] text-yellow-400 tracking-widest mb-3">📜 SCROLL OF NEWS</div>
            <h3 className="font-display text-xl md:text-2xl text-white mb-4">STAY IN THE LOOP</h3>
            <p className="text-[#9B8EC4] font-sans italic mb-8 text-base leading-relaxed">
              Art drops, new merch launches, and community events — plus<span className="text-yellow-400"> 10 Gold Coins</span> off your first order.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 font-display text-xs animate-pulse blink">&gt;</span>
                <input type="email" placeholder="Enter hero email..."
                  className="w-full bg-[#0D0B1E] border-2 border-yellow-400/25 p-4 pl-10 text-[#F0F0FF] font-display text-[9px] outline-none focus:border-yellow-400 transition-colors" />
              </div>
              <button className="font-display text-[10px] px-8 py-4 bg-yellow-400 text-black transition-all duration-150 active:scale-95 whitespace-nowrap"
                style={{boxShadow:'4px 4px 0 #a07800'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.05) translate(-2px,-2px)';e.currentTarget.style.boxShadow='6px 6px 0 #a07800,0 0 22px rgba(255,215,0,0.5)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='4px 4px 0 #a07800';}}>
                JOIN GUILD
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="bg-[#0A0818] border-t-4 border-yellow-400/15 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <PixleLogo scale={1.15} />
              <p className="font-sans text-[#9B8EC4] italic text-sm leading-relaxed mt-6 max-w-xs">
                Premium pixel art & merch for the digital generation. Every item carries a piece of the Chromatic Kingdom.
              </p>
              <div className="flex gap-3 mt-6">
                {[Facebook,Twitter,Instagram,Youtube].map((Icon,i)=>(
                  <button key={i} className="w-10 h-10 border-2 border-[#14112E] flex items-center justify-center transition-all duration-200"
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='#FFD700';e.currentTarget.style.color='#FFD700';e.currentTarget.style.boxShadow='0 0 12px rgba(255,215,0,0.3)';}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='';e.currentTarget.style.color='';e.currentTarget.style.boxShadow='';}}>
                    <Icon size={15}/>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display text-[8px] text-yellow-400 mb-6">NAVIGATE</h4>
              <ul className="space-y-3 font-display text-[9px] text-[#9B8EC4]">
                {NAV_ITEMS.map(n=>(
                  <li key={n.label}>
                    <button onClick={()=>goto(n.id)} className="flex items-center gap-2 transition-colors duration-200"
                      onMouseEnter={e=>{e.currentTarget.style.color='#FFD700';}} onMouseLeave={e=>{e.currentTarget.style.color='';}}>
                      <span style={{color:n.color}}>{n.icon}</span>{n.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-[8px] text-yellow-400 mb-6">THE REALMS</h4>
              <ul className="space-y-3 font-display text-[9px] text-[#9B8EC4]">
                {REALMS.map(r=>(
                  <li key={r.path}>
                    <button onClick={(e)=>enterRealm(r,e)} className="flex items-center gap-2 hover:text-yellow-400 transition-colors duration-200">
                      <ChevronRight size={9}/>{r.emoji} {r.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <PixelDivider />
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-display text-[7px] text-[#9B8EC4] tracking-widest">© 2025 PIXLE MAN · ALL PIXELS PROTECTED BY 8-BIT MAGIC</p>
            <a href="https://www.etsy.com/shop/PixleManCreate" target="_blank" rel="noopener noreferrer"
              className="font-display text-[7px] text-yellow-400/60 hover:text-yellow-400 flex items-center gap-1 transition-colors">
              ETSY STORE <ExternalLink size={8}/>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
