import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- TYPES ---
export type UserRole = 'founder' | 'innovator';
export type VentureTrack = 'startup' | 'researcher' | 'innovator_residence';

// Innovator Profile (Page 10)
export interface InnovatorProfile {
    teamName: string;
    leadName: string;
    email: string;
    phone: string;
    linkedinUrl: string;
    professionalStatus: string;
    currentRole: string;
    organization: string;
    city: string;
    country: string;
    isIncubated: boolean | null;
    incubatorName: string;
    hasGrants: boolean | null;
    grantDetails: string;
    primarySkill: string;
    yearsExperience: string;
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

// Venture Profile (Pages 4-9)
export interface VentureProfile {
    track: VentureTrack | null;

    // Identity
    organizationName: string;
    registrationYear: string;
    legalEntity: string;
    website: string;

    // Institute (Researcher only)
    instituteName: string;
    isDsirCertified: boolean;

    // Funding
    hasFunding: boolean;
    fundingDetails: string;
    incubatorName: string;

    // Tech Focus
    vertical: string;
    techCategory: string[];

    // Maturity
    currentStage: string;
    trlLevel: string;

    // The Pitch
    problemStatement: string;
    solutionDescription: string;
    techInnovation: string;
    keyRisks: string;

    // Market
    targetUsers: string;
    marketValidation: string;

    // Team Structure (Section E - Missing in previous version)
    teamHistory: string;

    // NEW: Innovator-in-Residence Specifics (Task 5)
    motivation: string;      // Why ARTPARK?
    supportNeeded: string;   // Mentorship, Tech, etc.
    commitment: string;      // Full-time vs Part-time
}

// Uploads
export interface Uploads {
    pitchDeck: string | null;
    budgetDoc: string | null;
    demoVideo: string | null;
    otherDocs: string | null; // (Section H - Missing in previous version)
}

export interface ApplicationState {
    role: UserRole | null;
    currentStep: number;

    innovator: InnovatorProfile;
    founder: FounderProfile;
    coFounders: CoFounder[];
    venture: VentureProfile;
    uploads: Uploads;
    declarations: Declarations;


    // Actions
    setRole: (role: UserRole) => void;
    updateInnovator: (fields: Partial<InnovatorProfile>) => void;
    updateFounder: (fields: Partial<FounderProfile>) => void;

    addCoFounder: () => void;
    removeCoFounder: (id: string) => void;
    updateCoFounder: (id: string, fields: Partial<CoFounder>) => void;

    updateVenture: (fields: Partial<VentureProfile>) => void;
    updateUploads: (fields: Partial<Uploads>) => void;
    updateDeclarations: (fields: Partial<Declarations>) => void;

    resetForm: () => void;
}

// Declarations Interface
export interface Declarations {
    isAccurate: boolean;
    agreesToTerms: boolean; // "I understand support does not guarantee funding..."
    agreesToCommunication: boolean;
}

// --- STORE IMPLEMENTATION ---

export const useApplicationStore = create<ApplicationState>()(
    persist(
        (set) => ({
            role: 'founder',
            currentStep: 1,

            innovator: {
                teamName: '', leadName: '', email: '', phone: '', linkedinUrl: '', professionalStatus: '',
                currentRole: '', organization: '', city: '', country: 'India',
                isIncubated: null, incubatorName: '', hasGrants: null, grantDetails: '',
                primarySkill: '', yearsExperience: ''
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
                targetUsers: '', marketValidation: '',
                teamHistory: '', // Default value
                motivation: '', supportNeeded: '', commitment: ''
            },

            uploads: { pitchDeck: null, budgetDoc: null, demoVideo: null, otherDocs: null }, // Default value

            // Default Declarations
            declarations: {
                isAccurate: false,
                agreesToTerms: false,
                agreesToCommunication: false
            },

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

            updateDeclarations: (fields) => set((state) => ({
                declarations: { ...state.declarations, ...fields }
            })),

            resetForm: () => set({ role: 'founder', currentStep: 1 })
        }),
        {
            name: 'artpark-onboarding-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);