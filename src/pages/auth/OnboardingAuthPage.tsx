import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Rocket,
  Users,
  ArrowRight,
  ArrowLeft,
  Linkedin,
  Phone,
  User,
  Mail,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import artparkLogo from "../../assets/artpark_in_logo.jpg";

// Placeholder for Google Icon
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

type AuthView = "selection" | "login" | "details" | "signup";
type UserRole = "founder" | "innovator" | null;

export default function OnboardingAuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State
  const [view, setView] = useState<AuthView>("selection");
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Consolidated Form Data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    linkedinUrl: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Check URL params on load
  useEffect(() => {
    const typeParam = searchParams.get("type");
    const modeParam = searchParams.get("mode");

    if (modeParam === "login") {
      setView("login");
    } else if (typeParam === "founder" || typeParam === "innovator") {
      setRole(typeParam as UserRole);
      if (!modeParam) setView("details");
    }
  }, [searchParams]);

  // --- Handlers ---

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setView("details");
    setSearchParams({ type: selectedRole!, mode: "apply" });
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView("signup");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Creating Account via Password:", { role, ...formData });
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleGoogleLogin = () => {
    console.log("Triggering Google OAuth...");
  };

  const goBack = () => {
    if (view === "signup") setView("details");
    else if (view === "details") {
      setView("selection");
      setRole(null);
    } else if (view === "login") {
      setView("selection");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side: Context */}
        <div className="hidden lg:block space-y-6 pr-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-2 mb-6">
            <span className="font-bold text-blue-600 text-xl">
              <img
                src={artparkLogo}
                alt="ARTPARK"
                className="w-full h-full object-contain"
              />
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Building the future of <br />
            <span className="text-blue-600">Robotics & AI</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-md">
            Join India's leading ecosystem.{" "}
            {role === "founder"
              ? "Build your deep-tech venture with us."
              : "Find your team and solve big problems."}
          </p>

          <div className="space-y-4 pt-4">
            <FeatureRow text="Access to world-class test labs" />
            <FeatureRow text="Mentorship from industry experts" />
            <FeatureRow text="Seed funding & grant opportunities" />
          </div>
        </div>

        {/* Right Side: The Form Card */}
        <motion.div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md mx-auto overflow-hidden relative h-[550px] flex flex-col">
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-gray-100 shrink-0">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: "0%" }}
              animate={{
                width:
                  view === "selection"
                    ? "20%"
                    : view === "details"
                    ? "60%"
                    : "100%",
              }}
            />
          </div>

          {/* Content Area - Added 'justify-center' to vertically align content */}
          <div className="p-8 flex-1 overflow-y-auto flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {/* STEP 1: ROLE SELECTION */}
              {view === "selection" && (
                <motion.div
                  key="selection"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 w-full"
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
                        onClick={() => {
                          setView("login");
                          setSearchParams({ mode: "login" });
                        }}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Log in
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: BASIC DETAILS + EMAIL */}
              {view === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full"
                >
                  <HeaderWithBack
                    title="Tell us about you"
                    subtitle="We'll use this to personalize your application"
                    onBack={goBack}
                  />

                  <form onSubmit={handleDetailsSubmit} className="space-y-4">
                    <Input
                      label="Full Name"
                      placeholder="e.g. Rahul Sharma"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      leftIcon={<User className="w-4 h-4" />}
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      leftIcon={<Mail className="w-4 h-4" />}
                    />

                    <Input
                      label="LinkedIn Profile"
                      placeholder="linkedin.com/in/username"
                      required
                      value={formData.linkedinUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          linkedinUrl: e.target.value,
                        })
                      }
                      leftIcon={<Linkedin className="w-4 h-4" />}
                    />

                    <Input
                      label="Phone Number"
                      placeholder="+91 98765 43210"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      leftIcon={<Phone className="w-4 h-4" />}
                    />

                    <Button
                      className="w-full mt-4"
                      size="lg"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Continue
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* STEP 3: ACCOUNT SECURITY */}
              {view === "signup" && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full"
                >
                  <HeaderWithBack
                    title="Secure your account"
                    subtitle={`Finish setting up account for ${formData.email}`}
                    onBack={goBack}
                  />

                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <GoogleIcon />
                      <span className="font-medium text-gray-700">
                        Continue with Google
                      </span>
                    </button>
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or create a password
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <Input
                      label="Create Password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      leftIcon={<Lock className="w-4 h-4" />}
                    />

                    <Input
                      label="Confirm Password"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      leftIcon={<Lock className="w-4 h-4" />}
                    />

                    <Button
                      className="w-full mt-4"
                      size="lg"
                      isLoading={isLoading}
                    >
                      Create Account
                    </Button>

                    <p className="text-xs text-center text-gray-500 mt-4">
                      By clicking Create Account, you agree to our Terms and
                      Privacy Policy.
                    </p>
                  </form>
                </motion.div>
              )}

              {/* LOGIN VIEW */}
              {view === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="w-full"
                >
                  <div className="flex items-center mb-6">
                    <button
                      onClick={goBack}
                      className="mr-3 p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Welcome Back
                      </h2>
                      <p className="text-sm text-gray-500">
                        Sign in to continue
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="space-y-4"
                  >
                    <Input
                      label="Email Address"
                      type="email"
                      leftIcon={<Mail className="w-4 h-4" />}
                    />
                    <Input
                      label="Password"
                      type="password"
                      leftIcon={<Lock className="w-4 h-4" />}
                    />
                    <Button className="w-full mt-2" size="lg">
                      Sign In
                    </Button>

                    <div className="mt-4">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="px-2 bg-white text-gray-500">
                            Or continue with
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg p-2.5 hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <GoogleIcon />
                        <span className="font-medium text-gray-700 text-sm">
                          Google
                        </span>
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 text-center text-sm">
                    <button
                      onClick={() => setView("selection")}
                      className="text-blue-600 hover:underline"
                    >
                      Don't have an account? Sign up
                    </button>
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

// --- Subcomponents ---

function HeaderWithBack({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center mb-6">
      <button
        type="button"
        onClick={onBack}
        className="mr-3 p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

function FeatureRow({ text }: { text: string }) {
  return (
    <div className="flex items-center text-gray-600">
      <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
      <span>{text}</span>
    </div>
  );
}

function RoleSelectCard({ icon, title, description, onClick, color }: any) {
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
