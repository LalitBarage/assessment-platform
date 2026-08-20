import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Target, Calendar, BarChart2 } from 'lucide-react';

const StudentResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/assessments/results/me');
        setResults(res.data.data || res.data);
      } catch (err) {
        setError('Failed to load past results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <div className="p-8 text-slate-500">Loading your performance history...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Overall Results</h1>
        <p className="text-slate-500 mt-2">Track your assessment history across all your subjects.</p>
      </div>

      {results.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
          You haven't completed any quizzes yet!
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                  <th className="p-4">Quiz Info</th>
                  <th className="p-4">Subject & Topic</th>
                  <th className="p-4">Date Taken</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((r, i) => {
                   const qs = r.quiz || {};
                   const subjName = qs.subject?.name || 'Unknown Subject';
                   const topName = qs.topic?.name || 'Unknown Topic';
                   const d = new Date(r.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric'
                   });
                   
                   const pct = Math.round((r.score / r.totalMarks) * 100) || 0;
                   const isExcellent = pct >= 80;
                   const isPassing = pct >= 50 && pct < 80;

                   let badgeClass = 'bg-red-100 text-red-700';
                   let statusText = 'Needs Work';
                   if (isExcellent) { badgeClass = 'bg-green-100 text-green-700'; statusText = 'Excellent'; }
                   else if (isPassing) { badgeClass = 'bg-indigo-100 text-indigo-700'; statusText = 'Passing'; }

                   return (
                     <tr key={r._id || i} className="hover:bg-slate-50 transition-colors">
                       <td className="p-4">
                         <div className="font-bold text-slate-800">{qs.title || 'Untitled Assessment'}</div>
                       </td>
                       <td className="p-4">
                         <div className="text-sm text-slate-700 font-medium flex items-center gap-1"><Target size={14} className="text-indigo-400"/> {subjName}</div>
                         <div className="text-xs text-slate-500 ml-4 mt-0.5">{topName}</div>
                       </td>
                       <td className="p-4 text-slate-600 text-sm flex items-center gap-2 mt-2">
                         <Calendar size={14} className="text-slate-400" /> {d}
                       </td>
                       <td className="p-4">
                         <div className="flex items-center gap-3">
                           <div className="font-bold text-slate-800 text-lg">{pct}%</div>
                           <div className="text-xs text-slate-400">({r.score}/{r.totalMarks} pts)</div>
                         </div>
                       </td>
                       <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${badgeClass}`}>
                            {statusText}
                          </span>
                       </td>
                     </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentResultsPage;
