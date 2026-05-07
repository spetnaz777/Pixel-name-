import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQty, removeFromCart, cartTotal, cartCount } = useCart();
  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]" />
          <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }} transition={{ type:'spring', stiffness:320, damping:38 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#14112E] z-[201] flex flex-col border-l-4 border-yellow-400">
            <div className="p-7 bg-[#0A0818] border-b-4 border-yellow-400 flex justify-between items-center">
              <div>
                <h2 className="font-display text-base text-yellow-400">INVENTORY</h2>
                {cartCount > 0 && <p className="font-display text-[7px] text-white/40 mt-1">{cartCount} ITEM{cartCount!==1?'S':''} IN BAG</p>}
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-pink-500 hover:rotate-90 transition-transform"><X /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-7 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 opacity-40 space-y-3">
                  <div className="text-5xl">🎒</div>
                  <p className="font-display text-[10px]">Your inventory is empty.</p>
                  <p className="font-sans text-sm text-white/50 italic">Go forth and collect loot!</p>
                </div>
              ) : cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center bg-[#0A0818] border border-white/10 p-4">
                  <div className="w-16 h-16 border-2 border-yellow-400/30 p-1.5 bg-black/40 shrink-0">
                    <img src={item.image} className="w-full h-full object-contain" style={{ imageRendering:'pixelated' }} alt={item.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-[9px] text-white uppercase mb-1 truncate">{item.name}</h4>
                    <p className="text-yellow-400 font-display text-xs">{item.price}G</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => updateQty(item.id,-1)} className="w-7 h-7 border border-white/20 flex items-center justify-center hover:border-yellow-400 hover:text-yellow-400 transition-colors"><Minus size={10}/></button>
                    <span className="font-display text-xs w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id,+1)} className="w-7 h-7 border border-white/20 flex items-center justify-center hover:border-yellow-400 hover:text-yellow-400 transition-colors"><Plus size={10}/></button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-1 text-pink-500 hover:scale-110 transition-transform"><X size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-7 bg-[#0A0818] border-t-4 border-yellow-400 space-y-5">
              <div className="flex justify-between items-center">
                <span className="font-display text-[9px] text-white/40">TOTAL GOLD</span>
                <span className="font-display text-3xl text-yellow-400">{cartTotal}G</span>
              </div>
              <a href="https://www.etsy.com/shop/PixleManCreate" target="_blank" rel="noopener noreferrer"
                className="block w-full font-display text-[10px] py-5 bg-yellow-400 text-black text-center transition-all duration-150"
                style={{ boxShadow: '4px 4px 0 #a07800' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '6px 6px 0 #a07800, 0 0 24px rgba(255,215,0,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '4px 4px 0 #a07800'; }}>
                CHECKOUT ON ETSY ↗
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
