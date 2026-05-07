import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { ShoppingCart } from 'lucide-react';

import { CartProvider } from './context/CartContext';
import { RealmProvider } from './context/RealmContext';
import { useCart } from './context/CartContext';
import { motion } from 'motion/react';

import PixelTransition from './components/PixelTransition';
import CartDrawer from './components/CartDrawer';

import Nexus           from './realms/Nexus';
import ChromaticKingdom from './realms/ChromaticKingdom';
import DragonIsle      from './realms/DragonIsle';
import NeonAbyss       from './realms/NeonAbyss';
import CrystalGuild    from './realms/CrystalGuild';
import CreatorSanctum  from './realms/CreatorSanctum';

/* Floating cart button — shows across all realms */
function GlobalCart() {
  const { cartCount, setIsCartOpen } = useCart();
  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="fixed bottom-8 left-8 z-[150] w-14 h-14 flex items-center justify-center transition-all duration-200"
      style={{ background:'rgba(255,215,0,0.15)', border:'2px solid rgba(255,215,0,0.5)', backdropFilter:'blur(8px)' }}
      onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,215,0,0.3)';e.currentTarget.style.boxShadow='0 0 24px rgba(255,215,0,0.5)';}}
      onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,215,0,0.15)';e.currentTarget.style.boxShadow='';}}
    >
      <ShoppingCart className="text-yellow-400" size={22} />
      {cartCount > 0 && (
        <motion.span initial={{scale:0}} animate={{scale:1}}
          className="absolute -top-2 -right-2 bg-yellow-400 text-black font-display text-[8px] w-6 h-6 flex items-center justify-center rounded-none">
          {cartCount}
        </motion.span>
      )}
    </button>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"        element={<Nexus />} />
        <Route path="/kingdom" element={<ChromaticKingdom />} />
        <Route path="/dragon-isle" element={<DragonIsle />} />
        <Route path="/shop"    element={<NeonAbyss />} />
        <Route path="/guild"   element={<CrystalGuild />} />
        <Route path="/sanctum" element={<CreatorSanctum />} />
        <Route path="*"        element={<Nexus />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <CartProvider>
      <RealmProvider>
        <div className="relative">
          <PixelTransition />
          <CartDrawer />
          <GlobalCart />
          <AnimatedRoutes />
        </div>
      </RealmProvider>
    </CartProvider>
  );
}
