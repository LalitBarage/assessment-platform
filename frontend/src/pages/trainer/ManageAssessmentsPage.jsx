import React, { useState, useEffect } from 'react';
import { BookOpen, ListTree, HelpCircle, Calendar, PlusCircle, CheckCircle } from 'lucide-react';
import api from '../../api/axios';

const ManageAssessmentsPage = () => {
  const [activeTab, setActiveTab] = useState('subjects');
  const [status, setStatus] = useState({ type: '', message: '' });

  // Data fetching state
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]); // for current topic

  // Common UI helper
  const showMessage = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 4000);
  };

  // --- Subjects State & Logic ---
  const [subjectForm, setSubjectForm] = useState({ name: '', description: '' });

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/assessments/subjects');
      setSubjects(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assessments/subjects', subjectForm);
      showMessage('success', 'Subject created successfully');
      setSubjectForm({ name: '', description: '' });
      fetchSubjects();
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to create subject');
    }
  };

  // --- Topics State & Logic ---
  const [topicForm, setTopicForm] = useState({ name: '', subject: '' });

  const fetchTopics = async (subjectId) => {
    if (!subjectId) {
      setTopics([]);
      return;
    }
    try {
      const res = await api.get(`/assessments/subjects/${subjectId}/topics`);
      setTopics(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubjectChangeForTopic = (e) => {
    const sid = e.target.value;
    setTopicForm({ ...topicForm, subject: sid });
    fetchTopics(sid);
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assessments/topics', topicForm);
      showMessage('success', 'Topic created successfully');
      setTopicForm({ ...topicForm, name: '' });
      fetchTopics(topicForm.subject);
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to create topic');
    }
  };

  // --- Questions State & Logic ---
  const [questionForm, setQuestionForm] = useState({
    type: 'objective',
    text: '',
    codeSnippet: '',
    subject: '',
    topic: '',
    correctAnswer: 'A',
    marks: 1
  });
  const [optionsForm, setOptionsForm] = useState({ A: '', B: '', C: '', D: '' });

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...questionForm };
      if (payload.type === 'objective') {
        payload.options = [optionsForm.A, optionsForm.B, optionsForm.C, optionsForm.D];
        // Ensure correctAnswer matches the option text
        payload.correctAnswer = optionsForm[questionForm.correctAnswer];
      } else {
        delete payload.correctAnswer;
        delete payload.options;
      }
      
      await api.post('/assessments/questions', payload);
      showMessage('success', 'Question created successfully');
      setQuestionForm({ ...questionForm, text: '', codeSnippet: '' });
      setOptionsForm({ A: '', B: '', C: '', D: '' });
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to create question');
    }
  };

  // --- Quizzes State & Logic ---
  const [quizForm, setQuizForm] = useState({
    title: '',
    subject: '',
    topic: '',
    duration: 60,
    scheduledDate: '',
  });
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const fetchQuestionsForQuiz = async (topicId) => {
    if (!topicId) {
      setAllQuestions([]);
      return;
    }
    try {
      const res = await api.get(`/assessments/topics/${topicId}/questions`);
      setAllQuestions(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (selectedQuestions.length === 0) {
      showMessage('error', 'Please select at least one question');
      return;
    }
    try {
      const payload = { ...quizForm, questions: selectedQuestions };
      await api.post('/assessments/quizzes', payload);
      showMessage('success', 'Quiz created successfully');
      setQuizForm({ ...quizForm, title: '', scheduledDate: '' });
      setSelectedQuestions([]);
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to create quiz');
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
             Manage Assessments
          </h1>
          <p className="mt-2 text-slate-500 font-medium">Create and organize subjects, topics, questions, and schedule quizzes.</p>
        </div>
      </div>

      {status.message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{status.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-slate-200/50 mb-8 overflow-x-auto justify-start">
        {[
          { id: 'subjects', label: 'Subjects', icon: BookOpen },
          { id: 'topics', label: 'Topics', icon: ListTree },
          { id: 'questions', label: 'Questions', icon: HelpCircle },
          { id: 'quizzes', label: 'Quizzes', icon: Calendar },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 -translate-y-0.5' 
                : 'text-slate-600 hover:text-indigo-600 hover:bg-white border border-transparent'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-panel rounded-[2rem] p-8">
        
        {/* SUBJECTS TAB */}
        {activeTab === 'subjects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <PlusCircle className="text-indigo-500 w-5 h-5"/> Add Subject
              </h2>
              <form onSubmit={handleCreateSubject} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subject Name</label>
                  <input required type="text" className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" 
                    value={subjectForm.name} onChange={e => setSubjectForm({...subjectForm, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" rows="3"
                    value={subjectForm.description} onChange={e => setSubjectForm({...subjectForm, description: e.target.value})}></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                  Create Subject
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Existing Subjects</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {subjects.length === 0 ? <p className="text-gray-500 italic">No subjects found.</p> : 
                  subjects.map(sub => (
                    <div key={sub._id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <h3 className="font-bold text-gray-900">{sub.name}</h3>
                      {sub.description && <p className="text-sm text-gray-600 mt-1">{sub.description}</p>}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {/* TOPICS TAB */}
        {activeTab === 'topics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <PlusCircle className="text-indigo-500 w-5 h-5"/> Add Topic
              </h2>
              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Select Subject</label>
                  <select required className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={topicForm.subject} onChange={handleSubjectChangeForTopic}>
                    <option value="">-- Select Subject --</option>
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Topic Name</label>
                  <input required type="text" className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={topicForm.name} onChange={e => setTopicForm({...topicForm, name: e.target.value})} disabled={!topicForm.subject} />
                </div>
                <button type="submit" disabled={!topicForm.subject} className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-indigo-300">
                  Create Topic
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Topics in Selected Subject</h2>
              {!topicForm.subject ? (
                <p className="text-gray-500 italic">Select a subject to view its topics.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {topics.length === 0 ? <p className="text-gray-500 italic">No topics found.</p> : 
                    topics.map(t => (
                      <div key={t._id} className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <span className="font-semibold text-indigo-900">{t.name}</span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        )}

        {/* QUESTIONS TAB */}
        {activeTab === 'questions' && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <PlusCircle className="text-indigo-500 w-5 h-5"/> Add Question
            </h2>
            <form onSubmit={handleCreateQuestion} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                  <select required className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                    value={questionForm.subject} 
                    onChange={e => {
                      setQuestionForm({...questionForm, subject: e.target.value, topic: ''});
                      fetchTopics(e.target.value);
                    }}>
                    <option value="">-- Select Subject --</option>
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Topic</label>
                  <select required className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                    value={questionForm.topic} onChange={e => setQuestionForm({...questionForm, topic: e.target.value})} disabled={!questionForm.subject}>
                    <option value="">-- Select Topic --</option>
                    {topics.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Question Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="qType" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" 
                      checked={questionForm.type === 'objective'} onChange={() => setQuestionForm({...questionForm, type: 'objective'})} />
                    <span>Objective (MCQ)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="qType" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" 
                      checked={questionForm.type === 'descriptive'} onChange={() => setQuestionForm({...questionForm, type: 'descriptive'})} />
                    <span>Descriptive</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Question Text</label>
                <textarea required className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" rows="3"
                  value={questionForm.text} onChange={e => setQuestionForm({...questionForm, text: e.target.value})}></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Code Snippet <span className="text-gray-400 font-normal">(Optional)</span></label>
                <textarea className="w-full rounded-lg border-gray-300 border px-4 py-2.5 font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white" rows="3"
                  value={questionForm.codeSnippet} onChange={e => setQuestionForm({...questionForm, codeSnippet: e.target.value})} placeholder="console.log('Hello');"></textarea>
              </div>

              {questionForm.type === 'objective' && (
                <div className="p-5 rounded-xl border border-gray-200 bg-gray-50 space-y-4">
                  <h3 className="font-semibold text-gray-800">Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['A', 'B', 'C', 'D'].map(opt => (
                      <div key={opt}>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Option {opt}</label>
                        <input required type="text" className="w-full rounded-lg border-gray-300 border px-3 py-2" 
                          value={optionsForm[opt]} onChange={e => setOptionsForm({...optionsForm, [opt]: e.target.value})} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Correct Answer</label>
                    <select className="w-full md:w-1/2 rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-emerald-500"
                      value={questionForm.correctAnswer} onChange={e => setQuestionForm({...questionForm, correctAnswer: e.target.value})}>
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                </div>
              )}

              <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                Save Question
              </button>
            </form>
          </div>
        )}

        {/* QUIZZES TAB */}
        {activeTab === 'quizzes' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Calendar className="text-indigo-500 w-5 h-5"/> Schedule Quiz
              </h2>
              <form onSubmit={handleCreateQuiz} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Quiz Title</label>
                  <input required type="text" className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" 
                    value={quizForm.title} onChange={e => setQuizForm({...quizForm, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                    <select required className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                      value={quizForm.subject} 
                      onChange={e => {
                        setQuizForm({...quizForm, subject: e.target.value, topic: ''});
                        fetchTopics(e.target.value);
                      }}>
                      <option value="">-- Subject --</option>
                      {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Topic <span className="font-normal text-gray-400">(Optional)</span></label>
                    <select className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                      value={quizForm.topic} 
                      onChange={e => {
                        setQuizForm({...quizForm, topic: e.target.value});
                        fetchQuestionsForQuiz(e.target.value);
                      }} disabled={!quizForm.subject}>
                      <option value="">-- Topic --</option>
                      {topics.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (mins)</label>
                    <input required type="number" min="1" className="w-full rounded-lg border-gray-300 border px-4 py-2.5" 
                      value={quizForm.duration} onChange={e => setQuizForm({...quizForm, duration: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Schedule Date</label>
                    <input required type="datetime-local" className="w-full rounded-lg border-gray-300 border px-4 py-2.5" 
                      value={quizForm.scheduledDate} onChange={e => setQuizForm({...quizForm, scheduledDate: e.target.value})} />
                  </div>
                </div>
                
                <button type="submit" disabled={selectedQuestions.length === 0} className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-indigo-300 mt-4">
                  Create Quiz ({selectedQuestions.length} Questions)
                </button>
              </form>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Select Questions</h2>
              {!quizForm.topic ? (
                <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center bg-gray-50">
                  <p className="text-gray-500">Select a topic to view available questions.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {allQuestions.length === 0 ? <p className="text-gray-500 italic">No questions found in this topic.</p> : 
                    allQuestions.map(q => (
                      <label key={q._id} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedQuestions.includes(q._id) ? 'bg-indigo-50 border-indigo-300 shadow-sm' : 'bg-white border-gray-200 hover:border-indigo-200'
                      }`}>
                        <input type="checkbox" className="mt-1 w-5 h-5 text-indigo-600 rounded" 
                          checked={selectedQuestions.includes(q._id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedQuestions([...selectedQuestions, q._id]);
                            else setSelectedQuestions(selectedQuestions.filter(id => id !== q._id));
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-800">{q.text}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium uppercase">{q.type}</span>
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md font-medium">{q.marks} Marks</span>
                          </div>
                        </div>
                      </label>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageAssessmentsPage;
