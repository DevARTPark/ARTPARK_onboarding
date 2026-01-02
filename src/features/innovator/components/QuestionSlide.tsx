import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface QuestionSlideProps {
  isActive: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onNext?: () => void;
  canProceed: boolean; // Disables 'Enter' if field is invalid
}

export default function QuestionSlide({
  isActive,
  title,
  subtitle,
  children,
  onNext,
  canProceed,
}: QuestionSlideProps) {
  // Enter key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isActive && canProceed && e.key === "Enter" && onNext) {
        const target = e.target as HTMLElement;
        // Don't submit if user is typing in a textarea
        if (target.tagName !== "TEXTAREA") {
          onNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, canProceed, onNext]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-gray-500 font-medium">{subtitle}</p>
        )}
      </div>

      <div className="py-4">{children}</div>

      {onNext && (
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200
              ${
                canProceed
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            OK
            <ArrowRight className="w-5 h-5" />
          </button>

          <span className="text-xs text-gray-400 hidden md:inline-block">
            {canProceed ? "press Enter ↵" : "fill to continue"}
          </span>
        </div>
      )}
    </motion.div>
  );
}
