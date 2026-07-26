import type { MonthlyReportResponse } from '../types/report';
import profile2 from '@/assets/profiles/profile2.png';
import profile3 from '@/assets/profiles/profile3.png';
import profile4 from '@/assets/profiles/profile4.png';

/**
 * 개발/스토리북용 목 데이터.
 * Figma 시안(R003~R007)에 찍혀 있는 값과 동일하게 맞춰두었습니다.
 * API 연동이 끝나면 이 파일은 지워도 됩니다.
 */
export const monthlyReportMock: MonthlyReportResponse = {
  reportYear: 2026,
  reportMonth: 6,

  monthlyPebbleCount: 64,
  recentMonths: [
    { year: 2026, month: 4, count: 46 },
    { year: 2026, month: 5, count: 36 },
    { year: 2026, month: 6, count: 64 },
  ],
  totalPebbleCount: 256,
  recordStartDate: '2025-12-24',
  recordEndDate: '2026-06-30',

  busiestCategory: {
    name: '학교',
    colorHex: '#00CEF5',
    milestoneCount: 5,
    taskCount: 23,
    milestones: [
      {
        id: 'm1',
        name: '중간고사',
        featured: true,
        remainingTaskCount: 6,
        tasks: [
          { id: 't1', name: '태스크 이름', completed: true },
          { id: 't2', name: '태스크 이름 이름', completed: true },
        ],
      },
      { id: 'm2', name: '동아리', featured: false, remainingTaskCount: 0, tasks: [] },
      { id: 'm3', name: '팀플', featured: false, remainingTaskCount: 0, tasks: [] },
      {
        id: 'm4',
        name: '축제',
        featured: true,
        remainingTaskCount: 4,
        tasks: [
          { id: 't3', name: '태스크 이름', completed: true },
          { id: 't4', name: '태스크 이름 이름', completed: false },
        ],
      },
      {
        id: 'm5',
        name: '기말고사',
        featured: true,
        remainingTaskCount: 7,
        tasks: [
          { id: 't5', name: '태스크 이름', completed: true },
          { id: 't6', name: '태스크 이름 이름', completed: true },
        ],
      },
    ],
  },

  busiestDay: {
    date: '2026-06-08',
    schedules: [
      {
        id: 's1',
        kind: 'task',
        breadcrumb: 'EXPO - 계획서 제출',
        name: 'EXPO 계획서 작성하기',
        completed: false,
        colorHex: null,
      },
      {
        id: 's2',
        kind: 'milestone',
        breadcrumb: '창업 공모전',
        name: '백엔드 프로젝트',
        completed: true,
        colorHex: '#FFC0C3',
      },
      {
        id: 's3',
        kind: 'task',
        breadcrumb: '창업 공모전 - 백엔드 프로젝트',
        name: 'MVP 페이지 구현',
        completed: true,
        colorHex: null,
      },
    ],
  },

  sharedFriends: {
    sharedCategoryCount: 2,
    friends: [
      { id: 'u1', categoryName: '창업 공모전', nickname: '담검이', avatarUrl: profile2 },
      { id: 'u2', categoryName: '창업 공모전', nickname: '조로', avatarUrl: profile3 },
      { id: 'u3', categoryName: '다른 공유 카테고리', nickname: '돼병이', avatarUrl: profile4 },
    ],
  },
};

/**
 * 요청 실패 확인용.
 * 현재 연월 + 0 으로 그려지고 "불러오지 못했어요" 안내가 뜹니다.
 */
export const monthlyReportFailureMock = undefined;

/**
 * 기록 0건인 정상 응답 확인용.
 * 경고 없이 각 섹션에 빈 상태 문구만 뜹니다.
 */
export const monthlyReportEmptyMock = {
  reportYear: 2026,
  reportMonth: 6,
  monthlyPebbleCount: 0,
  recentMonths: [
    { year: 2026, month: 4, count: 0 },
    { year: 2026, month: 5, count: 0 },
    { year: 2026, month: 6, count: 0 },
  ],
  totalPebbleCount: 0,
  recordStartDate: '2026-06-01',
  recordEndDate: '2026-06-30',
  busiestCategory: null,
  busiestDay: null,
  sharedFriends: { sharedCategoryCount: 0, friends: [] },
};

/**
 * 일부 필드만 오는 상황 확인용.
 * 온 값은 유지되고 빈 곳만 채워지며 경고가 뜹니다.
 */
export const monthlyReportPartialMock = {
  reportYear: 2026,
  reportMonth: 6,
  monthlyPebbleCount: 64,
  recentMonths: monthlyReportMock.recentMonths,
};
