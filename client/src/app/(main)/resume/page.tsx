'use client';

import { useEffect, useState } from 'react';
import { useResumeStore } from '@/features/resume/resumeStore';
import { aiApi } from '@/services/api';
import AIInsightPanel from '@/components/AIInsightPanel';
import {
  Upload,
  FileText,
  Trash2,
  Sparkles,
  Loader2,
  CheckCircle,
} from 'lucide-react';

interface ResumeAnalysis {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

interface ResumeInsightRecord {
  id: string;
  resume_id: string;
  analysis: ResumeAnalysis;
  created_at: string;
}

export default function ResumePage() {
  const { resumes, fetchResumes, uploadResume, updateParsedText, deleteResume, isLoading, error } =
    useResumeStore();

  const [file, setFile] = useState<File | null>(null);
  const [parsedText, setParsedText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // AI Analysis state
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  // Editing parsed text
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Past analyses history
  const [historyOpenId, setHistoryOpenId] = useState<string | null>(null);
  const [history, setHistory] = useState<ResumeInsightRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);
    await uploadResume(file, parsedText || undefined);
    setFile(null);
    setParsedText('');
    setUploading(false);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleAnalyze = async (resumeId: string) => {
    setAnalyzingId(resumeId);
    setAnalysis(null);
    setAnalyzeError(null);
    try {
      const res = await aiApi.analyzeResume(resumeId);
      setAnalysis(res.data.data);
      // If history for this resume is open, refresh it so the new run shows up
      if (historyOpenId === resumeId) {
        const historyRes = await aiApi.getResumeInsights(resumeId);
        setHistory(historyRes.data.data);
      }
    } catch {
      setAnalyzeError('Analysis failed. Ensure the resume has parsed text and your API key is set.');
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleSaveParsedText = async (id: string) => {
    await updateParsedText(id, editText);
    setEditingId(null);
    setEditText('');
  };

  const handleToggleHistory = async (resumeId: string) => {
    if (historyOpenId === resumeId) {
      setHistoryOpenId(null);
      return;
    }
    setHistoryOpenId(resumeId);
    setHistoryLoading(true);
    try {
      const res = await aiApi.getResumeInsights(resumeId);
      setHistory(res.data.data);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-medium text-[var(--text)]">
          Resume management
        </h1>
        <p className="text-sm text-[var(--text-dim)] mt-1">
          Upload and manage your resumes, get AI-powered feedback
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/25 text-[var(--danger-bright)] text-sm">
          {error}
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6">
        <h2 className="font-display text-lg font-medium text-[var(--text)] mb-4 flex items-center gap-2">
          <Upload size={20} className="text-[var(--sage-bright)]" />
          Upload resume
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">
          {/* File Drop Zone */}
          <label className="flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed border-[var(--border-hi)] bg-[var(--surface-2)] cursor-pointer hover:border-[var(--sage)]/50 hover:bg-[var(--sage)]/5 transition-all">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-[var(--sage-bright)]" />
                <span className="text-sm text-[var(--text)] font-medium">
                  {file.name}
                </span>
              </div>
            ) : (
              <div className="text-center">
                <Upload size={32} className="text-[var(--text-faint)] mx-auto mb-2" />
                <p className="text-sm text-[var(--text-dim)]">
                  Click to upload PDF or Word document
                </p>
                <p className="text-xs text-[var(--text-faint)] mt-1">Max 10MB</p>
              </div>
            )}
          </label>

          {/* Parsed Text */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-dim)] mb-1.5">
              Resume text (for AI analysis)
            </label>
            <textarea
              rows={5}
              value={parsedText}
              onChange={(e) => setParsedText(e.target.value)}
              placeholder="Paste your resume text here for AI analysis..."
              className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sage)]/40 resize-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--sage)] to-[#3f6e5f] text-[var(--bg)] font-semibold text-sm disabled:opacity-50 hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_10px_28px_-10px_rgba(91,140,123,0.5)]"
          >
            {uploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : uploadSuccess ? (
              <>
                <CheckCircle size={18} />
                Uploaded successfully!
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload resume
              </>
            )}
          </button>
        </form>
      </div>

      {/* Resumes List */}
      <div>
        <h2 className="font-display text-lg font-medium text-[var(--text)] mb-4">
          Your resumes
        </h2>

        {analyzeError && (
          <div className="mb-4 p-3 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/25 text-[var(--danger-bright)] text-sm">
            {analyzeError}
          </div>
        )}

        {isLoading && resumes.length === 0 ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-[var(--surface)] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-12 text-center">
            <FileText size={48} className="text-[var(--text-faint)] mx-auto mb-4" />
            <p className="text-[var(--text-dim)]">No resumes uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--sage)]/10 flex items-center justify-center">
                      <FileText size={20} className="text-[var(--sage-bright)]" />
                    </div>
                    <div>
                      <a
                        href={resume.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[var(--sage-bright)] hover:text-[var(--sage)] transition-colors"
                      >
                        View resume ↗
                      </a>
                      <p className="text-xs text-[var(--text-faint)]">
                        Uploaded {new Date(resume.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {resume.parsed_text ? (
                      <button
                        onClick={() => handleAnalyze(resume.id)}
                        disabled={analyzingId === resume.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--indigo)]/12 text-[var(--indigo-bright)] text-xs font-semibold hover:bg-[var(--indigo)]/20 disabled:opacity-50 transition-all"
                      >
                        {analyzingId === resume.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Sparkles size={14} />
                        )}
                        Analyze
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(resume.id);
                          setEditText(resume.parsed_text || '');
                        }}
                        className="text-xs text-[var(--text-faint)] hover:text-[var(--sage-bright)] transition-colors"
                      >
                        Add text for AI analysis
                      </button>
                    )}

                    <button
                      onClick={() => handleToggleHistory(resume.id)}
                      className="text-xs text-[var(--text-faint)] hover:text-[var(--indigo-bright)] transition-colors"
                    >
                      {historyOpenId === resume.id ? 'Hide history' : 'History'}
                    </button>

                    <button
                      onClick={() => deleteResume(resume.id)}
                      className="p-2 rounded-xl text-[var(--text-faint)] hover:text-[var(--danger-bright)] hover:bg-[var(--danger)]/10 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Edit parsed text */}
                {editingId === resume.id && (
                  <div className="mt-3 space-y-3 border-t border-[var(--border)] pt-3">
                    <textarea
                      rows={4}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      placeholder="Paste resume text here..."
                      className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sage)]/40 resize-none transition-all"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveParsedText(resume.id)}
                        className="px-4 py-2 rounded-xl bg-[var(--sage)] text-[var(--bg)] text-xs font-semibold hover:brightness-110 transition-colors"
                      >
                        Save text
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-xl bg-[var(--surface-2)] text-[var(--text-dim)] text-xs font-semibold hover:text-[var(--text)] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Past analyses */}
                {historyOpenId === resume.id && (
                  <div className="mt-3 border-t border-[var(--border)] pt-3 space-y-2">
                    {historyLoading ? (
                      <p className="text-xs text-[var(--text-faint)]">Loading history...</p>
                    ) : history.length === 0 ? (
                      <p className="text-xs text-[var(--text-faint)]">No past analyses yet.</p>
                    ) : (
                      history.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => setAnalysis(h.analysis)}
                          className="w-full text-left bg-[var(--surface-2)] rounded-xl p-3 text-xs hover:border-[var(--indigo)]/30 border border-transparent transition-all"
                        >
                          <p className="text-[var(--text-faint)] mb-1">
                            {new Date(h.created_at).toLocaleString()}
                          </p>
                          <p className="text-[var(--text-dim)]">
                            {h.analysis.strengths.length} strengths · {h.analysis.weaknesses.length}{' '}
                            areas to improve · {h.analysis.suggestions.length} suggestions
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Analysis Results */}
      {analysis && (
        <div>
          <h2 className="font-display text-lg font-medium text-[var(--text)] mb-4">
            Analysis results
          </h2>
          <AIInsightPanel analysis={analysis} />
        </div>
      )}
    </div>
  );
}