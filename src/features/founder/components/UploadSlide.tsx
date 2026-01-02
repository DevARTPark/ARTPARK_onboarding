import React from "react";
import { UploadCloud, FileText, X } from "lucide-react";

interface FileSlotProps {
  label: string;
  subLabel?: string;
  accept?: string;
  value: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

function FileSlot({
  label,
  subLabel,
  accept,
  value,
  onUpload,
  onRemove,
}: FileSlotProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-white hover:border-blue-400 transition-colors group relative">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            value
              ? "bg-green-100 text-green-600"
              : "bg-white border border-gray-200 text-gray-400"
          }`}
        >
          {value ? (
            <FileText className="w-6 h-6" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{label}</h4>
          <p className="text-xs text-gray-500">
            {value ? value : subLabel || "PDF or Video (Max 10MB)"}
          </p>
        </div>

        {value ? (
          <button
            onClick={onRemove}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
            Browse
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
}

interface UploadSlideProps {
  uploads: {
    pitchDeck: string | null;
    budgetDoc: string | null;
    demoVideo: string | null;
  };
  onUpdate: (key: string, fileName: string | null) => void;
}

export default function UploadSlide({ uploads, onUpdate }: UploadSlideProps) {
  // Mock upload handler - in real app, this sends file to Supabase Storage
  const handleUpload = (key: string, file: File) => {
    console.log(`Uploading ${key}:`, file.name);
    // Simulate success by just storing the name for now
    onUpdate(key, file.name);
  };

  return (
    <div className="space-y-4">
      <FileSlot
        label="Pitch Deck / Overview"
        subLabel="PDF Presentation (Problem, Solution, Team)"
        accept=".pdf"
        value={uploads.pitchDeck}
        onUpload={(f) => handleUpload("pitchDeck", f)}
        onRemove={() => onUpdate("pitchDeck", null)}
      />

      <FileSlot
        label="1-Year Budget Plan"
        subLabel="PDF or Excel with milestones"
        accept=".pdf,.xlsx,.csv"
        value={uploads.budgetDoc}
        onUpload={(f) => handleUpload("budgetDoc", f)}
        onRemove={() => onUpdate("budgetDoc", null)}
      />

      <FileSlot
        label="Demo / Explainer Video"
        subLabel="MP4 or Link (Max 3 mins)"
        accept="video/*"
        value={uploads.demoVideo}
        onUpload={(f) => handleUpload("demoVideo", f)}
        onRemove={() => onUpdate("demoVideo", null)}
      />
    </div>
  );
}
