import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useApplicationStore } from "../../store/useApplicationStore";
import ConversationalLayout from "../../features/innovator/layouts/ConversationalLayout";
import QuestionSlide from "../../features/innovator/components/QuestionSlide";
import CoFounderSlide from "../../features/founder/components/CoFounderSlide"; // The component above
import { Input } from "../../components/ui/Input";
import SelectionSlide from "../../features/founder/components/SelectionSlide";
import UploadSlide from "../../features/founder/components/UploadSlide";
import {
  Building2,
  GraduationCap,
  Activity,
  Tractor,
  Cpu,
  Zap,
  Radio,
} from "lucide-react";

export default function FounderApplication() {
  const { founder, updateFounder, coFounders } = useApplicationStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const TOTAL_SLIDES = 17;
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

        {/* SLIDE 7: TRACK SELECTION (PDF Page 3) */}
        <QuestionSlide
          key="track"
          isActive={currentSlide === 7}
          title="Choose your path"
          subtitle="Are you an incorporated startup or an academic research team?"
          canProceed={!!founder.affiliation} // Actually we should check venture.track
          onNext={next}
        >
          <SelectionSlide
            selected={venture.track || ""}
            onSelect={(val) => updateVenture({ track: val as any })}
            options={[
              {
                id: "startup",
                label: "Pre-Series A Startup",
                description: "Incorporated company (Pvt Ltd / LLP)",
                icon: <Building2 className="w-6 h-6" />,
              },
              {
                id: "researcher",
                label: "Academic Researcher",
                description: "Affiliated with University / DSIR Institute",
                icon: <GraduationCap className="w-6 h-6" />,
              },
            ]}
          />
        </QuestionSlide>

        {/* SLIDE 8: IDENTITY (Conditional) */}
        <QuestionSlide
          key="venture_identity"
          isActive={currentSlide === 8}
          title={
            venture.track === "startup"
              ? "Company Details"
              : "Institute Details"
          }
          subtitle="Tell us about your organization."
          canProceed={!!venture.organizationName}
          onNext={next}
        >
          <div className="space-y-4">
            <Input
              label={
                venture.track === "startup"
                  ? "Startup Name"
                  : "Project / Team Name"
              }
              value={venture.organizationName}
              onChange={(e) =>
                updateVenture({ organizationName: e.target.value })
              }
            />

            {venture.track === "startup" ? (
              <>
                <Input
                  label="Year of Incorporation"
                  type="number"
                  value={venture.registrationYear}
                  onChange={(e) =>
                    updateVenture({ registrationYear: e.target.value })
                  }
                />
                <Input
                  label="Legal Entity Type (e.g. Pvt Ltd)"
                  value={venture.legalEntity}
                  onChange={(e) =>
                    updateVenture({ legalEntity: e.target.value })
                  }
                />
              </>
            ) : (
              <>
                <Input
                  label="Institute Name"
                  value={venture.instituteName}
                  onChange={(e) =>
                    updateVenture({ instituteName: e.target.value })
                  }
                />
                <label className="flex items-center space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    checked={venture.isDsirCertified}
                    onChange={(e) =>
                      updateVenture({ isDsirCertified: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-gray-700">
                    Is your institute DSIR Certified?
                  </span>
                </label>
              </>
            )}
          </div>
        </QuestionSlide>

        {/* SLIDE 9: VERTICAL (PDF C.14 / 12) */}
        <QuestionSlide
          key="vertical"
          isActive={currentSlide === 9}
          title="Primary Focus Area"
          subtitle="Which vertical does your solution impact?"
          canProceed={!!venture.vertical}
          onNext={next}
        >
          <SelectionSlide
            selected={venture.vertical}
            onSelect={(val) => updateVenture({ vertical: val })}
            options={[
              {
                id: "Industrial Automation",
                label: "Industrial Automation",
                icon: <Zap className="w-5 h-5" />,
              },
              {
                id: "Mobility",
                label: "Mobility",
                icon: <Tractor className="w-5 h-5" />,
              }, // Using Tractor as proxy for mobility/agri
              {
                id: "Health",
                label: "Health",
                icon: <Activity className="w-5 h-5" />,
              },
              {
                id: "Agriculture",
                label: "Agriculture",
                icon: <Tractor className="w-5 h-5" />,
              },
            ]}
          />
        </QuestionSlide>

        {/* SLIDE 10: TECH CATEGORY (PDF C.15 / 13) */}
        <QuestionSlide
          key="tech"
          isActive={currentSlide === 10}
          title="Core Technology"
          subtitle="Select up to two technologies."
          canProceed={venture.techCategory.length > 0}
          onNext={next}
        >
          <SelectionSlide
            multiSelect={true}
            selected={venture.techCategory} // Array
            onSelect={(val) => {
              const current = venture.techCategory;
              if (current.includes(val)) {
                updateVenture({
                  techCategory: current.filter((c) => c !== val),
                });
              } else if (current.length < 2) {
                updateVenture({ techCategory: [...current, val] });
              }
            }}
            options={[
              {
                id: "Robotics",
                label: "Robotics",
                icon: <Cpu className="w-5 h-5" />,
              },
              {
                id: "Autonomous Systems",
                label: "Autonomous Systems",
                icon: <Radio className="w-5 h-5" />,
              },
              {
                id: "AI/ML",
                label: "AI / ML",
                icon: <Cpu className="w-5 h-5" />,
              },
              {
                id: "Communications",
                label: "5G / Networks",
                icon: <Radio className="w-5 h-5" />,
              },
            ]}
          />
        </QuestionSlide>

        {/* SLIDE 11: THE PITCH (Problem Statement) */}
        <QuestionSlide
          key="problem"
          isActive={currentSlide === 11}
          title="The Problem"
          subtitle="What is the core industrial or societal problem you are solving?"
          canProceed={venture.problemStatement.length > 20}
          onNext={next}
        >
          <textarea
            className="w-full h-48 p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 resize-none"
            placeholder="Describe the problem, who is affected, and why it matters..."
            value={venture.problemStatement}
            onChange={(e) =>
              updateVenture({ problemStatement: e.target.value })
            }
          />
        </QuestionSlide>

        {/* SLIDE 12: THE SOLUTION */}
        <QuestionSlide
          key="solution"
          isActive={currentSlide === 12}
          title="Your Solution"
          subtitle="Briefly describe your product and technical approach."
          canProceed={venture.solutionDescription.length > 20}
          onNext={() => alert("Proceed to Uploads...")}
        >
          <textarea
            className="w-full h-48 p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 resize-none"
            placeholder="Our solution is..."
            value={venture.solutionDescription}
            onChange={(e) =>
              updateVenture({ solutionDescription: e.target.value })
            }
          />
        </QuestionSlide>

        {/* SLIDE 13: INNOVATION (PDF Section C) */}
        <QuestionSlide
          key="innovation"
          isActive={currentSlide === 13}
          title="The Innovation"
          subtitle="How is your technology unique? What is the IP status?"
          canProceed={venture.techInnovation.length > 20}
          onNext={next}
        >
          <textarea
            className="w-full h-48 p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 resize-none"
            placeholder="Explain your technical differentiator vs existing solutions..."
            value={venture.techInnovation}
            onChange={(e) => updateVenture({ techInnovation: e.target.value })}
          />
        </QuestionSlide>

        {/* SLIDE 14: RISKS (PDF Section C) */}
        <QuestionSlide
          key="risks"
          isActive={currentSlide === 14}
          title="Key Risks"
          subtitle="What are the main technical or market challenges?"
          canProceed={true}
          onNext={next}
        >
          <textarea
            className="w-full h-40 p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 resize-none"
            placeholder="e.g., Regulatory hurdles, high component costs..."
            value={venture.keyRisks}
            onChange={(e) => updateVenture({ keyRisks: e.target.value })}
          />
        </QuestionSlide>

        {/* SLIDE 15: MARKET & USERS (PDF Section D/E) */}
        <QuestionSlide
          key="market"
          isActive={currentSlide === 15}
          title="Market & Users"
          subtitle="Who are your customers? Do you have any validation?"
          canProceed={venture.targetUsers.length > 10}
          onNext={next}
        >
          <div className="space-y-4">
            <Input
              label="Target Users / Beneficiaries"
              placeholder="e.g., Small-scale farmers in Karnataka"
              value={venture.targetUsers}
              onChange={(e) => updateVenture({ targetUsers: e.target.value })}
            />
            <textarea
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 resize-none"
              placeholder="Describe any pilots, customer calls, or POs received..."
              value={venture.marketValidation}
              onChange={(e) =>
                updateVenture({ marketValidation: e.target.value })
              }
            />
          </div>
        </QuestionSlide>

        {/* SLIDE 16: UPLOADS (PDF Section H) */}
        <QuestionSlide
          key="uploads"
          isActive={currentSlide === 16}
          title="Evidence"
          subtitle="Upload your supporting documents."
          canProceed={!!uploads.pitchDeck} // Only Deck is mandatory
          onNext={() => alert("Application Ready to Submit!")}
        >
          <UploadSlide
            uploads={uploads}
            onUpdate={(key, val) => updateUploads({ [key]: val })}
          />
        </QuestionSlide>
      </AnimatePresence>
    </ConversationalLayout>
  );
}
