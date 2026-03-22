import { create } from 'zustand';
import { resumeApi } from '@/services/api';

interface Resume {
  id: string;
  user_id: string;
  file_url: string;
  parsed_text: string | null;
  created_at: string;
}

interface ResumeState {
  resumes: Resume[];
  isLoading: boolean;
  error: string | null;

  fetchResumes: () => Promise<void>;
  uploadResume: (file: File, parsedText?: string) => Promise<void>;
  updateParsedText: (id: string, text: string) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resumes: [],
  isLoading: false,
  error: null,

  fetchResumes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await resumeApi.getAll();
      set({ resumes: response.data.data, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch resumes', isLoading: false });
    }
  },

  uploadResume: async (file, parsedText) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (parsedText) formData.append('parsed_text', parsedText);
      await resumeApi.upload(formData);
      const response = await resumeApi.getAll();
      set({ resumes: response.data.data, isLoading: false });
    } catch {
      set({ error: 'Failed to upload resume', isLoading: false });
    }
  },

  updateParsedText: async (id, text) => {
    try {
      await resumeApi.updateParsedText(id, text);
      set((state) => ({
        resumes: state.resumes.map((r) =>
          r.id === id ? { ...r, parsed_text: text } : r
        ),
      }));
    } catch {
      set({ error: 'Failed to update parsed text' });
    }
  },

  deleteResume: async (id) => {
    set({ isLoading: true });
    try {
      await resumeApi.delete(id);
      set((state) => ({
        resumes: state.resumes.filter((r) => r.id !== id),
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to delete resume', isLoading: false });
    }
  },
}));
