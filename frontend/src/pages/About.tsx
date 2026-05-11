import { motion } from 'framer-motion';
import { 
  Mail, Lightbulb, Rocket, Brain, Code, Cpu, Globe, 
  Sparkles, Layers, ShieldCheck, ExternalLink
} from 'lucide-react';

const TEAM = [
  { 
    name: 'Rohan Baviskar', 
    role: 'Lead Engineer', 
    specialty: 'High-Performance Full-Stack Systems & AI Integration',
    avatar: '/team_rohan.png',
    color: '#7c3aed'
  },
  { 
    name: 'Harshada Bodavade', 
    role: 'AI Strategist', 
    specialty: 'Neural Sentiment Analysis & Cognitive Intelligence',
    avatar: '/team_harshada.png',
    color: '#db2777'
  },
  { 
    name: 'Aayushi Chaudhari', 
    role: 'Design Director', 
    specialty: 'Interface Psychology & Immersive User Experiences',
    avatar: '/team_aayushi.png',
    color: '#059669'
  },
  { 
    name: 'Ujjwal Patil', 
    role: 'Backend Architect', 
    specialty: 'Distributed Scalability & Secure Data Pipelines',
    avatar: '/team_ujjwal.png',
    color: '#2563eb'
  },
];

const TECH_STACK = [
  { name: 'XLM-RoBERTa', icon: Cpu, desc: 'Advanced Multilingual Transformer' },
  { name: 'FastAPI', icon: Globe, desc: 'High-performance Asynchronous Backend' },
  { name: 'Vite 6', icon: Rocket, desc: 'Ultra-fast Frontend Bundling' },
  { name: 'Supabase', icon: ShieldCheck, desc: 'Secure Auth & Realtime Data' },
  { name: 'Framer Motion', icon: Sparkles, desc: 'Cinematic UI Orchestration' },
];

export default function About() {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-24 relative overflow-hidden">
      
      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* 1. Hero Section */}
      <div className="flex flex-col items-center text-center mb-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-slate-500 text-xs font-black uppercase tracking-[0.5em] mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary-400" />
          <span>Our Mission</span>
        </motion.div>
        
        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
          Decoding <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-white to-accent-400 italic">Human Emotion.</span>
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed italic opacity-80">
          MoodMate is an emotionally aware intelligence engine designed to bridge the gap 
          between digital interaction and human sentiment through state-of-the-art NLP.
        </p>
      </div>

      {/* 2. Team Section - Modern Grid */}
      <div className="mb-40 relative z-10">
        <div className="flex flex-col items-center mb-16">
           <h2 className="text-2xl font-black text-white uppercase tracking-[0.3em] italic mb-4">Core Collective</h2>
           <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-transparent rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM.map((member, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-dark-950 border border-white/[0.03] rounded-[2.5rem] p-10 flex flex-col items-center text-center hover:border-white/10 transition-all duration-500 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="w-32 h-32 rounded-full mb-8 relative z-10 p-1 bg-white/[0.02] border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-500 flex items-center justify-center overflow-hidden">
                <div 
                  className="w-full h-full rounded-full flex items-center justify-center text-3xl font-black text-white italic opacity-40 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(135deg, ${member.color}44, ${member.color}88)` }}
                >
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-2xl">
                   <Code className="w-4 h-4 text-primary-400" />
                </div>
              </div>
              
              <h3 className="text-xl font-black text-white mb-2 tracking-tight italic">{member.name}</h3>
              <p className="text-primary-500 text-xs font-black uppercase tracking-[0.2em] mb-4">{member.role}</p>
              
              <p className="text-slate-600 text-xs font-medium leading-relaxed mb-8 italic">
                Specializing in {member.specialty} to build a more empathic digital world.
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <button className="text-slate-600 hover:text-white transition-colors"><ExternalLink className="w-4 h-4" /></button>
                <button className="text-slate-600 hover:text-white transition-colors"><Mail className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Vision Section - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-40 relative z-10">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-br from-primary-500/[0.03] to-transparent border border-primary-500/10 rounded-[3rem] p-12 relative overflow-hidden group"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-8 border border-primary-500/20 shadow-inner">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-black text-white mb-6 italic">The Philosophy.</h3>
          <p className="text-slate-400 text-base leading-relaxed font-light italic">
            MoodMate was born from a simple realization: the internet is louder than ever, but less understood. We built this to return the "human" element to data, making emotional awareness a core feature of the modern web.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-br from-accent-500/[0.03] to-transparent border border-accent-500/10 rounded-[3rem] p-12 relative overflow-hidden group"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-500/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
          <div className="w-16 h-16 rounded-2xl bg-accent-500/10 flex items-center justify-center text-accent-400 mb-8 border border-accent-500/20 shadow-inner">
            <Rocket className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-black text-white mb-6 italic">The Future.</h3>
          <p className="text-slate-400 text-base leading-relaxed font-light italic">
            Our vision is to embed emotional intelligence into every layer of our platform. From predictive mental health tools to high-fidelity sensory sanctuaries, we are defining the next frontier of human-AI collaboration.
          </p>
        </motion.div>
      </div>

      {/* 4. Tech Stack Section */}
      <div className="flex flex-col items-center relative z-10">
        <h3 className="text-xs font-black uppercase tracking-[1em] text-slate-700 mb-12">Engineered with Precision</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 w-full max-w-5xl">
           {TECH_STACK.map((tech, i) => (
             <motion.div 
               key={i}
               whileHover={{ y: -5 }}
               className="flex flex-col items-center text-center group"
             >
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-primary-400 group-hover:border-primary-500/30 transition-all duration-500 mb-4 shadow-2xl">
                   <tech.icon className="w-6 h-6" />
                </div>
                <span className="text-white text-xs font-black tracking-tight">{tech.name}</span>
                <span className="text-slate-700 text-[10px] uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{tech.desc}</span>
             </motion.div>
           ))}
        </div>
      </div>

      {/* 5. Bottom Decoration */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="relative w-full h-32 flex items-center justify-center mt-32 opacity-40"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
           <svg viewBox="0 0 1000 100" className="w-full h-full opacity-20 stroke-primary-500" fill="none">
              <path d="M 0 50 Q 250 100 500 50 T 1000 50" strokeWidth="1" strokeDasharray="4 4" />
           </svg>
        </div>
        <div className="relative z-10 w-20 h-20 rounded-full bg-black border border-primary-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.1)]">
          <Brain className="w-10 h-10 text-primary-400/50" />
        </div>
      </motion.div>

    </div>
  );
}
