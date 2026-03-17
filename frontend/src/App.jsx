import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import CareerProfile from "./pages/CareerProfile";
import JobPreference from "./pages/JobPreferences";
import Dashboard from "./pages/Dashboard";
import JobListing from "./pages/JobListing";
import ApplyJob from "./pages/ApplyJob";
import RecruiterDashboard from "./pages/Recruiter/RecruiterDashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Candidate flow */}
        <Route path="/career-profile" element={<CareerProfile />} />
        <Route path="/job-preferences" element={<JobPreference />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<JobListing />} />
        <Route path="/apply-job/:jobId" element={<ApplyJob />} />

        {/* Recruiter flow */}
        <Route path="/Recruiter/Dashboard" element={<RecruiterDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
