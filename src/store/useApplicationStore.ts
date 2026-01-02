import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- TYPES ---

export type UserRole = 'founder' | 'innovator';

// The "Streamlined" Profile for Innovators (No Idea yet)
export interface InnovatorProfile {
    // 1. Identity
    teamName: string;         // Can be just their name if solo
    leadName: string;
    email: string;
    phone: string;

    // 2. Professional Context
    currentRole: string;      // e.g. "Technical Lead", "Student"
    professionalStatus: string; // "Student", "Working Professional", "Independent"
    linkedinUrl: string;

    // 3. Location
    city: string;
    country: string;

    // 4. History (Prior Support)
    isIncubated: boolean | null; // null means not answered yet
    incubatorName: string;
    hasGrants: boolean | null;
    grantDetails: string;

    // 5. Skills & Focus
    primarySkill: string;     // e.g. "AI/ML", "Robotics", "Design"
    yearsExperience: string;
}

// The "Detailed" Profile for Founders (Has Idea/Startup)
export interface FounderProfile {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    affiliation: string;
    organization: string;
    educationLevel: string;
    yearsExperience: string;
    linkedin: string;
    bio: string;
    // ... plus co-founders, venture details etc (simplified for this step)
}

export interface ApplicationState {
    role: UserRole;

    // Data Buckets
    innovator: InnovatorProfile;
    founder: FounderProfile;

    // Actions
    setRole: (role: UserRole) => void;
    updateInnovator: (fields: Partial<InnovatorProfile>) => void;
    updateFounder: (fields: Partial<FounderProfile>) => void;
    resetForm: () => void;
}

// --- STORE IMPLEMENTATION ---

export const useApplicationStore = create<ApplicationState>()(
    persist(
        (set) => ({
            role: 'founder', // Default, will be overwritten by OnboardingAuthPage

            // Initial State for Innovator
            innovator: {
                teamName: '',
                leadName: '',
                email: '',
                phone: '',
                currentRole: '',
                professionalStatus: '',
                linkedinUrl: '',
                city: '',
                country: 'India',
                isIncubated: null,
                incubatorName: '',
                hasGrants: null,
                grantDetails: '',
                primarySkill: '',
                yearsExperience: ''
            },

            // Initial State for Founder (Placeholder for now)
            founder: {
                fullName: '',
                email: '',
                phone: '',
                role: '',
                affiliation: '',
                organization: '',
                educationLevel: '',
                yearsExperience: '',
                linkedin: '',
                bio: ''
            },

            // Actions
            setRole: (role) => set({ role }),

            updateInnovator: (fields) => set((state) => ({
                innovator: { ...state.innovator, ...fields }
            })),

            updateFounder: (fields) => set((state) => ({
                founder: { ...state.founder, ...fields }
            })),

            resetForm: () => set((state) => ({
                // Resetting only the active role's data could be an option, 
                // but for safety we reset the innovator form here.
                innovator: {
                    teamName: '', leadName: '', email: '', phone: '', currentRole: '',
                    professionalStatus: '', linkedinUrl: '', city: '', country: 'India',
                    isIncubated: null, incubatorName: '', hasGrants: null, grantDetails: '',
                    primarySkill: '', yearsExperience: ''
                }
            }))
        }),
        {
            name: 'artpark-onboarding-storage', // Unique name for localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);