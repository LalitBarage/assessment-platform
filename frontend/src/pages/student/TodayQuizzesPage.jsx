import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Calendar, Clock } from 'lucide-react';

const TodayQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTodayQuizzes = async () => {
      try {
        const response = await api.get('/assessments/quizzes/today');
        setQuizzes(response.data.data || response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchTodayQuizzes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Today's Quizzes</h1>
      
      {loading ? (
        <div className="text-gray-500">Loading your quizzes...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      ) : quizzes.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-gray-400 mb-2 flex justify-center"><Calendar size={48} /></div>
          <h2 className="text-xl font-medium text-gray-700 mt-4">No quizzes for today</h2>
          <p className="text-gray-500 mt-2">You're all caught up! Enjoy your free time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {quizzes.map((quiz, index) => (
            <div key={quiz._id || index} className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-500">
              <h2 className="text-xl font-bold text-gray-800">{quiz.title || `Quiz #${index + 1}`}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                <span className="flex items-center gap-1"><Clock size={16} /> {quiz.duration || 30} mins</span>
              </div>
              <p className="text-gray-600 mt-4 line-clamp-2">{quiz.description || 'No description provided.'}</p>
              <Link to={`/student/quizzes/${quiz._id}/take`} className="mt-6 flex justify-center items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition w-full sm:w-auto">
                Start Quiz
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodayQuizzesPage;
