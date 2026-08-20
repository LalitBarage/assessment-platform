import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, UserPlus, BookOpen, Users, Settings, Bell, Search, GraduationCap, Trophy } from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleNavigation = {
    admin: [
      { name: 'Dashboard', path: '/admin', icon: <Home size={20} /> },
      { name: 'Register Users', path: '/admin/register-user', icon: <UserPlus size={20} /> },
      { name: 'Manage Students', path: '/admin/students', icon: <Users size={20} /> },
      { name: 'Assessments', path: '/admin/assessments', icon: <BookOpen size={20} /> },
    ],
    trainer: [
      { name: 'Dashboard', path: '/trainer', icon: <Home size={20} /> },
      { name: 'Assessments', path: '/trainer/assessments', icon: <BookOpen size={20} /> },
    ],
    student: [
      { name: 'Dashboard', path: '/student', icon: <Home size={20} /> },
      { name: 'Today Quizzes', path: '/student/quizzes/today', icon: <BookOpen size={20} /> },
      { name: 'My Results', path: '/student/results', icon: <Trophy size={20} /> },
      { name: 'Settings', path: '/student/settings', icon: <Settings size={20} /> },
    ],
  };

  const navLinks = user?.role ? roleNavigation[user.role] : [];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Desktop Optimized */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col relative z-20 shadow-sm">
        <div className="h-20 flex items-center px-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-600/20">
              <GraduationCap size={24} />
            </div>
            <span className="font-heading font-bold text-xl text-slate-800 tracking-tight">Nexanova</span>
          </div>
        </div>
        
        <div className="px-6 py-6 font-medium text-xs text-slate-400 uppercase tracking-widest mb-2">
          Menu
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1.5 overflow-y-auto w-full">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== `/${user?.role}` && location.pathname.startsWith(`${link.path}`));
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm border border-indigo-100/50' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-medium'
                }`}
              >
                <div className={`${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {link.icon}
                </div>
                <span>{link.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card at bottom of sidebar */}
        <div className="p-4 border-t border-slate-100 m-4 bg-slate-50 rounded-2xl">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase shrink-0">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500 font-medium capitalize truncate">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 px-4 py-2 mt-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-100 rounded-xl transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[50vh] h-[50vh] bg-indigo-200/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[50vh] h-[50vh] bg-violet-200/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        {/* Top Header */}
        <header className="h-20 bg-white/60 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-10 px-8 flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <h1 className="font-heading font-bold text-2xl text-slate-800 capitalize hidden sm:block">
              {location.pathname.split('/').pop().replace('-', ' ') || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-5">
            {/* Search Bar - Aesthetic only for now */}
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-64 pl-10 pr-4 py-2 bg-slate-100/50 border border-transparent focus:border-indigo-200 focus:bg-white rounded-full text-sm outline-none transition-all focus:shadow-sm" 
              />
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-fade-in w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
