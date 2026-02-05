import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferenceState {
    savedPhone: string;
    savedLocation: string;
    setSavedDetails: (details: { phone?: string; location?: string }) => void;
}

export const usePreferenceStore = create<PreferenceState>()(
    persist(
        (set) => ({
            savedPhone: '',
            savedLocation: '',
            setSavedDetails: (details) =>
                set((state) => ({
                    savedPhone: details.phone ?? state.savedPhone,
                    savedLocation: details.location ?? state.savedLocation
                })),
        }),
        { name: 'sokosnap-preferences' }
    )
);
