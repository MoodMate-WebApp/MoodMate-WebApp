import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageSquare, ArrowDownCircle, Trash2, Calendar, LayoutGrid, List, Filter, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import Skeleton from '../components/Skeleton';
import CustomDropdown from '../components/CustomDropdown';

interface HistoryItem {
  id: string;
  text: string;
  sentiment: string;
  emoji: string;
  confidence: number;
  date: string;
  time: string;
  timestamp: number;
  color: string;
  bg: string;
  border: string;
}

function mapEntry(entry: any): HistoryItem {
  const s = (entry.mood || entry.emotion || '').toLowerCase();
  const isPositive = s === 'positive' || s === 'happy';
  const isNegative = s === 'negative' || s === 'sad';

  const color = isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-yellow-500';
  const bg    = isPositive ? 'bg-green-500/10' : isNegative ? 'bg-red-500/10' : 'bg-yellow-500/10';
  const border= isPositive ? 'border-green-500/20' : isNegative ? 'border-red-500/20' : 'border-yellow-500/20';
  const emoji = isPositive ? '😊' : isNegative ? '😔' : '😐';
  const sentiment = isPositive ? 'Positive' : isNegative ? 'Negative' : 'Neutral';

  const d = new Date(entry.created_at || entry.timestamp || Date.now());
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return {
    id: String(entry.id),
    text: entry.text || '',
    sentiment,
    emoji,
    confidence: Math.round((entry.intensity || 0) * 10) || 85, // Fallback confidence
    date,
    time,
    timestamp: d.getTime(),
    color,
    bg,
    border,
  };
}

export default function History() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All Sentiments');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data } = await api.get('/api/v1/journal/entries');
        const mapped = (data?.data ?? []).map(mapEntry);
        setEntries(mapped.sort((a: any, b: any) => b.timestamp - a.timestamp));
      } catch (err: any) {
        if (err?.response?.status !== 401) {
          toast.error('Failed to load history.');
        }
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/v1/journal/entries/${id}`);
      setEntries(prev => prev.filter(e => e.id !== id));
      toast.success('Entry deleted');
    } catch (err) {
      toast.error('Failed to delete entry');
    }
  };

  const filteredHistory = entries.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All Sentiments' || item.sentiment === filter;
    return matchesSearch && matchesFilter;
  });

  // Grouping logic
  const groups: { [key: string]: HistoryItem[] } = {};
  filteredHistory.forEach(item => {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
  });

  const stats = {
    total: entries.length,
    positive: entries.filter(e => e.sentiment === 'Positive').length,
    negative: entries.filter(e => e.sentiment === 'Negative').length,
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-10 relative">
      
      {/* 1. Header & Stats Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center sm:items-end gap-8 mb-16">
        <div className="w-full lg:w-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-3 bg-primary-500/10 border border-primary-500/20 rounded-2xl text-primary-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Timeline</h1>
          </motion.div>
          <p className="text-slate-400 font-light max-w-md">Your journey through emotions, tracked and analyzed in real-time.</p>
        </div>

        <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
           {/* Quick Stats Chips */}
           <div className="flex items-center gap-4 bg-dark-950/60 border border-white/5 rounded-[1.5rem] p-3 pr-6 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 font-black text-sm shadow-inner">
                {stats.total}
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Total Analyzed</span>
           </div>
           
           <div className="flex items-center gap-4 bg-dark-950/60 border border-white/5 rounded-[1.5rem] p-3 pr-6 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 font-black text-sm shadow-inner">
                {stats.positive}
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Positive Moments</span>
           </div>

           <button 
             onClick={() => {
                const blob = new Blob([JSON.stringify(filteredHistory, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `moodmate_history_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                toast.success('History exported successfully');
             }}
             className="p-4 bg-dark-950/60 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all hover:bg-dark-900 shadow-xl"
           >
              <Download className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* 2. Search & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
          <input
            type="text"
            placeholder="Search moments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-950/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-primary-500/30 transition-all text-sm font-medium shadow-inner"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Sentiment Filter */}
          <CustomDropdown 
            value={filter}
            onChange={(val) => setFilter(val)}
            options={[
              { value: 'All Sentiments', label: 'All Sentiments' },
              { value: 'Positive', label: 'Positive' },
              { value: 'Neutral', label: 'Neutral' },
              { value: 'Negative', label: 'Negative' }
            ]}
            icon={Filter}
            className="w-full md:w-64"
          />

          {/* View Toggle */}
          <div className="flex p-1 bg-dark-950/60 border border-white/5 rounded-2xl">
             <button 
               onClick={() => setViewMode('list')}
               className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <List className="w-5 h-5" />
             </button>
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <LayoutGrid className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      {/* 3. Grouped History View */}
      {loading ? (
        <div className="space-y-12">
           {[1, 2].map(i => (
             <div key={i} className="space-y-4">
                <Skeleton height="20px" width="120px" borderRadius="10px" />
                <Skeleton height="300px" width="100%" borderRadius="2rem" />
             </div>
           ))}
        </div>
      ) : (
        <div className="space-y-16">
          <AnimatePresence mode="popLayout">
            {Object.entries(groups).map(([date, items]) => (
              <motion.div 
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Date Header */}
                <div className="flex items-center gap-4 ml-4">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 whitespace-nowrap">{date}</span>
                   <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="bg-dark-950/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="divide-y divide-white/5">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          className="flex flex-col lg:flex-row items-center gap-6 px-8 py-7 hover:bg-white/[0.03] transition-all group relative"
                        >
                          <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center ${item.bg} ${item.color} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                             <MessageSquare className="w-6 h-6" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-200 text-lg font-medium leading-relaxed mb-1 truncate lg:whitespace-normal line-clamp-2">
                               {item.text}
                            </p>
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                               <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {item.time}</span>
                               <span className="w-1 h-1 rounded-full bg-slate-700" />
                               <span className={item.color}>Confidence: {item.confidence}%</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl ${item.bg} ${item.color} border ${item.border} text-[10px] font-black uppercase tracking-widest shadow-xl`}>
                               <span>{item.emoji}</span>
                               <span>{item.sentiment}</span>
                            </span>
                            
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-xl opacity-0 group-hover:opacity-100"
                            >
                               <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -5 }}
                        className="bg-dark-950/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 hover:bg-white/[0.03] transition-all group relative overflow-hidden"
                      >
                         <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 ${item.bg}`} />
                         
                         <div className="flex justify-between items-start mb-8">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                               {item.emoji}
                            </div>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>

                         <p className="text-slate-200 text-lg font-medium leading-relaxed mb-10 line-clamp-4 min-h-[110px]">
                            {item.text}
                         </p>

                         <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                               {item.time}
                            </div>
                            <span className={`${item.color} text-[10px] font-black uppercase tracking-widest`}>
                               {item.sentiment} • {item.confidence}%
                            </span>
                         </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 4. Empty State */}
      {!loading && filteredHistory.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-32 flex flex-col items-center justify-center text-center"
        >
          <div className="w-24 h-24 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl">
             <Search className="w-10 h-10 text-slate-700" />
          </div>
          <h3 className="text-2xl font-black text-white mb-4 tracking-tight">No moments found.</h3>
          <p className="text-slate-400 font-light max-w-sm mx-auto mb-10 leading-relaxed">
            {entries.length === 0 
              ? "Your timeline is empty. Start your first analysis to begin tracking your emotional journey."
              : "Try adjusting your search or filters to find what you're looking for."}
          </p>
          {entries.length === 0 && (
            <button 
              onClick={() => navigate('/ai')}
              className="bg-white text-dark-950 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95"
            >
              Analyze My First Text
            </button>
          )}
        </motion.div>
      )}

      {/* Load More */}
      {!loading && filteredHistory.length > 0 && (
        <div className="mt-20 flex flex-col items-center gap-6">
           <div className="h-20 w-px bg-gradient-to-b from-white/10 to-transparent" />
           <button className="flex items-center gap-3 bg-dark-950/40 border border-white/10 hover:border-primary-500/50 text-slate-400 hover:text-white px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all group shadow-2xl">
              <ArrowDownCircle className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              Load earlier moments
           </button>
        </div>
      )}

    </div>
  );
}
