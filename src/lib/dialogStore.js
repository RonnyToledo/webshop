import { create } from "zustand";

export const useDialogStore = create((set) => ({
  open: false,
  toggleDialog: () => set((state) => ({ open: !state.open })),
}));
