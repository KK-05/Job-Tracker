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

export default function ResumePage() {
  const { resumes, fetchResumes, uploadResume, updateParsedText, deleteResume, isLoading } =
    useResumeStore();

  const [file, setFile] = useState<File | null>(null);
  const [parsedText, setParsedText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // AI Analysis state
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  } | null>(null);

  // Editing parsed text
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

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
    try {
      const res = await aiApi.analyzeResume(resumeId);
      setAnalysis(res.data.data);
    } catch {
      alert('Analysis failed. Ensure the resume has parsed text and your API key is set.');
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleSaveParsedText = async (id: string) => {
    await updateParsedText(id, editText);
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Resume Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload and manage your resumes, get AI-powered feedback
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Upload size={20} className="text-violet-500" />
          Upload Resume
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">
          {/* File Drop Zone */}
          <label className="flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:border-violet-500/50 hover:bg-violet-50/50 dark:hover:bg-violet-500/5 transition-all">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-violet-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  {file.name}
                </span>
              </div>
            ) : (
              <div className="text-center">
                <Upload size={32} className="text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Click to upload PDF or Word document
                </p>
                <p className="text-xs text-slate-400 mt-1">Max 10MB</p>
              </div>
            )}
          </label>

          {/* Parsed Text */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
              Resume Text (for AI analysis)
            </label>
            <textarea
              rows={5}
              value={parsedText}
              onChange={(e) => setParsedText(e.target.value)}
              placeholder="Paste your resume text here for AI analysis..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-sm disabled:opacity-50 hover:from-violet-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
          >
            {uploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : uploadSuccess ? (
              <>
                <CheckCircle size={18} />
                Uploaded Successfully!
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Resume
              </>
            )}
          </button>
        </form>
      </div>

      {/* Resumes List */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          Your Resumes
        </h2>

        {isLoading && resumes.length === 0 ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-slate-800/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-12 text-center">
            <FileText size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No resumes uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                      <FileText size={20} className="text-violet-500" />
                    </div>
                    <div>
                      <a
                        href={resume.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-violet-500 hover:text-violet-400 transition-colors"
                      >
                        View Resume ↗
                      </a>
                      <p className="text-xs text-slate-400">
                        Uploaded {new Date(resume.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {resume.parsed_text ? (
                      <button
                        onClick={() => handleAnalyze(resume.id)}
                        disabled={analyzingId === resume.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500/10 text-violet-500 text-xs font-semibold hover:bg-violet-500/20 disabled:opacity-50 transition-all"
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
                        className="text-xs text-slate-400 hover:text-violet-500 transition-colors"
                      >
                        Add text for AI analysis
                      </button>
                    )}

                    <button
                      onClick={() => deleteResume(resume.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Edit parsed text */}
                {editingId === resume.id && (
                  <div className="mt-3 space-y-3 border-t border-slate-200 dark:border-slate-700 pt-3">
                    <textarea
                      rows={4}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      placeholder="Paste resume text here..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none transition-all"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveParsedText(resume.id)}
                        className="px-4 py-2 rounded-xl bg-violet-500 text-white text-xs font-semibold hover:bg-violet-600 transition-colors"
                      >
                        Save Text
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
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
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Analysis Results
          </h2>
          <AIInsightPanel analysis={analysis} />
        </div>
      )}
    </div>
  );
}
