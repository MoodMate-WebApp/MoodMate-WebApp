import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, Wind, Activity, Music, Palette, MousePointer2, Star, CloudRain, Sun, ArrowUpRight, Brain
} from 'lucide-react';
import api from '../services/api';

// ── Shared keyframe CSS injected once at module level ──────────────────────
const AVATAR_KEYFRAMES = `
  @keyframes avatarSpin  { to { transform: rotate(360deg); } }
  @keyframes avatarFloat { 0%,100%{transform:translateY(-12px)} 50%{transform:translateY(12px)} }
  @keyframes avatarPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
  @keyframes avatarGlow  { 0%,100%{opacity:0.25} 50%{opacity:0.55} }
  .avatar-spin  { animation: avatarSpin  30s linear      infinite; will-change: transform; }
  .avatar-float { animation: avatarFloat 5s ease-in-out  infinite; will-change: transform; }
  .avatar-pulse { animation: avatarPulse 4s ease-in-out  infinite; will-change: transform; }
  .avatar-glow  { animation: avatarGlow  4s ease-in-out  infinite; will-change: opacity; }
`;

interface GameConfig {
  id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  color?: string;
}

const STATIC_CATALOG: GameConfig[] = [
  { id: 'bubble-burst', title: 'Bubble Burst', category: 'Focus', description: 'Interactive bubble popping for sensory relief.' },
  { id: 'prana-breathe', title: 'Prana Breathe', category: 'Calm', description: 'Guided breathing patterns for anxiety reduction.' },
  { id: 'zen-rain', title: 'Zen Rain', category: 'Relax', description: 'Visual rain symphony for cognitive stabilization.' },
  { id: 'mood-canvas', title: 'Mood Canvas', category: 'Creative', description: 'Dynamic color therapy through touch interaction.' },
  { id: 'echo-harmony', title: 'Echo Harmony', category: 'Flow', description: 'Generative ripple patterns for mental clarity.' },
  { id: 'focus-pulse', title: 'Focus Pulse', category: 'Focus', description: 'Synchronized rhythm exercises for concentration.' },
  { id: 'emotion-sort', title: 'Emotion Sort', category: 'Learning', description: 'Gamified Marathi emotional decoding.' },
  { id: 'celestial-drift', title: 'Celestial Drift', category: 'Relax', description: 'Interactive starlight navigation.' },
  { id: 'starlight-connect', title: 'Starlight Connect', category: 'Flow', description: 'Constellation creation for sensory grounding.' },
  { id: 'nature-loop', title: 'Nature Loop', category: 'Calm', description: 'Generative vegetation sway for mental peace.' },
];

const UI_MAPPING: Record<string, any> = {
  'bubble-burst': { color: '#3b82f6', icon: Wind, animation: 'pulse', image: '/zen_bubble.png' },
  'prana-breathe': { color: '#2dd4bf', icon: Activity, animation: 'float', image: '/zen_breathe.png' },
  'zen-rain': { color: '#6366f1', icon: CloudRain, animation: 'spin', image: '/zen_rain.png' },
  'mood-canvas': { color: '#f43f5e', icon: Palette, animation: 'pulse', image: '/zen_canvas.png' },
  'echo-harmony': { color: '#f59e0b', icon: Music, animation: 'float', image: '/zen_echo.png' },
  'focus-pulse': { color: '#8b5cf6', icon: Activity, animation: 'pulse', image: '/zen_pulse.png' },
  'emotion-sort': { color: '#10b981', icon: MousePointer2, animation: 'spin', image: '/zen_sort.png' },
  'celestial-drift': { color: '#06b6d4', icon: Star, animation: 'float', image: '/zen_drift.png' },
  'starlight-connect': { color: '#ec4899', icon: Sparkles, animation: 'pulse', image: '/zen_starlight.png' },
  'nature-loop': { color: '#4ade80', icon: Sun, animation: 'float', image: '/zen_nature.png' },
};

function GameAvatar({ ui }: { ui: any }) {
  const animClass =
    ui.animation === 'spin'  ? 'avatar-spin'  :
    ui.animation === 'float' ? 'avatar-float' :
    'avatar-pulse';

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Keyframes injected once at page level via <AvatarStyles /> */}

      {/* Glow — scales with container */}
      <div
        className="absolute rounded-full blur-[60px] avatar-glow"
        style={{
          backgroundColor: ui.color,
          width: '55%',
          height: '55%',
          maxWidth: '176px',
          maxHeight: '176px',
        }}
      />

      {/* Image — responsive sizing */}
      <div
        className={`relative flex items-center justify-center ${animClass}`}
        style={{ width: '65%', height: '65%', maxWidth: '208px', maxHeight: '208px' }}
      >
        <img
          src={ui.image}
          alt="Game Icon"
          className="w-full h-full object-contain select-none pointer-events-none"
          loading="lazy"
        />
      </div>
    </div>
  );
}

// Inject shared keyframes once into <head>
function AvatarStyles() {
  return <style>{AVATAR_KEYFRAMES}</style>;
}

export default function Games() {
  const [catalog, setCatalog] = useState<GameConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const { data } = await api.get('/api/v1/games/catalog');
        if (data?.data && data.data.length > 0) {
          setCatalog(data.data);
        } else {
          setCatalog(STATIC_CATALOG);
        }
      } catch (err) {
        setCatalog(STATIC_CATALOG);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  return (
    <>
    {/* Inject avatar keyframes once per page render */}
    <AvatarStyles />
    <div className="flex flex-col w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-28 sm:pt-32 pb-16 sm:pb-24 relative z-10 overflow-x-hidden">
      
      <div className="flex flex-col items-center text-center mb-10 sm:mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-slate-600 text-[9px] font-black uppercase tracking-[0.6em] mb-6 sm:mb-8 shadow-2xl"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
          <span>Sensory Void Protocol</span>
        </motion.div>
        
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-4 sm:mb-6 tracking-tighter uppercase italic leading-none">
          Neural{' '}
          <span
            className="non-italic"
            style={{
              background: 'linear-gradient(to right, #6366f1, #ffffff, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >Garden.</span>
        </h1>
        
        <p className="text-slate-500 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed opacity-60 tracking-wide px-4">
          A high-fidelity archive of sensory recalibration tools. 
          Initialize a gateway to stabilize your cognitive rhythm.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 relative z-20">
           {[...Array(10)].map((_, i) => <div key={i} className="h-[360px] sm:h-[420px] bg-white/10 rounded-[2.5rem] sm:rounded-[3rem] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 sm:gap-8 mb-12 sm:mb-20 relative z-20">
          {catalog.map((game, i) => {
            const ui = UI_MAPPING[game.id] || UI_MAPPING['bubble-burst'];
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.04, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => setActiveGameId(game.id)}
                className="group relative flex flex-col h-[340px] sm:h-[400px] lg:h-[440px] xl:h-[420px] bg-white/[0.03] border border-white/[0.06] rounded-[2.5rem] overflow-hidden hover:border-primary-500/40 transition-colors duration-300 cursor-pointer"
              >
                <div className="relative h-[62%] w-full overflow-hidden flex items-center justify-center bg-black/20">
                   <GameAvatar ui={ui} />
                   <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 px-5 sm:px-7 pb-6 sm:pb-8 flex-1 flex flex-col">
                   <div className="flex justify-between items-center mb-3 sm:mb-5">
                      <span className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[7px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-primary-400 transition-colors">
                        {game.category}
                      </span>
                      <ui.icon className="w-3.5 h-3.5 text-slate-800 group-hover:text-primary-500 transition-colors" />
                   </div>
                   
                   <h3 className="text-lg sm:text-xl font-black text-white mb-2 tracking-tight italic leading-tight group-hover:translate-x-1 transition-transform">
                     {game.title}
                   </h3>
                   
                   <p className="text-slate-600 text-[10px] font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 line-clamp-2">
                     {game.description}
                   </p>

                   <div className="mt-auto flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary-500">Initialize gateway</span>
                      <ArrowUpRight className="w-4 h-4 text-primary-500" />
                   </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
    
    <AnimatePresence>
      {activeGameId && (
        <ZenPlayer id={activeGameId} onClose={() => setActiveGameId(null)} />
      )}
    </AnimatePresence>
    </>
  );
}

function ZenPlayer({ id, onClose }: { id: string, onClose: () => void }) {
  const renderModule = () => {
    switch (id) {
      case 'bubble-burst': return <BubbleBurst />;
      case 'prana-breathe': return <PranaBreathe />;
      case 'zen-rain': return <ZenRain />;
      case 'mood-canvas': return <MoodCanvas />;
      case 'echo-harmony': return <EchoHarmony />;
      case 'focus-pulse': return <FocusPulse />;
      case 'emotion-sort': return <EmotionSort />;
      case 'celestial-drift': return <CelestialDrift />;
      case 'starlight-connect': return <StarlightConnect />;
      case 'nature-loop': return <NatureLoop />;
      default: return <div className="text-white text-4xl font-black italic">Coming Soon...</div>;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] bg-black"
      style={{ touchAction: 'none' }}
    >
      <div className="w-full h-full relative">
        {renderModule()}
      </div>

      {/* Close button — respects iOS safe area insets */}
      <button 
        id="close-game-button"
        onClick={onClose} 
        className="fixed right-4 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-white text-black rounded-full flex items-center justify-center z-[200000] hover:scale-110 active:scale-90 transition-all shadow-2xl border-2 border-primary-500/20"
        style={{ 
          top: 'calc(env(safe-area-inset-top, 0px) + 7rem)',
          right: 'max(1.5rem, env(safe-area-inset-right, 1.5rem) + 0.5rem)'
        }}
        aria-label="Exit Game"
      >
        <X className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={3} />
      </button>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-none text-center opacity-20 z-[100001]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
         <p className="text-white text-[9px] font-black uppercase tracking-[0.8em] whitespace-nowrap">Neuro-Zen Protocol v6.1</p>
      </div>
    </motion.div>
  );
}

/* --- EXPERIENCE MODULES --- */

function BubbleBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let bubbles: any[] = [];
    let particles: any[] = [];
    
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resize);
    resize();

    const createPop = (x: number, y: number, color: string) => {
      for (let i = 0; i < 12; i++) {
        particles.push({ 
          x, y, 
          r: Math.random() * 2 + 1, 
          vx: (Math.random() - 0.5) * 15, 
          vy: (Math.random() - 0.5) * 15, 
          life: 1, 
          color 
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.05 && bubbles.length < 25) {
        bubbles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 100,
          r: Math.random() * 40 + 20,
          vy: -(Math.random() * 2 + 0.5),
          color: `hsla(${Math.random() * 360}, 70%, 60%, 0.4)`,
          wobble: 0,
          wobbleSpeed: Math.random() * 0.05 + 0.02
        });
      }

      bubbles.forEach((b, i) => {
        b.y += b.vy;
        b.wobble += b.wobbleSpeed;
        const currentR = b.r + Math.sin(b.wobble) * 4;
        
        const grad = ctx.createRadialGradient(b.x - currentR * 0.3, b.y - currentR * 0.3, 0, b.x, b.y, currentR);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        grad.addColorStop(1, b.color);

        ctx.beginPath();
        ctx.arc(b.x, b.y, currentR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();

        if (b.y + b.r < -100) bubbles.splice(i, 1);
      });

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= 0.02;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.4', p.life.toString());
        ctx.fill();
        if (p.life <= 0) particles.splice(i, 1);
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    const handleInput = (e: any) => {
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      if (!x || !y) return;

      bubbles.forEach((b, i) => {
        const dist = Math.sqrt((x - b.x) ** 2 + (y - b.y) ** 2);
        if (dist < b.r + 15) {
          createPop(b.x, b.y, b.color);
          bubbles.splice(i, 1);
        }
      });
    };

    canvas.addEventListener('mousedown', handleInput);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput(e); });

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', handleInput);
      canvas.removeEventListener('touchstart', handleInput);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return <div className="module-container"><canvas ref={canvasRef} className="experience-canvas" /></div>;
}

function PranaBreathe() {
  const [phase, setPhase] = useState('Inhale');
  useEffect(() => {
    const cycle = setInterval(() => setPhase(p => p === 'Inhale' ? 'Exhale' : 'Inhale'), 4000);
    return () => clearInterval(cycle);
  }, []);
  return (
    <div className="module-container">
      <motion.div 
        animate={{ scale: phase === 'Inhale' ? 1.5 : 0.6, opacity: phase === 'Inhale' ? 0.4 : 0.1 }} 
        transition={{ duration: 4, ease: "easeInOut" }} 
        className="w-48 sm:w-96 h-48 sm:h-96 bg-teal-500 rounded-full blur-[100px]" 
      />
      <div className="absolute flex flex-col items-center">
         <motion.h2 
           key={phase} 
           initial={{ opacity: 0, y: 10 }} 
           animate={{ opacity: 1, y: 0 }} 
           className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic text-center"
         >
           {phase === 'Inhale' ? 'श्वास घ्या' : 'श्वास सोडा'}
         </motion.h2>
         <div className="mt-12 flex gap-3">
           {[1,2,3,4].map(i => <div key={i} className={`w-3 h-3 rounded-full transition-all duration-1000 ${phase === 'Inhale' ? 'bg-teal-500 scale-125' : 'bg-white/10 scale-100'}`} />)}
         </div>
      </div>
    </div>
  );
}

function ZenRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let drops: any[] = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (drops.length < 200) {
        drops.push({ x: Math.random() * canvas.width, y: -50, vy: Math.random() * 10 + 5, l: Math.random() * 40 + 10 });
      }

      drops.forEach((d, i) => {
        d.y += d.vy;
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.l);
        ctx.stroke();
        if (d.y > canvas.height) drops.splice(i, 1);
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return <div className="module-container"><canvas ref={canvasRef} className="experience-canvas" /></div>;
}

function MoodCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const paint = (e: any) => {
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      if (!x || !y) return;
      ctx.fillStyle = `hsla(${Date.now() / 10 % 360}, 80%, 60%, 0.15)`;
      ctx.beginPath();
      ctx.arc(x, y, 60, 0, Math.PI * 2);
      ctx.fill();
    };

    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); paint(e); }, { passive: false });
    
    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', paint);
      canvas.removeEventListener('touchmove', paint);
    };
  }, []);

  return (
    <div className="module-container">
      <canvas ref={canvasRef} className="experience-canvas" />
      <div className="absolute top-10 pointer-events-none text-white/20 font-black uppercase tracking-[1em] text-[10px]">Color Therapy Mode</div>
    </div>
  );
}

function EchoHarmony() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let ripples: any[] = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ripples.forEach((r, i) => {
        r.rad += 4;
        r.op -= 0.01;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.rad, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 158, 11, ${r.op})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (r.op <= 0) ripples.splice(i, 1);
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    const handleInput = (e: any) => {
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      if (x && y) ripples.push({ x, y, rad: 0, op: 1 });
    };

    canvas.addEventListener('mousedown', handleInput);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput(e); });

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return <div className="module-container"><canvas ref={canvasRef} className="experience-canvas" /></div>;
}

function FocusPulse() {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const handleMove = (e: any) => {
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    setPos({ x: (x / window.innerWidth) * 100, y: (y / window.innerHeight) * 100 });
  };
  return (
    <div onMouseMove={handleMove} onTouchMove={(e) => { e.preventDefault(); handleMove(e); }} className="module-container cursor-none">
       <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
       {/* Rings — use vmin so they never overflow the viewport */}
       <motion.div
         animate={{ scale: [1, 1.3, 1] }}
         transition={{ repeat: Infinity, duration: 3 }}
         className="border border-white/5 rounded-full flex items-center justify-center opacity-20"
         style={{ width: 'min(500px, 90vmin)', height: 'min(500px, 90vmin)' }}
       >
          <div
            className="border border-white/10 rounded-full flex items-center justify-center"
            style={{ width: 'min(300px, 54vmin)', height: 'min(300px, 54vmin)' }}
          >
             <div
               className="border-2 border-primary-500/30 rounded-full"
               style={{ width: 'min(150px, 27vmin)', height: 'min(150px, 27vmin)' }}
             />
          </div>
       </motion.div>
       <motion.div animate={{ x: `${pos.x}vw`, y: `${pos.y}vh` }} className="fixed top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full mix-blend-difference -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

function EmotionSort() {
  const POS_WORDS = ["आनंद", "शांती", "प्रेम", "उत्साह", "समाधान"];
  const NEG_WORDS = ["दुःख", "राग", "भीती", "चिंता", "तणाव"];
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING'>('IDLE');
  const [items, setItems] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const interval = setInterval(() => {
      setItems(prev => {
        if (prev.length >= 1) return prev;
        const isPos = Math.random() > 0.5;
        const text = isPos ? POS_WORDS[Math.floor(Math.random() * POS_WORDS.length)] : NEG_WORDS[Math.floor(Math.random() * NEG_WORDS.length)];
        return [{ id: Date.now(), text, isPos, x: Math.random() * 60 + 20, y: -100 }];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [gameState]);

  const handleSort = (item: any, side: 'pos' | 'neg') => {
    const correct = (item.isPos && side === 'pos') || (!item.isPos && side === 'neg');
    if (correct) { setScore(s => s + 10); setFeedback('Excellent!'); }
    else { setScore(s => Math.max(0, s - 5)); setFeedback('Oops!'); }
    setItems(prev => prev.filter(i => i.id !== item.id));
    setTimeout(() => setFeedback(null), 800);
  };
  
  if (gameState === 'IDLE') {
    return (
      <div className="module-container p-10 text-center">
         <Brain className="w-16 h-16 text-primary-400 mb-10" />
         <h2 className="text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">Emotion Calibration</h2>
         <p className="text-slate-500 mb-12 max-w-md mx-auto font-medium">Sort Marathi emotional markers to stabilize cognitive resonance.</p>
         <button onClick={() => setGameState('PLAYING')} className="bg-white text-black font-black uppercase tracking-widest text-xs px-20 py-6 rounded-full hover:bg-primary-500 hover:text-white transition-all shadow-3xl">Initialize</button>
      </div>
    );
  }

  return (
    <div className="module-container p-6 sm:p-10">
       <div className="absolute top-10 sm:top-20 left-10 sm:left-20 text-white font-black">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Calibration Score</p>
          <p className="text-4xl sm:text-6xl italic">{score}</p>
       </div>
       
       <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 1.5 }} 
              className={`absolute top-1/3 left-1/2 -translate-x-1/2 text-4xl sm:text-6xl font-black z-[20] ${feedback === 'Excellent!' ? 'text-green-500' : 'text-red-500'} italic uppercase tracking-tighter drop-shadow-2xl`}
            >
              {feedback}
            </motion.div>
          )}
       </AnimatePresence>

       <div className="flex-1 w-full relative overflow-hidden">
          <AnimatePresence>
           {items.map(item => (
             <motion.div 
               key={item.id} 
               initial={{ y: -100, x: `${item.x}%`, opacity: 0 }} 
               animate={{ y: '120vh', opacity: 1 }} 
               transition={{ duration: 7, ease: "linear" }} 
               className="absolute z-[15] left-0"
             >
                <div className="px-8 py-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl">
                   <span className="text-2xl sm:text-4xl font-black text-white italic tracking-tight">{item.text}</span>
                </div>
             </motion.div>
           ))}
        </AnimatePresence>
       </div>

       <div className="grid grid-cols-2 gap-4 sm:gap-10 w-full max-w-5xl mb-12 sm:mb-20 px-4 sm:px-10 z-[20]">
          {items.length > 0 && (
            <>
              <button 
                onClick={() => handleSort(items[0], 'pos')}
                className="h-32 sm:h-48 border-2 border-green-500/20 rounded-[2.5rem] sm:rounded-[4rem] flex flex-col items-center justify-center bg-green-500/10 hover:bg-green-500/30 active:scale-95 transition-all group"
              >
                 <span className="text-green-500 font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs group-hover:scale-110 transition-transform">Positive</span>
              </button>
              <button 
                onClick={() => handleSort(items[0], 'neg')}
                className="h-32 sm:h-48 border-2 border-red-500/20 rounded-[2.5rem] sm:rounded-[4rem] flex flex-col items-center justify-center bg-red-500/10 hover:bg-red-500/30 active:scale-95 transition-all group"
              >
                 <span className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs group-hover:scale-110 transition-transform">Negative</span>
              </button>
            </>
          )}
       </div>
    </div>
  );
}

function CelestialDrift() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let stars: any[] = [];
    let m = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (stars.length < 300) stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.2, s: Math.random() * 0.05 });
      stars.forEach(s => {
        s.x += (m.x - canvas.width / 2) * s.s;
        s.y += (m.y - canvas.height / 2) * s.s;
        if (s.x < 0) s.x = canvas.width; if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height; if (s.y > canvas.height) s.y = 0;
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    const handleMove = (e: any) => { 
      m.x = e.clientX || (e.touches && e.touches[0].clientX); 
      m.y = e.clientY || (e.touches && e.touches[0].clientY); 
    };
    
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); handleMove(e); }, { passive: false });
    animate();
    
    return () => { 
      window.removeEventListener('resize', resize); 
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener('mousemove', handleMove);
      // @ts-ignore
      canvas.removeEventListener('touchmove', handleMove);
      stars = [];
    };
  }, []);
  return <div className="module-container"><canvas ref={canvasRef} className="experience-canvas" /></div>;
}

function StarlightConnect() {
  const [points, setPoints] = useState<any[]>([]);
  const click = (e: any) => {
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    setPoints([...points, { x, y }]);
  };
  return (
    <div onClick={click} className="module-container cursor-crosshair">
       <svg className="absolute inset-0 w-full h-full pointer-events-none">
         {points.map((p, i) => i > 0 && (
           <motion.line key={i} x1={points[i-1].x} y1={points[i-1].y} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
         ))}
       </svg>
       {points.map((p, i) => <div key={i} className="absolute w-3 h-3 bg-white rounded-full blur-[1px] shadow-[0_0_15px_rgba(255,255,255,0.5)] -translate-x-1/2 -translate-y-1/2" style={{ left: p.x, top: p.y }} />)}
       <div className="absolute bottom-20 text-white/10 font-black uppercase tracking-[1em] text-[10px] pointer-events-none">Trace the constellation of your mood</div>
    </div>
  );
}

function NatureLoop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let blades: any[] = [];
    const resize = () => {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      blades = [];
      for(let i=0; i<180; i++) blades.push({ x: (i / 180) * canvas.width, h: Math.random() * 120 + 60, angle: Math.random() * Math.PI, speed: Math.random() * 0.02 + 0.01 });
    };
    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      blades.forEach(b => {
        b.angle += b.speed;
        const sway = Math.sin(b.angle) * 35;
        ctx.beginPath();
        ctx.moveTo(b.x, canvas.height);
        ctx.quadraticCurveTo(b.x + sway, canvas.height - b.h / 2, b.x + sway/2, canvas.height - b.h);
        ctx.strokeStyle = `rgba(74, 222, 128, ${0.1 + (b.h/250)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => { 
      window.removeEventListener('resize', resize); 
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      blades = [];
    };
  }, []);

  return (
    <div className="module-container">
       <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
       <div className="relative z-10 text-center pointer-events-none">
          <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 6 }}>
             <Sun className="w-16 h-16 text-green-500/20 mb-8 mx-auto" />
             <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Nature Recall</h2>
          </motion.div>
       </div>
    </div>
  );
}
