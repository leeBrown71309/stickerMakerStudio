import { create } from "zustand";

interface user {
  fullname: string;
  email: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface userState {
  user: user;
  localUser: any;
  setUser: (users: any) => void;
}

export const useUserStore = create<userState>()((set) => ({
  user: null!,
  localUser: null,
  setUser: (newUsers: any) => {
    set({ user: newUsers });
    localStorage.setItem("user", JSON.stringify(newUsers));
  },
}));
