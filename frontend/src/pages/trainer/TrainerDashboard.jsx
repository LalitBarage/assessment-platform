import React, { useState, useEffect } from 'react';
import { BookOpen, Layers, Database, Activity, Presentation } from 'lucide-react';
import api from '../../api/axios';

const TrainerDashboard = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get('/assessments/subjects');
        setSubjects(response.data.data || response.data);
      } catch (error) {
        console.error('Failed to fetch subjects', error);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <Presentation className="w-8 h-8 text-indigo-600" /> Trainer Central
          </h1>
          <p className="mt-2 text-slate-500 font-medium">Manage your educational curriculum and monitor active assessments.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-[2rem]">
        <div className="flex items-center gap-2 mb-8">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-heading font-bold text-slate-800">Quick Stats</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card bg-gradient-to-br from-purple-50/80 to-purple-100/50 p-6 flex flex-col items-center justify-center text-center border-purple-100/50 group">
            <div className="p-3 bg-white rounded-2xl shadow-sm mb-4 group-hover:-translate-y-1 transition-transform">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-purple-900/80 text-sm uppercase tracking-wide">Subjects</h3>
            <p className="text-4xl font-heading font-black text-purple-600 mt-2">{subjects.length || 0}</p>
          </div>
          
          <div className="glass-card bg-gradient-to-br from-pink-50/80 to-pink-100/50 p-6 flex flex-col items-center justify-center text-center border-pink-100/50 group">
            <div className="p-3 bg-white rounded-2xl shadow-sm mb-4 group-hover:-translate-y-1 transition-transform">
              <Layers className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-semibold text-pink-900/80 text-sm uppercase tracking-wide">Topics</h3>
            <p className="text-4xl font-heading font-black text-pink-600 mt-2">--</p>
          </div>
          
          <div className="glass-card bg-gradient-to-br from-yellow-50/80 to-yellow-100/50 p-6 flex flex-col items-center justify-center text-center border-yellow-100/50 group">
            <div className="p-3 bg-white rounded-2xl shadow-sm mb-4 group-hover:-translate-y-1 transition-transform">
              <Database className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-yellow-900/80 text-sm uppercase tracking-wide">Questions Bank</h3>
            <p className="text-4xl font-heading font-black text-yellow-600 mt-2">--</p>
          </div>
          
          <div className="glass-card bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 p-6 flex flex-col items-center justify-center text-center border-emerald-100/50 group">
            <div className="p-3 bg-white rounded-2xl shadow-sm mb-4 group-hover:-translate-y-1 transition-transform">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-emerald-900/80 text-sm uppercase tracking-wide">Active Quizzes</h3>
            <p className="text-4xl font-heading font-black text-emerald-600 mt-2">--</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
