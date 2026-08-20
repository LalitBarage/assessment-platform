import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Clock, CheckCircle, ChevronRight, ChevronLeft, Flag } from 'lucide-react';

const TakeQuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/assessments/quizzes/${id}`);
        const data = response.data.data || response.data;
        setQuiz(data);
        if (data.duration) {
          setTimeLeft(data.duration * 60);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quiz data');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    let totalMarks = 0;
    let earnedMarks = 0;
    
    // Evaluate Local Score
    quiz.questions.forEach(q => {
      totalMarks += q.marks;
      const userAnswer = answers[q._id];
      if (q.type === 'objective' && q.correctAnswer === userAnswer) {
        earnedMarks += q.marks;
      }
    });

    try {
      // Persist to DB
      await api.post(`/assessments/quizzes/${id}/submit`, {
        score: earnedMarks,
        totalMarks: totalMarks,
        answers: answers
      });
    } catch (err) {
      console.error('Failed to save submission securely:', err);
    }

    // Move to result
    navigate(`/student/quizzes/${id}/result`, {
      state: {
        quizTitle: quiz.title,
        earnedMarks,
        totalMarks,
        answersGiven: Object.keys(answers).length,
        totalQuestions: quiz.questions.length
      }
    });
  };

  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
       <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-6 rounded-xl shadow border border-red-100 text-center max-w-sm">
        <Flag className="text-red-500 mx-auto mb-3" size={28} />
        <h2 className="text-lg font-bold text-slate-800">Error</h2>
        <p className="text-sm text-slate-600">{error}</p>
      </div>
    </div>
  );

  if (!quiz) return null;

  const currentQ = quiz.questions[currentIdx];
  const isDangerTime = timeLeft !== null && timeLeft < 60;

  // Chunking logic for groups of 4 (1-4, 5-8, etc.)
  const chunkRows = [];
  for (let i = 0; i < quiz.questions.length; i += 4) {
    chunkRows.push(quiz.questions.slice(i, i + 4).map((q, idx) => ({ q, realIndex: i + idx })));
  }

  return (
    <div className="h-screen bg-slate-100 flex flex-col font-sans overflow-hidden">
      
      {/* Minimal Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 h-16">
        <h1 className="text-lg font-heading font-bold text-slate-800 line-clamp-1">{quiz.title}</h1>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 font-mono text-lg font-bold transition-colors ${
          isDangerTime ? 'text-red-600 bg-red-50 animate-pulse' : 'text-slate-700'
        }`}>
          <Clock size={18} /> {formatTime(timeLeft)}
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT COLUMN: ACTIVE QUESTION (70%) */}
        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          {currentQ ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col max-w-4xl mx-auto w-full p-8 relative">
              
              <div className="flex items-start gap-4 mb-6">
                <span className="shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 font-bold rounded flex items-center justify-center">
                  {currentIdx + 1}
                </span>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-800 flex-1 leading-snug">
                  {currentQ.text}
                </h2>
                <span className="shrink-0 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {currentQ.marks} pts
                </span>
              </div>

              {currentQ.codeSnippet && (
                <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-8">
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              )}

              <div className="mt-8 space-y-3">
                {currentQ.type === 'objective' ? (
                  currentQ.options.map((opt, i) => {
                    const isSelected = answers[currentQ._id] === opt;
                    return (
                      <label 
                        key={i} 
                        className={`group relative flex items-center p-4 rounded-lg cursor-pointer transition-all border-2 ${
                          isSelected 
                            ? 'bg-indigo-50 border-indigo-500 hover:bg-indigo-100' 
                            : 'bg-white border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 mr-4 flex flex-shrink-0 items-center justify-center ${
                          isSelected ? 'border-indigo-600' : 'border-slate-300'
                        }`}>
                           {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>}
                        </div>
                        <input type="radio" name={`q-${currentQ._id}`} className="sr-only" checked={isSelected} onChange={() => handleAnswerChange(currentQ._id, opt)} />
                        <span className={`text-base font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{opt}</span>
                      </label>
                    );
                  })
                ) : (
                  <textarea 
                    rows="6"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-4 text-slate-800 outline-none focus:border-indigo-500 resize-none hover:border-slate-300 transition-colors"
                    placeholder="Type your answer..."
                    value={answers[currentQ._id] || ''}
                    onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                  />
                )}
              </div>
              
            </div>
          ) : (
            <div className="m-auto text-slate-400">No question data to display.</div>
          )}

          {/* Footer Navigation bar */}
          <div className="max-w-4xl mx-auto w-full mt-6 flex items-center justify-between">
            <button onClick={() => setCurrentIdx(prev => prev - 1)} disabled={currentIdx === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-semibold rounded hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm"
            >
              <ChevronLeft size={18} /> Previous
            </button>
            
            {currentIdx === quiz.questions.length - 1 ? (
              <button onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 active:scale-95 transition-all shadow shadow-indigo-600/20"
              >
                Submit <CheckCircle size={18} />
              </button>
            ) : (
              <button 
                onClick={() => setCurrentIdx(prev => prev + 1)} disabled={currentIdx === quiz.questions.length - 1}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 border border-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 disabled:opacity-40 transition-colors shadow-sm"
              >
                Next <ChevronRight size={18} />
              </button>
            )}
          </div>
        </main>

        {/* RIGHT COLUMN: NAVIGATION PANEL (30%) */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Question Explorer</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {chunkRows.map((row, rIdx) => (
              <div key={rIdx} className="w-full">
                <div className="text-xs font-semibold text-slate-400 mb-2">Group {rIdx * 4 + 1} - {rIdx * 4 + row.length}</div>
                <div className="grid grid-cols-4 gap-2">
                  {row.map((item) => {
                    const idx = item.realIndex;
                    const isCurrent = currentIdx === idx;
                    const isAnswered = !!answers[item.q._id];
                    
                    // Determine Color based on constraints: Red (Not), Orange (Current), Green (Attempted)
                    // Priority: Current overrides answer status for navigation visibility, or Attempted overrides all.
                    // If prioritizing "Currently viewing" overrides:
                    let boxColor = 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200'; // Default Red not attempted
                    if (isCurrent) {
                      boxColor = 'bg-orange-500 text-white border-orange-600 hover:bg-orange-600 shadow-md transform scale-105';
                    } else if (isAnswered) {
                      boxColor = 'bg-green-500 text-white border-green-600 hover:bg-green-600';
                    } else {
                      boxColor = 'bg-red-500 text-white border-red-600 hover:bg-red-600'; // Pure red
                    }

                    return (
                      <button 
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`aspect-square rounded flex items-center justify-center font-bold text-sm border hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${boxColor}`}
                        title={isAnswered ? "Attempted" : "Not Attempted"}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/80 text-xs">
            <h4 className="font-bold text-slate-600 mb-3 uppercase tracking-wider text-[10px]">Legend</h4>
            <div className="space-y-2 font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-500"></div> Current
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div> Attempted
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500"></div> Not Attempted
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default TakeQuizPage;
