import React, { useState, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useApplicationStore } from "../store/useApplicationStore";

// Types
import type { SlideConfig } from "../features/application/types/SlideTypes";

// Layout & Wrapper
import ApplicationLayout from "../features/application/layouts/ApplicationLayout";
import QuestionSlide from "../components/QuestionSlide";

// Slide Components
import FormSlide from "../components/slides/FormSlide";
import OptionSlide from "../components/slides/OptionSlide";
import EssaySlide from "../components/slides/EssaySlide";
import ListSlide from "../components/slides/ListSlide";
import UploadSlide from "../components/slides/UploadSlide";
import InfoSlide from "../components/slides/InfoSlide";
import ReviewSlide from "../components/slides/ReviewSlide";
import ConsentSlide from "../components/slides/ConsentSlide";

// --- PROPS INTERFACE ---
interface ApplicationEngineProps {
  flowConfig: SlideConfig[];
  trackTitle: string;
}

export default function ApplicationEngine({
  flowConfig,
  trackTitle,
}: ApplicationEngineProps) {
  const store = useApplicationStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Filter Slides
  const activeSlides = useMemo(() => {
    return flowConfig.filter((slide) => {
      if (!slide.condition) return true;
      return slide.condition(store);
    });
  }, [store.venture.track, store.role, flowConfig]); // Added flowConfig dependency

  // 2. Get Current Slide
  const currentSlide = activeSlides[currentIndex];

  // Safety Reset
  useEffect(() => {
    if (!currentSlide && activeSlides.length > 0) {
      setCurrentIndex(activeSlides.length - 1);
    }
  }, [activeSlides.length, currentSlide]);

  if (!currentSlide)
    return <div className="p-10 text-center">Loading Application...</div>;

  // 3. Progress Logic
  const currentSectionId = currentSlide.sectionId;
  const sectionSlides = activeSlides.filter(
    (s) => s.sectionId === currentSectionId
  );
  const localIndex = sectionSlides.findIndex((s) => s.id === currentSlide.id);
  const localProgress = ((localIndex + 1) / sectionSlides.length) * 100;

  // 4. Update Handler
  const handleUpdate = (path: string, value: any) => {
    const [domain, field] = path.split(".");
    if (domain === "founder") store.updateFounder({ [field]: value });
    else if (domain === "venture") store.updateVenture({ [field]: value });
    else if (domain === "innovator") store.updateInnovator({ [field]: value });
    else if (domain === "uploads") store.updateUploads({ [field]: value });
    else if (domain === "declarations")
      store.updateDeclarations({ [field]: value });
  };

  const getValue = (path?: string) => {
    if (!path) return "";
    return (
      path
        .split(".")
        .reduce(
          (obj: any, key) => (obj && obj[key] !== undefined ? obj[key] : ""),
          store
        ) || ""
    );
  };

  // 5. Navigation
  const next = () => {
    if (currentIndex < activeSlides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      console.log("Form Submitted", store);
      alert(`Application Submitted for ${trackTitle}!`);
    }
  };

  const back = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // 6. Validation
  const checkCanProceed = (): boolean => {
    const s = currentSlide;
    switch (s.type) {
      case "form":
        return (
          s.props?.inputs?.every((i) => !i.required || !!getValue(i.field)) ??
          true
        );
      case "option":
        // Specialized check for Innovator Status
        if (s.id === "status") return !!store.innovator.professionalStatus;
        if (s.id === "skills") return !!store.innovator.primarySkill;
        // ... Founder checks ...
        return s.id === "track_selection"
          ? !!store.venture.track
          : s.id === "vertical"
          ? !!store.venture.vertical
          : s.id === "tech_category"
          ? store.venture.techCategory.length > 0
          : s.id === "trl_level"
          ? !!store.venture.trlLevel
          : true;
      case "essay":
        return (
          s.props?.questions?.every(
            (q) => !q.minChars || getValue(q.field).length >= q.minChars
          ) ?? true
        );
      case "upload":
        return true; // Optional for Innovator for now
      case "consent":
        // Check if all checkboxes defined in props are true in the store
        // We assume generic 'items' prop for consent slide
        const requiredKeys = s.props?.items?.map((i: any) => i.id) || [];
        return requiredKeys.every(
          (key: string) =>
            store.declarations[key as keyof typeof store.declarations]
        );
      default:
        return true;
    }
  };

  // 7. Render
  const renderSlideContent = (slide: SlideConfig) => {
    switch (slide.type) {
      case "intro":
        return <InfoSlide type="intro" content={slide.subtitle} />;
      case "form":
        return (
          <FormSlide
            inputs={slide.props?.inputs || []}
            values={store}
            onUpdate={handleUpdate}
          />
        );
      case "option":
        // Map generic Option IDs to Store Fields
        let field = "dummy";
        if (slide.id === "status") field = "innovator.professionalStatus";
        else if (slide.id === "skills") field = "innovator.primarySkill";
        else if (slide.id === "track_selection") field = "venture.track";
        else if (slide.id === "vertical") field = "venture.vertical";
        else if (slide.id === "tech_category") field = "venture.techCategory";
        else if (slide.id === "trl_level") field = "venture.trlLevel";
        else if (slide.id === "iir_commitment") field = "venture.commitment";

        return (
          <OptionSlide
            options={slide.props?.options || []}
            selected={getValue(field)}
            multiSelect={slide.props?.multiSelect}
            onSelect={(val: string) => {
              // FIX: Handle Multi-Select Array Logic
              if (slide.props?.multiSelect) {
                const currentArray = (getValue(field) as string[]) || [];
                // If value exists, remove it. If not, add it.
                const newValue = currentArray.includes(val)
                  ? currentArray.filter((item) => item !== val)
                  : [...currentArray, val];
                handleUpdate(field, newValue);
              } else {
                // Single Select
                handleUpdate(field, val);
              }
            }}
          />
        );
      case "essay":
        return (
          <EssaySlide
            questions={slide.props?.questions || []}
            values={store}
            onUpdate={handleUpdate}
          />
        );
      case "list":
        return <ListSlide />;
      case "upload":
        return (
          <UploadSlide
            files={slide.props?.files || []}
            values={store}
            onUpdate={(key, val) => store.updateUploads({ [key]: val })}
          />
        );
      case "review":
        return <ReviewSlide data={store} />;
      case "consent":
        return (
          <ConsentSlide
            // FIX: Cast the generic items to the specific type required by ConsentSlide
            items={
              (slide.props?.items || []) as Array<{
                id: keyof typeof store.declarations;
                label: string;
              }>
            }
            values={store.declarations}
            onUpdate={(field, val) =>
              store.updateDeclarations({ [field]: val })
            }
          />
        );
      default:
        return <div>Unknown Slide</div>;
    }
  };

  return (
    <ApplicationLayout
      currentSectionId={currentSectionId}
      localProgress={localProgress}
      trackTitle={trackTitle}
    >
      <AnimatePresence mode="wait">
        <QuestionSlide
          key={currentSlide.id}
          isActive={true}
          title={currentSlide.title}
          subtitle={
            currentSlide.type === "intro" ? undefined : currentSlide.subtitle
          }
          onNext={next}
          onBack={currentIndex > 0 ? back : undefined}
          canProceed={checkCanProceed()}
        >
          {renderSlideContent(currentSlide)}
        </QuestionSlide>
      </AnimatePresence>
    </ApplicationLayout>
  );
}
