import React from "react";
import { motion } from "framer-motion";
import artparkLogo from "../../../assets/artpark_in_logo.jpg";

interface ConversationalLayoutProps {
  children: React.ReactNode;
  progress: number; // 0 to 100
}

export default function ConversationalLayout({
  children,
  progress,
}: ConversationalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Bar: Minimalist Logo & Progress */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-50 flex items-center px-6 md:px-12 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={artparkLogo}
            alt="ARTPARK"
            className="h-8 w-auto rounded-md"
          />
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
            Innovator Track
          </span>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </header>

      {/* Main Stage: The Conversation */}
      <main className="flex-1 flex flex-col justify-center items-center p-6 md:p-0 relative overflow-hidden">
        <div className="w-full max-w-2xl z-10">{children}</div>
      </main>

      {/* Footer: Contextual Help */}
      <footer className="fixed bottom-6 w-full text-center text-gray-400 text-xs pointer-events-none">
        <p>
          Press{" "}
          <span className="font-bold border border-gray-300 rounded px-1 mx-1 bg-white text-gray-600">
            Enter ↵
          </span>{" "}
          to continue
        </p>
      </footer>
    </div>
  );
}
