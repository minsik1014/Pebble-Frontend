// src/features/landing/constants/stepStructureData.ts

export interface StepStructureCard {
  id: string;
  width: number;
  left: number;
  top: number;
  zIndex: number;
  title: string;
  description: string;
  titleClassName: string;
  descriptionClassName: string;
}

export interface StepStructureStage {
  id: 'category' | 'milestone' | 'task';
  backgroundText: 'CATEGORY' | 'MILESTONE' | 'TASK';
  cards: StepStructureCard[];
}

const cardLayouts = [
  {
    width: 800,
    left: 320,
    top: 460,
    zIndex: 30,
    titleClassName: 'text-[28px]',
    descriptionClassName: 'text-[24px]',
  },
  {
    width: 720,
    left: 360,
    top: 508,
    zIndex: 20,
    titleClassName: 'text-[40px]',
    descriptionClassName: 'text-[32px]',
  },
  {
    width: 640,
    left: 400,
    top: 556,
    zIndex: 10,
    titleClassName: 'text-[40px]',
    descriptionClassName: 'text-[32px]',
  },
];

function createStageCards(
  stageId: StepStructureStage['id'],
  title: string,
  mainDescription: string,
  backgroundDescription: string,
): StepStructureCard[] {
  return cardLayouts.map((layout, index) => ({
    id: `${stageId}-${index}`,
    ...layout,
    title,
    description: index === 0 ? mainDescription : backgroundDescription,
  }));
}

export const STEP_STRUCTURE_STAGES: StepStructureStage[] = [
  {
    id: 'category',
    backgroundText: 'CATEGORY',
    cards: createStageCards(
      'category',
      '카테고리',
      '이루고 싶은 목표를 모아 보세요',
      '이루고 싶은 목표를 한 곳에',
    ),
  },
  {
    id: 'milestone',
    backgroundText: 'MILESTONE',
    cards: createStageCards(
      'milestone',
      '마일스톤',
      '목표를 단계 별로 나누어 보세요',
      '큰 목표를 작은 단계로',
    ),
  },
  {
    id: 'task',
    backgroundText: 'TASK',
    cards: createStageCards(
      'task',
      '태스크',
      '오늘 할 일을 하나씩 놓아 보세요',
      '오늘의 할 일을 한 칸씩',
    ),
  },
];