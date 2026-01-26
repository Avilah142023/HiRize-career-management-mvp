import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import CareerProfile from "./pages/CareerProfile";
import JobPreference from "./pages/JobPreferences";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/AuthPage" element={<AuthPage />} />
        <Route path="/CareerProfile" element={<CareerProfile />} />
        <Route path="/JobPreferences" element={<JobPreference />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
