'use client';

import { useMemo, useRef, useState } from 'react';
import type { RoadmapItem, RoadmapStatus, TeamMember } from '../../lib/admin/types';

const DAY_WIDTH = 36;
const LABEL_WIDTH = 180;
const ROW_HEIGHT = 44;
const BAR_HEIGHT = 28;
const RANGE_PAD_DAYS = 7;
const DEFAULT_RANGE_DAYS = 56;
const EDGE_HANDLE_WIDTH = 8;
const UNASSIGNED_LANE = '__unassigned__';

const STATUS_BAR: Record<RoadmapStatus, string> = {
  backlog: 'bg-white/[0.08] border-white/15',
  planned: 'bg-[linear-gradient(135deg,#2B5876,#4E4376)] border-white/10',
  in_progress: 'bg-[linear-gradient(135deg,#F12711,#F5AF19)] border-white/10',
  completed: 'bg-green-500/25 border-green-400/30',
};

const STATUS_FILL: Record<RoadmapStatus, string> = {
  backlog: 'bg-white/20',
  planned: 'bg-white/30',
  in_progress: 'bg-white/30',
  completed: 'bg-green-300/50',
};

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MS_PER_DAY = 86_400_000;

// Build a UTC date from a YYYY-MM-DD string without local-timezone drift.
function fromISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function toISODate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / MS_PER_DAY);
}

function todayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function startOfWeek(date: Date): Date {
  // Week starts Monday. getUTCDay: 0=Sun..6=Sat.
  const day = date.getUTCDay();
  const offset = (day + 6) % 7;
  return addDays(date, -offset);
}

function isScheduled(item: RoadmapItem): boolean {
  return Boolean(item.start_date && item.due_date);
}

interface DragState {
  itemId: string;
  mode: 'move' | 'resize-start' | 'resize-end';
  startX: number;
  origStart: Date;
  origDue: Date;
  deltaDays: number;
}

interface Lane {
  key: string;
  name: string;
  items: RoadmapItem[];
}

interface GanttTimelineProps {
  items: RoadmapItem[];
  team: TeamMember[];
  onEditItem: (item: RoadmapItem) => void;
  onItemDatesChange: (id: string, startISO: string, dueISO: string) => void;
}

export default function GanttTimeline({
  items,
  team,
  onEditItem,
  onItemDatesChange,
}: GanttTimelineProps) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scheduled = useMemo(() => items.filter(isScheduled), [items]);
  const unscheduled = useMemo(() => items.filter((it) => !isScheduled(it)), [items]);

  const { rangeStart, totalDays } = useMemo(() => {
    if (scheduled.length === 0) {
      const start = startOfWeek(todayUTC());
      return { rangeStart: start, totalDays: DEFAULT_RANGE_DAYS };
    }
    let min = fromISO(scheduled[0].start_date as string);
    let max = fromISO(scheduled[0].due_date as string);
    for (const it of scheduled) {
      const s = fromISO(it.start_date as string);
      const d = fromISO(it.due_date as string);
      if (s < min) min = s;
      if (d > max) max = d;
    }
    const start = addDays(min, -RANGE_PAD_DAYS);
    const end = addDays(max, RANGE_PAD_DAYS);
    return { rangeStart: start, totalDays: diffDays(end, start) + 1 };
  }, [scheduled]);

  const days = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => addDays(rangeStart, i)),
    [rangeStart, totalDays]
  );

  const monthSegments = useMemo(() => {
    const segments: { label: string; span: number }[] = [];
    for (const day of days) {
      const label = `${MONTH_NAMES[day.getUTCMonth()]} ${day.getUTCFullYear()}`;
      const last = segments[segments.length - 1];
      if (last && last.label === label) last.span += 1;
      else segments.push({ label, span: 1 });
    }
    return segments;
  }, [days]);

  const lanes = useMemo<Lane[]>(() => {
    const result: Lane[] = team.map((member) => ({
      key: member.user_id,
      name: member.name,
      items: scheduled.filter((it) => it.assignees.includes(member.user_id)),
    }));
    const unassigned = scheduled.filter((it) => it.assignees.length === 0);
    if (unassigned.length > 0) {
      result.push({ key: UNASSIGNED_LANE, name: 'Unassigned', items: unassigned });
    }
    return result;
  }, [team, scheduled]);

  const today = todayUTC();
  const todayOffset = diffDays(today, rangeStart);
  const showToday = todayOffset >= 0 && todayOffset < totalDays;
  const gridWidth = totalDays * DAY_WIDTH;

  function previewDates(item: RoadmapItem): { start: Date; due: Date } {
    const start = fromISO(item.start_date as string);
    const due = fromISO(item.due_date as string);
    if (!drag || drag.itemId !== item.id) return { start, due };

    const delta = drag.deltaDays;
    if (drag.mode === 'move') {
      return { start: addDays(start, delta), due: addDays(due, delta) };
    }
    if (drag.mode === 'resize-start') {
      const next = addDays(start, delta);
      return { start: next <= due ? next : due, due };
    }
    const next = addDays(due, delta);
    return { start, due: next >= start ? next : start };
  }

  function handlePointerDown(
    e: React.PointerEvent,
    item: RoadmapItem,
    mode: DragState['mode']
  ) {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({
      itemId: item.id,
      mode,
      startX: e.clientX,
      origStart: fromISO(item.start_date as string),
      origDue: fromISO(item.due_date as string),
      deltaDays: 0,
    });
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!drag) return;
    const deltaDays = Math.round((e.clientX - drag.startX) / DAY_WIDTH);
    if (deltaDays !== drag.deltaDays) {
      setDrag({ ...drag, deltaDays });
    }
  }

  function handlePointerUp(item: RoadmapItem) {
    if (!drag || drag.itemId !== item.id) {
      setDrag(null);
      return;
    }
    const { start, due } = previewDates(item);
    const startISO = toISODate(start);
    const dueISO = toISODate(due);
    setDrag(null);
    if (startISO !== item.start_date || dueISO !== item.due_date) {
      onItemDatesChange(item.id, startISO, dueISO);
    }
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-2xl border border-white/8 bg-white/[0.02]" ref={scrollRef}>
        <div style={{ width: LABEL_WIDTH + gridWidth }}>
          {/* Month header */}
          <div className="flex border-b border-white/8">
            <div
              className="sticky left-0 z-20 flex items-center bg-[#0a0a12] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/40"
              style={{ width: LABEL_WIDTH, minWidth: LABEL_WIDTH }}
            >
              Timeline
            </div>
            <div className="flex">
              {monthSegments.map((seg, i) => (
                <div
                  key={`${seg.label}-${i}`}
                  className="border-l border-white/8 py-2 text-xs font-medium text-white/60"
                  style={{ width: seg.span * DAY_WIDTH }}
                >
                  <span className="px-2">{seg.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Day header */}
          <div className="flex border-b border-white/8">
            <div
              className="sticky left-0 z-20 bg-[#0a0a12]"
              style={{ width: LABEL_WIDTH, minWidth: LABEL_WIDTH }}
            />
            <div className="flex">
              {days.map((day, i) => {
                const isWeekStart = day.getUTCDay() === 1;
                const isToday = i === todayOffset;
                return (
                  <div
                    key={i}
                    className={`flex flex-col items-center py-1 text-[10px] ${
                      isWeekStart ? 'border-l border-white/8' : ''
                    } ${isToday ? 'text-white' : 'text-white/35'}`}
                    style={{ width: DAY_WIDTH }}
                  >
                    <span className="uppercase">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'][day.getUTCDay()]}
                    </span>
                    <span className={isToday ? 'font-semibold' : ''}>{day.getUTCDate()}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lanes */}
          {lanes.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-white/30">
              No scheduled tasks. Add start and due dates to see them here.
            </p>
          ) : (
            lanes.map((lane) => (
              <div key={lane.key} className="flex border-b border-white/8 last:border-b-0">
                <div
                  className="sticky left-0 z-10 flex items-center bg-[#0a0a12] px-4 text-sm font-medium text-white/70"
                  style={{
                    width: LABEL_WIDTH,
                    minWidth: LABEL_WIDTH,
                    minHeight: Math.max(lane.items.length, 1) * ROW_HEIGHT + 8,
                  }}
                >
                  {lane.name}
                  <span className="ml-2 text-xs text-white/30">{lane.items.length}</span>
                </div>

                <div
                  className="relative"
                  style={{
                    width: gridWidth,
                    minHeight: Math.max(lane.items.length, 1) * ROW_HEIGHT + 8,
                  }}
                >
                  {/* Week gridlines */}
                  {days.map((day, i) =>
                    day.getUTCDay() === 1 ? (
                      <div
                        key={`g-${i}`}
                        className="absolute top-0 bottom-0 border-l border-white/[0.04]"
                        style={{ left: i * DAY_WIDTH }}
                      />
                    ) : null
                  )}

                  {showToday && (
                    <div
                      className="absolute top-0 bottom-0 z-0 w-px bg-[#F5AF19]/50"
                      style={{ left: todayOffset * DAY_WIDTH + DAY_WIDTH / 2 }}
                    />
                  )}

                  {lane.items.map((item, rowIdx) => {
                    const { start, due } = previewDates(item);
                    const left = diffDays(start, rangeStart) * DAY_WIDTH;
                    const width = (diffDays(due, start) + 1) * DAY_WIDTH;
                    const isDragging = drag?.itemId === item.id;
                    return (
                      <div
                        key={`${lane.key}-${item.id}`}
                        className={`group absolute flex items-center overflow-hidden rounded-lg border text-xs text-white shadow-sm ${
                          STATUS_BAR[item.status]
                        } ${isDragging ? 'opacity-90 ring-1 ring-white/40' : ''}`}
                        style={{
                          left,
                          width,
                          height: BAR_HEIGHT,
                          top: rowIdx * ROW_HEIGHT + 6,
                          cursor: 'grab',
                          touchAction: 'none',
                        }}
                        role="button"
                        tabIndex={0}
                        title={`${item.title} · ${toISODate(start)} → ${toISODate(due)}`}
                        onPointerDown={(e) => handlePointerDown(e, item, 'move')}
                        onPointerMove={handlePointerMove}
                        onPointerUp={() => handlePointerUp(item)}
                        onClick={() => {
                          if (drag?.deltaDays) return;
                          onEditItem(item);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onEditItem(item);
                          }
                        }}
                      >
                        {/* Progress fill */}
                        <div
                          className={`absolute inset-y-0 left-0 ${STATUS_FILL[item.status]}`}
                          style={{ width: `${Math.min(100, Math.max(0, item.progress))}%` }}
                          aria-hidden
                        />
                        {/* Resize handle: start */}
                        <span
                          className="absolute inset-y-0 left-0 z-10 cursor-ew-resize opacity-0 group-hover:opacity-100"
                          style={{ width: EDGE_HANDLE_WIDTH }}
                          onPointerDown={(e) => handlePointerDown(e, item, 'resize-start')}
                          onPointerMove={handlePointerMove}
                          onPointerUp={() => handlePointerUp(item)}
                          aria-hidden
                        >
                          <span className="absolute inset-y-1 left-1 w-0.5 rounded bg-white/60" />
                        </span>
                        <span className="relative z-[5] truncate px-2.5 font-medium">
                          {item.title}
                        </span>
                        {/* Resize handle: end */}
                        <span
                          className="absolute inset-y-0 right-0 z-10 cursor-ew-resize opacity-0 group-hover:opacity-100"
                          style={{ width: EDGE_HANDLE_WIDTH }}
                          onPointerDown={(e) => handlePointerDown(e, item, 'resize-end')}
                          onPointerMove={handlePointerMove}
                          onPointerUp={() => handlePointerUp(item)}
                          aria-hidden
                        >
                          <span className="absolute inset-y-1 right-1 w-0.5 rounded bg-white/60" />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Unscheduled tray */}
      {unscheduled.length > 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">
            Unscheduled — {unscheduled.length}
          </h3>
          <div className="flex flex-wrap gap-2">
            {unscheduled.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onEditItem(item)}
                className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/20 hover:text-white"
              >
                <span className="text-white/30">P{item.priority}</span>
                <span className="max-w-[16rem] truncate">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
