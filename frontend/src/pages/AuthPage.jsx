import React, { useState } from 'react';
import logo from '../assets/images/Logo2.png';
import CareerProfile from './CareerProfile';


const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);


const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/>
  </svg>
);

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignIn ? '/api/auth/signin' : '/api/auth/signup';
      const payload = isSignIn 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        console.log('Authentication successful:', data);
        window.location.href = '/CareerProfile';
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = (provider) => {
    console.log(`${provider} authentication clicked`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 to-sky-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="flex max-w-5xl w-full bg-blue-50 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-sky-900 to-sky-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-sky-400 opacity-20 rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-600 opacity-10 rounded-full -translate-x-48 translate-y-48"></div>
          
          <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white w-full">
            {/* Logo */}
            <div className="mb-12">
              <img src={logo} alt="HIRIZE Logo" className="w-30 h-30 mb-4" />
            </div>

            {/* Welcome Text */}
            <h1 className="text-4xl font-bold mb-4">
              {isSignIn ? 'Hello, Buddy!' : 'Welcome Back!'}
            </h1>
            <p className="text-blue-200 mb-8 font-medium text-xl">
              {isSignIn 
                ? 'Sign-in to stay Connected with us.'
                : 'Track your job applications, interviews, and progress — all in one place.'}
            </p>

            
            <button
              onClick={() => {
                setIsSignIn(!isSignIn);
                setError('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="px-12 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-sky-700 transition-all duration-300"
            >
              {isSignIn ? 'SIGN UP' : 'SIGN IN'}
            </button>
          </div>
        </div>

        
        <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-sky-700 mb-6 text-center">
            {isSignIn ? 'Sign In' : 'Create Account'}
          </h2>

          <p className="text-gray-500 text-center mb-6 font-medium text-lg">
            {isSignIn ? 'or use your account' : 'or use your email for registration:'}
          </p>

        
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          
          <div className="space-y-4">
            {!isSignIn && (
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                />
              </div>
            )}

            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                <polyline points="3,4 12,13 21,4"></polyline>
              </svg>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
              />
            </div>

            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
              />
            </div>

            {isSignIn && (
              <div className="text-right">
                <button className="text-lg text-gray-500 hover:text-sky-700 font-medium">
                  Forgot your password?
                </button>
              </div>
            )}

            <button
              onClick={() => handleSubmit("/CareerProfile")}
              disabled={loading}
              className="w-full py-3 bg-sky-700 text-white rounded-full font-semibold hover:bg-sky-900 transition-colors mt-6 disabled:bg-sky-300 disabled:cursor-not-allowed"
            >
              {loading ? 'LOADING...' : (isSignIn ? 'SIGN IN' : 'SIGN UP')}
            </button>
          </div>

         
          <div className="mt-6">
            <p className="text-gray-600 text-center mb-4 text-lg font-medium">or continue with</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleSocialAuth('Google')}
                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-sky-700 transition-colors"
                aria-label="Sign in with Google"
              >
                <GoogleIcon />
              </button>
              <button
                onClick={() => handleSocialAuth('LinkedIn')}
                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-sky-700 transition-colors"
                aria-label="Sign in with LinkedIn"
              >
                <LinkedInIcon />
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden mt-6 text-center">
            <p className="text-gray-600 mb-2">
              {isSignIn ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              onClick={() => {
                setIsSignIn(!isSignIn);
                setError('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-sky-700 font-semibold hover:underline"
            >
              {isSignIn ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;