import { create } from "zustand";

export type collection = {
  id: string;
  name: string;
  tag: string;
  userId: string;
  stickers: any[];
  user: any;
  createdAt: Date;
  updatedAt: Date;
};

interface collectionState {
  currentCollection: collection;
  collectionList: collection[];
  refreshCollections: boolean;
  setCurrentCollection: (collection: any) => void;
  setCollections: (collection: any) => void;
  refreshCollectionsList: (refresh: boolean) => void;
}

export const useCollectionStore = create<collectionState>()((set) => ({
  currentCollection: null!,
  collectionList: [],
  refreshCollections: false,
  setCurrentCollection: (collection: collection) => {
    set({ currentCollection: collection });
    localStorage.setItem("collectionId", JSON.stringify(collection.id));
  },
  setCollections: (collections: collection[]) => {
    set({ collectionList: collections });
  },
  refreshCollectionsList: (refresh: boolean) => {
    set({ refreshCollections: refresh });
  },
}));
