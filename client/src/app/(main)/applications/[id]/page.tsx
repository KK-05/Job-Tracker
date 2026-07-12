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
  const [aiError, setAiError] = useState<string | null>(null);
  const [matchHistory, setMatchHistory] = useState<{ id: string; match_score: number; created_at: string }[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
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

  async function handleDeleteNote(noteId: string) {
    try {
      await noteApi.delete(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
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
    setAiError(null);
    try {
      const res = await aiApi.jobMatch(selectedResume, id);
      setMatchResult(res.data.data);
      if (historyOpen) {
        const historyRes = await aiApi.getJobInsights(id);
        setMatchHistory(historyRes.data.data);
      }
    } catch {
      setAiError('AI analysis failed. Please check your API key and try again.');
    } finally {
      setAiLoading(false);
    }
  }

  async function toggleHistory() {
    if (historyOpen) {
      setHistoryOpen(false);
      return;
    }
    setHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const res = await aiApi.getJobInsights(id);
      setMatchHistory(res.data.data);
    } catch {
      setMatchHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }

  if (!currentApplication) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[var(--sage)]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push('/applications')}
        className="flex items-center gap-2 text-sm text-[var(--text-dim)] hover:text-[var(--sage-bright)] transition-colors"
      >
        <ArrowLeft size={16} />
        Back to applications
      </button>

      {/* Main Card */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center">
              <Building2 size={28} className="text-[var(--sage-bright)]" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-medium text-[var(--text)]">
                {currentApplication.company_name}
              </h1>
              <p className="text-[var(--text-dim)]">
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
                  className="px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  className="p-2 rounded-xl bg-[var(--sage)] text-[var(--bg)] hover:brightness-110"
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
                  className="p-2 rounded-xl text-[var(--text-dim)] hover:text-[var(--sage-bright)] hover:bg-[var(--surface-2)] transition-all"
                >
                  <Edit3 size={16} />
                </button>
              </>
            )}

            <button
              onClick={handleDelete}
              className="p-2 rounded-xl text-[var(--text-dim)] hover:text-[var(--danger-bright)] hover:bg-[var(--danger)]/10 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center gap-4 text-sm text-[var(--text-dim)] mb-6">
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
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-2">
              Job description
            </h3>
            <div className="bg-[var(--surface-2)] rounded-xl p-4 text-sm text-[var(--text-dim)] whitespace-pre-wrap max-h-48 overflow-y-auto">
              {currentApplication.job_description}
            </div>
          </div>
        )}
      </div>

      {/* AI Job Match Section */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6">
        <h3 className="flex items-center gap-2 font-display text-lg font-medium text-[var(--text)] mb-4">
          <Sparkles size={20} className="text-[var(--indigo-bright)]" />
          AI job match
        </h3>

        <div className="flex items-end gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--text-dim)] mb-1.5">
              Select resume
            </label>
            <select
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--sage)]/40"
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
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--indigo)] to-[var(--sage)] text-[var(--bg)] text-sm font-semibold disabled:opacity-50 hover:brightness-110 transition-all flex items-center gap-2"
          >
            {aiLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            Analyze
          </button>
        </div>

        {aiError && (
          <div className="mb-4 p-3 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/25 text-[var(--danger-bright)] text-sm">
            {aiError}
          </div>
        )}

        <AIInsightPanel
          matchScore={matchResult?.match_score}
          missing_skills={matchResult?.missing_skills}
          analysis={matchResult ? { suggestions: matchResult.suggestions } : undefined}
          isLoading={aiLoading}
        />

        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <button
            onClick={toggleHistory}
            className="text-xs text-[var(--indigo-bright)] hover:text-[var(--indigo)] transition-colors"
          >
            {historyOpen ? 'Hide past matches' : 'View past matches'}
          </button>
          {historyOpen && (
            <div className="mt-3 space-y-2">
              {historyLoading ? (
                <p className="text-xs text-[var(--text-faint)]">Loading...</p>
              ) : matchHistory.length === 0 ? (
                <p className="text-xs text-[var(--text-faint)]">No past matches yet.</p>
              ) : (
                matchHistory.map((m) => (
                  <div
                    key={m.id}
                    className="bg-[var(--surface-2)] rounded-xl p-3 text-xs text-[var(--text-dim)] flex items-center justify-between"
                  >
                    <span>{new Date(m.created_at).toLocaleString()}</span>
                    <span className="font-semibold text-[var(--sage-bright)]">
                      {m.match_score}% match
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6">
        <h3 className="font-display text-lg font-medium text-[var(--text)] mb-4">
          Notes
        </h3>

        <form onSubmit={handleAddNote} className="flex gap-3 mb-4">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--sage)]/40 transition-all"
          />
          <button
            type="submit"
            className="px-4 py-3 rounded-xl bg-[var(--sage)] text-[var(--bg)] hover:brightness-110 transition-all"
          >
            <Send size={16} />
          </button>
        </form>

        <div className="space-y-3">
          {notes.length === 0 ? (
            <p className="text-sm text-[var(--text-faint)] text-center py-4">
              No notes yet. Add your first note above.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="group bg-[var(--surface-2)] rounded-xl p-4 border border-[var(--border)] relative"
              >
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="absolute top-3 right-3 p-1 rounded-lg text-[var(--text-faint)] hover:text-[var(--danger-bright)] hover:bg-[var(--danger)]/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={14} />
                </button>
                <p className="text-sm text-[var(--text-dim)]">
                  {note.content}
                </p>
                <p className="text-xs text-[var(--text-faint)] mt-2">
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
