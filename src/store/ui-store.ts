import { create } from "zustand";
import type { TaskStatus } from "@/schemas/task";

type TaskFilters = {
  search: string;
  status: TaskStatus | "all";
  categoryId: string | "all";
};

type UiState = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  filters: TaskFilters;
  setSearch: (search: string) => void;
  setStatusFilter: (status: TaskFilters["status"]) => void;
  setCategoryFilter: (categoryId: TaskFilters["categoryId"]) => void;
  resetFilters: () => void;
};

const defaultFilters: TaskFilters = {
  search: "",
  status: "all",
  categoryId: "all",
};

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  filters: defaultFilters,
  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  setStatusFilter: (status) => set((state) => ({ filters: { ...state.filters, status } })),
  setCategoryFilter: (categoryId) => set((state) => ({ filters: { ...state.filters, categoryId } })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
