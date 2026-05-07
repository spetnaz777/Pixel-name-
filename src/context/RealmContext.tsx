import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface Origin { x: number; y: number; }

interface RealmCtx {
  transitionColor: string;
  transitionBg: string;
  transitionName: string;
  transitionOrigin: Origin;
  isTransitioning: boolean;
  navigateToRealm: (path: string, color: string, bg: string, name: string, origin?: Origin) => void;
}

const Ctx = createContext<RealmCtx>(null!);
export const useRealm = () => useContext(Ctx);

export function RealmProvider({ children }: { children: React.ReactNode }) {
  const [transitionColor,  setColor]       = useState('#7C3AED');
  const [transitionBg,     setBg]          = useState('');
  const [transitionName,   setName]        = useState('');
  const [transitionOrigin, setOrigin]      = useState<Origin>({ x: 50, y: 50 });
  const [isTransitioning,  setTransition]  = useState(false);
  const navigate = useNavigate();

  const navigateToRealm = useCallback((
    path: string, color: string, bg: string, name: string, origin?: Origin
  ) => {
    if (isTransitioning) return;
    setColor(color);
    setBg(bg);
    setName(name);
    setOrigin(origin ?? { x: 50, y: 50 });
    setTransition(true);
    setTimeout(() => {
      navigate(path);
      setTimeout(() => setTransition(false), 600);
    }, 520);
  }, [navigate, isTransitioning]);

  return (
    <Ctx.Provider value={{ transitionColor, transitionBg, transitionName, transitionOrigin, isTransitioning, navigateToRealm }}>
      {children}
    </Ctx.Provider>
  );
}
