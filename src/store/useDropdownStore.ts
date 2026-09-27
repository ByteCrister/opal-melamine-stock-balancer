import { create } from "zustand";
import { DropdownType } from "@/types/dropdown.types";

interface DropdownStoreState {
  activeTab: DropdownType;
  setActiveTab: (tab: DropdownType) => void;
}

/**
 * Zustand store for Dropdown UI state management.
 * (Data caching and fetching is handled by Tanstack Query)
 */
export const useDropdownStore = create<DropdownStoreState>((set) => ({
  activeTab: "classes",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
