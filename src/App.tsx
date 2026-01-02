import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import OnboardingAuthPage from "./pages/auth/OnboardingAuthPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login page which handles role selection */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* The Main Entry Page */}
        <Route path="/login" element={<OnboardingAuthPage />} />

        {/* Future Protected Routes will go here */}
        {/* <Route path="/wizard/*" element={<WizardFlow />} /> */}
      </Routes>
    </Router>
  );
}
