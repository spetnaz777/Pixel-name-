import { motion } from 'motion/react';
import React from 'react';
import { Sparkles, Shield } from 'lucide-react';

export const PixelButton = ({ 
  children, 
  onClick, 
  variant = 'cyan',
  className = '',
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'magenta' | 'gold' | 'cyan' | 'outlined';
  className?: string;
  key?: React.Key;
}) => {
  const baseStyles = "relative inline-block px-6 py-3 font-display text-[8px] sm:text-[10px] uppercase cursor-pointer transition-all active:translate-y-1 active:shadow-none font-bold tracking-widest";
  
  const variants = {
    magenta: "bg-quest-pink text-white shadow-[4px_4px_0px_#8b1842] hover:bg-opacity-90 pixelated",
    gold: "bg-quest-gold text-black shadow-[4px_4px_0px_#b89b00] hover:scale-105 transition-transform",
    cyan: "bg-quest-cyan text-black shadow-[4px_4px_0px_#00c4cc] hover:bg-opacity-90",
    outlined: "bg-transparent text-quest-cyan border-2 border-quest-cyan shadow-[4px_4px_0px_rgba(0,245,255,0.2)] hover:bg-quest-cyan/10"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const StatBar = ({ label, value, max, color }: { label: string, value: number, max: number, color: string }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[8px] font-display uppercase tracking-widest">
        <span className="text-quest-muted">{label}</span>
        <span style={{ color }}>{value}/{max}</span>
      </div>
      <div className="h-4 w-full bg-quest-void border-2 border-quest-surface p-[2px] shadow-[inset_2px_2px_0px_black]">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full relative overflow-hidden"
          style={{ backgroundColor: color }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};

export const QuestBox = ({ title, description, reward }: { title: string, description: string, reward: string }) => {
  return (
    <div className="bg-quest-surface border-4 border-quest-pink p-6 relative overflow-hidden group shadow-[8px_8px_0px_rgba(255,45,120,0.1)]">
      <div className="absolute top-0 right-0 p-2 bg-quest-pink text-white font-display text-[8px] rotate-45 translate-x-4 -translate-y-2 font-bold">
        XP+
      </div>
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="text-quest-gold animate-glow" size={20} />
        <h3 className="text-sm md:text-lg text-quest-cyan leading-none">{title}</h3>
      </div>
      <p className="text-xs font-sans text-quest-muted mb-6 leading-relaxed">{description}</p>
      <div className="bg-quest-void border-2 border-quest-surface p-3">
        <p className="text-[8px] font-display text-quest-gold mb-1">LOOT DROPPING</p>
        <p className="text-xs text-quest-text font-bold">{reward}</p>
      </div>
    </div>
  );
};

export const RealmMap = ({ locations }: { locations: any[] }) => {
  return (
    <div className="relative aspect-[4/3] bg-[#07071a] overflow-hidden border-2 border-quest-surface group cursor-crosshair">
      {/* Map Grid */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundSize: '24px 24px', backgroundImage: 'linear-gradient(to right, #8888BB 1px, transparent 1px), linear-gradient(to bottom, #8888BB 1px, transparent 1px)' }} />
      
      {locations.map((loc) => (
        <motion.div 
          key={loc.id}
          className="absolute cursor-pointer border-2 border-transparent hover:border-quest-cyan p-1 transition-all"
          style={{ top: loc.top, left: loc.left }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="relative">
             <div className="w-6 h-6 bg-quest-surface border-2 border-quest-cyan shadow-[2px_2px_0px_black] flex items-center justify-center" style={{ imageRendering: 'pixelated' }}>
                <div className="w-2 h-2 bg-quest-pink animate-pulse" />
             </div>
             <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-quest-surface border-2 border-quest-cyan px-3 py-1.5 z-10 shadow-[4px_4px_0px_black]">
                <p className="text-[10px] font-display text-quest-text">{loc.name}</p>
             </div>
          </div>
        </motion.div>
      ))}

      {/* Animated Sprite */}
      <motion.div 
        animate={{ 
          x: [0, 50, 20, 100, 0],
          y: [0, 20, 80, 10, 0]
        }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        className="absolute text-2xl z-20 pixelated opacity-40 select-none"
      >
        🛸
      </motion.div>
    </div>
  );
};

export const PixelCard = ({ 
  children, 
  className = '',
  title,
  subtitle,
  onClick
}: { 
  children: React.ReactNode; 
  className?: string;
  title?: string;
  subtitle?: string;
  key?: React.Key;
  onClick?: () => void;
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-quest-surface p-1 border-2 border-[#00F5FF33] transition-all hover:border-quest-cyan/60 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="p-4 h-full flex flex-col">
        {title && (
          <h3 className="text-quest-text text-xs mb-1 font-display tracking-widest border-b border-quest-muted/20 pb-4">
            {title}
          </h3>
        )}
        {subtitle && <p className="text-[10px] text-quest-muted mt-2 mb-4 font-sans italic">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export const PixelBadge = ({ children, color = 'magenta', className = '' }: { children: React.ReactNode, color?: string, className?: string }) => {
  const colors: Record<string, string> = {
    magenta: 'bg-quest-pink',
    gold: 'bg-quest-gold text-black',
    cyan: 'bg-quest-cyan text-black',
    muted: 'bg-quest-muted'
  };

  return (
    <span className={`${colors[color] || 'bg-quest-pink'} text-white text-[8px] font-display px-3 py-1.5 uppercase font-bold tracking-tighter ${className}`}>
      {children}
    </span>
  );
};

export const InventorySlot = ({ 
  src, 
  active = false,
  onClick,
  className = ''
}: { 
  src: string; 
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <div 
      onClick={onClick}
      className={`w-16 h-16 bg-quest-void border-2 cursor-pointer transition-all flex items-center justify-center p-2 
        ${active ? 'border-quest-gold shadow-[0_0_10px_rgba(255,215,0,0.4)]' : 'border-quest-surface hover:border-quest-muted'}
        ${className}`}
    >
      <img 
        src={src} 
        alt="item" 
        className={`w-full h-full object-contain pixelated ${active ? 'animate-glow' : 'opacity-60'}`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
