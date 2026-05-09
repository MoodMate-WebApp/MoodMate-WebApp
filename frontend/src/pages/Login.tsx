import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, ShieldCheck, Brain, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-200 selection:bg-indigo-500/30 flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Decorative SVG Curve */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-40">
           <path d="M 450 0 Q 300 500 450 1000" stroke="#6366f1" strokeWidth="1" fill="none" />
           <path d="M 455 0 Q 305 500 455 1000" stroke="#6366f1" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      {/* Main Content Wrapper */}
      <div className="w-full max-w-[1440px] mx-auto px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-10 items-center min-h-screen py-12">
        
        {/* Left Side: Branding & Visual */}
        <div className="flex flex-col h-full">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-24 self-start group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">MoodMate</span>
          </Link>

          <div className="mb-16">
            <h1 className="text-5xl xl:text-6xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
              Understand <span className="text-[#818cf8]">emotions.</span><br/>
              Improve <span className="text-[#818cf8]">connections.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-lg font-light">
              MoodMate uses advanced AI to analyze text and help you understand the emotions behind every word.
            </p>
          </div>

          <div className="relative w-full max-w-[280px] sm:max-w-md aspect-square mb-12 lg:mb-20 mx-auto lg:mx-0">
             {/* Main Brain Glow */}
             <div className="absolute inset-0 bg-indigo-600/20 blur-[120px] rounded-full scale-90 pointer-events-none" />
             
             {/* Brain Image */}
             <img 
               src="/brain.png" 
               alt="AI Brain" 
               className="w-full h-full object-contain mix-blend-screen relative z-10"
               style={{ animation: 'float 6s ease-in-out infinite' }}
             />

             {/* Floating Markers */}
             <div className="absolute top-[20%] left-[-5%] z-20 flex items-center gap-2 bg-[#020617]/90 backdrop-blur-md border border-green-500/30 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px]">😊</div>
                <span className="text-white text-xs font-bold">Positive</span>
             </div>

             <div className="absolute top-[15%] right-[5%] z-20 flex items-center gap-2 bg-[#020617]/90 backdrop-blur-md border border-yellow-500/30 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.15)]">
                <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-[10px]">😐</div>
                <span className="text-white text-xs font-bold">Neutral</span>
             </div>

             <div className="absolute bottom-[25%] left-[5%] z-20 flex items-center gap-2 bg-[#020617]/90 backdrop-blur-md border border-red-500/30 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px]">😔</div>
                <span className="text-white text-xs font-bold">Negative</span>
             </div>

             {/* Ground Ripples */}
             <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-80 h-16 opacity-40 pointer-events-none mix-blend-screen overflow-visible">
                <div className="absolute inset-0 border-[2px] border-indigo-500 rounded-[100%] scale-x-[2.5] animate-ripple" />
                <div className="absolute inset-0 border-[2px] border-indigo-500 rounded-[100%] scale-x-[2.5] animate-ripple [animation-delay:1.5s]" />
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-[100%] scale-x-[2]" />
             </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-medium text-sm mt-auto">
            <ShieldCheck className="w-5 h-5 text-slate-400" />
            Your data is secure and private with us.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col justify-center items-center lg:items-end">
          <div className="w-full max-w-[520px] bg-[#020617]/60 backdrop-blur-3xl border border-indigo-500/20 rounded-[2.5rem] p-10 lg:p-14 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
            
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />

            <div className="text-center mb-10 relative z-10">
              <h2 className="text-4xl font-bold text-white mb-3">Welcome Back!</h2>
              <p className="text-slate-400 text-sm">Login to continue to MoodMate</p>
            </div>

            <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
                  <input 
                    type="email" 
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#020617] border border-white/5 rounded-2xl px-12 py-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/30 transition-all font-light"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="block text-sm font-medium text-slate-300">Password</label>
                  <a href="#" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#020617] border border-white/5 rounded-2xl px-12 py-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/30 transition-all font-light"
                    placeholder="Enter your password"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold py-4.5 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 mt-4 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Login'}
              </button>


              <div className="flex items-center gap-6 my-10">
                 <div className="h-[1px] bg-white/5 flex-1" />
                 <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">or</span>
                 <div className="h-[1px] bg-white/5 flex-1" />
              </div>

              <div className="space-y-4">
                <button className="w-full flex items-center justify-center gap-3 bg-[#020617] hover:bg-[#0f172a] border border-white/10 text-slate-300 hover:text-white font-medium py-4 rounded-2xl transition-all text-sm shadow-lg shadow-black/20">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
                <button className="w-full flex items-center justify-center gap-3 bg-[#020617] hover:bg-[#0f172a] border border-white/10 text-slate-300 hover:text-white font-medium py-4 rounded-2xl transition-all text-sm shadow-lg shadow-black/20">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Continue with GitHub
                </button>
              </div>
            </form>

            <div className="mt-12 text-center relative z-10">
              <p className="text-slate-500 text-sm font-medium">
                Don't have an account? <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors ml-1">Sign up</Link>
              </p>
            </div>
          </div>
        </div>

      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 3s ease-out infinite;
        }
      `}</style>
    </div>
  );
}
