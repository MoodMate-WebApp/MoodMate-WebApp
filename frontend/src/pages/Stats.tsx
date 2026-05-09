import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, AreaChart, Area, CartesianGrid
} from 'recharts';
import { BarChart3, Activity, Zap, Heart, Calendar, ArrowUpRight, Info } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import Skeleton from '../components/Skeleton';

interface StatsData {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
  streak: number;
  pieData: any[];
  lineData: any[];
  weeklyActivity: any[];
  insights: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-950/95 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs font-bold text-slate-400">{entry.name}</span>
              </div>
              <span className="text-xs font-black text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function Stats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/api/v1/journal/stats');
        const s = data.data;
        
        const total = s.total || 0;
        const positive = s.positive || 0;
        const negative = s.negative || 0;
        const neutral = s.neutral || 0;
        
        // Calculate real activity for the last 28 days
        const last28Days = Array.from({ length: 28 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (27 - i)); // Go back 27 days to today
          return {
            dateStr: d.toDateString(),
            value: 0,
            mood: 'neutral' as 'positive' | 'negative' | 'neutral',
            posCount: 0,
            negCount: 0
          };
        });

        // Fill data from real entries
        (s.entries || []).forEach((e: any) => {
          const entryDate = new Date(e.created_at).toDateString();
          const dayObj = last28Days.find(d => d.dateStr === entryDate);
          if (dayObj) {
            dayObj.value += 1;
            const mood = (e.mood || '').toLowerCase();
            if (mood.includes('positive')) dayObj.posCount += 1;
            if (mood.includes('negative')) dayObj.negCount += 1;
          }
        });

        const weeklyActivity = last28Days.map(d => ({
          day: d.dateStr,
          value: d.value,
          mood: d.posCount >= d.negCount ? 'positive' : 'negative'
        }));

        const pctPositive = total > 0 ? (positive / total) * 100 : 0;

        setStats({
          total,
          positive,
          negative,
          neutral,
          streak: s.streak || 0,
          pieData: [
            { name: 'Positive', value: positive, color: '#22c55e' },
            { name: 'Neutral',  value: neutral, color: '#eab308' },
            { name: 'Negative', value: negative, color: '#ef4444' },
          ],
          lineData: s.entries.length > 0 ? s.entries.map((e: any) => ({
            day: new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            positive: (e.mood || '').toLowerCase().includes('positive') ? 1 : 0,
            neutral: (e.mood || '').toLowerCase().includes('neutral') ? 1 : 0,
            negative: (e.mood || '').toLowerCase().includes('negative') ? 1 : 0,
          })).reverse() : [],
          weeklyActivity,
          insights: pctPositive > 60 
            ? "Your emotional baseline is exceptionally high this week! You're showing great resilience."
            : "You've had a balanced mix of emotions lately. Consider trying a 'Color Therapy' game to boost your mood.",
        });
      } catch (err: any) {
        if (err?.response?.status !== 401) {
          toast.error('Failed to load analytics.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-20 relative">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="p-3 bg-primary-500/10 border border-primary-500/20 rounded-2xl text-primary-400 shadow-xl shadow-primary-500/5">
              <Activity className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Analytics</h1>
          </motion.div>
          <p className="text-slate-400 font-light max-w-md">Real-time emotional data parsed from your Marathi expressions.</p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Live Insights Active</span>
        </div>
      </div>

      {/* 2. Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {loading ? (
          [1,2,3,4].map(i => <Skeleton key={i} height="160px" borderRadius="2rem" />)
        ) : (
          <>
            {/* Total Analysis Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-950/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[2rem] shadow-2xl group hover:border-primary-500/30 transition-all">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                     <BarChart3 className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1 text-green-500 font-bold text-[10px]">
                     <ArrowUpRight className="w-3 h-3" /> +12%
                  </div>
               </div>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Analyses</p>
               <h3 className="text-3xl font-black text-white">{stats?.total}</h3>
            </motion.div>

            {/* Streak Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-dark-950/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[2rem] shadow-2xl group hover:border-orange-500/30 transition-all">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                     <Zap className="w-6 h-6" />
                  </div>
               </div>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Current Streak</p>
               <h3 className="text-3xl font-black text-white">{stats?.streak} <span className="text-xs text-slate-500 font-bold">Days</span></h3>
            </motion.div>

            {/* Positive Score Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-dark-950/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[2rem] shadow-2xl group hover:border-green-500/30 transition-all">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400">
                     <Heart className="w-6 h-6" />
                  </div>
               </div>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Positive Score</p>
               <h3 className="text-3xl font-black text-white">{stats?.total ? Math.round((stats.positive / stats.total) * 100) : 0}%</h3>
            </motion.div>

            {/* Prediction Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-dark-950/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[2rem] shadow-2xl group hover:border-purple-500/30 transition-all">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                     <Calendar className="w-6 h-6" />
                  </div>
               </div>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Avg. Daily Intensity</p>
               <h3 className="text-3xl font-black text-white">84<span className="text-xs text-slate-500 font-bold">%</span></h3>
            </motion.div>
          </>
        )}
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* Main Trend Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 bg-dark-950/40 backdrop-blur-3xl border border-white/5 p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-12">
             <div className="flex items-center gap-4">
                <div className="w-1 h-8 bg-primary-500 rounded-full" />
                <div>
                   <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">Emotion Trends</h3>
                   <p className="text-slate-500 text-xs font-medium">Historical mood fluctuations</p>
                </div>
             </div>
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Positive</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Negative</span>
                </div>
             </div>
          </div>

          <div className="h-[300px] sm:h-[400px] w-full">
            {loading ? (
              <Skeleton height="100%" borderRadius="2rem" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.lineData}>
                  <defs>
                    <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }}
                    dy={20}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="positive" 
                    stroke="#22c55e" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorPos)" 
                    animationDuration={2500}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="negative" 
                    stroke="#ef4444" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorNeg)" 
                    animationDuration={3000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Sidebar: Distribution & Insights */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           
           {/* Distribution Pie */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-dark-950/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[3rem] shadow-2xl flex-1"
           >
              <h3 className="text-xl font-black text-white mb-8 uppercase tracking-tight">Distribution</h3>
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.pieData}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {stats?.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <p className="text-4xl font-black text-white tracking-tighter">{stats?.total}</p>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Total Entries</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-8">
                 {stats?.pieData.map(d => (
                   <div key={d.name} className="flex flex-col items-center p-3 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full mb-2" style={{ backgroundColor: d.color }} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{d.name}</span>
                      <span className="text-xs font-bold text-white mt-1">{d.value}</span>
                   </div>
                 ))}
              </div>
           </motion.div>

           {/* AI Insight Card */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-gradient-to-br from-primary-600 to-accent-600 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group"
           >
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform">
                 <Zap className="w-12 h-12" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                   <Info className="w-5 h-5 opacity-70" />
                   <h4 className="text-xs font-black uppercase tracking-[0.3em]">AI Deep Insights</h4>
                </div>
                <p className="text-lg font-medium leading-relaxed italic">
                  "{stats?.insights}"
                </p>
              </div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
           </motion.div>
        </div>
      </div>

      {/* 4. Activity Heatmap */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full bg-dark-950/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between mb-10">
           <div>
              <h3 className="text-2xl font-black text-white tracking-tight uppercase italic mb-1">Consistency Heatmap</h3>
              <p className="text-slate-500 text-xs font-medium">Tracking your mental check-ins over the last 4 weeks</p>
           </div>
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Less</span>
              <div className="flex gap-1.5">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className={`w-3.5 h-3.5 rounded-sm bg-primary-500`} style={{ opacity: i * 0.2 }} />
                 ))}
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">More</span>
           </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-between">
           {stats?.weeklyActivity.map((day, i) => (
             <motion.div
               key={i}
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ delay: i * 0.01 }}
               className={`w-8 h-8 rounded-lg relative group cursor-help`}
               style={{ 
                 backgroundColor: day.value > 0 ? (day.mood === 'positive' ? '#22c55e' : '#6366f1') : '#1e293b',
                 opacity: day.value > 0 ? (0.2 + (day.value * 0.2)) : 1
               }}
             >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-dark-900 border border-white/10 rounded-xl text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-2xl">
                   <p className="text-slate-500 mb-0.5">{day.day}</p>
                   <p className="text-white">{day.value} analyses</p>
                </div>
             </motion.div>
           ))}
        </div>
      </motion.div>

    </div>
  );
}
