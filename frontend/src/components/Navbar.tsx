import { Link, useLocation } from 'react-router-dom';
import { Home, Brain, History, BarChart2, Gamepad2, Info, Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useState } from 'react';

export default function Navbar() {
  const { user } = useAuth();
  const { t } = useSettings();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t('home'), path: '/', icon: Home },
    { name: t('ai'), path: '/ai', icon: Brain },
    { name: t('history'), path: '/history', icon: History, restricted: true },
    { name: t('stats'), path: '/stats', icon: BarChart2, restricted: true },
    { name: t('games'), path: '/games', icon: Gamepad2, restricted: true },
    { name: t('about'), path: '/about', icon: Info },
  ].filter(link => !link.restricted || user);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-dark-950/40 backdrop-blur-3xl border border-white/5 px-6 py-4 rounded-[2rem] shadow-2xl pointer-events-auto transition-all duration-500 hover:border-white/10">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 w-full h-full"
              >
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]">
                  <defs>
                    <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M20 75C20 75 20 25 20 25C20 15 30 15 35 25L50 55L65 25C70 15 80 15 80 25C80 25 80 75 80 75" 
                    stroke="url(#logo-grad)" 
                    strokeWidth="16" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              <div className="absolute inset-0 bg-primary-500/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white italic">MoodMate<span className="text-primary-500 not-italic">.</span></span>
          </Link>
        </div>
        
        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-white/[0.03] rounded-2xl border border-white/5 shadow-inner"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
 
        {/* Action Buttons */}
        <div className="flex items-center gap-4 sm:gap-6">
          {user ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 group/profile"
            >
              <Link to="/profile" className="relative flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-2xl p-1.5 pr-4 hover:border-white/10 transition-all duration-500">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-primary-500 to-purple-500 text-white shadow-xl shadow-primary-600/10 group-hover/profile:scale-105 transition-transform duration-500 overflow-hidden">
                   <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/profile:opacity-100 transition-opacity" />
                   <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 relative z-10" xmlns="http://www.w3.org/2000/svg">
                     <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Profile</span>
                  <span className="text-xs font-bold text-white tracking-tight -mt-0.5">{user.user_metadata?.display_name?.split(' ')[0] || 'Member'}</span>
                </div>
                <div className="absolute top-2 right-2 h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              </Link>
            </motion.div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden md:flex items-center gap-2 text-slate-500 hover:text-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300">
                 Auth
              </Link>
              <Link to="/signup" className="flex items-center gap-2 bg-white text-dark-950 hover:bg-slate-100 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl hover:scale-105 active:scale-95">
                Start <Sparkles className="h-3 w-3 fill-current hidden xs:block" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-90"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 bg-dark-950/98 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.8)] lg:hidden pointer-events-auto"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                      isActive ? 'bg-primary-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}
              
              {!user && (
                <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center py-4 text-slate-400 font-bold"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center py-4 bg-white text-dark-900 rounded-2xl font-bold"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
