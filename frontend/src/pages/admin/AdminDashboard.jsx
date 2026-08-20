import React, { useState, useEffect } from 'react';
import { Users, UserCheck, GraduationCap, LayoutDashboard, TrendingUp } from 'lucide-react';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrainers: 0,
    totalStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/auth/users/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load user stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-indigo-600" /> Admin Dashboard
          </h1>
          <p className="mt-2 text-slate-500 font-medium">Welcome to the administration portal. Monitor platform usage and manage users.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-[2rem]">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-heading font-bold text-slate-800">Platform Overview</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="glass-card bg-gradient-to-br from-indigo-50/80 to-indigo-100/50 p-6 relative overflow-hidden group border-indigo-100/50">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="font-semibold text-indigo-900/80 text-sm tracking-wide uppercase">Total Users</h3>
                <p className="text-5xl font-heading font-black text-indigo-600 mt-3 drop-shadow-sm">
                  {loading ? '...' : stats.totalUsers}
                </p>
              </div>
              <div className="p-3 bg-white shadow-sm shadow-indigo-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors duration-500"></div>
          </div>

          {/* Trainers */}
          <div className="glass-card bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 p-6 relative overflow-hidden group border-emerald-100/50">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="font-semibold text-emerald-900/80 text-sm tracking-wide uppercase">Total Trainers</h3>
                <p className="text-5xl font-heading font-black text-emerald-600 mt-3 drop-shadow-sm">
                  {loading ? '...' : stats.totalTrainers}
                </p>
              </div>
              <div className="p-3 bg-white shadow-sm shadow-emerald-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors duration-500"></div>
          </div>

          {/* Students */}
          <div className="glass-card bg-gradient-to-br from-blue-50/80 to-blue-100/50 p-6 relative overflow-hidden group border-blue-100/50">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="font-semibold text-blue-900/80 text-sm tracking-wide uppercase">Total Students</h3>
                <p className="text-5xl font-heading font-black text-blue-600 mt-3 drop-shadow-sm">
                  {loading ? '...' : stats.totalStudents}
                </p>
              </div>
              <div className="p-3 bg-white shadow-sm shadow-blue-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>
          </div>
        </div>

        <div className="mt-10 p-6 glass-card bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4 border-slate-200/50">
          <div>
            <h3 className="font-heading font-bold text-slate-800 text-lg">Ready to manage the platform?</h3>
            <p className="text-slate-500 mt-1">Head over to the sidebar to manage users or assessments.</p>
          </div>
          <button className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
            Quick Action
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
