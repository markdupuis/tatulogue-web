'use client';

import { useMemo, useRef, useState } from 'react';
import type { RoadmapItem, RoadmapStatus, TeamMember } from '../../lib/admin/types';

const DAY_WIDTH = 36;
const LABEL_WIDTH = 180;
const ROW_HEIGHT = 44;
const BAR_HEIGHT = 28;
const WINDOW_DAYS = 42;
const LANE_PADDING = 8;
const BAR_TOP_PADDING = 6;
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

interface PackedBar {
  item: RoadmapItem;
  subRow: number;
}

interface Lane {
  key: string;
  name: string;
  items: RoadmapItem[];
  bars: PackedBar[];
  subRowCount: number;
}

// Greedy interval packing: sort by start date, place each bar on the first
// sub-row whose previous bar ends (due day, inclusive) before this bar starts.
function packLane(items: RoadmapItem[]): { bars: PackedBar[]; subRowCount: number } {
  const sorted = [...items].sort((a, b) => {
    const sa = a.start_date as string;
    const sb = b.start_date as string;
    if (sa !== sb) return sa < sb ? -1 : 1;
    return (a.due_date as string) < (b.due_date as string) ? -1 : 1;
  });

  const rowEnds: Date[] = [];
  const bars: PackedBar[] = [];

  for (const item of sorted) {
    const start = fromISO(item.start_date as string);
    const due = fromISO(item.due_date as string);
    let placed = -1;
    for (let row = 0; row < rowEnds.length; row += 1) {
      if (rowEnds[row] < start) {
        placed = row;
        break;
      }
    }
    if (placed === -1) {
      placed = rowEnds.length;
      rowEnds.push(due);
    } else {
      rowEnds[placed] = due;
    }
    bars.push({ item, subRow: placed });
  }

  return { bars, subRowCount: rowEnds.length };
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

  // Default window: Monday on/before the earliest scheduled start, else this week's Monday.
  const defaultWindowStart = useMemo(() => {
    if (scheduled.length === 0) return startOfWeek(todayUTC());
    let min = fromISO(scheduled[0].start_date as string);
    for (const it of scheduled) {
      const s = fromISO(it.start_date as string);
      if (s < min) min = s;
    }
    return startOfWeek(min);
  }, [scheduled]);

  const [windowStart, setWindowStart] = useState<Date>(defaultWindowStart);

  const windowEnd = useMemo(() => addDays(windowStart, WINDOW_DAYS - 1), [windowStart]);

  const days = useMemo(
    () => Array.from({ length: WINDOW_DAYS }, (_, i) => addDays(windowStart, i)),
    [windowStart]
  );

  // Month row as aligned segments: group visible days by calendar month so each
  // segment's width = (visible days in that month) * DAY_WIDTH.
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

  // Only bars overlapping the window belong to a lane; pack them into sub-rows.
  const lanes = useMemo<Lane[]>(() => {
    const overlapsWindow = (it: RoadmapItem) =>
      fromISO(it.start_date as string) <= windowEnd &&
      fromISO(it.due_date as string) >= windowStart;

    const build = (key: string, name: string, laneItems: RoadmapItem[]): Lane => {
      const { bars, subRowCount } = packLane(laneItems);
      return { key, name, items: laneItems, bars, subRowCount };
    };

    const result: Lane[] = team.map((member) =>
      build(
        member.user_id,
        member.name,
        scheduled.filter(
          (it) => it.assignees.includes(member.user_id) && overlapsWindow(it)
        )
      )
    );
    const unassigned = scheduled.filter(
      (it) => it.assignees.length === 0 && overlapsWindow(it)
    );
    if (unassigned.length > 0) {
      result.push(build(UNASSIGNED_LANE, 'Unassigned', unassigned));
    }
    return result;
  }, [team, scheduled, windowStart, windowEnd]);

  const today = todayUTC();
  const todayOffset = diffDays(today, windowStart);
  const showToday = todayOffset >= 0 && todayOffset < WINDOW_DAYS;
  const gridWidth = WINDOW_DAYS * DAY_WIDTH;

  const laneHeight = (lane: Lane) =>
    Math.max(lane.subRowCount, 1) * ROW_HEIGHT + LANE_PADDING;

  function shiftWindow(weeks: number) {
    setWindowStart((prev) => addDays(prev, weeks * 7));
  }

  function goToday() {
    setWindowStart(startOfWeek(todayUTC()));
  }

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

  const navButton =
    'rounded-lg border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white';

  return (
    <div className="space-y-6">
      {/* Calendar navigation toolbar */}
      <div className="flex items-center gap-2">
        <button type="button" className={navButton} onClick={() => shiftWindow(-1)}>
          ◀ Prev
        </button>
        <button type="button" className={navButton} onClick={goToday}>
          Today
        </button>
        <button type="button" className={navButton} onClick={() => shiftWindow(1)}>
          Next ▶
        </button>
        <span className="ml-2 text-xs text-white/35">
          {`${MONTH_NAMES[windowStart.getUTCMonth()]} ${windowStart.getUTCDate()}`} —{' '}
          {`${MONTH_NAMES[windowEnd.getUTCMonth()]} ${windowEnd.getUTCDate()}, ${windowEnd.getUTCFullYear()}`}
        </span>
      </div>

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
                    minHeight: laneHeight(lane),
                  }}
                >
                  {lane.name}
                  <span className="ml-2 text-xs text-white/30">{lane.items.length}</span>
                </div>

                <div
                  className="relative"
                  style={{
                    width: gridWidth,
                    minHeight: laneHeight(lane),
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

                  {lane.bars.map(({ item, subRow }) => {
                    const { start, due } = previewDates(item);
                    // Real (unclipped) bar geometry against the window.
                    const rawStartOffset = diffDays(start, windowStart);
                    const rawEndOffset = diffDays(due, windowStart) + 1;
                    // Clip to window edges so out-of-range tasks pin to a border.
                    const clippedStart = Math.max(0, rawStartOffset);
                    const clippedEnd = Math.min(WINDOW_DAYS, rawEndOffset);
                    const left = clippedStart * DAY_WIDTH;
                    const width = (clippedEnd - clippedStart) * DAY_WIDTH;
                    const clippedLeft = rawStartOffset < 0;
                    const clippedRight = rawEndOffset > WINDOW_DAYS;
                    const isDragging = drag?.itemId === item.id;
                    return (
                      <div
                        key={`${lane.key}-${item.id}`}
                        className={`group absolute flex items-center overflow-hidden border text-xs text-white shadow-sm ${
                          clippedLeft ? '' : 'rounded-l-lg'
                        } ${clippedRight ? '' : 'rounded-r-lg'} ${
                          STATUS_BAR[item.status]
                        } ${isDragging ? 'opacity-90 ring-1 ring-white/40' : ''}`}
                        style={{
                          left,
                          width,
                          height: BAR_HEIGHT,
                          top: subRow * ROW_HEIGHT + BAR_TOP_PADDING,
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
                        {/* Resize handle: start (hidden when the real start is clipped off-window) */}
                        {!clippedLeft && (
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
                        )}
                        <span className="relative z-[5] truncate px-2.5 font-medium">
                          {item.title}
                        </span>
                        {/* Resize handle: end (hidden when the real end is clipped off-window) */}
                        {!clippedRight && (
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
                        )}
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
