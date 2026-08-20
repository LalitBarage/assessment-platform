import React, { useState, useEffect } from 'react';
import { Users, Edit2, X, CheckCircle } from 'lucide-react';
import api from '../../api/axios';

const ManageStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });

  const showMessage = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 4000);
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/auth/students');
      setStudents(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to fetch students.');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openEditModal = (student) => {
    setEditingStudent(student);
    setEditForm({ name: student.name, email: student.email, password: '' });
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setEditForm({ name: '', email: '', password: '' });
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const payload = { name: editForm.name, email: editForm.email };
      if (editForm.password) {
        payload.password = editForm.password;
      }
      
      await api.put(`/auth/student/${editingStudent._id}`, payload);
      showMessage('success', 'Student details updated successfully!');
      closeEditModal();
      fetchStudents(); // Refresh list
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to update student');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-600" /> Manage Students
          </h1>
          <p className="mt-2 text-slate-500 font-medium">View and update student login details and information.</p>
        </div>
      </div>

      {status.message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{status.message}</span>
        </div>
      )}

      {/* Main Table */}
      <div className="glass-panel rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">No students found.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600">{student.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">{student.role}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openEditModal(student)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">Edit Student</h2>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input required type="text" className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input required type="email" className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl mt-6">
                <label className="block text-sm font-bold text-orange-800 mb-2">Change Password</label>
                <p className="text-xs text-orange-600 mb-3">Leave blank if you do not want to change the password.</p>
                <input type="password" placeholder="New Password" minLength="6" className="w-full rounded-lg border-orange-200 border px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                  value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={closeEditModal} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudentsPage;
