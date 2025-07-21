import React, { useState } from 'react'
import { db } from '../../../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('Admin');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if user with this mobile already exists
      const q = query(collection(db, 'users'), where('mobile', '==', mobile));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // User exists, get their role
        const userData = querySnapshot.docs[0].data();
        if (userData.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/employee');
        }
        return;
      }
      // If not exists, add new user
      await addDoc(collection(db, 'users'), {
        name,
        mobile,
        role,
        createdAt: new Date(),
      });
      alert('Login details saved!');
      setName('');
      setMobile('');
      setRole('Admin');
      if (role === 'Admin') {
        navigate('/admin/file');
      } else {
        navigate('/employee/tokens');
      }
    } catch (error) {
      alert('Error saving details: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-700">Login Page</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number:</label>
            <input
              type="tel"
              value={mobile}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                if (val.length <= 10) setMobile(val);
              }}
              required
              maxLength={10}
              pattern="[0-9]{10}"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              inputMode="numeric"
              placeholder="Enter 10-digit mobile number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role:</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition duration-200">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
