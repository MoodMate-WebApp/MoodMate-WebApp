import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, MessageSquare, Shield, Target, Zap, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export default function Home() {
  const { user } = useAuth();
  const { t } = useSettings();

  // Demo scenarios - Marathi text, English analysis
  const scenarios = [
    {
      text: "आज मला खूप थकवा आणि तणाव जाणवत आहे... सर्व काही खूप कठीण वाटत आहे.",
      mood: "Negative",
      emoji: "😔",
      confidence: 82,
      color: "red"
    },
    {
      text: "आजचा दिवस खूप छान होता! मी माझे काम पूर्ण केले आणि मला खूप अभिमान वाटत आहे.",
      mood: "Positive",
      emoji: "😊",
      confidence: 94,
      color: "green"
    },
    {
      text: "मी फक्त बसून पावसाचा आनंद घेत आहे. दिवस सामान्य आहे.",
      mood: "Neutral",
      emoji: "😐",
      confidence: 76,
      color: "yellow"
    }
  ];

  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    let t1: any, t2: any, t3: any, t4: any;

    const runSequence = () => {
      setDemoStep(0);
      t1 = setTimeout(() => setDemoStep(1), 500); // Box 1 active
      t2 = setTimeout(() => setDemoStep(2), 2500); // Box 2 active
      t3 = setTimeout(() => setDemoStep(3), 4500); // Box 3 active
      t4 = setTimeout(() => {
        setScenarioIndex((prev) => (prev + 1) % scenarios.length);
        runSequence();
      }, 9000); // Loop to next scenario
    };

    runSequence();

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, []);

  const currentScenario = scenarios[scenarioIndex];
  
  // Neural nodes overlay for the brain
  const nodes = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 60 + 20}%`,
    left: `${Math.random() * 60 + 20}%`,
    duration: Math.random() * 1.5 + 1,
    delay: Math.random() * 2,
    size: Math.random() * 4 + 2,
  }));

  return (
    <div className="flex flex-col items-center flex-grow min-h-screen relative w-full pt-12 md:pt-20">
      
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10 pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 text-primary-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-2xl backdrop-blur-md"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            <span>{t('engineTag')}</span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-[6.5rem] font-black tracking-tighter leading-[0.9] mb-10 text-white text-center lg:text-left uppercase italic">
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              {t('heroTitle1')}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 py-4 non-italic"
            >
              {t('heroTitle2')}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              {t('heroTitle3')}
            </motion.span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg md:text-xl text-slate-500 mb-14 max-w-xl leading-relaxed font-medium text-center lg:text-left tracking-wide"
          >
            {t('heroDesc')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
          >
            {/* Primary Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              {user ? (
                <Link
                  to="/ai"
                  className="relative group flex items-center justify-center gap-4 bg-white text-dark-950 px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all overflow-hidden shadow-2xl hover:bg-primary-500 hover:text-white w-full border border-white/10"
                >
                  {t('dashboard')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="relative group flex items-center justify-center gap-4 bg-white text-dark-950 px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all overflow-hidden shadow-2xl hover:bg-slate-100 w-full"
                >
                  {t('getStarted')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </motion.div>

            {/* Secondary Button */}
            {!user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/ai"
                  className="relative group flex items-center justify-center gap-4 bg-white/[0.03] backdrop-blur-md border border-white/10 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all hover:bg-white/[0.08] w-full"
                >
                  Live Demo <Sparkles className="w-4 h-4 text-primary-400" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Brain Visual Content */}
        <div className="flex-1 relative w-full flex justify-center items-center h-[280px] sm:h-[400px] lg:h-[600px] z-10">
          <motion.div
            animate={{ 
              y: [-20, 20, -20],
              rotate: [-2, 2, -2]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 8,
              ease: "easeInOut"
            }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Soft Outer Glow Pulse behind the image */}
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute bg-primary-500/30 blur-[150px] rounded-full w-[90%] h-[90%] pointer-events-none"
            />
            
            {/* Brain Image */}
            <div className="relative z-10 w-[200px] sm:w-full h-full flex items-center justify-center mix-blend-screen overflow-visible">
              <motion.img 
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: 1
                }}
                transition={{
                  scale: { repeat: Infinity, duration: 8, ease: "easeInOut" },
                  opacity: { duration: 1 }
                }}
                src="/brain.png" 
                alt="AI Brain" 
                className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(99,102,241,0.3)] transition-all duration-700 ease-in-out"
                style={{ mixBlendMode: 'screen' }}
              />
              
              {/* Neural Blink Effect Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {nodes.map(node => (
                  <motion.div
                    key={node.id}
                    className="absolute rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                    style={{ 
                      top: node.top, 
                      left: node.left,
                      width: node.size,
                      height: node.size,
                    }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 0.5] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: node.duration, 
                      delay: node.delay,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Ground ripples */}
            <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-32 opacity-20 pointer-events-none mix-blend-screen">
              <motion.div 
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeOut" }}
                className="absolute inset-0 border-[1px] border-primary-500/50 rounded-[100%] scale-x-[3]"
              />
              <motion.div 
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 5, delay: 2.5, ease: "easeOut" }}
                className="absolute inset-0 border-[1px] border-primary-500/50 rounded-[100%] scale-x-[3]"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Live Demo Section */}
      <div className="w-full max-w-7xl mx-auto px-4 relative z-20 pb-40">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-dark-950/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-10 shadow-2xl overflow-hidden relative"
        >
          {/* Animated background glow inside the box */}
          <div className={`absolute top-0 right-0 w-96 h-96 blur-[150px] opacity-10 transition-colors duration-1000 ${
            currentScenario.color === 'red' ? 'bg-red-500' : currentScenario.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'
          }`} />

          {/* Header */}
          <div className="flex-shrink-0 flex items-center lg:items-start gap-5 lg:flex-col lg:w-56">
            <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-inner group">
               <MessageSquare className="w-8 h-8 text-primary-400 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">AI in action.</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">Watch our engine decode Marathi text in real-time.</p>
            </div>
          </div>

          {/* Interactive Flow Diagram */}
          <div className="flex-1 w-full flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            
            {/* Box 1: Input Text - Now much wider */}
            <motion.div 
              animate={{ 
                opacity: demoStep >= 1 ? 1 : 0.3,
                y: demoStep === 1 ? -5 : 0,
                borderColor: demoStep === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'
              }}
              className="bg-dark-900 border border-white/5 rounded-[2.5rem] p-8 flex-[2] w-full min-h-[140px] flex items-center shadow-2xl transition-all duration-500 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <AnimatePresence mode="wait">
                {demoStep >= 1 && (
                  <motion.p
                    key={scenarioIndex}
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-slate-200 font-medium text-lg leading-relaxed italic relative z-10 w-full"
                  >
                    "{currentScenario.text}"
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Connecting Line */}
            <div className="hidden md:flex flex-col items-center gap-2 opacity-20 px-2">
               <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent" />
            </div>

            {/* Box 2: Analyzing */}
            <motion.div 
              animate={{ 
                opacity: demoStep >= 2 ? 1 : 0.3,
                scale: demoStep === 2 ? 1.05 : 1
              }}
              className="bg-dark-900 border border-white/5 rounded-[2rem] p-6 flex-1 w-full min-h-[140px] flex items-center justify-center gap-4 shadow-2xl transition-all duration-500 overflow-hidden relative"
            >
              {demoStep === 2 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex flex-col items-center gap-3"
                >
                  <div className="flex items-center gap-1.5">
                    <motion.div animate={{ height: [8, 24, 8] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 bg-primary-500 rounded-full" />
                    <motion.div animate={{ height: [24, 8, 24] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 bg-primary-400 rounded-full" />
                    <motion.div animate={{ height: [12, 32, 12] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 bg-accent-400 rounded-full" />
                  </div>
                </motion.div>
              )}
              {demoStep > 2 && (
                <div className="flex flex-col items-center gap-2 opacity-60">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-500"
                  >
                    ✓
                  </motion.div>
                </div>
              )}
            </motion.div>

            {/* Connecting Line */}
            <div className="hidden md:flex flex-col items-center gap-2 opacity-20 px-2">
               <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent" />
            </div>

            {/* Box 3: Result */}
            <motion.div 
              animate={{ 
                opacity: demoStep >= 3 ? 1 : 0.3,
                y: demoStep === 3 ? -5 : 0,
                borderColor: demoStep === 3 ? (currentScenario.color === 'red' ? 'rgba(239,68,68,0.4)' : currentScenario.color === 'green' ? 'rgba(34,197,94,0.4)' : 'rgba(234,179,8,0.4)') : 'rgba(255,255,255,0.05)',
                boxShadow: demoStep === 3 ? `0 30px 60px rgba(0,0,0,0.5), 0 0 30px ${currentScenario.color === 'red' ? 'rgba(239,68,68,0.15)' : currentScenario.color === 'green' ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)'}` : 'none'
              }}
              className="bg-dark-900 border border-white/5 rounded-[2rem] p-8 flex-[1.5] w-full min-h-[140px] flex items-center gap-6 shadow-2xl transition-all duration-500 relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {demoStep >= 3 && (
                  <motion.div 
                    key={scenarioIndex}
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }} 
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    className="flex items-center gap-5 w-full relative z-10"
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl relative overflow-hidden flex-shrink-0 ${
                      currentScenario.color === 'red' ? 'bg-red-500/20 text-red-500' : currentScenario.color === 'green' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
                        {currentScenario.emoji}
                      </motion.span>
                    </div>
                    <div>
                      <h4 className={`font-black text-2xl mb-1 tracking-tighter ${
                        currentScenario.color === 'red' ? 'text-red-500' : currentScenario.color === 'green' ? 'text-green-500' : 'text-yellow-500'
                      }`}>
                        {currentScenario.mood}
                      </h4>
                      <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">Confidence: {currentScenario.confidence}%</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
           {[
             { title: "Real-time Processing", desc: "Get emotional insights the moment you finish typing.", icon: Zap },
             { title: "84.80% Accuracy", desc: "Optimized specifically for Marathi NLP nuances and context.", icon: Target },
             { title: "Privacy First", desc: "Your data is encrypted and never shared with third parties.", icon: Shield }
           ].map((item, i) => (
             <motion.div
               key={item.title}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.2 }}
               className="bg-white/5 border border-white/5 rounded-3xl p-10 hover:bg-white/10 transition-all duration-500 group"
             >
                <div className="w-14 h-14 bg-dark-900 border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                   <item.icon className="w-7 h-7 text-primary-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4 tracking-tight">{item.title}</h4>
                <p className="text-slate-400 text-sm font-light leading-relaxed">{item.desc}</p>
             </motion.div>
           ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0], opacity: [0.2, 0.8, 0.2] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Explore</span>
        <ChevronDown className="w-5 h-5 text-slate-500" />
      </motion.div>

    </div>
  );
}
