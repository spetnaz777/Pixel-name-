import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRealm } from '../context/RealmContext';

export default function PixelTransition() {
  const { isTransitioning, transitionColor, transitionBg, transitionName, transitionOrigin } = useRealm();
  const { x, y } = transitionOrigin;

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-all overflow-hidden"
          style={{
            backgroundImage: transitionBg ? `url(${transitionBg})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: transitionBg ? undefined : transitionColor,
          }}
          initial={{ clipPath: `circle(0px at ${x}% ${y}%)` }}
          animate={{ clipPath: `circle(220% at ${x}% ${y}%)` }}
          exit={{
            clipPath: `circle(0px at 50% 0%)`,
            transition: { duration: 0.55, ease: [0.7, 0, 0.84, 0] }
          }}
          transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Color tint over image */}
          <div className="absolute inset-0" style={{ background: `${transitionColor}cc` }} />

          {/* Pixel noise scanlines */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{ backgroundImage: 'repeating-linear-gradient(transparent,transparent 3px,rgba(0,0,0,0.15) 3px,rgba(0,0,0,0.15) 4px)' }} />

          {/* Portal ring expanding */}
          <motion.div
            className="absolute rounded-full border-4 pointer-events-none"
            style={{ borderColor: '#fff', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: '300vmax', height: '300vmax', opacity: 0 }}
            transition={{ duration: 0.6, ease: 'linear' }}
          />

          {/* "ENTERING REALM" text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3, ease: [0.16,1,0.3,1] }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <div className="text-center px-6 py-8"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', border: '2px solid rgba(255,255,255,0.2)' }}>
              <p className="font-display text-[9px] sm:text-[11px] text-white/50 tracking-[0.5em] mb-3">◆ ENTERING REALM ◆</p>
              <p className="font-display text-xl sm:text-3xl text-white leading-tight"
                style={{ textShadow: `0 0 30px ${transitionColor}, 0 0 60px ${transitionColor}` }}>
                {transitionName}
              </p>
              <motion.div className="h-0.5 w-0 mx-auto mt-4"
                style={{ background: '#fff' }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.25, duration: 0.3 }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
