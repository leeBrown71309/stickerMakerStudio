import { create } from "zustand";

interface stikerState {
  currentSticker: any;
  currentImage: any;
  setCurrentSticker: (sticker: any) => void;
  setCurrentImage: (image: any) => void;
}

export const useStikerStore = create<stikerState>()((set) => ({
  currentSticker: null,
  currentImage: null,
  setCurrentImage: (image: any) => {
    set({ currentImage: image });
  },
  setCurrentSticker: (sticker: any) => {
    set({ currentSticker: sticker });
  },
}));
