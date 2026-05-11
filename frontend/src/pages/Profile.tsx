import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Bell, HelpCircle, LogOut, 
  Key, Sliders, Loader2, Camera, ShieldCheck, Smartphone, X, Check
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { toast } from 'react-hot-toast';
import CustomDropdown from '../components/CustomDropdown';

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  age?: string;
  gender?: string;
  mood_goal?: string;
  bio?: string;
  avatar_url?: string;
  preferences?: any;
}

const AVATAR_OPTIONS = [
  { id: '1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=6366f1' },
  { id: '2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=10b981' },
  { id: '3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo&backgroundColor=f59e0b' },
  { id: '4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kiki&backgroundColor=ec4899' },
  { id: '5', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sasha&backgroundColor=6366f1' },
  { id: '6', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Leo&backgroundColor=10b981' },
  { id: '7', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=f59e0b' },
  { id: '8', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Robo&backgroundColor=6366f1' },
  { id: '9', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel&backgroundColor=10b981' },
];

export default function Profile() {
  const { logout } = useAuth();
  const { settings, updateSettings, t: translate } = useSettings();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('General');
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    mood_goal: '',
    bio: '',
    avatar_url: ''
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/api/v1/profile/me');
        const p = data.data;
        setProfile(p);
        setFormData({
          full_name: p.full_name || '',
          age: p.age || '',
          gender: p.gender || '',
          mood_goal: p.mood_goal || '',
          bio: p.bio || '',
          avatar_url: p.avatar_url || ''
        });
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(
      api.post('/api/v1/profile/me', formData),
      {
        loading: 'Updating profile...',
        success: () => {
          setProfile({ ...profile!, ...formData });
          setIsEditing(false);
          return 'Profile updated successfully';
        },
        error: 'Update failed'
      }
    );
  };

  const handleAvatarSelect = async (url: string) => {
    setFormData(prev => ({ ...prev, avatar_url: url }));
    if (profile) {
      try {
        await api.post('/api/v1/profile/me', { avatar_url: url });
        setProfile({ ...profile, avatar_url: url });
        toast.success('Avatar updated');
      } catch (err) {
        toast.error('Failed to update avatar');
      }
    }
    setShowAvatarModal(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.promise(
      api.post('/api/v1/profile/me', { password: securityData.newPassword }), // In real app, separate endpoint
      {
        loading: 'Updating security protocols...',
        success: 'Password updated successfully',
        error: 'Update failed'
      }
    );
    setSecurityData({ ...securityData, currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  const sidebarItems = [
    { name: 'General', icon: User },
    { name: 'Security', icon: Shield },
    { name: 'Preferences', icon: Sliders },
    { name: 'Notifications', icon: Bell },
    { name: 'Support', icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col w-full relative pt-44 pb-24">
      
      {/* Cinematic Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-primary-500/5 blur-[150px] rounded-full -translate-y-1/2 -z-10 pointer-events-none" />


      {/* Header Area */}
      <div className="mb-14 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-slate-500 mt-2">Manage your profile, security, and application experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-1">
           {sidebarItems.map((item) => (
             <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  activeTab === item.name 
                  ? 'bg-white text-dark-950 shadow-2xl scale-105' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
             >
                <item.icon className={`w-4 h-4 ${activeTab === item.name ? 'text-primary-500' : 'text-slate-600'}`} />
                {item.name}
             </button>
           ))}
           <div className="h-px bg-white/5 my-4" />
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/5 transition-all"
           >
              <LogOut className="w-4 h-4" />
              {translate('logout')}
           </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
           <AnimatePresence mode="wait">
              {activeTab === 'General' ? (
                <motion.div key="general" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                   <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                      <div className="relative group">
                         <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 p-0.5 bg-dark-900 shadow-2xl">
                            <img 
                              src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email}&backgroundColor=6366f1`} 
                              alt="Profile" 
                              className="w-full h-full rounded-full object-cover" 
                            />
                         </div>
                         <button 
                           onClick={() => setShowAvatarModal(true)}
                           className="absolute bottom-0 right-0 p-2.5 bg-primary-600 border border-white/20 rounded-full text-white hover:bg-primary-500 transition-all shadow-xl active:scale-95 group-hover:scale-110"
                         >
                            <Camera className="w-4 h-4" />
                         </button>
                      </div>
                      
                      <div className="flex-grow text-center md:text-left">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                               <h2 className="text-2xl font-bold text-white">{profile?.full_name || 'Account Holder'}</h2>
                               <p className="text-slate-500 text-sm mt-1">{profile?.email}</p>
                            </div>
                            <button 
                              onClick={() => setIsEditing(!isEditing)} 
                              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                isEditing ? 'bg-white/10 text-white border border-white/10' : 'bg-white text-dark-900 hover:bg-slate-200 shadow-lg'
                              }`}
                            >
                               {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                            </button>
                         </div>
                         <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                            <div className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-bold text-primary-400 uppercase tracking-wider flex items-center gap-1.5">
                               <ShieldCheck className="w-3 h-3" /> Verified Member
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-xl">
                      <h3 className="text-lg font-bold text-white mb-8">Personal Information</h3>
                      <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                            <input type="text" disabled={!isEditing} value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white focus:outline-none focus:border-primary-500/50 disabled:opacity-50 transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Age</label>
                            <input type="text" disabled={!isEditing} value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white focus:outline-none focus:border-primary-500/50 disabled:opacity-50 transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
                            <CustomDropdown 
                              disabled={!isEditing}
                              value={formData.gender}
                              onChange={(val) => setFormData({ ...formData, gender: val })}
                              options={[
                                { value: 'Male', label: 'Male' },
                                { value: 'Female', label: 'Female' },
                                { value: 'Other', label: 'Other' }
                              ]}
                              placeholder="Select Gender"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Wellness Goal</label>
                            <input type="text" disabled={!isEditing} value={formData.mood_goal} onChange={(e) => setFormData({ ...formData, mood_goal: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white focus:outline-none focus:border-primary-500/50 disabled:opacity-50 transition-all" placeholder="e.g. Daily Balance" />
                         </div>
                         <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">About Me (Bio)</label>
                            <textarea disabled={!isEditing} rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white focus:outline-none focus:border-primary-500/50 disabled:opacity-50 transition-all resize-none" placeholder="Tell us a little about your wellness journey..." />
                         </div>
                         {isEditing && (
                           <div className="md:col-span-2 pt-4">
                              <button type="submit" className="w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary-600/20">Save Changes</button>
                           </div>
                         )}
                      </form>
                   </div>
                </motion.div>
              ) : activeTab === 'Security' ? (
                <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                   <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-xl">
                      <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3"><Key className="w-5 h-5 text-primary-400" /> Password Management</h3>
                      <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Current Password</label>
                            <input type="password" value={securityData.currentPassword} onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">New Password</label>
                            <input type="password" value={securityData.newPassword} onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm New Password</label>
                            <input type="password" value={securityData.confirmPassword} onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-all" />
                         </div>
                         <button type="submit" className="px-8 py-3 bg-white text-dark-900 text-sm font-bold rounded-xl hover:bg-slate-200 transition-all">Update Password</button>
                      </form>
                   </div>

                   <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-xl">
                      <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3"><Smartphone className="w-5 h-5 text-primary-400" /> Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                         <div>
                            <p className="text-sm font-bold text-white">Enable 2FA</p>
                            <p className="text-xs text-slate-500 mt-1">Secure your account with an extra layer of protection.</p>
                         </div>
                         <button 
                            onClick={() => { setSecurityData({...securityData, twoFactor: !securityData.twoFactor}); toast.success('2FA Status Updated'); }}
                            className={`w-12 h-6 rounded-full relative p-1 transition-colors duration-300 ${securityData.twoFactor ? 'bg-primary-600' : 'bg-slate-700'}`}
                         >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${securityData.twoFactor ? 'translate-x-6' : 'translate-x-0'}`} />
                         </button>
                      </div>
                   </div>
                </motion.div>
              ) : activeTab === 'Preferences' ? (
                <motion.div key="preferences" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-xl">
                      <h3 className="text-lg font-bold text-white mb-8">Application Experience</h3>
                      <div className="space-y-8">
                         {/* Appearance */}
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div>
                               <p className="text-sm font-bold text-white">Appearance</p>
                               <p className="text-xs text-slate-500 mt-0.5">Switch between light and dark visual modes.</p>
                            </div>
                            <div className="flex bg-dark-900 p-1 rounded-xl border border-white/5">
                               {['Dark', 'Light'].map(mode => (
                                 <button
                                   key={mode}
                                   onClick={() => updateSettings({ theme: mode as any })}
                                   className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                                     settings.theme === mode 
                                     ? 'bg-white text-dark-900 shadow-lg' 
                                     : 'text-slate-500 hover:text-slate-300'
                                   }`}
                                 >
                                   {mode}
                                 </button>
                               ))}
                            </div>
                         </div>

                         {/* Language */}
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div>
                               <p className="text-sm font-bold text-white">Interface Language</p>
                               <p className="text-xs text-slate-500 mt-0.5">Select your preferred language for the UI.</p>
                            </div>
                            <div className="flex bg-dark-900 p-1 rounded-xl border border-white/5 flex-wrap">
                               {['English', 'Marathi', 'Hindi'].map(lang => (
                                 <button
                                   key={lang}
                                   onClick={() => updateSettings({ language: lang as any })}
                                   className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                     settings.language === lang 
                                     ? 'bg-white text-dark-900 shadow-lg' 
                                     : 'text-slate-500 hover:text-slate-300'
                                   }`}
                                 >
                                   {lang}
                                 </button>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
              ) : activeTab === 'Notifications' ? (
                <motion.div key="notifications" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-xl">
                      <h3 className="text-lg font-bold text-white mb-8">Notification Preferences</h3>
                      <div className="space-y-6">
                         {[
                           { id: 'daily', title: 'Daily Reminders', desc: 'Get a nudge to record your mood every day.' },
                           { id: 'achieve', title: 'Milestones', desc: 'Notifications for streaks and mood improvements.' },
                           { id: 'product', title: 'Product Updates', desc: 'Stay informed about new features and games.' }
                         ].map(notif => (
                           <div key={notif.id} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                              <div>
                                 <p className="text-sm font-bold text-white">{notif.title}</p>
                                 <p className="text-xs text-slate-500 mt-1">{notif.desc}</p>
                              </div>
                              <button className="w-12 h-6 rounded-full bg-primary-600 relative p-1 transition-colors">
                                 <div className="w-4 h-4 bg-white rounded-full shadow-md translate-x-6" />
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>
                </motion.div>
              ) : activeTab === 'Support' ? (
                <motion.div key="support" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-xl text-center">
                      <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400 mx-auto mb-6">
                         <HelpCircle className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Need some help?</h3>
                      <p className="text-slate-500 text-sm mb-8">Our support team is here for you 24/7 to ensure your wellness journey is smooth.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                         <button className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary-500/30 transition-all text-left group">
                            <p className="text-white font-bold mb-1 group-hover:text-primary-400">Documentation</p>
                            <p className="text-xs text-slate-500">Read our guides and FAQs.</p>
                         </button>
                         <button className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary-500/30 transition-all text-left group">
                            <p className="text-white font-bold mb-1 group-hover:text-primary-400">Direct Chat</p>
                            <p className="text-xs text-slate-500">Talk to a real human agent.</p>
                         </button>
                      </div>
                   </div>
                </motion.div>
              ) : null}
           </AnimatePresence>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setShowAvatarModal(false)}
               className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" 
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-2xl bg-dark-900 border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden"
             >
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                   <div>
                      <h3 className="text-xl font-bold text-white">Choose Avatar</h3>
                      <p className="text-slate-500 text-sm mt-1">Select an identity that represents you.</p>
                   </div>
                   <button 
                     onClick={() => setShowAvatarModal(false)}
                     className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"
                   >
                      <X className="w-6 h-6" />
                   </button>
                </div>
                
                <div className="p-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                   {AVATAR_OPTIONS.map((avatar) => {
                     const isSelected = formData.avatar_url === avatar.url || (!formData.avatar_url && avatar.id === '1');
                     return (
                       <button
                         key={avatar.id}
                         onClick={() => handleAvatarSelect(avatar.url)}
                         className="relative group aspect-square"
                       >
                          <div className={`w-full h-full rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                            isSelected ? 'border-primary-500 scale-110 shadow-2xl shadow-primary-500/20' : 'border-white/5 hover:border-white/20'
                          }`}>
                             <img src={avatar.url} alt="Avatar Option" className="w-full h-full object-cover" />
                          </div>
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full p-1 shadow-lg border-2 border-dark-900">
                               <Check className="w-3 h-3" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                       </button>
                     );
                   })}
                </div>

                <div className="p-8 bg-white/[0.02] border-t border-white/5 flex justify-end">
                   <button 
                     onClick={() => setShowAvatarModal(false)}
                     className="px-8 py-3 bg-white text-dark-900 font-bold rounded-xl hover:bg-slate-200 transition-all shadow-lg"
                   >
                      Done
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
