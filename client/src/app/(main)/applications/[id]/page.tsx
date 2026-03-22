'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApplicationStore } from '@/features/applications/applicationStore';
import { noteApi, aiApi } from '@/services/api';
import { useResumeStore } from '@/features/resume/resumeStore';
import StatusBadge from '@/components/StatusBadge';
import AIInsightPanel from '@/components/AIInsightPanel';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Trash2,
  Edit3,
  Save,
  Send,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface Note {
  id: string;
  content: string;
  created_at: string;
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { currentApplication, fetchApplication, updateApplication, deleteApplication } =
    useApplicationStore();
  const { resumes, fetchResumes } = useResumeStore();

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editing, setEditing] = useState(false);
  const [editStatus, setEditStatus] = useState('');

  // AI state
  const [selectedResume, setSelectedResume] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    match_score: number;
    missing_skills: string[];
    suggestions: string[];
  } | null>(null);

  useEffect(() => {
    fetchApplication(id);
    fetchResumes();
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadNotes() {
    try {
      const res = await noteApi.getByApplication(id);
      setNotes(res.data.data);
    } catch {
      /* ignore */
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      await noteApi.create({ application_id: id, content: newNote });
      setNewNote('');
      loadNotes();
    } catch {
      /* ignore */
    }
  }

  async function handleStatusUpdate() {
    if (!editStatus) return;
    await updateApplication(id, { status: editStatus as 'Applied' | 'Interview' | 'Offer' | 'Rejected' });
    setEditing(false);
  }

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this application?')) {
      await deleteApplication(id);
      router.push('/applications');
    }
  }

  async function handleJobMatch() {
    if (!selectedResume) return;
    setAiLoading(true);
    setMatchResult(null);
    try {
      const res = await aiApi.jobMatch(selectedResume, id);
      setMatchResult(res.data.data);
    } catch {
      alert('AI analysis failed. Please check your API key.');
    } finally {
      setAiLoading(false);
    }
  }

  if (!currentApplication) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push('/applications')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-500 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Applications
      </button>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
              <Building2 size={28} className="text-violet-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                {currentApplication.company_name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                {currentApplication.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {editing ? (
              <div className="flex items-center gap-2">
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  className="p-2 rounded-xl bg-violet-500 text-white hover:bg-violet-600"
                >
                  <Save size={16} />
                </button>
              </div>
            ) : (
              <>
                <StatusBadge status={currentApplication.status as 'Applied' | 'Interview' | 'Offer' | 'Rejected'} />
                <button
                  onClick={() => {
                    setEditing(true);
                    setEditStatus(currentApplication.status);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-violet-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  <Edit3 size={16} />
                </button>
              </>
            )}

            <button
              onClick={handleDelete}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            Applied:{' '}
            {new Date(currentApplication.applied_date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>

        {/* Job Description */}
        {currentApplication.job_description && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Job Description
            </h3>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {currentApplication.job_description}
            </div>
          </div>
        )}
      </div>

      {/* AI Job Match Section */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-white mb-4">
          <Sparkles size={20} className="text-violet-500" />
          AI Job Match
        </h3>

        <div className="flex items-end gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Select Resume
            </label>
            <select
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            >
              <option value="">Choose a resume...</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  Resume uploaded {new Date(r.created_at).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleJobMatch}
            disabled={!selectedResume || aiLoading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold disabled:opacity-50 hover:from-violet-500 hover:to-cyan-500 transition-all flex items-center gap-2"
          >
            {aiLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            Analyze
          </button>
        </div>

        <AIInsightPanel
          matchScore={matchResult?.match_score}
          missing_skills={matchResult?.missing_skills}
          analysis={matchResult ? { suggestions: matchResult.suggestions } : undefined}
          isLoading={aiLoading}
        />
      </div>

      {/* Notes Section */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          Notes
        </h3>

        <form onSubmit={handleAddNote} className="flex gap-3 mb-4">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
          />
          <button
            type="submit"
            className="px-4 py-3 rounded-xl bg-violet-500 text-white hover:bg-violet-600 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>

        <div className="space-y-3">
          {notes.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              No notes yet. Add your first note above.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50"
              >
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {note.content}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(note.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
