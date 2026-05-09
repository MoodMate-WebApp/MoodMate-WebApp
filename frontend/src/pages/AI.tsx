import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trash2, MessageSquare, BarChart3, Lightbulb, Gamepad2, Info, ChevronRight, Brain, ArrowDown } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LogIn, UserPlus } from 'lucide-react';

interface AnalysisResult {
  sentiment: string;
  emotion: string;
  confidence: number;
  intensity: number;
  emoji: string;
  summary: string;
  coping_suggestions: string[];
  color_code: string;
  // derived in mapping layer:
  sentimentLabel: string;
  positiveScore: number;
  neutralScore: number;
  negativeScore: number;
  colorClass: string;
  glowClass: string;
  borderClass: string;
}

// Maps backend response → UI display values
function mapResult(data: Omit<AnalysisResult, 'sentimentLabel' | 'positiveScore' | 'neutralScore' | 'negativeScore' | 'colorClass' | 'glowClass' | 'borderClass'>): AnalysisResult {
  const s = data.sentiment.toLowerCase();
  const isPositive = s === 'positive';
  const isNegative = s === 'negative';

  // Derive bar percentages from confidence score
  const dominantPct = Math.round(data.confidence * 100);
  const remainder = 100 - dominantPct;
  const positiveScore = isPositive ? dominantPct : Math.round(remainder * 0.3);
  const negativeScore = isNegative ? dominantPct : Math.round(remainder * 0.4);
  const neutralScore = Math.max(0, 100 - positiveScore - negativeScore);

  const colorClass = isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-yellow-500';
  const glowClass = isPositive
    ? 'bg-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.3)]'
    : isNegative
    ? 'bg-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.3)]'
    : 'bg-yellow-500/20 shadow-[0_0_40px_rgba(234,179,8,0.3)]';
  const borderClass = isPositive
    ? 'border-green-500/20'
    : isNegative
    ? 'border-red-500/20'
    : 'border-yellow-500/20';

  return {
    ...data,
    sentimentLabel: data.sentiment,
    positiveScore,
    neutralScore,
    negativeScore,
    colorClass,
    glowClass,
    borderClass,
  };
}

const MARATHI_TEMPLATES = [
  "आजचा दिवस खूप छान आहे! 🌸",
  "मला खूप एकटेपणा आणि दुःख वाटत आहे. 😔",
  "सर्व काही सामान्य चालले आहे, काही खास नाही. 😐",
  "माझ्या यशामुळे मला खूप अभिमान वाटत आहे! 🏆",
  "खूप कामाचा ताण आहे आणि मी खूप चिडलो आहे. 😡"
];

export default function AI() {
  const { user } = useAuth();
  const { t } = useSettings();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showTrialModal, setShowTrialModal] = useState(false);
  
  // Ref for auto-scrolling
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      const trialUsed = localStorage.getItem('moodmate_trial_used');
      if (trialUsed === 'true') {
        setShowTrialModal(true);
      }
    }
  }, [user]);

  // Auto-scroll when results arrive
  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  const handleAnalyze = async (overrideText?: string) => {
    const textToUse = overrideText || text;
    if (!user && localStorage.getItem('moodmate_trial_used') === 'true') {
      setShowTrialModal(true);
      return;
    }

    if (!textToUse.trim() || textToUse.trim().length < 3) {
      toast.error('Please enter at least 3 characters.');
      return;
    }
    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data } = await api.post('/api/v1/analyze', {
        content: textToUse.trim(),
        language: 'Marathi',
      });
      const mapped = mapResult(data);
      setResult(mapped);
      toast.success('Analysis complete! Scroll down for your emotional profile.');

      try {
        await api.post('/api/v1/journal/entries', {
          text: textToUse.trim(),
          emotion: mapped.emotion,
          mood: mapped.sentiment,
          color_code: mapped.color_code,
          intensity: mapped.intensity,
          language: 'Marathi'
        });
      } catch (saveErr) {
        console.error('Failed to save to history:', saveErr);
      }

      if (!user) {
        localStorage.setItem('moodmate_trial_used', 'true');
        setTimeout(() => setShowTrialModal(true), 8000);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-10 relative selection:bg-primary-500/30">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-12">
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3 h-3" />
            <span>{t('engineTag')}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight"
          >
            मराठी शब्दांमागील <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">भावना ओळखा.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg font-light max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Enter any text in Marathi to understand the underlying emotions and receive personalized wellness tips.
          </motion.p>
        </div>

        {/* Brain Visual with Floating Markers */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 relative w-full max-w-md aspect-square flex items-center justify-center"
        >
           <div className="absolute inset-0 bg-primary-500/20 blur-[100px] rounded-full scale-75 pointer-events-none" />
           
           <img 
             src="/brain.png" 
             alt="AI Brain" 
             className="w-full h-full object-contain mix-blend-screen relative z-10 animate-float"
             style={{ animation: 'float 6s ease-in-out infinite' }}
           />

           <motion.div 
             animate={{ y: [0, -10, 0] }}
             transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
             className="absolute top-[15%] left-[-10%] sm:left-0 z-20 hidden xs:flex items-center gap-2 bg-dark-800/80 backdrop-blur-md border border-green-500/30 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.2)]"
           >
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px]">😊</div>
              <span className="text-white text-xs font-bold">Positive</span>
           </motion.div>

           <motion.div 
             animate={{ y: [0, 10, 0] }}
             transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
             className="absolute top-[10%] right-[-10%] sm:right-0 z-20 hidden xs:flex items-center gap-2 bg-dark-800/80 backdrop-blur-md border border-yellow-500/30 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.2)]"
           >
              <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-[10px]">😐</div>
              <span className="text-white text-xs font-bold">Neutral</span>
           </motion.div>

           <motion.div 
             animate={{ y: [0, -12, 0] }}
             transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
             className="absolute bottom-[20%] right-[-15%] sm:right-[-5%] z-20 hidden xs:flex items-center gap-2 bg-dark-800/80 backdrop-blur-md border border-red-500/30 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.2)]"
           >
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px]">😔</div>
              <span className="text-white text-xs font-bold">Negative</span>
           </motion.div>
        </motion.div>
      </div>

      {/* 2. Input Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-dark-950/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 lg:p-10 mb-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
             <MessageSquare className="w-5 h-5 text-primary-400" />
             <h3 className="text-white font-black text-xl tracking-tight uppercase">Your Thoughts</h3>
           </div>
           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marathi Mode Active</span>
           </div>
        </div>

        <div className="relative bg-dark-950/60 border border-white/5 rounded-[2rem] p-8 mb-8 group focus-within:border-primary-500/30 transition-all shadow-inner">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!user && localStorage.getItem('moodmate_trial_used') === 'true'}
            placeholder={!user && localStorage.getItem('moodmate_trial_used') === 'true' ? "Trial used. Please sign up..." : "मराठीत काहीतरी लिहा (e.g. आज मला खूप आनंद झाला आहे...)"}
            className="w-full h-56 bg-transparent text-white text-xl placeholder:text-slate-700 resize-none outline-none font-medium leading-relaxed disabled:opacity-50"
            maxLength={2000}
          />
          
          {/* Neural Scan Overlay during analysis */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-dark-950/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-[2rem] overflow-hidden"
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-24 h-24">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="absolute inset-0 border-t-2 border-primary-500 rounded-full"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className="absolute inset-2 border-b-2 border-accent-500 rounded-full opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-primary-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-black text-sm uppercase tracking-[0.3em] mb-1">Analyzing Neuro-Data</p>
                    <p className="text-primary-400 text-[10px] font-bold">Decoding Marathi Nuances...</p>
                  </div>
                </div>
                {/* Scan line */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent shadow-[0_0_20px_rgba(99,102,241,1)]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 border-t border-white/5 pt-8">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Info className="w-3 h-3" /> {text.length} / 2000 characters
            </span>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={handleClear}
                className="flex items-center justify-center gap-2 bg-dark-900 border border-white/5 text-slate-500 hover:text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all w-full sm:w-auto"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
              <button
                onClick={() => handleAnalyze()}
                disabled={!text.trim() || isAnalyzing || (!user && localStorage.getItem('moodmate_trial_used') === 'true')}
                className="flex items-center justify-center gap-3 bg-gradient-to-br from-primary-600 to-primary-500 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 disabled:opacity-50 w-full sm:w-auto border border-white/10"
              >
                {isAnalyzing ? "Processing..." : <><Sparkles className="w-3.5 h-3.5" /> Start Analysis</>}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="flex flex-col gap-4">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Quick Examples</p>
          <div className="flex flex-wrap gap-2">
             {MARATHI_TEMPLATES.map((tmpl, i) => (
               <button
                 key={i}
                 onClick={() => {
                   setText(tmpl);
                   handleAnalyze(tmpl);
                 }}
                 disabled={isAnalyzing}
                 className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/10 hover:border-primary-500/30 transition-all font-medium"
               >
                 {tmpl}
               </button>
             ))}
          </div>
        </div>
      </motion.div>

      {/* 3. Analysis Result Section */}
      <div ref={resultsRef} className="scroll-mt-32">
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="w-full bg-dark-950/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 lg:p-12 mb-8 shadow-2xl relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className={`absolute -top-20 -right-20 w-80 h-80 blur-[120px] rounded-full opacity-20 ${result.glowClass}`} />

              <div className="flex items-center justify-between mb-12">
                 <div className="flex items-center gap-3">
                   <BarChart3 className="w-6 h-6 text-primary-400" />
                   <h3 className="text-white font-black text-2xl tracking-tight uppercase">Emotional Profile</h3>
                 </div>
                 <div className={`px-4 py-1.5 rounded-full border ${result.borderClass} ${result.glowClass} flex items-center gap-2`}>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${result.colorClass.replace('text-', 'bg-')}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${result.colorClass}`}>Confidence: {Math.round(result.confidence * 100)}%</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
                
                {/* Left Side: Result Card */}
                <div className="xl:col-span-5 flex flex-col items-center xl:items-start">
                  <div className="relative mb-10">
                    <div className={`absolute inset-0 blur-[60px] rounded-full scale-150 opacity-40 ${result.glowClass}`} />
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className={`w-40 h-40 rounded-[2.5rem] border-2 ${result.borderClass} flex items-center justify-center text-7xl relative z-10 bg-dark-900/80 backdrop-blur-xl shadow-inner`}
                    >
                      {result.emoji}
                    </motion.div>
                  </div>
                  
                  <div className="text-center xl:text-left w-full">
                    <h4 className={`${result.colorClass} text-5xl font-black mb-4 tracking-tighter uppercase italic`}>{result.sentimentLabel}</h4>
                    <p className="text-slate-300 text-lg font-light mb-10 leading-relaxed border-l-4 border-white/10 pl-6 italic">"{result.summary}"</p>
                    
                    {/* Intensity Indicator */}
                    <div className="bg-dark-900/50 border border-white/5 rounded-2xl p-6 mb-8">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Emotional Intensity</span>
                          <span className="text-white font-black text-sm">{Math.round(result.intensity * 10)}%</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${result.intensity * 10}%` }}
                            className={`h-full ${result.colorClass.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`}
                          />
                       </div>
                    </div>

                    {/* Mood-based Game Suggestion */}
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => navigate('/games')}
                      className="w-full flex items-center justify-between p-5 bg-primary-500/10 border border-primary-500/20 rounded-2xl group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all">
                          <Gamepad2 className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-black text-xs uppercase tracking-widest mb-0.5">Feeling {result.sentimentLabel}?</p>
                          <p className="text-primary-400 text-[10px] font-bold">Try our {result.sentimentLabel === 'Positive' ? 'Arcade' : 'Color Therapy'} games →</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-primary-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                    </motion.button>
                  </div>
                </div>

                {/* Right Side: Detailed Breakdown & Tips */}
                <div className="xl:col-span-7 flex flex-col gap-12">
                  
                  {/* Sentiment Breakdown */}
                  <div className="space-y-8">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Fine-grained Sentiment</h5>
                    <div className="space-y-10">
                      {/* Positive Bar */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                           <span className="text-green-500">Positive Score</span>
                           <span className="text-white">{result.positiveScore}%</span>
                        </div>
                        <div className="h-2 w-full bg-dark-900 rounded-full overflow-hidden border border-white/5">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${result.positiveScore}%` }} className="h-full bg-green-500" />
                        </div>
                      </div>

                      {/* Neutral Bar */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                           <span className="text-yellow-500">Neutral Score</span>
                           <span className="text-white">{result.neutralScore}%</span>
                        </div>
                        <div className="h-2 w-full bg-dark-900 rounded-full overflow-hidden border border-white/5">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${result.neutralScore}%` }} className="h-full bg-yellow-500" />
                        </div>
                      </div>

                      {/* Negative Bar */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                           <span className="text-red-500">Negative Score</span>
                           <span className="text-white">{result.negativeScore}%</span>
                        </div>
                        <div className="h-2 w-full bg-dark-900 rounded-full overflow-hidden border border-white/5">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${result.negativeScore}%` }} className="h-full bg-red-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coping Suggestions */}
                  {result.coping_suggestions.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-inner">
                      <div className="flex items-center gap-3 mb-6">
                         <Lightbulb className="w-5 h-5 text-yellow-500" />
                         <h5 className="text-white font-black text-sm uppercase tracking-widest">Personalized Wellness Tips</h5>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {result.coping_suggestions.map((tip, i) => (
                          <div key={i} className="flex items-start gap-3 bg-dark-950/40 p-4 rounded-xl border border-white/5 hover:border-primary-500/20 transition-all group">
                            <div className="w-5 h-5 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 font-black text-[10px] group-hover:bg-primary-500 group-hover:text-white transition-all">
                              {i + 1}
                            </div>
                            <span className="text-slate-400 text-xs leading-relaxed font-medium">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
              
              {/* Back to Top / New Analysis button */}
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setTimeout(handleClear, 500);
                  }}
                  className="flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em]"
                >
                  <ArrowDown className="w-3 h-3 rotate-180" /> New Analysis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Bottom Tip Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-full bg-dark-950/40 border border-white/5 rounded-[1.5rem] px-8 py-5 flex items-center justify-between relative overflow-hidden group"
      >
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-slate-400 text-sm font-light">
            <span className="text-white font-black uppercase tracking-widest text-[10px] mr-2">Pro Tip:</span> For the most accurate Marathi sentiment detection, try to express yourself in at least 2-3 sentences.
          </p>
        </div>

        {/* Waveform Animation */}
        <div className="hidden md:flex items-end gap-1 h-8 relative z-10 opacity-20">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [4, Math.random() * 24 + 4, 4] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.05 }}
              className="w-1 bg-primary-500 rounded-full"
            />
          ))}
        </div>
      </motion.div>

      {/* Global Style for the float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      {/* Trial Limit Modal */}
      <AnimatePresence>
        {showTrialModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-dark-900 border border-white/10 rounded-[2.5rem] p-8 lg:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-500/20 blur-[80px] rounded-full -translate-y-1/2" />
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-primary-500/20 rotate-3">
                  <Sparkles className="w-10 h-10" />
                </div>

                <h2 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">Analyze More.</h2>
                <p className="text-slate-400 text-lg font-light mb-10 leading-relaxed">
                  You've reached your free limit. Create a MoodMate account to unlock unlimited Marathi sentiment analyses, track your history, and get personalized mood trends.
                </p>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => navigate('/signup')}
                    className="flex items-center justify-center gap-3 bg-white text-dark-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-slate-200"
                  >
                    <UserPlus className="w-4 h-4" /> Start Your Journey Free
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center justify-center gap-3 bg-dark-800 border border-white/5 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-dark-700"
                  >
                    <LogIn className="w-4 h-4" /> Already have an account?
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
