
import { create } from "zustand";

export const useAuthStore = create((set) => ({
    authName: "",
    updateAuthName: (newAuth) => set({ authName: newAuth }),
 
  }))

 