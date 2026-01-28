import React, { useState } from 'react';

const CareerProfile = () => {
  const [formData, setFormData] = useState({
    role: '',
    industry: '',
    experienceLevel: ''
  });
  const [loading, setLoading] = useState(false);  // ADD THIS
  const [error, setError] = useState(''); // ADD THIS

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Marketing',
    'Engineering',
    'Sales',
    'Design',
    'Human Resources',
    'Other'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleExperienceSelect = (level) => {
    setFormData({
      ...formData,
      experienceLevel: level
    });
  };

  const handleSubmit = async () => {
  setLoading(true);
  setError('');

  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Please login first');
      window.location.href = '/';
      return;
    }

    const response = await fetch('http://localhost:5000/api/profile/career', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Career profile updated:', data);
      // The role is now saved as title in the database
      window.location.href = '/JobPreferences';
    } else {
      setError(data.message || 'Failed to update profile');
    }
  } catch (err) {
    setError('Network error. Please try again.');
    console.error('Career profile error:', err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 to-sky-900 p-6 flex items-center justify-center">
      <div className="flex-col max-w-full rounded-xl bg-gradient-to-br from-sky-200 to-sky-600 shadow-2xl relative z-10">
        {/* Header */}
        <div className="mb-8 mt-4 px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Tell us about your career
          </h1>
          <p className="text-gray-700 text-xl font-medium text-italic">
            We'll customize your dashboard based on your professional profile.
          </p>
        </div>

        {/* ADD THIS ERROR MESSAGE */}
        {error && (
         <div className="mx-8 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
        {error}
         </div>
         )}

        {/* Form */}
        <div className="space-y-6 px-8 pb-8">
          {/* Role */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Current / Target Role
            </label>
            <div className="relative">
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <input
                type="text"
                name="role"
                placeholder="Role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full pl-14 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent text-base"
              />
            </div>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Industry
            </label>
            <div className="relative">
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-700" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                <path d="M9 22v-4h6v4"></path>
                <path d="M8 6h.01"></path>
                <path d="M16 6h.01"></path>
                <path d="M12 6h.01"></path>
                <path d="M12 10h.01"></path>
                <path d="M12 14h.01"></path>
                <path d="M16 10h.01"></path>
                <path d="M16 14h.01"></path>
                <path d="M8 10h.01"></path>
                <path d="M8 14h.01"></path>
              </svg>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full pl-14 pr-12 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent text-base appearance-none cursor-pointer"
              >
                <option value="">Select Industry</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              <svg 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Experience Level
            </label>
            <div className="space-y-3">
              {/* Student */}
              <button
                onClick={() => handleExperienceSelect('Student')}
                className={`w-full p-5 bg-white border-2 rounded-xl text-left transition-all ${
                  formData.experienceLevel === 'Student'
                    ? 'border-sky-700 bg-sky-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                    formData.experienceLevel === 'Student'
                      ? 'border-sky-700'
                      : 'border-gray-300'
                  }`}>
                    {formData.experienceLevel === 'Student' && (
                      <div className="w-3 h-3 rounded-full bg-sky-700"></div>
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-medium text-gray-900">Student</div>
                  </div>
                </div>
              </button>

              {/* Fresher */}
              <button
                onClick={() => handleExperienceSelect('Fresher')}
                className={`w-full p-5 bg-white border-2 rounded-xl text-left transition-all ${
                  formData.experienceLevel === 'Fresher'
                    ? 'border-sky-700 bg-sky-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                    formData.experienceLevel === 'Fresher'
                      ? 'border-sky-700'
                      : 'border-gray-300'
                  }`}>
                    {formData.experienceLevel === 'Fresher' && (
                      <div className="w-3 h-3 rounded-full bg-sky-700"></div>
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-medium text-gray-900">Fresher</div>
                    <div className="text-sm text-gray-500">0-1 years</div>
                  </div>
                </div>
              </button>

              {/* Mid-Level */}
              <button
                onClick={() => handleExperienceSelect('Mid-Level')}
                className={`w-full p-5 bg-white border-2 rounded-xl text-left transition-all ${
                  formData.experienceLevel === 'Mid-Level'
                    ? 'border-sky-700 bg-sky-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                    formData.experienceLevel === 'Mid-Level'
                      ? 'border-sky-700'
                      : 'border-gray-300'
                  }`}>
                    {formData.experienceLevel === 'Mid-Level' && (
                      <div className="w-3 h-3 rounded-full bg-sky-700"></div>
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-medium text-gray-900">Mid-Level</div>
                    <div className="text-sm text-gray-500">2-5 years</div>
                  </div>
                </div>
              </button>

              {/* Senior */}
              <button
                onClick={() => handleExperienceSelect('Senior')}
                className={`w-full p-5 bg-white border-2 rounded-xl text-left transition-all ${
                  formData.experienceLevel === 'Senior'
                    ? 'border-sky-700 bg-sky-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                    formData.experienceLevel === 'Senior'
                      ? 'border-sky-700'
                      : 'border-gray-300'
                  }`}>
                    {formData.experienceLevel === 'Senior' && (
                      <div className="w-3 h-3 rounded-full bg-sky-700"></div>
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-medium text-gray-900">Senior</div>
                    <div className="text-sm text-gray-500">5+ years</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleSubmit}
             disabled={loading}  // ADD THIS
            className="w-full py-4 bg-sky-900 text-white text-lg font-semibold rounded-2xl hover:bg-sky-950 transition-colors mt-8 disabled:bg-sky-300 disabled:cursor-not-allowed"  // ADD disabled styles
             >
            {loading ? 'SAVING...' : 'Next'}  {/* CHANGE THIS */}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CareerProfile;