import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { MetadataFormData, VideoEntry } from '../types';

type VideoState = {
  entries: VideoEntry[];
  addVideo: (entry: VideoEntry) => void;
  updateVideo: (id: string, data: Partial<MetadataFormData>) => void;
  removeVideo: (id: string) => void;
  setEntries: (entries: VideoEntry[]) => void;
};

const storage = createJSONStorage(() => {
  try {
    if (typeof window !== 'undefined' && (window as any)?.localStorage) return window.localStorage as unknown as Storage;
  } catch {}
  return AsyncStorage as unknown as Storage;
});

export const useVideoStore = create<VideoState>()(
  persist(
    (set, get) => ({
      entries: [],
      addVideo: (entry) => set({ entries: [entry, ...get().entries] }),
      updateVideo: (id, data) => set({
        entries: get().entries.map((e) => (e.id === id ? { ...e, ...data } : e)),
      }),
      removeVideo: (id) => set({ entries: get().entries.filter((e) => e.id !== id) }),
      setEntries: (entries) => set({ entries }),
    }),
    {
      name: 'videoEntries',
      storage
    }
  )
);

