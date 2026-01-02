import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useApplicationStore } from "../../store/useApplicationStore";
import ConversationalLayout from "../../features/innovator/layouts/ConversationalLayout";
import QuestionSlide from "../../features/innovator/components/QuestionSlide";
import CoFounderSlide from "../../features/founder/components/CoFounderSlide"; // The component above
import { Input } from "../../components/ui/Input";

export default function FounderApplication() {
  const { founder, updateFounder, coFounders } = useApplicationStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const TOTAL_SLIDES = 7;
  const progress = ((currentSlide + 1) / TOTAL_SLIDES) * 100;
  const next = () => setCurrentSlide((prev) => prev + 1);

  return (
    <ConversationalLayout progress={progress}>
      <AnimatePresence mode="wait">
        {/* SLIDE 0: WELCOME */}
        <QuestionSlide
          key="intro"
          isActive={currentSlide === 0}
          title={`Hello ${founder.fullName.split(" ")[0]}, ready to scale?`}
          subtitle="Let's start with your professional profile (Page 1 of Application)."
          canProceed={true}
          onNext={next}
        >
          <div className="p-6 bg-purple-50 rounded-xl border border-purple-100 text-purple-900">
            <p>
              You are applying as a <strong>Lead Founder</strong>.
            </p>
          </div>
        </QuestionSlide>

        {/* SLIDE 1: IDENTITY (PDF A.1-5) */}
        <QuestionSlide
          key="identity"
          isActive={currentSlide === 1}
          title="Confirm your details"
          subtitle="This will be used for all official communication."
          canProceed={!!founder.fullName && !!founder.email && !!founder.phone}
          onNext={next}
        >
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={founder.fullName}
              onChange={(e) => updateFounder({ fullName: e.target.value })}
            />
            <Input
              label="Primary Email"
              value={founder.email}
              onChange={(e) => updateFounder({ email: e.target.value })}
            />
            <Input
              label="Phone Number"
              value={founder.phone}
              onChange={(e) => updateFounder({ phone: e.target.value })}
            />
          </div>
        </QuestionSlide>

        {/* SLIDE 2: CURRENT ROLE (PDF A.6-7) */}
        <QuestionSlide
          key="role"
          isActive={currentSlide === 2}
          title="What is your current status?"
          subtitle="Your professional affiliation."
          canProceed={!!founder.affiliation}
          onNext={next}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {[
              "Entrepreneur",
              "Working Professional",
              "Researcher",
              "Student",
            ].map((status) => (
              <button
                key={status}
                onClick={() => {
                  updateFounder({ affiliation: status });
                }}
                className={`p-4 text-left rounded-xl border-2 transition-all duration-200
                  ${
                    founder.affiliation === status
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
              >
                <span className="font-medium">{status}</span>
              </button>
            ))}
          </div>
          <Input
            placeholder="Organization / Institution Name"
            value={founder.organization}
            onChange={(e) => updateFounder({ organization: e.target.value })}
          />
        </QuestionSlide>

        {/* SLIDE 3: BACKGROUND (PDF B.8-12) */}
        <QuestionSlide
          key="background"
          isActive={currentSlide === 3}
          title="Your Expertise"
          subtitle="Education and primary functional strength."
          canProceed={!!founder.educationLevel && !!founder.primaryStrength}
          onNext={next}
        >
          <div className="space-y-4">
            <select
              className="w-full p-3 rounded-md border border-gray-300 bg-white"
              value={founder.educationLevel}
              onChange={(e) =>
                updateFounder({ educationLevel: e.target.value })
              }
            >
              <option value="">Select Education Level</option>
              <option value="Bachelors">Bachelor's Degree</option>
              <option value="Masters">Master's Degree</option>
              <option value="PhD">PhD</option>
            </select>

            <Input
              placeholder="College / University"
              value={founder.college}
              onChange={(e) => updateFounder({ college: e.target.value })}
            />

            <div className="pt-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Primary Strength
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Robotics", "AI/ML", "Product", "Business"].map((skill) => (
                  <button
                    key={skill}
                    onClick={() => updateFounder({ primaryStrength: skill })}
                    className={`p-2 text-sm rounded border ${
                      founder.primaryStrength === skill
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-300"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </QuestionSlide>

        {/* SLIDE 4: ONLINE PRESENCE (PDF C.13-16) */}
        <QuestionSlide
          key="links"
          isActive={currentSlide === 4}
          title="Proof of Work"
          subtitle="Where can we see your work?"
          canProceed={!!founder.linkedinUrl}
          onNext={next}
        >
          <div className="space-y-4">
            <Input
              label="LinkedIn Profile (Mandatory)"
              value={founder.linkedinUrl}
              onChange={(e) => updateFounder({ linkedinUrl: e.target.value })}
            />
            <Input
              label="GitHub Profile"
              value={founder.githubUrl}
              onChange={(e) => updateFounder({ githubUrl: e.target.value })}
            />
            <Input
              label="Portfolio / Website"
              value={founder.portfolioUrl}
              onChange={(e) => updateFounder({ portfolioUrl: e.target.value })}
            />
          </div>
        </QuestionSlide>

        {/* SLIDE 5: BIO (PDF B.13) */}
        <QuestionSlide
          key="bio"
          isActive={currentSlide === 5}
          title="Professional Bio"
          subtitle="Short description of your background (Max 150 words)."
          canProceed={!!founder.bio && founder.bio.length > 20}
          onNext={next}
        >
          <textarea
            autoFocus
            className="w-full h-40 p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 resize-none"
            placeholder="I have 5 years of experience in..."
            value={founder.bio}
            onChange={(e) => updateFounder({ bio: e.target.value })}
          />
        </QuestionSlide>

        {/* SLIDE 6: CO-FOUNDERS (PDF D.17-22) */}
        <QuestionSlide
          key="team"
          isActive={currentSlide === 6}
          title="Building together?"
          subtitle="Add your co-founders here (if any)."
          canProceed={true} // Optional to have co-founders
          onNext={() =>
            alert("Profile Completed! Moving to Track Selection...")
          }
        >
          <CoFounderSlide />
        </QuestionSlide>
      </AnimatePresence>
    </ConversationalLayout>
  );
}
