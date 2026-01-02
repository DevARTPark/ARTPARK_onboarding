import React from "react";
import { Check } from "lucide-react";

interface Option {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface SelectionSlideProps {
  options: Option[];
  selected: string | string[];
  multiSelect?: boolean;
  onSelect: (value: string) => void;
}

export default function SelectionSlide({
  options,
  selected,
  multiSelect = false,
  onSelect,
}: SelectionSlideProps) {
  const isSelected = (id: string) => {
    if (Array.isArray(selected)) return selected.includes(id);
    return selected === id;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`relative p-6 text-left rounded-xl border-2 transition-all duration-200 group
            ${
              isSelected(option.id)
                ? "border-blue-600 bg-blue-50 shadow-md"
                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
            }`}
        >
          {isSelected(option.id) && (
            <div className="absolute top-4 right-4 text-blue-600">
              <Check className="w-5 h-5" />
            </div>
          )}

          <div className="flex items-center gap-4">
            {option.icon && (
              <div
                className={`p-3 rounded-lg ${
                  isSelected(option.id)
                    ? "bg-blue-200 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {option.icon}
              </div>
            )}
            <div>
              <h3
                className={`font-bold text-lg ${
                  isSelected(option.id) ? "text-blue-900" : "text-gray-900"
                }`}
              >
                {option.label}
              </h3>
              {option.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
