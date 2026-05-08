'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect, createContext, useContext, useRef } from 'react';
import Lenis from 'lenis';

// ─── Lenis context — lets child components access the lenis instance ──────────
const LenisContext = createContext<{ lenis: Lenis | null }>({ lenis: null });
export const useLenis = () => useContext(LenisContext);

function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Create lenis with optimal settings for a creative portfolio
    const lenis = new Lenis({
      duration: 1.4,
      // Expo ease-out — snappy start, buttery deceleration
      easing: (t: number) => 1 - Math.pow(1 - t, 5),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
      infinite: false,
      orientation: 'vertical',
    });

    lenisRef.current = lenis;

    // Sync Lenis with the native requestAnimationFrame loop.
    // Using a named function (not an arrow func stored outside) ensures
    // the rafId we cancel is always the outermost one scheduled.
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Pause lenis when the tab is hidden to avoid drift on resume
    const handleVisibility = () => {
      if (document.hidden) lenis.stop();
      else lenis.start();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', handleVisibility);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </LenisContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </SessionProvider>
  );
}
