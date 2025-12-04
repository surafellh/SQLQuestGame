
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Save, Trash2, Mail, Shield, Palette, Sparkles, BarChart, Clock, Award } from 'lucide-react';

interface SettingsPageProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onDeleteAccount: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user, onUpdateUser, onDeleteAccount }) => {
  const [name, setName] = useState(user.name);
  const [theme, setTheme] = useState(user.theme || 'cosmic');
  const [avatarColor, setAvatarColor] = useState(user.avatar || 'bg-gradient-to-tr from-quest-accent to-purple-500');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    onUpdateUser({
        ...user,
        name,
        theme: theme as any,
        avatar: avatarColor
    });
    alert("Profile updated successfully!");
  };

  const AVATAR_OPTIONS = [
      'bg-gradient-to-tr from-blue-500 to-purple-600',
      'bg-gradient-to-tr from-emerald-500 to-teal-600',
      'bg-gradient-to-tr from-orange-500 to-red-600',
      'bg-gradient-to-tr from-pink-500 to-rose-600',
      'bg-gradient-to-tr from-indigo-500 to-blue-600',
      'bg-gradient-to-tr from-slate-500 to-slate-800',
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 h-full overflow-y-auto custom-scrollbar">
      <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
      <p className="text-quest-400 mb-8">Manage your profile, preferences, and account data.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Left Col: Profile Edit */}
          <div className="lg:col-span-2 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-quest-800 border border-quest-700 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <User className="text-quest-accent" size={20} /> Public Profile
                  </h2>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-medium text-quest-400 uppercase tracking-wider mb-2">Avatar</label>
                          <div className="flex flex-wrap gap-3">
                              {AVATAR_OPTIONS.map((color, idx) => (
                                  <button 
                                    key={idx}
                                    onClick={() => setAvatarColor(color)}
                                    className={`w-10 h-10 rounded-full ${color} transition-transform hover:scale-110 ${avatarColor === color ? 'ring-2 ring-white scale-110' : ''}`}
                                  />
                              ))}
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-medium text-quest-400 uppercase tracking-wider mb-1.5">Display Name</label>
                          <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-quest-900 border border-quest-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-quest-accent outline-none"
                          />
                      </div>
                  </div>
              </div>

               {/* Preferences */}
               <div className="bg-quest-800 border border-quest-700 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Palette className="text-purple-400" size={20} /> Appearance
                  </h2>
                  
                  <div className="grid grid-cols-3 gap-4">
                      {['cosmic', 'midnight', 'nebula'].map((t) => (
                          <div 
                            key={t}
                            onClick={() => setTheme(t)}
                            className={`
                                cursor-pointer rounded-lg p-4 border-2 transition-all
                                ${theme === t ? 'border-quest-accent bg-quest-700' : 'border-transparent bg-quest-900 hover:bg-quest-700'}
                            `}
                          >
                              <div className="text-sm font-bold text-white capitalize text-center">{t}</div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Account Security */}
              <div className="bg-quest-800 border border-quest-700 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Shield className="text-green-400" size={20} /> Security
                  </h2>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-medium text-quest-400 uppercase tracking-wider mb-1.5">Email Address</label>
                          <div className="flex items-center gap-2 bg-quest-900 p-3 rounded-lg border border-quest-600 text-gray-400 cursor-not-allowed">
                              <Mail size={16} />
                              {user.email}
                          </div>
                          <p className="text-xs text-quest-500 mt-1">Email cannot be changed directly. Contact support.</p>
                      </div>
                      <button className="text-sm text-quest-accent hover:text-white font-medium">
                          Change Password...
                      </button>
                  </div>
              </div>

               {/* Save Button */}
               <div className="flex justify-end">
                    <button 
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-quest-accent hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all"
                    >
                        <Save size={18} /> Save Changes
                    </button>
               </div>

                {/* Danger Zone */}
               <div className="mt-12 pt-8 border-t border-quest-700">
                    <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2">
                        <Trash2 size={16} /> Danger Zone
                    </h3>
                    <div className="flex justify-between items-center bg-red-900/10 border border-red-900/30 p-4 rounded-lg">
                        <div className="text-sm text-gray-400">
                            Permanently delete your account and all progress.
                        </div>
                        {showDeleteConfirm ? (
                             <div className="flex items-center gap-2">
                                <button onClick={() => setShowDeleteConfirm(false)} className="text-xs text-gray-400 hover:text-white px-3 py-1">Cancel</button>
                                <button onClick={onDeleteAccount} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-bold">Confirm Delete</button>
                             </div>
                        ) : (
                            <button onClick={() => setShowDeleteConfirm(true)} className="text-red-400 hover:text-red-300 text-sm font-bold">Delete Account</button>
                        )}
                    </div>
               </div>

          </div>

          {/* Right Col: Stats */}
          <div className="space-y-6">
              <div className="bg-quest-800 border border-quest-700 rounded-xl p-6">
                   <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <BarChart className="text-orange-400" size={20} /> Your Stats
                  </h2>

                  <div className="space-y-6">
                      <div className="flex items-center gap-4">
                          <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                              <Sparkles size={24} />
                          </div>
                          <div>
                              <div className="text-2xl font-bold text-white">{user.xp.toLocaleString()}</div>
                              <div className="text-xs text-quest-400 uppercase font-bold">Total XP</div>
                          </div>
                      </div>

                      <div className="flex items-center gap-4">
                          <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-400">
                              <Award size={24} />
                          </div>
                          <div>
                              <div className="text-2xl font-bold text-white">{user.completedChallenges.length}</div>
                              <div className="text-xs text-quest-400 uppercase font-bold">Quests Completed</div>
                          </div>
                      </div>

                       <div className="flex items-center gap-4">
                          <div className="p-3 rounded-full bg-purple-500/10 text-purple-400">
                              <Clock size={24} />
                          </div>
                          <div>
                              <div className="text-2xl font-bold text-white">Lvl {user.level}</div>
                              <div className="text-xs text-quest-400 uppercase font-bold">Current Rank</div>
                          </div>
                      </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-quest-700">
                      <div className="text-xs text-center text-gray-500">
                          Member since {new Date(user.joinDate).toLocaleDateString()}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
