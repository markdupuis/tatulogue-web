'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminShell from '../../../components/admin/AdminShell';
import GanttTimeline from '../../../components/admin/GanttTimeline';
import TaskEditorModal from '../../../components/admin/TaskEditorModal';
import {
  deleteRoadmapItem,
  fetchRoadmap,
  fetchTeamMembers,
  updateRoadmapItem,
} from '../../../lib/admin/queries';
import type { RoadmapItem, RoadmapStatus, TeamMember } from '../../../lib/admin/types';

type ViewMode = 'timeline' | 'board';

const STATUS_LABELS: Record<RoadmapStatus, string> = {
  backlog: 'Backlog',
  planned: 'Planned',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const COLUMN_ORDER: RoadmapStatus[] = ['backlog', 'planned', 'in_progress', 'completed'];

const COLUMN_TINT: Record<RoadmapStatus, string> = {
  backlog: 'bg-white/[0.01]',
  planned: 'bg-[#2B5876]/8',
  in_progress: 'bg-[#F12711]/6',
  completed: 'bg-green-400/5',
};

const STATUS_DOT: Record<RoadmapStatus, string> = {
  backlog: 'bg-white/40',
  planned: 'bg-[#4E4376]',
  in_progress: 'bg-[#F5AF19]',
  completed: 'bg-green-400',
};

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#2B5876,#4E4376)',
  'linear-gradient(135deg,#F12711,#F5AF19)',
  'linear-gradient(135deg,#4E4376,#F12711)',
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDueDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

interface AssigneeStackProps {
  assignees: string[];
  team: TeamMember[];
}

function AssigneeStack({ assignees, team }: AssigneeStackProps) {
  if (assignees.length === 0) return null;
  return (
    <div className="flex -space-x-1.5">
      {assignees.map((userId) => {
        const idx = team.findIndex((m) => m.user_id === userId);
        if (idx === -1) return null;
        const member = team[idx];
        return (
          <span
            key={userId}
            title={member.name}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-[#07070d] text-[10px] font-semibold text-white"
            style={{ background: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length] }}
          >
            {initials(member.name)}
          </span>
        );
      })}
    </div>
  );
}

interface BoardCardProps {
  item: RoadmapItem;
  team: TeamMember[];
  onEdit: (item: RoadmapItem) => void;
  onDelete: (id: string) => void;
}

function BoardCard({ item, team, onEdit, onDelete }: BoardCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onEdit(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onEdit(item);
      }}
      className="cursor-pointer rounded-xl border border-white/8 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">{item.title}</h3>
        <span className="flex-shrink-0 rounded-full border border-white/8 px-2 py-0.5 text-xs text-white/50">
          P{item.priority}
        </span>
      </div>

      {item.category && (
        <div className="mt-2">
          <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-xs text-white/50">
            {item.category}
          </span>
        </div>
      )}

      {(item.assignees.length > 0 || item.due_date) && (
        <div className="mt-3 flex items-center justify-between gap-2">
          <AssigneeStack assignees={item.assignees} team={team} />
          {item.due_date && (
            <span className="text-xs text-white/40">{formatDueDate(item.due_date)}</span>
          )}
        </div>
      )}

      {item.progress > 0 && (
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-[linear-gradient(135deg,#F12711,#F5AF19)]"
            style={{ width: `${Math.min(100, item.progress)}%` }}
          />
        </div>
      )}

      <div className="mt-3 flex items-center justify-end">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="text-xs text-white/30 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('timeline');
  const [editing, setEditing] = useState<RoadmapItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([fetchRoadmap(), fetchTeamMembers()]).then(([roadmap, members]) => {
      if (!active) return;
      setItems(roadmap);
      setTeam(members);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const isModalOpen = isCreating || editing !== null;

  function openCreate() {
    setEditing(null);
    setIsCreating(true);
  }

  function openEdit(item: RoadmapItem) {
    setIsCreating(false);
    setEditing(item);
  }

  function closeModal() {
    setIsCreating(false);
    setEditing(null);
  }

  function handleSaved(saved: RoadmapItem) {
    setItems((prev) => {
      const exists = prev.some((it) => it.id === saved.id);
      return exists ? prev.map((it) => (it.id === saved.id ? saved : it)) : [saved, ...prev];
    });
    closeModal();
  }

  function handleDeleted(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
    closeModal();
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this task?')) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    await deleteRoadmapItem(id);
  }

  async function handleDatesChange(id: string, startISO: string, dueISO: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, start_date: startISO, due_date: dueISO } : it))
    );
    await updateRoadmapItem(id, { start_date: startISO, due_date: dueISO });
  }

  const columns = useMemo(() => {
    return COLUMN_ORDER.map((status) => ({
      status,
      items: items
        .filter((it) => it.status === status)
        .sort((a, b) => a.priority - b.priority),
    }));
  }, [items]);

  return (
    <AdminShell active="roadmap" title="Roadmap">
      {loading ? (
        <p className="text-white/40">Loading…</p>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="inline-flex rounded-xl border border-white/8 bg-white/[0.02] p-1">
              {(['timeline', 'board'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setView(mode)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                    view === mode
                      ? 'bg-[linear-gradient(135deg,#2B5876,#4E4376)] text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="rounded-xl bg-[linear-gradient(135deg,#2B5876,#4E4376)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              + New task
            </button>
          </div>

          {view === 'timeline' ? (
            <GanttTimeline
              items={items}
              team={team}
              onEditItem={openEdit}
              onItemDatesChange={handleDatesChange}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {columns.map(({ status, items: columnItems }) => (
                <div
                  key={status}
                  className={`rounded-2xl border border-white/8 p-3 ${COLUMN_TINT[status]}`}
                >
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
                      <h2 className="text-sm font-semibold text-white">
                        {STATUS_LABELS[status]}
                      </h2>
                    </div>
                    <span className="text-xs text-white/40">{columnItems.length}</span>
                  </div>
                  <div className="space-y-3">
                    {columnItems.length === 0 ? (
                      <p className="px-1 py-6 text-center text-xs text-white/25">Empty</p>
                    ) : (
                      columnItems.map((item) => (
                        <BoardCard
                          key={item.id}
                          item={item}
                          team={team}
                          onEdit={openEdit}
                          onDelete={handleDelete}
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {isModalOpen && (
            <TaskEditorModal
              item={editing}
              team={team}
              onClose={closeModal}
              onSaved={handleSaved}
              onDeleted={handleDeleted}
            />
          )}
        </>
      )}
    </AdminShell>
  );
}
