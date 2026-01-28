import React, { useState, useEffect } from 'react';
import logo from "../assets/images/Logo2.png";


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    bio: '',
    skills: [],
    experience: '',
    education: '',
    profileImage: null
  });

   const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.href = '/';
        return;
      }

      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setProfileData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          location: data.user.location || '',
          title: data.user.title || '',
          bio: data.user.bio || '',
          skills: data.user.skills || [],
          experience: data.user.experience || '',
          education: data.user.education || '',
          profileImage: data.user.profileImage || null
        });
      } else {
        setError('Failed to load profile');
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/';
        }
      }
    } catch (err) {
      setError('Network error');
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'resume', name: 'Resume', icon: '📄' },
    { id: 'coverletter', name: 'Cover Letter', icon: '✉️' },
    { id: 'documents', name: 'Documents', icon: '📁' },
    { id: 'notes', name: 'Notes', icon: '📝' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfilePage profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} setIsEditing={setIsEditing} />;
      case 'resume':
        return <ResumePage />;
      case 'coverletter':
        return <CoverLetterPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'notes':
        return <NotesPage />;
      default:
        return <ProfilePage profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} setIsEditing={setIsEditing} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-br from-sky-600 to-sky-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-sky-800">
          {isSidebarOpen ? (
            <img
                    src={logo}
                    className="w-90 h-90 mb-4"
      />
          ) : (
            <h1 className="text-2xl font-bold">H</h1>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 transition-colors ${
                activeTab === item.id
                  ? 'bg-sky-800 border-l-4 border-white'
                  : 'hover:bg-sky-600'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {isSidebarOpen && <span className="ml-4 font-medium">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-sky-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {isSidebarOpen && <span className="ml-4 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-sky-600 to-sky-900">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {menuItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-lg font-medium text-gray-800">{profileData.name}</p>
              <p className="text-base text-gray-500">{profileData.title}</p>
            </div>
            <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
              {profileData.profileImage ? (
                <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profileData.name.charAt(0)
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const ProfilePage = ({ profileData, setProfileData, isEditing, setIsEditing }) => {
  const [editData, setEditData] = useState(profileData);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);

  useEffect(() => {
    setEditData(profileData);
  }, [profileData]);

  const handleAddSkill = () => {
    if (newSkill.trim() !== '') {
      setEditData({
        ...editData,
        skills: [...editData.skills, newSkill.trim()]
      });
      setNewSkill('');
      setShowSkillInput(false);
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setEditData({
      ...editData,
      skills: editData.skills.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({...editData, profileImage: reader.result});
        if (!isEditing) {
          setProfileData({...profileData, profileImage: reader.result});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });

      const data = await response.json();

      if (response.ok) {
        setProfileData(editData);
        setIsEditing(false);
        console.log('Profile saved successfully');
      } else {
        console.error('Failed to save profile:', data.message);
        alert('Failed to save profile');
      }
    } catch (err) {
      console.error('Save profile error:', err);
      alert('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-sky-700 to-sky-500 rounded-full flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
              {profileData.profileImage ? (
                <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profileData.name.charAt(0)
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-sky-700 text-white rounded-full p-2 cursor-pointer hover:bg-sky-800">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            )}
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900">{profileData.name}</h2>
            <p className="text-xl text-gray-600 mt-1">{profileData.title}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition-colors disabled:bg-sky-300"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditData(profileData);
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">Email</label>
          {isEditing ? (
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({...editData, email: e.target.value})}
              className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          ) : (
            <p className="text-gray-800 text-lg bg-sky-100 px-4 py-3 rounded-lg">{profileData.email}</p>
          )}
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              value={editData.phone}
              onChange={(e) => setEditData({...editData, phone: e.target.value})}
              className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          ) : (
            <p className="text-gray-800 text-lg bg-sky-100 px-4 py-3 rounded-lg">{profileData.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">Location</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.location}
              onChange={(e) => setEditData({...editData, location: e.target.value})}
              className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          ) : (
            <p className="text-gray-800 text-lg bg-sky-100 px-4 py-3 rounded-lg">{profileData.location}</p>
          )}
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">Experience</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.experience}
              onChange={(e) => setEditData({...editData, experience: e.target.value})}
              className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          ) : (
            <p className="text-gray-800 text-lg bg-sky-100 px-4 py-3 rounded-lg">{profileData.experience}</p>
          )}
        </div>
      </div>

      {/* Bio */}
      <div className="mb-8">
        <label className="block text-xl font-semibold text-gray-700 mb-2">Bio</label>
        {isEditing ? (
          <textarea
            value={editData.bio}
            onChange={(e) => setEditData({...editData, bio: e.target.value})}
            rows="4"
            className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        ) : (
          <p className="text-gray-800 text-lg bg-sky-100 px-4 py-3 rounded-lg">{profileData.bio}</p>
        )}
      </div>

      {/* Skills */}
      <div className="mb-8">
        <label className="block text-xl font-semibold text-gray-700 mb-3">Skills</label>
        <div className="flex flex-wrap gap-2">
          {editData.skills.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-sky-100 text-sky-800 rounded-full font-medium text-lg flex items-center gap-2"
            >
              {skill}
              {isEditing && (
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-2 text-red-600 hover:text-red-800 font-bold"
                  aria-label="Remove skill"
                >
                  ×
                </button>
              )}
            </span>
          ))}
          
          {isEditing && !showSkillInput && (
            <button 
              onClick={() => setShowSkillInput(true)}
              className="px-4 py-2 border-2 border-dashed border-sky-500 text-sky-700 rounded-full font-medium text-lg hover:bg-sky-50"
            >
              + Add Skill
            </button>
          )}
          
          {isEditing && showSkillInput && (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSkill();
                  }
                }}
                placeholder="Enter skill"
                className="px-4 py-2 border border-sky-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                autoFocus
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-sky-700 text-white rounded-full hover:bg-sky-800"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowSkillInput(false);
                  setNewSkill('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Education */}
      <div>
        <label className="block text-xl font-semibold text-gray-700 mb-2">Education</label>
        {isEditing ? (
          <input
            type="text"
            value={editData.education}
            onChange={(e) => setEditData({...editData, education: e.target.value})}
            className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        ) : (
          <p className="text-gray-800 text-lg bg-sky-100 px-4 py-3 rounded-lg">{profileData.education}</p>
        )}
      </div>
    </div>
  );
};
// Resume Page Component
const ResumePage = () => {
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fetch resumes on page load
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/upload", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const resumeFiles = data.files.filter(
        (file) => file.fileType === "resume"
      );

      setResumes(resumeFiles);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  // Upload resume
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/upload/resume",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResumes((prev) => [data.file, ...prev]);
        alert("Resume uploaded successfully!");
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  // Delete resume
  const deleteResume = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/api/upload/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-4xl font-bold mb-4">Resume</h3>

        {/* Uploaded resumes */}
        {resumes.length === 0 && (
          <p className="text-gray-500 text-xl font-medium mb-4">No resumes uploaded yet</p>
        )}

        {resumes.map((resume) => (
          <div
            key={resume._id}
            className="flex justify-between items-center p-4 mb-3 border rounded-lg bg-green-50"
          >
            {/* file preview */}
            <a
              href={`http://localhost:5000/${resume.filePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-900 underline font-semibold text-xl"
            >
              📄 {resume.originalName}
            </a>

            <button
              onClick={() => deleteResume(resume._id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}

        {/* Upload */}
        <div className="border-2 border-dashed rounded-lg p-12 text-center mt-6">
          <label className="px-6 py-3 bg-sky-700 text-white rounded-lg cursor-pointer">
            {uploading ? "Uploading..." : "Upload Resume"}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>
    </div>
  );
};


// Cover Letter Page Component
const CoverLetterPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
  const fetchCoverLetter = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/upload", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // fetch cover letter
      const coverLetter = data.files.find(
        (file) => file.fileType === "coverletter"
      );

      if (coverLetter) {
        setUploadedFile(coverLetter);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  fetchCoverLetter();
}, []);


  // Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/upload/coverletter",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUploadedFile(data.file); // backend should return file object
        alert("Cover letter uploaded successfully!");
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!uploadedFile) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/upload/${uploadedFile._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUploadedFile(null);
        alert("Cover letter deleted successfully!");
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting file");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-4xl font-bold text-gray-900 mb-4">
          Cover Letter
        </h3>
        <p className="text-gray-600 text-xl font-medium mb-6">
          Upload and manage your cover letters
        </p>

        {/* Uploaded File Display */}
        {uploadedFile && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
           <a
            href={`http://localhost:5000/${uploadedFile.filePath}`}
            target="_blank"
           rel="noopener noreferrer"
           className="text-sky-900 underline font-semibold text-base">
             ✓ Uploaded: {uploadedFile.originalName}
            </a>

            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}

        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">✉️</div>
          <p className="text-gray-600 font-semibold mb-4">
            Upload your cover letter (PDF / DOC / DOCX)
          </p>

          <label className="px-6 py-3 bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition-colors font-medium cursor-pointer inline-block">
            {uploading ? "Uploading..." : "Upload Cover Letter"}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

// Documents Page Component
const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fetch documents on page load
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/upload", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const docFiles = data.files.filter(
        (file) => file.fileType === "document"
      );

      setDocuments(docFiles);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  // Upload document
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("document", file);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/upload/document",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setDocuments((prev) => [data.file, ...prev]);
        alert("Document uploaded successfully!");
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  // Delete document
  const deleteDocument = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/api/upload/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDocuments((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-4xl font-bold text-gray-900 mb-4">
          Documents
        </h3>

        <p className="text-gray-600 font-medium text-xl mb-6">
          Upload and manage all your job-related documents
        </p>

        {/* Uploaded documents */}
        {documents.length === 0 && (
          <p className="text-gray-500 font-semibold text-lg mb-4">No documents uploaded yet</p>
        )}

        {documents.map((doc) => (
          <div
            key={doc._id}
            className="flex justify-between items-center p-4 mb-3 border rounded-lg bg-green-50"
          >
            {/* Preview */}
            <a
              href={`http://localhost:5000/${doc.filePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-900 underline font-semibold text-xl"
            >
              📁 {doc.originalName}
            </a>

            <button
              onClick={() => deleteDocument(doc._id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}

        {/* Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mt-6">
          <div className="text-6xl mb-4">📁</div>

          <p className="text-gray-600 font-semibold mb-4">
            Upload documents (PDF / DOC / DOCX / ZIP / Images)
          </p>

          <label className="px-6 py-3 bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition-colors font-medium cursor-pointer inline-block">
            {uploading ? "Uploading..." : "Upload Document"}
            <input
              type="file"
              accept=".pdf,.doc,.docx,.zip,.jpg,.png"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

// Notes Page Component
const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({
    title: '',
    content: ''
  });
  const [isEditing, setIsEditing] = useState(false);

 useEffect(() => {
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setNotes(data.notes);
      }
    } catch (err) {
      console.error("Failed to load notes", err);
    }
  };

  fetchNotes();
}, []);

  const [saving, setSaving] = useState(false);

  const handleSaveNote = async () => {
    if (!currentNote.title.trim() && !currentNote.content.trim()) {
      alert('Please add a title or content');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentNote)
      });

      const data = await response.json();
      if (response.ok) {
        setNotes([data.note, ...notes]);
        setCurrentNote({ title: '', content: '' });
        setIsEditing(false);
        alert('Note saved successfully!');
      } else {
        alert(data.message || 'Failed to save note');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving note');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.ok) {
        setNotes(notes.filter(note => note._id !== id));
        alert('Note deleted successfully!');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting note');
    }
  };

  const handleAddBullet = () => {
    setCurrentNote({
      ...currentNote,
      content: currentNote.content + '\n• '
    });
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Notes</h3>
            <p className="text-gray-600 font-semibold text-xl">Keep track of important information and ideas</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-sky-700 text-white rounded-lg hover:bg-sky-900 transition-colors font-semibold"
            >
              + New Note
            </button>
          )}
        </div>


        {/* Note Editor */}
        {isEditing && (
          <div className="mb-6 border-2 border-sky-200 rounded-lg p-6 bg-sky-50">
            <input
              type="text"
              placeholder="Note Title (Bold Header)"
              value={currentNote.title}
              onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-2xl"
            />
            
            <div className="mb-2">
              <button
                onClick={handleAddBullet}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xl font-medium"
              >
                • Add Bullet Point
              </button>
            </div>
  
            <textarea
              placeholder="Write your notes here... Click 'Add Bullet Point' or type • manually for bullet points"
              value={currentNote.content}
              onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
              rows="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono from-neutral-700 text-lg"
            />
            
             <div className="flex gap-3 mt-4">
              <button
                onClick={handleSaveNote}
                disabled={saving}
                className="px-6 py-3 bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition-colors font-medium disabled:bg-sky-400"
              >
                {saving ? 'Saving...' : 'Save Note'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentNote({ title: '', content: '' });
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Saved Notes List */}
        <div className="space-y-4">
          {notes.length === 0 && !isEditing && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl font-semibold mb-4">📝</div>
              <p>No notes yet. Click "New Note" to get started!</p>
            </div>
          )}

          {notes.map((note) => (
            <div key={note._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-xl font-bold text-gray-900">{note.title || 'Untitled Note'}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-base text-gray-700">{new Date(note.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="text-gray-900 whitespace-pre-wrap font-mono text-xl">
                {note.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;