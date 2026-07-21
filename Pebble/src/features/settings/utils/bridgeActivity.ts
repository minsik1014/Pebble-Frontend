import type { BridgeColorPalette } from '../constants/bridgeColorPalettes';

export type BridgeIntensityLevel = 'empty' | 'level1' | 'level2' | 'level3';

export interface DailyBridgeActivity {
  date: string;
  completedTaskCount: number;
}

export const BRIDGE_ACTIVITY_POLICY = {
  dayStartHour: 0,
  dayEndHour: 23,
  dayEndMinute: 59,
  visibleDays: 7,
  retentionMonths: 12,
} as const;

export const MOCK_RECENT_BRIDGE_ACTIVITIES: DailyBridgeActivity[] = [
  { date: '2026-07-21', completedTaskCount: 1 },
  { date: '2026-07-20', completedTaskCount: 2 },
  { date: '2026-07-19', completedTaskCount: 4 },
  { date: '2026-07-18', completedTaskCount: 0 },
  { date: '2026-07-17', completedTaskCount: 5 },
  { date: '2026-07-16', completedTaskCount: 3 },
  { date: '2026-07-15', completedTaskCount: 0 },
];

export function getBridgeIntensityLevel(
  completedTaskCount: number,
): BridgeIntensityLevel {
  if (completedTaskCount <= 0) return 'empty';
  if (completedTaskCount <= 2) return 'level1';
  if (completedTaskCount <= 4) return 'level2';
  return 'level3';
}

export function getBridgeColorByCompletedTaskCount({
  completedTaskCount,
  palette,
}: {
  completedTaskCount: number;
  palette: BridgeColorPalette;
}) {
  const level = getBridgeIntensityLevel(completedTaskCount);
  return palette.colors[level];
}

export function getRecentSevenDayBridgeColors({
  activities,
  palette,
}: {
  activities: DailyBridgeActivity[];
  palette: BridgeColorPalette;
}) {
  return activities
    .slice(0, BRIDGE_ACTIVITY_POLICY.visibleDays)
    .map((activity) =>
      getBridgeColorByCompletedTaskCount({
        completedTaskCount: activity.completedTaskCount,
        palette,
      }),
    );
}