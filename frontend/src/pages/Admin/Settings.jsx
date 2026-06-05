import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Save, Bell, Shield, Palette, User, Mail, Key } from 'lucide-react';

export default function Settings() {
  const { user } = useAppContext();

  return (
    // Margin diseragamkan: w-full max-w-7xl mx-auto agar fit in
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 p-4 md:p-8 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account preferences and system configurations.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
          <Save size={18} strokeWidth={2.5} /> 
          <span>Save Changes</span>
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Account & Security */}
        <div className="bg-[#0B172E] rounded-[2rem] border border-[#1E2A45] shadow-xl overflow-hidden">
          <div className="flex items-center gap-4 px-8 py-6 border-b border-[#1E2A45] bg-[#0F1B33]">
            {/* Ikon Header Diperbarui dengan background & highlight */}
            <div className="p-2.5 bg-[#071226] border border-[#1E2A45] rounded-xl shadow-md">
              <Shield className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]" size={22} />
            </div>
            <h2 className="font-bold text-xl text-white">Account & Security</h2>
          </div>
          
          <div className="p-8 space-y-8">
            {/* Profile Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    defaultValue={user?.name || ''} 
                    className="w-full pl-12 pr-4 py-3.5 border border-[#1E2A45] bg-[#071226] text-white rounded-xl focus:outline-none focus:border-blue-500 transition-colors font-medium" 
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="email" 
                    defaultValue={user?.email || 'admin@growpath.ai'} 
                    className="w-full pl-12 pr-4 py-3.5 border border-[#1E2A45] bg-[#071226] text-white rounded-xl focus:outline-none focus:border-blue-500 transition-colors font-medium" 
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">System Role</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full border border-[#1E2A45] bg-[#071226]/50 p-4 rounded-xl cursor-not-allowed">
                  <div className="px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg text-sm font-bold w-max">
                    {user?.role || 'SuperAdmin'}
                  </div>
                  <span className="text-slate-500 text-sm font-medium">Role is managed by system administrators and cannot be changed here.</span>
                </div>
              </div>
            </div>

            <hr className="border-[#1E2A45]" />

            {/* Password Section */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Security Settings</label>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-[#1E2A45] bg-[#071226]/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#0F1B33] border border-[#1E2A45] rounded-xl">
                    <Key className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Account Password</h3>
                    <p className="text-sm text-slate-500 font-medium">We recommend updating your password every 90 days.</p>
                  </div>
                </div>
                <button className="whitespace-nowrap px-6 py-3 bg-[#0F1B33] hover:bg-[#1E2A45] text-slate-300 rounded-xl border border-[#1E2A45] font-bold transition-colors w-full sm:w-auto">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#0B172E] rounded-[2rem] border border-[#1E2A45] shadow-xl overflow-hidden">
          <div className="flex items-center gap-4 px-8 py-6 border-b border-[#1E2A45] bg-[#0F1B33]">
            {/* Ikon Header Diperbarui */}
            <div className="p-2.5 bg-[#071226] border border-[#1E2A45] rounded-xl shadow-md">
              <Bell className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" size={22} />
            </div>
            <h2 className="font-bold text-xl text-white">Notification Preferences</h2>
          </div>
          
          <div className="p-8 space-y-4">
            {/* Toggle 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#071226] hover:bg-[#071226]/80 transition-colors rounded-xl border border-[#1E2A45]">
              <div>
                <p className="font-bold text-white mb-1">Email Notifications</p>
                <p className="text-sm text-slate-500 font-medium">Receive daily summaries and system alerts via email.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-12 h-6 bg-[#1E2A45] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Toggle 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#071226] hover:bg-[#071226]/80 transition-colors rounded-xl border border-[#1E2A45]">
              <div>
                <p className="font-bold text-white mb-1">System Alerts</p>
                <p className="text-sm text-slate-500 font-medium">Get notified in-app about platform updates and maintenance.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-12 h-6 bg-[#1E2A45] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-[#0B172E] rounded-[2rem] border border-[#1E2A45] shadow-xl overflow-hidden">
          <div className="flex items-center gap-4 px-8 py-6 border-b border-[#1E2A45] bg-[#0F1B33]">
            {/* Ikon Header Diperbarui */}
            <div className="p-2.5 bg-[#071226] border border-[#1E2A45] rounded-xl shadow-md">
              <Palette className="text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]" size={22} />
            </div>
            <h2 className="font-bold text-xl text-white">Appearance</h2>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Dark Mode Card */}
              <button className="flex flex-col items-start p-6 border-2 border-blue-500 bg-[#071226] rounded-2xl text-left shadow-lg shadow-blue-500/10 relative overflow-hidden group">
                <div className="absolute top-5 right-5 w-5 h-5 rounded-full bg-blue-500 border-[3px] border-white"></div>
                <div className="w-full h-28 bg-[#0B172E] rounded-xl mb-5 flex flex-col gap-2 p-4 border border-[#1E2A45]">
                  <div className="w-1/3 h-2 bg-[#1E2A45] rounded-full"></div>
                  <div className="w-full h-12 bg-blue-600/20 border border-blue-500/20 rounded-lg mt-1"></div>
                  <div className="w-2/3 h-2 bg-[#0F1B33] rounded-full mt-auto"></div>
                </div>
                <h3 className="font-bold text-white text-lg mb-1">Dark Mode</h3>
                <p className="text-slate-400 text-sm font-medium">Sleek and easy on the eyes.</p>
              </button>

              {/* Light Mode Card */}
              <button className="flex flex-col items-start p-6 border-2 border-[#1E2A45] bg-[#071226]/50 rounded-2xl text-left opacity-60 cursor-not-allowed">
                <div className="w-full h-28 bg-slate-100 rounded-xl mb-5 flex flex-col gap-2 p-4 border border-slate-300">
                  <div className="w-1/3 h-2 bg-slate-300 rounded-full"></div>
                  <div className="w-full h-12 bg-blue-500 border border-blue-600 rounded-lg mt-1"></div>
                  <div className="w-2/3 h-2 bg-slate-200 rounded-full mt-auto"></div>
                </div>
                <h3 className="font-bold text-slate-300 text-lg mb-2">Light Mode</h3>
                <span className="inline-block px-3 py-1 bg-[#1E2A45] text-slate-300 text-xs font-bold rounded-lg">Coming Soon</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}