/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Plus, Minus, ChevronRight, Menu, Shield, Zap, Sparkles, Map as MapIcon, Facebook, Twitter, Youtube, Instagram } from 'lucide-react';
import { products, Product } from './data';
import { PixelButton, PixelCard, PixelBadge, StatBar, QuestBox, RealmMap, InventorySlot } from './components/PixelUI';

interface CartItem extends Product {
  quantity: number;
}

type NavTab = 'Home' | 'Shop' | 'About' | 'Contact';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Mugs' | 'T-Shirts' | 'Accessories'>('All');
  const [activeTab, setActiveTab] = useState<NavTab>('Home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const mapLocations = [
    { id: '1', name: "Mug Island", top: '25%', left: '20%', category: 'Mugs' },
    { id: '2', name: "Tee Kingdom", top: '55%', left: '60%', category: 'T-Shirts' },
    { id: '3', name: "Accessory Caves", top: '75%', left: '30%', category: 'Accessories' },
  ];

  const handleMapClick = (category: any) => {
    setActiveCategory(category);
    setActiveTab('Shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderHome = () => (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-quest-void/40 via-transparent to-quest-void z-10" />
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src="https://storage.googleapis.com/static.rethink.software/yusefazmoon22/pixle_man_create_original_banner.png" 
            className="w-full h-full object-cover brightness-75 pixelated" 
            alt="Hero Banner"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-20 text-center px-4 max-w-5xl">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl text-white mb-6 drop-shadow-[0_10px_10px_black] leading-tight">
              PIXEL YOUR WORLD
            </h1>
            <p className="text-xl md:text-2xl text-quest-muted font-sans font-semibold mb-12 italic">
              Premium mugs, tees & accessories — all pixel-designed.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <PixelButton variant="cyan" className="px-12 py-5 text-lg" onClick={() => setActiveTab('Shop')}>
                SHOP NOW
              </PixelButton>
              <PixelButton variant="outlined" className="px-12 py-5 text-lg flex items-center gap-2 group">
                <MapIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                EXPLORE THE MAP
              </PixelButton>
            </div>
          </motion.div>
        </div>

        {/* Twinkling Pixels */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-quest-cyan"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 + Math.random() * 3, delay: Math.random() * 5 }}
            />
          ))}
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl mb-4">EXPLORE THE SHOP</h2>
          <div className="h-1 w-24 bg-quest-cyan mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { title: 'Mugs', desc: 'Sip in 8-bit style', icon: '☕', cat: 'Mugs' },
             { title: 'T-Shirts', desc: 'Wear the legends', icon: '👕', cat: 'T-Shirts' },
             { title: 'Accessories', desc: 'Quest essentials', icon: '🎒', cat: 'Accessories' },
             { title: 'New Drops', desc: 'Recently forged', icon: '🌟', cat: 'All' }
           ].map((item, i) => (
             <PixelCard key={i} title={item.title} subtitle={item.desc} className="pixel-shadow-hover transition-all cursor-pointer group" onClick={() => { setActiveCategory(item.cat as any); setActiveTab('Shop'); }}>
                <div className="h-32 flex items-center justify-center text-5xl group-hover:scale-125 group-hover:-rotate-6 transition-transform">
                  {item.icon}
                </div>
                <PixelButton variant="magenta" className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity">EXPLORE</PixelButton>
             </PixelCard>
           ))}
        </div>
      </section>

      {/* Interactive World Map */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <PixelBadge color="gold">DISCOVERY MODE</PixelBadge>
            <h2 className="text-4xl leading-tight">World Map of Products</h2>
            <p className="text-xl text-quest-muted font-sans leading-relaxed">
              Navigate the Chromatic Realm through its distinct regions. Each island holds unique gear forged from local elements.
            </p>
            <div className="space-y-4">
              {mapLocations.map(loc => (
                <div key={loc.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => handleMapClick(loc.category)}>
                  <div className="w-8 h-8 flex items-center justify-center border-2 border-quest-cyan group-hover:bg-quest-cyan group-hover:text-black font-display text-[10px] transition-all">
                    {loc.id}
                  </div>
                  <span className="text-quest-muted group-hover:text-quest-cyan uppercase tracking-widest text-sm transition-all">{loc.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-quest-cyan/5 blur-3xl rounded-full" />
            <RealmMap locations={mapLocations} />
          </div>
        </div>
      </section>

      {/* Best Sellers Strip */}
      <section className="bg-quest-surface py-24 border-y border-quest-cyan/20">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-2xl">🔥 BEST SELLERS</h2>
            <PixelButton variant="outlined" onClick={() => setActiveTab('Shop')}>View All Items</PixelButton>
          </div>
          <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide">
            {products.filter(p => p.isBestSeller).map(p => (
              <motion.div key={p.id} className="min-w-[300px]" whileHover={{ y: -10 }}>
                <PixelCard title={p.name}>
                  <div className="aspect-square bg-quest-void mb-6 relative overflow-hidden group">
                    <img src={p.image} className="w-full h-full object-contain pixelated p-8" alt={p.name} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-quest-cyan font-display uppercase text-xs">{p.price} Gold</span>
                    <PixelButton onClick={() => addToCart(p)}>Add to Bag</PixelButton>
                  </div>
                </PixelCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN THE GUILD newsletter */}
      <section className="max-w-7xl mx-auto px-4 mb-32">
        <PixelCard className="!p-0 overflow-hidden !bg-black">
           <div className="flex flex-col lg:flex-row">
             <div className="flex-1 p-12 lg:p-20 space-y-8">
               <h2 className="text-4xl text-white">JOIN THE GUILD</h2>
               <p className="text-xl text-quest-muted font-sans">Receive scrolls of news and get <span className="text-quest-gold">10XP off</span> your first order.</p>
               <div className="max-w-md">
                 <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-quest-cyan animate-pulse">&gt;</div>
                   <input 
                    type="email" 
                    placeholder="Enter Hero Email..." 
                    className="w-full bg-quest-void border-2 border-quest-cyan p-4 pl-10 text-quest-text font-display text-xs outline-none focus:shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all"
                   />
                 </div>
                 <PixelButton variant="gold" className="w-full mt-6 py-5">SIGN UP NOW</PixelButton>
               </div>
             </div>
             <div className="lg:w-1/3 bg-quest-cyan/10 flex items-center justify-center p-20 border-l border-quest-cyan/20">
                <Shield className="w-32 h-32 text-quest-cyan animate-glow" />
             </div>
           </div>
        </PixelCard>
      </section>
    </div>
  );

  const renderShop = () => (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-glow">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <div>
           <PixelBadge color="cyan" className="mb-4">THE CHROMA ARMORY</PixelBadge>
           <h1 className="text-5xl mb-4">THE SHOP</h1>
           <p className="text-xl text-quest-muted italic font-sans">Browse the high-vibrance gear forged from the essence of the Kingdom.</p>
        </div>
        <div className="flex gap-4 flex-wrap">
          {['All', 'Mugs', 'T-Shirts', 'Accessories'].map(cat => (
            <PixelButton 
              key={cat} 
              variant={activeCategory === cat ? 'gold' : 'outlined'}
              onClick={() => setActiveCategory(cat as any)}
            >
              {cat}
            </PixelButton>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((p) => (
            <motion.div
              layout
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <PixelCard className="h-full flex flex-col group pixel-shadow-hover transition-all">
                <div className="aspect-square bg-quest-void relative border-b border-quest-surface overflow-hidden">
                  <img src={p.image} className="w-full h-full object-contain p-12 transition-transform group-hover:scale-110 pixelated" alt={p.name} />
                  {p.isBestSeller && <div className="absolute top-4 left-4"><PixelBadge color="gold">BEST SELLER</PixelBadge></div>}
                  {p.isNew && <div className="absolute top-4 right-4"><PixelBadge color="magenta">NEW DROP</PixelBadge></div>}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg mb-2 group-hover:text-quest-cyan transition-colors">{p.name}</h3>
                  <p className="text-sm text-quest-muted font-sans italic mb-6 leading-relaxed">{p.description}</p>
                  <div className="mt-auto flex justify-between items-center bg-quest-void/50 p-4 border border-quest-surface">
                    <span className="text-quest-cyan font-display text-xl">{p.price}G</span>
                    <PixelButton onClick={() => addToCart(p)}>ADD TO BAG</PixelButton>
                  </div>
                </div>
              </PixelCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'Shop': return renderShop();
      case 'About': return (
        <div className="max-w-4xl mx-auto px-4 py-32 text-center space-y-12">
           <h1 className="text-5xl">OUR ORIGIN LOG</h1>
           <PixelCard>
             <div className="space-y-8 font-sans text-xl leading-relaxed italic text-quest-muted p-8">
               <p>PIXLE MERCH was founded by a party of three pixel artists and one caffeine-addicted code-wizard.</p>
               <p>We felt that modern stores was losing the charm of the 8-bit era. Our mission: bring back the vibrant, tactical feel of retro RPGs to the items you use every day.</p>
               <p>Every sleeve, every ceramic glaze is enchanted with 100% digital magic.</p>
             </div>
           </PixelCard>
           <PixelButton variant="gold" onClick={() => setActiveTab('Shop')}>START YOUR JOURNEY</PixelButton>
        </div>
      );
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen relative bg-quest-void overflow-x-hidden">
      <div className="scanline" />
      
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-quest-void/95 backdrop-blur-md border-b-2 border-quest-cyan py-2' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('Home')}>
            <div className="w-10 h-10 border-2 border-quest-cyan flex items-center justify-center bg-quest-void animate-glow">
              <Shield className="text-quest-cyan w-6 h-6" />
            </div>
            <span className="font-display text-lg text-white drop-shadow-[2px_2px_0px_#FF2D78]">
              PIXLE<span className="text-quest-cyan italic">MERCH</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-12 font-display text-[10px] uppercase tracking-widest">
            {['Home', 'Shop', 'About', 'Contact'].map((item) => (
              <button 
                key={item} 
                className={`hover:text-quest-cyan transition-colors ${activeTab === item ? 'text-quest-cyan' : 'text-quest-text'}`}
                onClick={() => { setActiveTab(item as any); if (item === 'Shop') setActiveCategory('All'); }}
              >
                {item}
              </button>
            ))}
            <div className="relative group cursor-pointer" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="w-5 h-5 text-quest-pink group-hover:scale-110 transition-transform" />
              <span className="absolute -top-2 -right-2 bg-white text-black text-[8px] w-4 h-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </div>
          </div>

          <button className="lg:hidden text-quest-cyan" onClick={() => setIsCartOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="pt-20">
        {renderCurrentTab()}
      </div>

      {/* Footer */}
      <footer className="bg-black border-t-8 border-quest-surface py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="col-span-1 md:col-span-2">
               <h2 className="text-3xl text-quest-cyan mb-6">PIXLE MERCH</h2>
               <p className="font-sans text-xl text-quest-muted italic leading-relaxed max-w-md">
                 Premium physical loot for the digital generation. Forged in the Kingdom of Chroma, delivered to your doorstep.
               </p>
            </div>
            <div>
               <h4 className="text-quest-gold text-xs mb-8">THE ATLAS</h4>
               <ul className="space-y-4 font-display text-[10px] text-quest-muted">
                 <li className="hover:text-quest-cyan cursor-pointer">Store Map</li>
                 <li className="hover:text-quest-cyan cursor-pointer">Guild Rules</li>
                 <li className="hover:text-quest-cyan cursor-pointer">Loot FAQ</li>
                 <li className="hover:text-quest-cyan cursor-pointer">Traveler Support</li>
               </ul>
            </div>
            <div>
               <h4 className="text-quest-magenta text-xs mb-8">SOCIAL ORBS</h4>
               <div className="flex gap-4">
                  {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                    <div key={i} className="w-10 h-10 border-2 border-quest-surface flex items-center justify-center hover:border-quest-cyan hover:text-quest-cyan transition-all cursor-pointer">
                      <Icon size={18} />
                    </div>
                  ))}
               </div>
            </div>
          </div>
          <div className="pt-16 border-t border-quest-surface text-center">
            <p className="font-display text-[8px] text-quest-muted tracking-widest uppercase">
              © 2025 Kingdom of Pixle Merch. All Loot Protected by 8-Bit Magic.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-quest-surface z-[201] flex flex-col border-l-4 border-quest-cyan">
              <div className="p-8 bg-black border-b-4 border-quest-cyan flex justify-between items-center">
                 <h2 className="text-xl">INVENTORY</h2>
                 <button onClick={() => setIsCartOpen(false)} className="text-quest-pink hover:rotate-90 transition-transform"><X /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-20 space-y-4 opacity-50">
                    <p className="font-display text-[10px]">Your inventory is empty.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 items-center bg-quest-void border-2 border-quest-surface p-4">
                      <div className="w-16 h-16 border-2 border-quest-cyan p-2 bg-black">
                        <img src={item.image} className="w-full h-full object-contain pixelated" alt={item.name} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[10px] uppercase mb-1">{item.name}</h4>
                        <p className="text-quest-gold text-xs font-display">{item.price}G</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 border border-quest-muted flex items-center justify-center"><Minus size={12}/></button>
                         <span className="font-display text-xs">{item.quantity}</span>
                         <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 border border-quest-muted flex items-center justify-center"><Plus size={12}/></button>
                         <button onClick={() => removeFromCart(item.id)} className="ml-2 text-quest-pink"><X size={16}/></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-8 bg-black border-t-4 border-quest-cyan space-y-6">
                <div className="flex justify-between items-center">
                   <span className="text-quest-muted font-display text-[10px]">TOTAL GOLD</span>
                   <span className="text-3xl text-quest-gold">{cartTotal}G</span>
                </div>
                <PixelButton variant="gold" className="w-full py-5 text-center">CHECKOUT (QUEST START)</PixelButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
