import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Target, Award, ArrowRight, Zap, RefreshCw } from 'lucide-react';

const QuizResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state;
  
  const [animationScore, setAnimationScore] = useState(0);

  if (!resultData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 max-w-lg w-full rounded-3xl shadow-xl shadow-slate-200/50 text-center border border-slate-100">
          <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Session Data</h2>
          <p className="text-slate-500 mb-8">It looks like the assessment session expired or was accessed invalidly.</p>
          <button onClick={() => navigate('/student')} className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { quizTitle, earnedMarks, totalMarks, answersGiven, totalQuestions } = resultData;
  const targetPercentage = Math.round((earnedMarks / totalMarks) * 100) || 0;

  // Mount animation for the circular progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationScore(targetPercentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [targetPercentage]);

  // Determine aesthetic tier
  const isExcellent = targetPercentage >= 80;
  const isPassing = targetPercentage >= 50 && targetPercentage < 80;
  
  let tierColors = {
    bg: 'bg-red-500',
    lightBg: 'bg-red-50',
    text: 'text-red-500',
    border: 'border-red-100',
    gradient: 'from-red-500 to-rose-600',
    message: 'Needs Improvement',
    subMessage: 'Review your material and try again. Persistence is key!'
  };

  if (isExcellent) {
    tierColors = {
      bg: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      text: 'text-emerald-500',
      border: 'border-emerald-100',
      gradient: 'from-emerald-400 to-teal-500',
      message: 'Outstanding Performance!',
      subMessage: 'You have mastered this content spectacularly.'
    };
  } else if (isPassing) {
    tierColors = {
      bg: 'bg-indigo-500',
      lightBg: 'bg-indigo-50',
      text: 'text-indigo-500',
      border: 'border-indigo-100',
      gradient: 'from-indigo-500 to-blue-600',
      message: 'Great Effort!',
      subMessage: 'You possess a solid understanding of the material.'
    };
  }

  // Circle Math
  const circumference = 2 * Math.PI * 120; // radius 120
  const strokeDashoffset = circumference - (animationScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-inter selection:bg-indigo-100">
      
      {/* Decorative Header Banner */}
      <div className={`relative h-64 md:h-80 w-full bg-gradient-to-br ${tierColors.gradient} overflow-hidden shadow-sm`}>
        {/* Subtle background patterns */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 z-10 text-center">
          <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/30 shadow-xl shadow-black/5">
            Assessment Completed
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 drop-shadow-sm">{tierColors.message}</h1>
          <p className="text-lg md:text-xl font-medium text-white/90 drop-shadow-sm max-w-2xl">{quizTitle}</p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 -mt-16 md:-mt-24 relative z-20 pb-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-900/5 p-6 md:p-12 border border-slate-100 backdrop-blur-xl">
          
          {/* Circular Score Display */}
          <div className="relative flex justify-center -mt-24 md:-mt-32 mb-10">
            <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-full bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center p-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
                <circle cx="130" cy="130" r="120" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-100" />
                <circle 
                  cx="130" cy="130" r="120" 
                  stroke="currentColor" strokeWidth="16" fill="transparent" 
                  strokeLinecap="round"
                  className={`${tierColors.text} drop-shadow-md transition-all duration-1500 ease-out`}
                  style={{ strokeDasharray: circumference, strokeDashoffset }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
                <span className="text-5xl md:text-6xl font-black text-slate-800 tracking-tighter">
                  {animationScore}<span className="text-2xl md:text-3xl text-slate-400 font-bold ml-1">%</span>
                </span>
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest mt-1">Score</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <p className="text-lg text-slate-600 font-medium">{tierColors.subMessage}</p>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Metric 1 */}
            <div className={`flex items-center p-6 rounded-3xl border-2 ${tierColors.border} ${tierColors.lightBg} transition-transform hover:-translate-y-1 duration-300`}>
              <div className={`w-14 h-14 rounded-2xl ${tierColors.bg} text-white flex items-center justify-center shadow-lg`}>
                <Award size={28} />
              </div>
              <div className="ml-5">
                <p className="text-sm font-bold tracking-wider text-slate-500 uppercase mb-1">Points Earned</p>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-slate-800">{earnedMarks}</span>
                   <span className="text-lg font-semibold text-slate-400">/ {totalMarks}</span>
                </div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-center p-6 rounded-3xl border-2 border-indigo-100 bg-indigo-50/50 transition-transform hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Target size={28} />
              </div>
              <div className="ml-5">
                <p className="text-sm font-bold tracking-wider text-slate-500 uppercase mb-1">Completion Rate</p>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-slate-800">{answersGiven}</span>
                   <span className="text-lg font-semibold text-slate-400">/ {totalQuestions} answered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Notice */}
          <div className="flex gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="shrink-0 pt-1 text-amber-500">
              <Zap size={24} />
            </div>
            <div>
              <h4 className="text-amber-800 font-bold mb-1">Descriptive Parsing Notice</h4>
              <p className="text-amber-700/80 text-sm font-medium leading-relaxed">
                If this assessment contained written responses, they require manual review. Your point total currently reflects only automatically graded objective answers.
              </p>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Link to="/student" className="group px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-900 shadow-xl hover:shadow-2xl transition-all flex items-center gap-3">
              Return to Student Portal
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </main>

    </div>
  );
};

export default QuizResultPage;
