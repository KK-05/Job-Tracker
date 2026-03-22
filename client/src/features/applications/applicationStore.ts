import { create } from 'zustand';
import { applicationApi } from '@/services/api';

interface Application {
  id: string;
  user_id: string;
  company_name: string;
  role: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  job_description: string;
  applied_date: string;
  created_at: string;
}

interface ApplicationState {
  applications: Application[];
  currentApplication: Application | null;
  isLoading: boolean;
  error: string | null;

  fetchApplications: (params?: Record<string, string>) => Promise<void>;
  fetchApplication: (id: string) => Promise<void>;
  createApplication: (data: Partial<Application>) => Promise<void>;
  updateApplication: (id: string, data: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: [],
  currentApplication: null,
  isLoading: false,
  error: null,

  fetchApplications: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await applicationApi.getAll(params);
      set({ applications: response.data.data, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch applications', isLoading: false });
    }
  },

  fetchApplication: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await applicationApi.getById(id);
      set({ currentApplication: response.data.data, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch application', isLoading: false });
    }
  },

  createApplication: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await applicationApi.create(data as {
        company_name: string;
        role: string;
        status?: string;
        job_description?: string;
        applied_date?: string;
      });
      const response = await applicationApi.getAll();
      set({ applications: response.data.data, isLoading: false });
    } catch {
      set({ error: 'Failed to create application', isLoading: false });
    }
  },

  updateApplication: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await applicationApi.update(id, data);
      set((state) => ({
        applications: state.applications.map((a) =>
          a.id === id ? response.data.data : a
        ),
        currentApplication: response.data.data,
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to update application', isLoading: false });
    }
  },

  deleteApplication: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await applicationApi.delete(id);
      set((state) => ({
        applications: state.applications.filter((a) => a.id !== id),
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to delete application', isLoading: false });
    }
  },
}));
