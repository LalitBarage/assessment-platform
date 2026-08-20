import React, { useState } from 'react';
import { UserPlus, User, Mail, Lock, Shield, CheckCircle } from 'lucide-react';
import api from '../../api/axios';

const RegisterUserPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const showMessage = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, role: formData.role.toUpperCase() };
      await api.post('/auth/admin/register', payload);
      showMessage('success', 'User registered successfully!');
      setFormData({ name: '', email: '', password: '', role: 'student' });
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to register user');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <UserPlus className="w-8 h-8 text-indigo-600" /> Register User
        </h1>
        <p className="mt-2 text-sm text-gray-600">Onboard new students, trainers, or admins to the platform.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
          <Shield className="text-indigo-500 w-5 h-5"/> Account Details
        </h2>

        {status.message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" 
                placeholder="Enter full name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="email" 
                className="block w-full pl-10 rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" 
                placeholder="Enter email address"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                minLength="6"
                className="block w-full pl-10 rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" 
                placeholder="Enter a secure password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
            <select 
              className="mt-1 block w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="student">Student</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>
            <p className="mt-2 text-xs text-gray-500 text-right">Trainers can manage assessments. Admins have full access.</p>
          </div>
          
          <div className="pt-4">
            <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserPage;
