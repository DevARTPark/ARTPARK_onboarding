// import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import OnboardingAuthPage from "./pages/auth/OnboardingAuthPage";

// 1. Import the Unified Engine
import ApplicationEngine from "./pages/ApplicationEngine";
import ApplicationSuccess from "./pages/ApplicationSuccess";
import AssessmentPage from "./pages/AssessmentPage";

// 2. Import the Configurations
import { APPLICATION_FLOW } from "./features/application/config/applicationFlow";
import { INNOVATOR_FLOW } from "./features/application/config/innovatorFlow";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login page */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login / Role Selection */}
        <Route path="/login" element={<OnboardingAuthPage />} />

        {/* FOUNDER TRACK */}
        {/* Uses the generic engine with the Founder questions */}
        <Route
          path="/apply/founder"
          element={
            <ApplicationEngine
              flowConfig={APPLICATION_FLOW}
              trackTitle="Founder Track"
            />
          }
        />
        {/* 1. Success Page (Post-Submission) */}
        <Route path="/application-submitted" element={<ApplicationSuccess />} />

        {/* 2. Assessment Page (Accessed via Email Link) */}
        <Route path="/assessment/:id" element={<AssessmentPage />} />

        {/* INNOVATOR TRACK */}
        {/* Uses the same engine but with Innovator questions */}
        <Route
          path="/apply/innovator"
          element={
            <ApplicationEngine
              flowConfig={INNOVATOR_FLOW}
              trackTitle="Innovator Track"
            />
          }
        />
      </Routes>
    </Router>
  );
}
