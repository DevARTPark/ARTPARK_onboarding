import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- TYPES ---
export type UserRole = 'founder' | 'innovator';
export type VentureTrack = 'startup' | 'researcher';

// Innovator Profile (Page 10)
export interface InnovatorProfile {
    fullName: string;
    email: string;
    phone: string;
    linkedinUrl: string;
    professionalStatus: string;
    currentRole: string;
    organization: string;
    city: string;
    country: string;
    educationLevel: string;
    college: string;
    yearsExperience: string;
    primarySkill: string;
    bio: string;
}

// Co-Founder Structure (Page 2)
export interface CoFounder {
    id: string;
    name: string;
    email: string;
    role: string;
    affiliation: string;
    skillArea: string;
    isFullTime: boolean;
}

// Founder Profile (Page 1)
export interface FounderProfile {
    fullName: string;
    email: string;
    phone: string;
    currentRole: string;
    affiliation: string;
    organization: string;
    city: string;
    country: string;
    educationLevel: string;
    college: string;
    discipline: string;
    yearsExperience: string;
    primaryStrength: string;
    linkedinUrl: string;
    githubUrl: string;
    scholarUrl: string;
    portfolioUrl: string;
    bio: string;
}

// NEW: Venture Profile (Pages 4-9)
export interface VentureProfile {
    track: VentureTrack | null;

    // Identity
    organizationName: string; // Startup Name or Project Name
    registrationYear: string; // For startups
    legalEntity: string; // Pvt Ltd, LLP, etc.
    website: string;

    // Institute (Researcher only)
    instituteName: string;
    isDsirCertified: boolean;

    // Funding
    hasFunding: boolean;
    fundingDetails: string; // Investors or Grants
    incubatorName: string;

    // Tech Focus
    vertical: string; // Health, Mobility, etc.
    techCategory: string[]; // AI, Robotics (Max 2)

    // Maturity
    currentStage: string; // Prototype, MVP, Pilot
    trlLevel: string; // 1-9

    // The Pitch (Long answers)
    problemStatement: string;
    solutionDescription: string;
    techInnovation: string; // Differentiator
    keyRisks: string;

    // Market
    targetUsers: string;
    marketValidation: string; // Pilots, Customers
}

// NEW: Uploads
export interface Uploads {
    pitchDeck: string | null;
    budgetDoc: string | null;
    demoVideo: string | null;
}

export interface ApplicationState {
    role: UserRole | null;
    currentStep: number;

    innovator: InnovatorProfile;
    founder: FounderProfile;
    coFounders: CoFounder[];

    // NEW State
    venture: VentureProfile;
    uploads: Uploads;

    // Actions
    setRole: (role: UserRole) => void;
    updateInnovator: (fields: Partial<InnovatorProfile>) => void;
    updateFounder: (fields: Partial<FounderProfile>) => void;

    addCoFounder: () => void;
    removeCoFounder: (id: string) => void;
    updateCoFounder: (id: string, fields: Partial<CoFounder>) => void;

    updateVenture: (fields: Partial<VentureProfile>) => void;
    updateUploads: (fields: Partial<Uploads>) => void;

    resetForm: () => void;
}

// --- STORE IMPLEMENTATION ---

export const useApplicationStore = create<ApplicationState>()(
    persist(
        (set) => ({
            role: null,
            currentStep: 1,

            innovator: {
                fullName: '', email: '', phone: '', linkedinUrl: '', professionalStatus: '',
                currentRole: '', organization: '', city: '', country: 'India', educationLevel: '',
                college: '', yearsExperience: '', primarySkill: '', bio: ''
            },

            founder: {
                fullName: '', email: '', phone: '', currentRole: '', affiliation: '',
                organization: '', city: '', country: 'India', educationLevel: '', college: '',
                discipline: '', yearsExperience: '', primaryStrength: '', linkedinUrl: '',
                githubUrl: '', scholarUrl: '', portfolioUrl: '', bio: ''
            },

            coFounders: [],

            venture: {
                track: null,
                organizationName: '', registrationYear: '', legalEntity: '', website: '',
                instituteName: '', isDsirCertified: false,
                hasFunding: false, fundingDetails: '', incubatorName: '',
                vertical: '', techCategory: [],
                currentStage: '', trlLevel: '',
                problemStatement: '', solutionDescription: '', techInnovation: '', keyRisks: '',
                targetUsers: '', marketValidation: ''
            },

            uploads: { pitchDeck: null, budgetDoc: null, demoVideo: null },

            setRole: (role) => set({ role }),

            updateInnovator: (fields) => set((state) => ({
                innovator: { ...state.innovator, ...fields }
            })),

            updateFounder: (fields) => set((state) => ({
                founder: { ...state.founder, ...fields }
            })),

            addCoFounder: () => set((state) => ({
                coFounders: [
                    ...state.coFounders,
                    { id: crypto.randomUUID(), name: '', email: '', role: '', affiliation: '', skillArea: '', isFullTime: true }
                ]
            })),

            removeCoFounder: (id) => set((state) => ({
                coFounders: state.coFounders.filter(c => c.id !== id)
            })),

            updateCoFounder: (id, fields) => set((state) => ({
                coFounders: state.coFounders.map(c => c.id === id ? { ...c, ...fields } : c)
            })),

            updateVenture: (fields) => set((state) => ({
                venture: { ...state.venture, ...fields }
            })),

            updateUploads: (fields) => set((state) => ({
                uploads: { ...state.uploads, ...fields }
            })),

            resetForm: () => set({ role: null, currentStep: 1 })
        }),
        {
            name: 'artpark-onboarding-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);