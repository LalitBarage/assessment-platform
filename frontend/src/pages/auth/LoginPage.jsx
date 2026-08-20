import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, AlertCircle, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const user = await login(email, password);
      // Redirect based on role
      setTimeout(() => {
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'trainer') navigate('/trainer');
        else if (user.role === 'student') navigate('/student');
        else navigate('/');
      }, 500); // small delay for animation effect
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-800 bg-slate-50 selection:bg-indigo-200">
      {/* Left side - Branding/Image (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-primary relative overflow-hidden flex-col justify-between p-12">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-12 animate-fade-in">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold tracking-tight">Nexanova</span>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-5xl font-heading font-bold text-white leading-tight mb-6 mt-20">
              Your Journey to <br/>Mastery Begins Here.
            </h1>
            <p className="text-indigo-100 text-lg max-w-md leading-relaxed">
              Access your personalized dashboard, engage with interactive assessments, and track your educational progress seamlessly.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/40 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-indigo-200 text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
          &copy; {new Date().getFullYear()} Nexanova Education. All rights reserved.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 animate-fade-in relative z-10">
        <div className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="bg-indigo-100 p-2 rounded-xl">
               <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-2xl font-heading font-bold text-slate-800 tracking-tight">Nexanova</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-start gap-3 animate-slide-up">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email-address">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded text-indigo-600" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3.5 px-4 mb-2 text-sm font-medium text-white rounded-xl bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'group'}`}
            >
              {isLoading ? 'Signing in...' : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
