import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, ArrowRight, Library } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <Library className="w-8 h-8 text-indigo-600" /> Student View
          </h1>
          <p className="mt-2 text-slate-500 font-medium">Stay on top of your learning by completing today's assigned quizzes.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-[2rem]">
        <h2 className="text-2xl font-heading font-bold text-slate-800 mb-8">Welcome Back!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Quizzes Card */}
          <div className="glass-card bg-gradient-to-br from-indigo-50/80 to-indigo-100/40 p-8 flex flex-col justify-between border-indigo-100/50 group">
            <div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shadow-indigo-100 mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-heading font-bold text-slate-800 text-xl mb-3">Today's Quizzes</h3>
              <p className="text-slate-600 leading-relaxed max-w-sm">
                You have quizzes scheduled for today. Completing them on time keeps your streak alive!
              </p>
            </div>
            <button 
              onClick={() => navigate('/student/quizzes/today')}
              className="mt-8 flex items-center justify-between w-full bg-white px-6 py-3.5 rounded-xl text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm border border-indigo-50 group/btn"
            >
              <span>View Quizzes</span>
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Past Results Card */}
          <div className="glass-card bg-gradient-to-br from-violet-50/80 to-violet-100/40 p-8 flex flex-col justify-between border-violet-100/50 group">
            <div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shadow-violet-100 mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-heading font-bold text-slate-800 text-xl mb-3">Past Results</h3>
              <p className="text-slate-600 leading-relaxed max-w-sm">
                Review how you've performed on previous assessments. See your growth over time.
              </p>
            </div>
            <button 
              onClick={() => navigate('/student/results')}
              className="mt-8 flex items-center justify-between w-full bg-white px-6 py-3.5 rounded-xl text-violet-600 font-semibold hover:bg-violet-600 hover:text-white transition-all duration-300 shadow-sm border border-violet-50 group/btn"
            >
              <span>View Analytics</span>
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
