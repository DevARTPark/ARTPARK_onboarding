import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Rocket,
  Users,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import the components you just created
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

// Placeholder for the logo - replace with your actual import
// import artparkLogo from "/artpark_logo.png";

type AuthView = "selection" | "login" | "signup";
type UserRole = "founder" | "innovator" | null;

export default function OnboardingAuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State
  const [view, setView] = useState<AuthView>("selection");
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Check URL params on load (e.g., ?type=founder)
  useEffect(() => {
    const typeParam = searchParams.get("type");
    const modeParam = searchParams.get("mode"); // 'login' or 'signup'

    if (modeParam === "login") {
      setView("login");
    } else if (typeParam === "founder" || typeParam === "innovator") {
      setRole(typeParam as UserRole);
      setView("signup");
    }
  }, [searchParams]);

  // Handlers
  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setView("signup");
    setSearchParams({ type: selectedRole!, mode: "signup" });
  };

  const handleSwitchToLogin = () => {
    setView("login");
    setRole(null);
    setSearchParams({ mode: "login" });
  };

  const handleBackToSelection = () => {
    setView("selection");
    setRole(null);
    setSearchParams({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call for now
    console.log("Submitting:", { view, role, ...formData });
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration (Matches Artpark Login) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side: Marketing / Context */}
        <div className="hidden lg:block space-y-6 pr-8">
          {/* Replace text with <img src={artparkLogo} /> if you have it */}
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-2 mb-6">
            <span className="font-bold text-blue-600">AP</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Building the future of <br />
            <span className="text-blue-600">Robotics & AI</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-md">
            Join India's leading ecosystem for deep-tech innovation. Whether you
            have an idea or just the skills, we have a path for you.
          </p>

          <div className="space-y-4 pt-4">
            <FeatureRow text="Access to world-class test labs" />
            <FeatureRow text="Mentorship from industry experts" />
            <FeatureRow text="Seed funding & grant opportunities" />
          </div>
        </div>

        {/* Right Side: The Interactive Card */}
        <motion.div
          layout
          className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md mx-auto overflow-hidden relative"
        >
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-gray-100">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: "0%" }}
              animate={{ width: view === "selection" ? "33%" : "100%" }}
            />
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {/* VIEW 1: ROLE SELECTION */}
              {view === "selection" && (
                <motion.div
                  key="selection"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Start your journey
                    </h2>
                    <p className="text-gray-500 mt-2">
                      How would you like to participate?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <RoleSelectCard
                      icon={<Rocket className="w-6 h-6 text-white" />}
                      color="bg-blue-600"
                      title="I have a Startup Idea"
                      description="For founders ready to build, incubate, and scale."
                      onClick={() => handleRoleSelect("founder")}
                    />

                    <RoleSelectCard
                      icon={<Users className="w-6 h-6 text-white" />}
                      color="bg-purple-600"
                      title="I want to join a Team"
                      description="For innovators looking for projects and co-founders."
                      onClick={() => handleRoleSelect("innovator")}
                    />
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">
                      Already have an account?{" "}
                      <button
                        onClick={handleSwitchToLogin}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Log in
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* VIEW 2: LOGIN & SIGNUP FORM */}
              {(view === "signup" || view === "login") && (
                <motion.div
                  key="auth-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center mb-6">
                    {view === "signup" && (
                      <button
                        onClick={handleBackToSelection}
                        className="mr-3 p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {view === "login"
                          ? "Welcome Back"
                          : role === "founder"
                          ? "Founder Application"
                          : "Innovator Profile"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {view === "login"
                          ? "Enter your credentials to access the portal"
                          : "Create your account to get started"}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {view === "signup" && (
                      <Input
                        label="Full Name"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    )}

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />

                    <Input
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />

                    {view === "signup" && (
                      <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    )}

                    <Button
                      className="w-full mt-2"
                      size="lg"
                      isLoading={isLoading}
                      rightIcon={<ArrowRight className="w-4 h-4 ml-2" />}
                    >
                      {view === "login" ? "Sign In" : "Create Account"}
                    </Button>
                  </form>

                  <div className="mt-6 text-center text-sm text-gray-500">
                    {view === "login" ? (
                      <>
                        New here?{" "}
                        <button
                          onClick={() => handleBackToSelection()}
                          className="text-blue-600 font-medium hover:underline"
                        >
                          Create an account
                        </button>
                      </>
                    ) : (
                      <>
                        Already registered?{" "}
                        <button
                          onClick={handleSwitchToLogin}
                          className="text-blue-600 font-medium hover:underline"
                        >
                          Log in instead
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function FeatureRow({ text }: { text: string }) {
  return (
    <div className="flex items-center text-gray-600">
      <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
      <span>{text}</span>
    </div>
  );
}

function RoleSelectCard({
  icon,
  title,
  description,
  onClick,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative flex items-start p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200"
    >
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-lg ${color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}
      >
        {icon}
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
        <ArrowRight className="w-5 h-5" />
      </div>
    </div>
  );
}
