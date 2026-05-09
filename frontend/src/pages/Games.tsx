import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, Wind, Activity, Music, Palette, MousePointer2, Star, CloudRain, Sun, ArrowUpRight
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

interface GameConfig {
  id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  color?: string;
}

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

function GameAvatar({ ui, isHovered }: { ui: any, isHovered: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div 
        animate={{ 
          scale: isHovered ? [1.1, 1.4, 1.1] : [1, 1.2, 1],
          opacity: isHovered ? [0.5, 0.8, 0.5] : [0.3, 0.5, 0.3]
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute w-48 h-48 rounded-full blur-[70px] z-0"
        style={{ backgroundColor: ui.color }}
      />

      {/* The Core 3D Image Avatar */}
      <motion.div
        animate={{ 
          rotate: ui.animation === 'spin' ? 360 : 0,
          y: ui.animation === 'float' ? [-15, 15, -15] : 0,
          scale: ui.animation === 'pulse' ? [1, 1.08, 1] : 1
        }}
        transition={{ 
          rotate: { repeat: Infinity, duration: 30, ease: "linear" },
          y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
          scale: { repeat: Infinity, duration: 4, ease: "easeInOut" }
        }}
        className="relative w-56 h-56 flex items-center justify-center z-10"
      >
        <img 
          src={ui.image} 
          alt="Game Icon"
          className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-1000 select-none pointer-events-none"
        />
        
        {/* Subtle Internal Energy Overlay */}
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-full pointer-events-none"
        />
      </motion.div>
    </div>
  );
}

export default function Games() {
  const [catalog, setCatalog] = useState<GameConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [hoveredGameId, setHoveredGameId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const { data } = await api.get('/api/v1/games/catalog');
        setCatalog(data.data);
      } catch (err) {
        toast.error('Failed to load Sanctuary catalog.');
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  return (
    <div className="flex flex-col w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-32 pb-24 relative overflow-hidden">
      
      {/* 1. Header Section - Ultra Minimalist */}
      <div className="flex flex-col items-center text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-slate-600 text-[9px] font-black uppercase tracking-[0.6em] mb-8 shadow-2xl"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
          <span>Sensory Void Protocol</span>
        </motion.div>
        
        <h1 className="text-4xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase italic">
          Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-white to-accent-500 non-italic">Garden.</span>
        </h1>
        
        <p className="text-slate-500 text-sm font-light max-w-xl mx-auto leading-relaxed opacity-60 tracking-wide">
          A high-fidelity archive of sensory recalibration tools. 
          Initialize a gateway to stabilize your cognitive rhythm.
        </p>
      </div>

      {/* 2. Optimized Clickable Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
           {[...Array(10)].map((_, i) => <div key={i} className="h-[420px] bg-white/5 rounded-[3rem] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-20 relative z-10">
          {catalog.map((game, i) => {
            const ui = UI_MAPPING[game.id] || UI_MAPPING['bubble-burst'];
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02, duration: 0.6 }}
                whileHover={{ y: -10 }}
                onMouseEnter={() => setHoveredGameId(game.id)}
                onMouseLeave={() => setHoveredGameId(null)}
                onClick={() => setActiveGameId(game.id)}
                className="group relative flex flex-col h-[380px] sm:h-[460px] bg-dark-950/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden hover:border-primary-500/50 transition-all duration-700 cursor-pointer shadow-2xl"
              >
                {/* Visual Area */}
                <div className="relative h-[65%] w-full overflow-hidden flex items-center justify-center">
                   <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   
                   <GameAvatar ui={ui} isHovered={hoveredGameId === game.id} />

                   <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
                </div>

                {/* Content Area - Ultra Clean */}
                <div className="relative z-10 px-8 pb-8 flex-1 flex flex-col">
                   <div className="flex justify-between items-center mb-5">
                      <span className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[7px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-primary-400 transition-colors">
                        {game.category}
                      </span>
                      <ui.icon className="w-3.5 h-3.5 text-slate-800 group-hover:text-primary-500 transition-colors" />
                   </div>
                   
                   <h3 className="text-xl font-black text-white mb-3 tracking-tight italic leading-tight group-hover:translate-x-1 transition-transform">
                     {game.title}
                   </h3>
                   
                   <p className="text-slate-600 text-[10px] font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 line-clamp-2">
                     {game.description}
                   </p>

                   {/* Launch Indicator */}
                   <div className="mt-auto flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary-500">Initialize gateway</span>
                      <ArrowUpRight className="w-4 h-4 text-primary-500" />
                   </div>
                </div>

                {/* Premium Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[#050505] -z-20" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-primary-500/5 blur-[150px] rounded-full -translate-y-1/2 -z-10 pointer-events-none" />

      {/* Experience Canvas Global Styles */}
      <style>{`
        .experience-canvas { position: absolute; inset: 0; width: 100%; height: 100%; cursor: crosshair; }
        .zen-overlay { position: fixed; inset: 0; z-index: 200; background: black; display: flex; flex-direction: column; overflow: hidden; }
      `}</style>

      {/* Overlays */}
      <AnimatePresence>
        {activeGameId && (
          <ZenPlayer id={activeGameId} onClose={() => setActiveGameId(null)} />
        )}
      </AnimatePresence>

    </div>
  );
}

/* --- PLAYER COMPONENT --- */

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
      default: return <div className="text-white text-4xl font-black">Coming Soon...</div>;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] bg-dark-950/98 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-10"
    >
      <button 
        onClick={onClose} 
        className="fixed top-6 right-6 sm:top-10 sm:right-10 w-12 h-12 sm:w-16 sm:h-16 bg-white text-dark-950 rounded-2xl flex items-center justify-center z-[100000] hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-90"
      >
        <X className="w-6 h-6" />
      </button>

      {renderModule()}

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none text-center opacity-30">
         <p className="text-white text-[10px] font-black uppercase tracking-[1em]">Neuro-Zen Protocol v6.0</p>
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
    const ctx = canvas.getContext('2d')!;
    
    let bubbles: any[] = [];
    let particles: any[] = [];
    let starfield: any[] = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starfield = [];
      for(let i=0; i<100; i++) {
        starfield.push({ 
          x: Math.random() * canvas.width, 
          y: Math.random() * canvas.height, 
          r: Math.random() * 1.5 
        });
      }
    };
    
    window.addEventListener('resize', resize);
    resize();

    const createPop = (x: number, y: number, color: string) => {
      for (let i = 0; i < 15; i++) {
        particles.push({ 
          x, y, 
          r: Math.random() * 3 + 1, 
          vx: (Math.random() - 0.5) * 20, 
          vy: (Math.random() - 0.5) * 20, 
          life: 1, 
          color 
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Starfield
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      starfield.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Spawn Bubbles (Higher rate)
      if (Math.random() < 0.04 && bubbles.length < 20) {
        bubbles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 100,
          r: Math.random() * 50 + 30,
          vy: -(Math.random() * 2 + 1),
          color: `hsla(${Math.random() * 360}, 70%, 60%, 0.4)`,
          wobble: 0,
          wobbleSpeed: Math.random() * 0.05 + 0.02
        });
      }

      // Update & Draw Bubbles
      bubbles.forEach((b, i) => {
        b.y += b.vy;
        b.wobble += b.wobbleSpeed;
        const currentR = b.r + Math.sin(b.wobble) * 5;
        
        const grad = ctx.createRadialGradient(b.x - currentR * 0.3, b.y - currentR * 0.3, 0, b.x, b.y, currentR);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        grad.addColorStop(0.3, b.color);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(b.x, b.y, currentR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (b.y + b.r < -100) bubbles.splice(i, 1);
      });

      // Update & Draw Particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
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
        if (dist < b.r + 10) {
          createPop(b.x, b.y, b.color);
          bubbles.splice(i, 1);
        }
      });
    };

    canvas.addEventListener('mousedown', handleInput);
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleInput(e);
    });

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="experience-canvas" />;
}

function PranaBreathe() {
  const [phase, setPhase] = useState('Inhale');
  useEffect(() => {
    const cycle = setInterval(() => setPhase(p => p === 'Inhale' ? 'Exhale' : 'Inhale'), 4000);
    return () => clearInterval(cycle);
  }, []);
  return (
    <div className="h-full flex flex-col items-center justify-center bg-black">
      <motion.div animate={{ scale: phase === 'Inhale' ? 1.4 : 0.7, opacity: phase === 'Inhale' ? 0.6 : 0.2 }} transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }} className="w-80 h-80 bg-teal-500 rounded-full blur-[80px]" />
      <div className="absolute flex flex-col items-center">
         <motion.h2 key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-6xl font-black text-white tracking-tighter uppercase italic">{phase === 'Inhale' ? 'श्वास घ्या' : 'श्वास सोडा'}</motion.h2>
         <div className="mt-8 flex gap-2">{[1,2,3,4].map(i => <div key={i} className={`w-2 h-2 rounded-full ${phase === 'Inhale' ? 'bg-teal-500 animate-pulse' : 'bg-white/10'}`} />)}</div>
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
    const ctx = canvas.getContext('2d')!;
    
    let parts: any[] = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (parts.length < 150) {
        parts.push({ 
          x: Math.random() * canvas.width, 
          y: -20, 
          vy: Math.random() * 8 + 4, 
          l: Math.random() * 30 + 10 
        });
      }

      parts.forEach((p, i) => {
        p.y += p.vy;
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + p.l);
        ctx.stroke();
        
        if (p.y > canvas.height) parts.splice(i, 1);
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="experience-canvas" />;
}

function MoodCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    
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
      ctx.arc(x, y, 50, 0, Math.PI * 2);
      ctx.fill();
    };

    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      paint(e);
    });

    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="experience-canvas" />;
}

function EchoHarmony() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    
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
        r.rad += 3;
        r.op -= 0.015;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.rad, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 158, 11, ${r.op})`;
        ctx.lineWidth = 2;
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
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleInput(e);
    });

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="experience-canvas" />;
}

function FocusPulse() {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const handleMove = (e: any) => { setPos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 }); };
  return (
    <div onMouseMove={handleMove} className="h-full bg-black flex items-center justify-center relative cursor-none overflow-hidden">
       <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
       <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="w-96 h-96 border border-white/10 rounded-full flex items-center justify-center">
          <div className="w-64 h-64 border border-white/20 rounded-full flex items-center justify-center">
             <div className="w-32 h-32 border-2 border-primary-500 rounded-full" />
          </div>
       </motion.div>
       <motion.div animate={{ x: `${pos.x}vw`, y: `${pos.y}vh` }} className="fixed top-0 left-0 w-8 h-8 bg-white rounded-full mix-blend-difference -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

function EmotionSort() {
  const POS_WORDS = ["आनंद (Joy)", "शांती (Peace)", "प्रेम (Love)", "उत्साह (Excitement)", "समाधान (Content)"];
  const NEG_WORDS = ["दुःख (Sadness)", "राग (Anger)", "भीती (Fear)", "चिंता (Anxiety)", "तणाव (Stress)"];
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING'>('IDLE');
  const [items, setItems] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const interval = setInterval(() => {
      const isPos = Math.random() > 0.5;
      const text = isPos ? POS_WORDS[Math.floor(Math.random() * POS_WORDS.length)] : NEG_WORDS[Math.floor(Math.random() * NEG_WORDS.length)];
      setItems(prev => [...prev, { id: Date.now(), text, isPos, x: Math.random() * 60 + 20, y: -50, speed: Math.random() * 0.5 + 0.8 }]);
    }, 4000);
    return () => clearInterval(interval);
  }, [gameState]);
  const handleSort = (item: any, side: 'pos' | 'neg') => {
    const correct = (item.isPos && side === 'pos') || (!item.isPos && side === 'neg');
    if (correct) { setScore(s => s + 10); setFeedback('Correct!'); }
    else { setScore(s => Math.max(0, s - 5)); setFeedback('Wrong!'); }
    setItems(prev => prev.filter(i => i.id !== item.id));
    setTimeout(() => setFeedback(null), 1000);
  };
  
  const handleTouch = (e: any, item: any, side: 'pos' | 'neg') => {
    e.preventDefault();
    handleSort(item, side);
  };
  if (gameState === 'IDLE') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black p-10 text-center">
         <MousePointer2 className="w-10 h-10 text-primary-400 mb-10 shadow-3xl" />
         <h2 className="text-4xl font-black text-white mb-6 uppercase italic tracking-tighter">How to Play</h2>
         <div className="max-w-md text-slate-500 mb-12 space-y-4 font-medium leading-relaxed">
            <p>Marathi emotion words will float down.</p>
            <p>Tap <span className="text-green-500 font-bold">Left</span> for positive, <span className="text-red-500 font-bold">Right</span> for negative.</p>
         </div>
         <button onClick={() => setGameState('PLAYING')} className="bg-white text-black font-black uppercase tracking-widest text-xs px-16 py-5 rounded-3xl hover:bg-primary-500 hover:text-white transition-all shadow-2xl">Begin Calibration</button>
      </div>
    );
  }
  return (
    <div className="h-full bg-black relative p-10 flex flex-col items-center overflow-hidden">
       <div className="absolute top-10 left-10 text-white font-black z-[10]">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Calibration Score</p>
          <p className="text-4xl italic">{score}</p>
       </div>
       <AnimatePresence>
          {feedback && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className={`absolute top-1/3 text-4xl font-black z-[20] ${feedback === 'Correct!' ? 'text-green-500' : 'text-red-500'} italic`}>{feedback === 'Correct!' ? 'उत्कृष्ट!' : 'चुकीचे!'}</motion.div>}
       </AnimatePresence>
       <div className="flex-1 w-full relative">
          <AnimatePresence>
           {items.map(item => (
             <motion.div key={item.id} initial={{ y: -50, x: `${item.x}%`, opacity: 0 }} animate={{ y: window.innerHeight + 100, opacity: 1 }} transition={{ duration: 15 / item.speed, ease: "linear" }} className="absolute select-none z-[15]">
                <div className="flex gap-4">
                   <button 
                     onClick={() => handleSort(item, 'pos')} 
                     onTouchStart={(e) => handleTouch(e, item, 'pos')}
                     className="bg-green-500/10 hover:bg-green-500/30 border border-green-500/20 text-green-500 px-4 py-2 rounded-xl text-lg font-bold transition-all backdrop-blur-md whitespace-nowrap"
                   >
                     {item.text} 👈
                   </button>
                   <button 
                     onClick={() => handleSort(item, 'neg')} 
                     onTouchStart={(e) => handleTouch(e, item, 'neg')}
                     className="bg-red-500/10 hover:bg-red-500/30 border border-red-500/20 text-red-500 px-4 py-2 rounded-xl text-lg font-bold transition-all backdrop-blur-md whitespace-nowrap"
                   >
                     👉 {item.text}
                   </button>
                </div>
             </motion.div>
           ))}
        </AnimatePresence>
       </div>
       <div className="grid grid-cols-2 gap-10 w-full max-w-4xl relative z-10 mb-10">
          <div className="h-40 border-2 border-green-500/20 rounded-[3rem] flex flex-col items-center justify-center bg-green-500/[0.02] backdrop-blur-sm">
             <span className="text-green-500 font-black uppercase tracking-[0.3em] text-xs">Positive</span>
             <p className="text-slate-700 text-[10px] mt-2 italic">सकारात्मक</p>
          </div>
          <div className="h-40 border-2 border-red-500/20 rounded-[3rem] flex flex-col items-center justify-center bg-red-500/[0.02] backdrop-blur-sm">
             <span className="text-red-500 font-black uppercase tracking-[0.3em] text-xs">Negative</span>
             <p className="text-slate-700 text-[10px] mt-2 italic">नकारात्मक</p>
          </div>
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
    const ctx = canvas.getContext('2d')!;
    
    let stars: any[] = [];
    let m = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (stars.length < 200) {
        stars.push({ 
          x: Math.random() * canvas.width, 
          y: Math.random() * canvas.height, 
          r: Math.random() * 1.5, 
          s: Math.random() * 0.02 
        });
      }

      stars.forEach(s => {
        s.x += (m.x - canvas.width / 2) * s.s;
        s.y += (m.y - canvas.height / 2) * s.s;
        
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    const handleMove = (e: any) => {
      m.x = e.clientX || (e.touches && e.touches[0].clientX);
      m.y = e.clientY || (e.touches && e.touches[0].clientY);
    };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      handleMove(e);
    });

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="experience-canvas" />;
}

function StarlightConnect() {
  const [points, setPoints] = useState<any[]>([]);
  const click = (e: any) => setPoints([...points, { x: e.clientX, y: e.clientY }]);
  return (
    <div onClick={click} className="h-full bg-black relative overflow-hidden">
       <svg className="absolute inset-0 w-full h-full">{points.map((p, i) => i > 0 && (<motion.line key={i} x1={points[i-1].x} y1={points[i-1].y} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />))}</svg>
       {points.map((p, i) => <div key={i} className="absolute w-2 h-2 bg-white rounded-full blur-[2px] shadow-[0_0_10px_white]" style={{ left: p.x, top: p.y }} />)}
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center">
          <p className="text-slate-800 text-[10px] font-black uppercase tracking-[0.5em]">Connect the stars to form your constellation.</p>
       </div>
    </div>
  );
}

function NatureLoop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    
    let blades: any[] = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      blades = [];
      for(let i=0; i<150; i++) {
        blades.push({ 
          x: (i / 150) * canvas.width, 
          h: Math.random() * 100 + 50, 
          angle: 0, 
          speed: Math.random() * 0.02 + 0.01 
        });
      }
    };
    
    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      blades.forEach(b => {
        b.angle += b.speed;
        const sway = Math.sin(b.angle) * 30;
        ctx.beginPath();
        ctx.moveTo(b.x, canvas.height);
        ctx.quadraticCurveTo(b.x + sway, canvas.height - b.h / 2, b.x + sway/2, canvas.height - b.h);
        ctx.strokeStyle = `rgba(74, 222, 128, ${0.1 + (b.h/200)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="h-full bg-black relative flex flex-col items-center justify-center overflow-hidden">
       <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
       <div className="relative z-10 text-center pointer-events-none p-10">
          <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 5 }} className="flex flex-col items-center">
             <Wind className="w-12 h-12 text-green-500/30 mb-8" />
             <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Visual Grounding</h2>
             <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">Focus on the rhythm of the wind to lower anxiety.</p>
          </motion.div>
       </div>
    </div>
  );
}
