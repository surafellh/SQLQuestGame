
import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  Server, 
  ShieldAlert, 
  Search, 
  Filter, 
  MoreVertical,
  Ban,
  Trash2,
  CheckCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { MOCK_ADMIN_LOGS, MOCK_USERS_LIST } from '../constants';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'system'>('overview');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [disableDryRuns, setDisableDryRuns] = useState(false);

  return (
    <div className="flex flex-col h-full bg-quest-900 text-gray-200">
      
      {/* Admin Header */}
      <div className="p-4 md:p-6 border-b border-quest-700 bg-quest-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-white flex items-center gap-3">
             <ShieldAlert className="text-red-500" />
             Admin Command Center
           </h1>
           <p className="text-quest-400 text-sm mt-1">System status, user management, and security logs</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`flex-1 md:flex-none px-4 py-2 rounded font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-quest-600 text-white' : 'hover:bg-quest-700 text-gray-400'}`}
            >
                Overview
            </button>
             <button 
                onClick={() => setActiveTab('users')}
                className={`flex-1 md:flex-none px-4 py-2 rounded font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'users' ? 'bg-quest-600 text-white' : 'hover:bg-quest-700 text-gray-400'}`}
            >
                Users
            </button>
             <button 
                onClick={() => setActiveTab('system')}
                className={`flex-1 md:flex-none px-4 py-2 rounded font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'system' ? 'bg-quest-600 text-white' : 'hover:bg-quest-700 text-gray-400'}`}
            >
                System
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-quest-800 p-6 rounded-xl border border-quest-700 shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-quest-400 text-sm font-bold uppercase">Total Users</p>
                                <h3 className="text-3xl font-bold text-white mt-1">1,248</h3>
                            </div>
                            <Users className="text-blue-500" />
                        </div>
                        <div className="mt-4 text-xs text-green-400 flex items-center gap-1">
                            <Activity size={12} /> +12% this week
                        </div>
                    </div>

                     <div className="bg-quest-800 p-6 rounded-xl border border-quest-700 shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-quest-400 text-sm font-bold uppercase">Active Queries</p>
                                <h3 className="text-3xl font-bold text-white mt-1">842</h3>
                            </div>
                            <Server className="text-purple-500" />
                        </div>
                        <div className="mt-4 text-xs text-blue-400 flex items-center gap-1">
                            <CheckCircle size={12} /> System Healthy
                        </div>
                    </div>

                    <div className="bg-quest-800 p-6 rounded-xl border border-quest-700 shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-quest-400 text-sm font-bold uppercase">Blocked Threats</p>
                                <h3 className="text-3xl font-bold text-white mt-1">12</h3>
                            </div>
                            <ShieldAlert className="text-red-500" />
                        </div>
                        <div className="mt-4 text-xs text-red-400 flex items-center gap-1">
                            Last: DROP TABLE attempt
                        </div>
                    </div>

                     <div className="bg-quest-800 p-6 rounded-xl border border-quest-700 shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-quest-400 text-sm font-bold uppercase">Est. Cost</p>
                                <h3 className="text-3xl font-bold text-white mt-1">$4.21</h3>
                            </div>
                            <Activity className="text-green-500" />
                        </div>
                        <div className="mt-4 text-xs text-gray-400 flex items-center gap-1">
                            Current billing cycle
                        </div>
                    </div>
                </div>

                {/* Live Logs */}
                <div className="bg-quest-800 border border-quest-700 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-quest-700 flex justify-between items-center bg-quest-900/50">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Activity size={18} className="text-quest-accent" /> Live System Logs
                        </h3>
                        <button className="text-xs text-quest-400 hover:text-white">Export CSV</button>
                    </div>
                    <div className="divide-y divide-quest-700">
                        {MOCK_ADMIN_LOGS.map(log => (
                            <div key={log.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-quest-700/50 transition-colors gap-2">
                                <div className="flex items-center gap-4">
                                    <div className={`
                                        w-2 h-2 rounded-full shrink-0
                                        ${log.status === 'error' ? 'bg-red-500' : 
                                          log.status === 'warning' ? 'bg-yellow-500' : 
                                          log.status === 'success' ? 'bg-green-500' : 'bg-blue-500'}
                                    `}/>
                                    <span className="font-mono text-xs text-quest-500 whitespace-nowrap">{log.timestamp}</span>
                                    <span className="font-medium text-gray-300 text-sm">{log.action}</span>
                                </div>
                                <span className="text-xs px-2 py-1 rounded bg-quest-900 text-quest-400 font-mono self-start md:self-auto">
                                    {log.userId}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
             <div className="bg-quest-800 border border-quest-700 rounded-xl overflow-hidden">
                 <div className="p-4 border-b border-quest-700 flex gap-4 bg-quest-900/50 flex-col md:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-quest-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search users by email or ID..."
                            className="w-full bg-quest-800 border border-quest-600 rounded-lg pl-9 py-2 text-sm text-white focus:ring-2 focus:ring-quest-accent focus:outline-none"
                        />
                    </div>
                    <button className="p-2 border border-quest-600 rounded-lg hover:bg-quest-700 text-quest-400 self-end md:self-auto">
                        <Filter size={18} />
                    </button>
                 </div>
                 <div className="overflow-x-auto">
                     <table className="w-full text-left min-w-[600px]">
                         <thead className="bg-quest-900 text-quest-400 text-xs uppercase tracking-wider font-semibold">
                             <tr>
                                 <th className="p-4">User</th>
                                 <th className="p-4">Role</th>
                                 <th className="p-4">Status</th>
                                 <th className="p-4">Last Active</th>
                                 <th className="p-4 text-right">Actions</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-quest-700">
                             {MOCK_USERS_LIST.map(user => (
                                 <tr key={user.id} className="hover:bg-quest-700/30">
                                     <td className="p-4">
                                         <div className="flex flex-col">
                                             <span className="font-bold text-white">{user.name}</span>
                                             <span className="text-xs text-quest-400">{user.email}</span>
                                         </div>
                                     </td>
                                     <td className="p-4">
                                         <span className={`text-xs font-bold px-2 py-1 rounded ${user.role === 'admin' ? 'bg-purple-900/50 text-purple-400' : 'bg-blue-900/50 text-blue-400'}`}>
                                            {user.role}
                                         </span>
                                     </td>
                                     <td className="p-4">
                                         <span className="flex items-center gap-1.5 text-xs text-green-400">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                            Active
                                         </span>
                                     </td>
                                     <td className="p-4 text-sm text-gray-400">{user.lastActive}</td>
                                     <td className="p-4 text-right">
                                         <div className="flex items-center justify-end gap-2">
                                             <button className="p-1.5 hover:bg-red-900/30 text-quest-500 hover:text-red-400 rounded transition-colors" title="Ban User">
                                                <Ban size={16} />
                                             </button>
                                             <button className="p-1.5 hover:bg-quest-600 text-quest-500 hover:text-white rounded transition-colors">
                                                <MoreVertical size={16} />
                                             </button>
                                         </div>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
        )}

        {/* SYSTEM TAB */}
        {activeTab === 'system' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-quest-800 p-6 rounded-xl border border-quest-700">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Server size={20} className="text-quest-accent" /> Platform Status
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-quest-900 rounded-lg border border-quest-700">
                            <div>
                                <h4 className="font-medium text-white">Maintenance Mode</h4>
                                <p className="text-xs text-quest-400 mt-1">Prevents new logins and pauses query execution.</p>
                            </div>
                            <button onClick={() => setMaintenanceMode(!maintenanceMode)} className={`transition-colors ${maintenanceMode ? 'text-green-400' : 'text-gray-600'}`}>
                                {maintenanceMode ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                            </button>
                        </div>

                         <div className="flex items-center justify-between p-4 bg-quest-900 rounded-lg border border-quest-700">
                            <div>
                                <h4 className="font-medium text-white">Disable Dry Runs</h4>
                                <p className="text-xs text-quest-400 mt-1">Skips the estimation step (Higher risk).</p>
                            </div>
                            <button onClick={() => setDisableDryRuns(!disableDryRuns)} className={`transition-colors ${disableDryRuns ? 'text-green-400' : 'text-gray-600'}`}>
                                {disableDryRuns ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                            </button>
                        </div>
                    </div>
                </div>
                 <div className="bg-quest-800 p-6 rounded-xl border border-quest-700">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <ShieldAlert size={20} className="text-red-500" /> Emergency Actions
                    </h3>
                    <div className="space-y-4">
                        <button className="w-full p-3 border border-red-500/30 bg-red-900/10 hover:bg-red-900/30 text-red-400 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all">
                            <Trash2 size={16} /> Flush Cache & Reset Sessions
                        </button>
                         <button className="w-full p-3 border border-red-500/30 bg-red-900/10 hover:bg-red-900/30 text-red-400 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all">
                            <Ban size={16} /> Force Logout All Users
                        </button>
                    </div>
                 </div>
            </div>
        )}

      </div>
    </div>
  );
};
