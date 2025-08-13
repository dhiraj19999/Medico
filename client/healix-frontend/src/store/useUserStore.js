import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null,
  loadingUser: true,  // loading flag add kiya
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),
  setLoadingUser: (value) => set({ loadingUser: value }), // loading setter
}));

export default useUserStore;
