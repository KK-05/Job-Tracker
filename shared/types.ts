// Shared TypeScript types for the AI Job Application Tracker

// ─── Enums ──────────────────────────────────────────────
export const APPLICATION_STATUS = {
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
} as const;

export type ApplicationStatus = (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

// ─── Database Models ────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  role: string;
  status: ApplicationStatus;
  job_description: string;
  applied_date: string;
  created_at: string;
}

export interface Note {
  id: string;
  application_id: string;
  content: string;
  created_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  file_url: string;
  parsed_text: string;
  created_at: string;
}

export interface AIInsight {
  id: string;
  application_id: string;
  match_score: number;
  feedback: string;
  created_at: string;
}

// ─── API Responses ──────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ResumeAnalysis {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface JobMatchResult {
  match_score: number;
  missing_skills: string[];
  suggestions: string[];
}

// ─── Dashboard Analytics ────────────────────────────────
export interface AnalyticsData {
  total_applications: number;
  interview_count: number;
  offer_count: number;
  rejection_count: number;
  interview_rate: number;
  offer_rate: number;
  rejection_rate: number;
  applications_per_month: { month: string; count: number }[];
  status_distribution: { status: string; count: number }[];
}
