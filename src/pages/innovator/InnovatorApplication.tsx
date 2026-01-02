import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useApplicationStore } from "../../store/useApplicationStore";
import ConversationalLayout from "../../features/innovator/layouts/ConversationalLayout";
import QuestionSlide from "../../features/innovator/components/QuestionSlide";
import { Input } from "../../components/ui/Input";

export default function InnovatorApplication() {
  const { innovator, updateInnovator } = useApplicationStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Define total slides for progress bar
  const TOTAL_SLIDES = 6;
  const progress = ((currentSlide + 1) / TOTAL_SLIDES) * 100;

  const next = () => setCurrentSlide((prev) => prev + 1);

  return (
    <ConversationalLayout progress={progress}>
      <AnimatePresence mode="wait">
        {/* SLIDE 0: INTRO */}
        <QuestionSlide
          key="intro"
          isActive={currentSlide === 0}
          title={`Hi ${
            innovator.fullName.split(" ")[0] || "there"
          }, ready to build the future?`}
          subtitle="We just need a few details to match you with the right opportunities."
          canProceed={true}
          onNext={next}
        >
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 text-blue-800">
            <p>
              You are applying as an <strong>Innovator</strong>.
            </p>
          </div>
        </QuestionSlide>

        {/* SLIDE 1: PROFESSIONAL STATUS */}
        <QuestionSlide
          key="status"
          isActive={currentSlide === 1}
          title="Which describes you best?"
          subtitle="This helps us understand your availability."
          canProceed={!!innovator.professionalStatus}
          onNext={next} // No button needed, auto-advance on selection
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Student",
              "Working Professional",
              "Researcher",
              "Entrepreneur",
              "Independent",
            ].map((status) => (
              <button
                key={status}
                onClick={() => {
                  updateInnovator({ professionalStatus: status });
                  setTimeout(next, 200); // Auto-advance
                }}
                className={`p-6 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-md
                  ${
                    innovator.professionalStatus === status
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
              >
                <span className="text-lg font-medium">{status}</span>
              </button>
            ))}
          </div>
        </QuestionSlide>

        {/* SLIDE 2: CURRENT ROLE */}
        <QuestionSlide
          key="role"
          isActive={currentSlide === 2}
          title="What are you currently doing?"
          subtitle="Your designation and organization."
          canProceed={!!innovator.currentRole && !!innovator.organization}
          onNext={next}
        >
          <div className="space-y-4">
            <Input
              autoFocus
              placeholder="Current Role (e.g. PhD Scholar, Senior Engineer)"
              value={innovator.currentRole}
              onChange={(e) => updateInnovator({ currentRole: e.target.value })}
            />
            <Input
              placeholder="Organization / Institution Name"
              value={innovator.organization}
              onChange={(e) =>
                updateInnovator({ organization: e.target.value })
              }
            />
          </div>
        </QuestionSlide>

        {/* SLIDE 3: LOCATION */}
        <QuestionSlide
          key="location"
          isActive={currentSlide === 3}
          title="Where are you based?"
          subtitle="We support innovators across India."
          canProceed={!!innovator.city}
          onNext={next}
        >
          <Input
            autoFocus
            placeholder="City, State"
            value={innovator.city}
            onChange={(e) => updateInnovator({ city: e.target.value })}
            className="text-lg py-4"
          />
        </QuestionSlide>

        {/* SLIDE 4: SKILLS */}
        <QuestionSlide
          key="skills"
          isActive={currentSlide === 4}
          title="What is your superpower?"
          subtitle="Pick your primary area of expertise."
          canProceed={!!innovator.primarySkill}
          onNext={next}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Robotics / Hardware",
              "AI / ML",
              "Systems Integration",
              "Product Design",
              "Business / Ops",
            ].map((skill) => (
              <button
                key={skill}
                onClick={() => {
                  updateInnovator({ primarySkill: skill });
                  setTimeout(next, 200);
                }}
                className={`p-4 text-left rounded-xl border-2 transition-all duration-200
                  ${
                    innovator.primarySkill === skill
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
              >
                <span className="font-medium">{skill}</span>
              </button>
            ))}
          </div>
        </QuestionSlide>

        {/* SLIDE 5: BIO (Final) */}
        <QuestionSlide
          key="bio"
          isActive={currentSlide === 5}
          title="Tell us your story"
          subtitle="Briefly describe your technical background (Max 150 words)."
          canProceed={!!innovator.bio && innovator.bio.length > 10}
          onNext={() =>
            alert("Application Submitted! Redirect to Dashboard...")
          }
        >
          <textarea
            autoFocus
            className="w-full h-40 p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 resize-none"
            placeholder="I have been working on..."
            value={innovator.bio}
            onChange={(e) => updateInnovator({ bio: e.target.value })}
          />
        </QuestionSlide>
      </AnimatePresence>
    </ConversationalLayout>
  );
}
