import React, { useState } from 'react';
import { Lock, ShieldCheck, CheckCircle } from 'lucide-react';
import api from '../../api/axios';

const StudentSettingsPage = () => {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  const showMessage = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await api.put('/auth/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      showMessage('success', 'Password updated successfully!');
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-indigo-600" /> Account Settings
        </h1>
        <p className="mt-2 text-sm text-gray-600">Manage your profile and security settings.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
          <Lock className="text-indigo-500 w-5 h-5"/> Change Password
        </h2>

        {status.message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">{status.message}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
            <input 
              required 
              type="password" 
              className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" 
              value={formData.oldPassword} 
              onChange={e => setFormData({...formData, oldPassword: e.target.value})} 
            />
          </div>
          
          <div className="pt-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
            <input 
              required 
              type="password" 
              minLength="6"
              className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" 
              value={formData.newPassword} 
              onChange={e => setFormData({...formData, newPassword: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
            <input 
              required 
              type="password" 
              minLength="6"
              className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" 
              value={formData.confirmPassword} 
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
            />
          </div>
          
          <div className="pt-4">
            <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentSettingsPage;
