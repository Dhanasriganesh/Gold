import React, { useState } from 'react'
import { auth, db } from '../../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import goldBars from '../../../assets/gold-bars.jpg';
 
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const q = query(collection(db, 'users'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError('User not found in the system');
        return;
      }
      const userData = querySnapshot.docs[0].data();
      const userRole = userData.role.toLowerCase();
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'employee') {
        navigate('/employee');
      } else {
        setError('Invalid user role');
      }
    } catch (error) {
      setError(error.message);
    }
  };
 
  return (
    <div className="relative min-h-screen h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* General background blurry balls */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        {/* Large balls in corners and right side */}
        <div className="absolute top-[-8%] left-[-8%] w-72 h-72 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 opacity-60 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-gradient-to-tr from-yellow-400 via-yellow-500 to-yellow-300 opacity-50 blur-3xl" />
        <div className="absolute top-1/2 left-[60%] w-40 h-40 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 opacity-40 blur-2xl" />
        {/* Small balls in right and empty spaces */}
        <div className="absolute top-[10%] left-[55%] w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 opacity-50 blur-xl" />
        <div className="absolute bottom-[15%] left-[40%] w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-300 via-yellow-500 to-yellow-200 opacity-40 blur-2xl" />
        <div className="absolute top-[70%] right-[20%] w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-500 opacity-30 blur-2xl" />
        <div className="absolute bottom-[25%] right-[10%] w-10 h-10 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 opacity-40 blur-xl" />
      </div>
      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row w-full h-full">
        {/* Left: Image with 9:16 aspect ratio, always fits screen */}
        <div className="md:w-1/2 w-full flex items-center justify-center h-1/2 md:h-screen p-0 md:p-8 bg-white relative overflow-visible">
          {/* Blurry balls behind the image only */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[10%] left-[10%] w-24 h-24 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-500 opacity-40 blur-2xl" />
            <div className="absolute bottom-[15%] left-[30%] w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-300 via-yellow-500 to-yellow-200 opacity-30 blur-xl" />
            <div className="absolute top-[60%] right-[10%] w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-500 opacity-30 blur-2xl" />
          </div>
          <div className="w-full max-w-xs md:max-w-sm aspect-[9/16] rounded-3xl overflow-hidden shadow-xl animate-fadeIn max-h-[90vh] md:max-h-[90vh] flex items-center justify-center relative z-10">
            <img
              src={goldBars}
              alt="Gold Bars"
              className="object-cover w-full h-full"
              style={{ maxHeight: '90vh' }}
            />
          </div>
        </div>
        {/* Right: Login Card */}
        <div className="md:w-1/2 w-full flex items-center justify-center h-1/2 md:h-screen p-6 animate-fadeIn delay-200">
          <div className="w-full max-w-md rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-yellow-400 bg-white/30 backdrop-blur-lg" style={{boxShadow: '0 4px 32px 0 rgba(212,175,55,0.15), 0 1.5px 0 0 #FFD700 inset'}}>
            {/* Metallic gold bar top accent */}
            <div className="w-24 h-2 rounded-full mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 shadow-lg" />
            <h1 className="text-4xl font-semibold font-sans text-yellow-700 mb-2 tracking-tight">Gold Portal</h1>
            <h2 className="text-xl font-semibold  font-sans mb-4 text-yellow-600 w-full text-center">Log In</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded w-full text-center animate-pulse">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5 w-full">
              <div>
                <label className="block text-sm font-medium font-sans text-gray-700 mb-1">Your email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/70 backdrop-blur"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/70 backdrop-blur"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-semibold py-2 rounded-full transition duration-200 shadow-md text-lg border-2 border-yellow-300"
              >
                Log In
              </button>
            </form>
            <div className="w-full flex justify-between mt-4 text-xs text-gray-500">
              <a href="#" className="hover:underline">I forgot my password</a>
              <span>&copy; Gold Portal 2024</span>
            </div>
          </div>
        </div>
      </div>
      {/* Animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 1s ease;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  )
}
 
export default Login
 
 