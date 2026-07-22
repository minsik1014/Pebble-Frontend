import type { CompletedCategoryDetail } from "@/features/mypage/types/completedCategory";
import type { MilestoneItem, TaskItem } from "@/types";

const createTask = (id: string, title: string, start: string): TaskItem => ({
  id,
  title,
  start,
  itemType: "task",
});

const createMilestone = (
  id: string,
  title: string,
  start: string,
  tasks: TaskItem[] = [],
): MilestoneItem => ({
  id,
  title,
  start,
  tasks,
  itemType: "milestone",
});

export const completedCategoryMocks: CompletedCategoryDetail[] = [
  {
    category: {
      id: "japan-trip",
      title: "일본 여행",
      accent: "#78929a",
      themeBase: "#3f6067",
      themeMid: "#78929a",
      themeLight: "#d5e0e5",
      items: [
        createMilestone("japan-plan", "여행 계획 세우기", "2026-04-21", [
          createTask("japan-flight", "항공권 예약", "2026-04-15"),
          createTask("japan-hotel", "숙소 예약", "2026-04-16"),
        ]),
        createMilestone("japan-ready", "여행 준비", "2026-04-23", [
          createTask("japan-route", "여행 동선 정리", "2026-04-18"),
          createTask("japan-pack", "짐 챙기기", "2026-04-22"),
        ]),
      ],
    },
    isPrivate: false,
    progress: 100,
    cardBackgroundClassName:
      "bg-[linear-gradient(145deg,#d5e0e5_0%,#78929a_48%,#3f6067_100%)]",
  },
  {
    category: {
      id: "midterm",
      title: "중간고사",
      accent: "#ffdd47",
      themeBase: "#ffdd47",
      themeMid: "#ffea8e",
      themeLight: "#fff6d5",
      items: [
        createMilestone("media-system", "미디어운영시스템", "2026-04-21"),
        createMilestone("art-therapy", "미술치료", "2026-04-23", [
          createTask("art-chapter-12", "1장, 2장 정리", "2026-04-15"),
          createTask("art-chapter-34", "3장, 4장 정리", "2026-04-16"),
          createTask("art-chapter-56", "5장, 6장 정리", "2026-04-18"),
          createTask("art-practice", "연습 문제", "2026-04-22"),
        ]),
        createMilestone("interaction", "모바일인터랙션디자인", "2026-04-23"),
      ],
    },
    isPrivate: true,
    progress: 100,
    cardBackgroundClassName: "bg-theme-5-base",
  },
  {
    category: {
      id: "gui-team",
      title: "GUI 팀플",
      accent: "#00cef5",
      themeBase: "#00cef5",
      themeMid: "#9ce7ff",
      themeLight: "#daf4ff",
      items: [
        createMilestone("gui-research", "레퍼런스 조사", "2026-05-03"),
        createMilestone("gui-prototype", "프로토타입 제작", "2026-05-10", [
          createTask("gui-wireframe", "와이어프레임", "2026-05-06"),
          createTask("gui-test", "사용성 테스트", "2026-05-09"),
        ]),
      ],
    },
    isPrivate: false,
    progress: 100,
    cardBackgroundClassName: "bg-theme-1-base",
  },
  {
    category: {
      id: "summer-trip",
      title: "여름 여행",
      accent: "#7d9b79",
      themeBase: "#466347",
      themeMid: "#7d9b79",
      themeLight: "#dbe7e1",
      items: [createMilestone("summer-plan", "여행지 정하기", "2026-06-10")],
    },
    isPrivate: false,
    progress: 100,
    cardBackgroundClassName:
      "bg-[linear-gradient(145deg,#dbe7e1_0%,#7d9b79_48%,#466347_100%)]",
  },
  {
    category: {
      id: "project",
      title: "프로젝트",
      accent: "#78a0dc",
      themeBase: "#45628d",
      themeMid: "#78a0dc",
      themeLight: "#dbe8fb",
      items: [createMilestone("project-release", "서비스 배포", "2026-06-20")],
    },
    isPrivate: true,
    progress: 100,
    cardBackgroundClassName: "bg-[#78a0dc]",
  },
  {
    category: {
      id: "startup-contest",
      title: "창업 공모전",
      accent: "#ff7580",
      themeBase: "#ff7580",
      themeMid: "#ffc0c3",
      themeLight: "#ffeced",
      items: [createMilestone("contest-submit", "기획서 제출", "2026-06-25")],
    },
    isPrivate: false,
    progress: 100,
    cardBackgroundClassName: "bg-theme-3-base",
  },
  {
    category: {
      id: "exercise-log",
      title: "운동 기록",
      accent: "#60d062",
      themeBase: "#60d062",
      themeMid: "#9ae29b",
      themeLight: "#d3f4d4",
      items: [createMilestone("exercise-routine", "주간 운동 루틴", "2026-06-30")],
    },
    isPrivate: true,
    progress: 100,
    cardBackgroundClassName: "bg-theme-2-base",
  },
];
