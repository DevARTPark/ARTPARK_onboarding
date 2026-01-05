import React from "react";
import { Edit2, CheckCircle, AlertCircle } from "lucide-react";
import type { ApplicationState } from "../../store/useApplicationStore";

interface ReviewSlideProps {
  data: ApplicationState; // Full store state
}

export default function ReviewSlide({ data }: ReviewSlideProps) {
  // Helper Component for Sections
  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-3 shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
        <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider">
          {title}
        </h4>
        {/* In a real app, this button would trigger navigation to that step */}
        <button className="text-gray-400 hover:text-blue-600 transition-colors">
          <Edit2 className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-3 text-sm">{children}</div>
    </div>
  );

  // Helper Component for Data Rows
  const Row = ({
    label,
    value,
    isLong = false,
  }: {
    label: string;
    value: any;
    isLong?: boolean;
  }) => (
    <div
      className={`${
        isLong ? "col-span-1" : "grid grid-cols-1 sm:grid-cols-3 gap-2"
      }`}
    >
      <span className="text-gray-500 font-medium">{label}</span>
      <span
        className={`text-gray-900 font-semibold ${
          isLong
            ? "block mt-1 p-2 bg-gray-50 rounded border border-gray-100"
            : "sm:col-span-2"
        }`}
      >
        {value || <span className="text-gray-300 italic">Not provided</span>}
      </span>
    </div>
  );

  const isFounder = data.role === "founder";

  return (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
      {/* Alert Banner */}
      <div className="flex gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100 items-start">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <p>
          Please review your details carefully. Once submitted, your application
          cannot be edited.
        </p>
      </div>

      {/* 1. Identity Section */}
      <Section title={isFounder ? "Lead Founder" : "Innovator Details"}>
        <Row
          label="Name"
          value={isFounder ? data.founder.fullName : data.innovator.leadName}
        />
        <Row
          label="Email"
          value={isFounder ? data.founder.email : data.innovator.email}
        />
        <Row
          label="Phone"
          value={isFounder ? data.founder.phone : data.innovator.phone}
        />
        <Row
          label="LinkedIn"
          value={
            isFounder ? data.founder.linkedinUrl : data.innovator.linkedinUrl
          }
        />
      </Section>

      {/* 2. Professional Background */}
      <Section title="Background">
        {isFounder ? (
          <>
            <Row label="Education" value={data.founder.educationLevel} />
            <Row
              label="Experience"
              value={`${data.founder.yearsExperience} Years`}
            />
            <Row
              label="Primary Strength"
              value={data.founder.primaryStrength}
            />
          </>
        ) : (
          <>
            <Row label="Status" value={data.innovator.professionalStatus} />
            <Row label="Primary Skill" value={data.innovator.primarySkill} />
          </>
        )}
      </Section>

      {/* 3. Venture / Project Details */}
      <Section title="Venture / Project">
        <Row
          label="Track"
          value={
            data.venture.track
              ? data.venture.track.toUpperCase().replace("_", " ")
              : "-"
          }
        />
        <Row label="Organization" value={data.venture.organizationName} />

        {data.venture.track === "startup" && (
          <Row label="Reg. Year" value={data.venture.registrationYear} />
        )}

        <Row label="Vertical" value={data.venture.vertical} />
        <Row
          label="Tech Focus"
          value={
            Array.isArray(data.venture.techCategory)
              ? data.venture.techCategory.join(", ")
              : data.venture.techCategory || "-"
          }
        />
      </Section>

      {/* 4. The Pitch (Long Text) */}
      <Section title="The Pitch">
        <Row
          isLong
          label="Problem Statement"
          value={data.venture.problemStatement}
        />
        <Row
          isLong
          label="Proposed Solution"
          value={data.venture.solutionDescription}
        />
        {data.venture.track === "innovator_residence" && (
          <Row isLong label="Motivation" value={data.venture.motivation} />
        )}
      </Section>

      {/* 5. Team */}
      {data.coFounders.length > 0 && (
        <Section title="Team">
          <div className="grid gap-2">
            {data.coFounders.map((c, i) => (
              <div
                key={c.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">{c.name}</span>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-gray-500">{c.role}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 6. Uploads */}
      <Section title="Documents">
        <div className="flex gap-4 flex-wrap">
          {Object.entries(data.uploads).map(([key, val]) => {
            if (!val) return null;
            return (
              <div
                key={key}
                className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>
            );
          })}
          {!data.uploads.pitchDeck && !data.uploads.demoVideo && (
            <span className="text-gray-400 italic">No files uploaded</span>
          )}
        </div>
      </Section>
    </div>
  );
}
