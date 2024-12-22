import { create } from 'zustand';

interface SidebarState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useSidebarStore =
  create<SidebarState>((set) => ({
    isSidebarCollapsed: true,
    toggleSidebar: () =>
      set((state) => ({
        isSidebarCollapsed:
          !state.isSidebarCollapsed,
      })),
  }));
