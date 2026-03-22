import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────
export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// ─── Applications ───────────────────────────────────────
export const applicationApi = {
  create: (data: {
    company_name: string;
    role: string;
    status?: string;
    job_description?: string;
    applied_date?: string;
  }) => api.post('/applications', data),
  getAll: (params?: Record<string, string>) =>
    api.get('/applications', { params }),
  getById: (id: string) => api.get(`/applications/${id}`),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/applications/${id}`, data),
  delete: (id: string) => api.delete(`/applications/${id}`),
  getAnalytics: () => api.get('/applications/analytics/summary'),
};

// ─── Notes ──────────────────────────────────────────────
export const noteApi = {
  create: (data: { application_id: string; content: string }) =>
    api.post('/notes', data),
  getByApplication: (applicationId: string) =>
    api.get(`/notes/${applicationId}`),
};

// ─── Resume ─────────────────────────────────────────────
export const resumeApi = {
  upload: (formData: FormData) =>
    api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: () => api.get('/resume'),
  updateParsedText: (id: string, parsed_text: string) =>
    api.put(`/resume/${id}/parsed-text`, { parsed_text }),
  delete: (id: string) => api.delete(`/resume/${id}`),
};

// ─── AI ─────────────────────────────────────────────────
export const aiApi = {
  analyzeResume: (resume_id: string) =>
    api.post('/ai/analyze-resume', { resume_id }),
  jobMatch: (resume_id: string, application_id: string) =>
    api.post('/ai/job-match', { resume_id, application_id }),
};

export default api;
