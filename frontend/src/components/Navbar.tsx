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
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-dark-950/60 backdrop-blur-2xl border border-white/5 px-6 py-3 rounded-[1.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-4 group">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative z-10 w-full h-full"
            >
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                <defs>
                  <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#D946EF" />
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
            <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">MoodMate</span>
        </Link>
        </div>
        
        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-white/5 rounded-xl border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl px-2 py-1.5 transition-all duration-500 group/profile"
            >
              <div className="hidden sm:flex flex-col items-end mr-3">
                <span className="text-xs font-bold text-white tracking-tight">{user.user_metadata?.display_name?.split(' ')[0] || 'User'}</span>
              </div>
              <Link to="/profile" className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 text-white shadow-lg shadow-primary-600/20 group-hover/profile:scale-110 transition-transform duration-500 overflow-hidden">
                   <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/profile:opacity-100 transition-opacity" />
                   <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 relative z-10" xmlns="http://www.w3.org/2000/svg">
                     <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 border-2 border-dark-950 rounded-full" />
              </Link>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300">
                 Login
              </Link>
              <Link to="/signup" className="flex items-center gap-2 bg-white text-dark-900 hover:bg-slate-200 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-white/5 hover:shadow-white/10 hover:scale-105 active:scale-95">
                Get Started <Sparkles className="h-3 w-3 fill-current hidden xs:block" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
