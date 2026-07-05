import { useMemo, useState } from "react";
import CardViewIcon from "@/assets/icons/Card-view.svg?react";
import ListViewIcon from "@/assets/icons/List-view.svg?react";
import PlusIcon from "@/assets/icons/Plus.svg?react";
import {
  Bell,
  Calendar,
  LayoutGrid,
  ChevronUp,
  Eye,
  List,
  LogOut,
  User,
  Settings,
  Users,
} from "lucide-react";

type SidebarNavItem = {
  id: string;
  label: string;
  icon: any; // LucideIcon type
  active?: boolean;
};

type ScheduleItem = {
  id: string;
  title: string;
  start: string;
  end?: string;
  accent: string;
  rowWidthClass: string;
};

type Category = {
  id: string;
  title: string;
  accent: string;
  items: ScheduleItem[];
};

const sidebarTopItems: SidebarNavItem[] = [
  { id: "bell", label: "알림", icon: Bell },
];

const sidebarMiddleItems: SidebarNavItem[] = [
  { id: "social", label: "소셜", icon: Users },
  { id: "calendar", label: "일정", icon: Calendar, active: true },
  { id: "my", label: "마이", icon: User },
];

const sidebarBottomItems: SidebarNavItem[] = [
  { id: "settings", label: "설정", icon: Settings },
  { id: "logout", label: "로그아웃", icon: LogOut },
];

const categories: Category[] = [
  {
    id: "expo",
    title: "EXPO",
    accent: "#00cef5",
    items: [
      {
        id: "expo-1",
        title: "계획서 제출",
        start: "6/7",
        end: "6/9",
        accent: "#9be6ff",
        rowWidthClass: "w-80",
      },
      {
        id: "expo-2",
        title: "EXPO 계획서 작성하기",
        start: "6/10",
        accent: "#daf4ff",
        rowWidthClass: "w-[308px]",
      },
    ],
  },
  {
    id: "final-exam",
    title: "기말고사",
    accent: "#ffdd47",
    items: [
      {
        id: "final-1",
        title: "운영시스템 공부",
        start: "6/14",
        end: "6/16",
        accent: "#fff6d5",
        rowWidthClass: "w-80",
      },
      {
        id: "final-2",
        title: "운영시스템 시험",
        start: "6/17",
        accent: "#fff6d5",
        rowWidthClass: "w-80",
      },
    ],
  },
  {
    id: "startup-contest",
    title: "창업 공모전",
    accent: "#ff7580",
    items: [
      {
        id: "startup-1",
        title: "백엔드 프로젝트",
        start: "6/8",
        end: "6/11",
        accent: "#ffc0c3",
        rowWidthClass: "w-80",
      },
      {
        id: "startup-2",
        title: "MVP 페이지 구현",
        start: "6/8",
        end: "6/9",
        accent: "#ffeced",
        rowWidthClass: "w-[308px]",
      },
      {
        id: "startup-3",
        title: "백엔드 보고서 제출",
        start: "6/17",
        accent: "#ffeced",
        rowWidthClass: "w-[308px]",
      },
      {
        id: "startup-4",
        title: "창업실무 보고서",
        start: "6/12",
        accent: "#ffc0c3",
        rowWidthClass: "w-80",
      },
    ],
  },
];

const SidebarIconButton = ({ item }: { item: SidebarNavItem }) => {
  const Icon = item.icon;

  return (
    <button
      type="button"
      aria-label={item.label}
      aria-current={item.active ? "page" : undefined}
      className={`relative h-11 w-11 flex items-center justify-center rounded-token-s transition-colors ${
        item.active ? "bg-fill-primary text-text-onFill" : "text-text-secondary hover:text-text-strong"
      }`}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
};

const ScheduleRow = ({
  item,
  checked,
  onToggle,
}: {
  item: ScheduleItem;
  checked: boolean;
  onToggle: () => void;
}) => {
  const dateLabel = item.end ? `${item.start} ~ ${item.end}` : item.start;

  return (
    <label
      className={`w-full gap-2 pl-2 pr-2 py-2 flex items-center relative rounded-token-s overflow-hidden cursor-pointer hover:bg-fill-surface transition-colors shrink-0`}
    >
      <div className="flex flex-1 grow items-center gap-2 relative min-w-0">
        <div
          className="relative w-2 h-8 rounded shrink-0"
          style={{ backgroundColor: item.accent }}
        />
        <div className="relative min-w-0 max-w-[170px] text-body-02-m text-text-strong truncate">
          {item.title}
        </div>
      </div>
      <div className="inline-flex items-center justify-end gap-3 shrink-0">
        <div className="inline-flex items-center justify-end">
          <div className="text-body-02-m text-text-quaternary whitespace-nowrap">
            {dateLabel}
          </div>
        </div>
        <span className="relative inline-flex h-6 w-6 items-center justify-center">
          <input
            type="checkbox"
            aria-label={`${item.title} 일정 완료`}
            checked={checked}
            onChange={onToggle}
            className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <span className="relative w-6 h-6 rounded border border-border-default bg-fill-inverse peer-checked:border-fill-primary peer-checked:bg-fill-primary" />
        </span>
      </div>
      <span className="sr-only">{dateLabel}</span>
    </label>
  );
};

const CategoryCard = ({
  category,
  expanded,
  onToggleExpanded,
  checkedItems,
  onToggleChecked,
}: {
  category: Category;
  expanded: boolean;
  onToggleExpanded: () => void;
  checkedItems: Record<string, boolean>;
  onToggleChecked: (itemId: string) => void;
}) => {
  return (
    <section className="w-[352px] shrink-0 flex flex-col items-center justify-center relative bg-fill-inverse rounded-[20px] shadow-shadow-s overflow-hidden">
      <div className="flex w-full items-center justify-between pl-5 pr-3 py-3 relative bg-fill-inverse rounded-[20px] overflow-hidden">
        <div className="flex items-center gap-3 relative">
          <div
            className="relative w-2 h-10 rounded"
            style={{ backgroundColor: category.accent }}
          />
          <h2 className="text-title-02-sb text-text-strong">
            {category.title}
          </h2>
        </div>
        <div className="inline-flex items-center justify-end">
          <button
            type="button"
            aria-label={`${category.title} 접기`}
            aria-expanded={expanded}
            onClick={onToggleExpanded}
            className="relative flex items-center justify-center w-11 h-11 rounded-token-s hover:bg-fill-surface transition-colors"
          >
            <ChevronUp
              className={`w-6 h-6 transition-transform text-text-strong ${
                expanded ? "" : "rotate-180"
              }`}
            />
          </button>
          <button
            type="button"
            aria-label={`${category.title} 보기`}
            className="relative flex items-center justify-center w-11 h-11 rounded-token-s hover:bg-fill-surface transition-colors"
          >
            <Eye className="w-6 h-6 text-text-strong" />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="flex flex-col items-center gap-3 pt-0 pb-3 w-full relative">
          <div className="flex flex-col items-center justify-start gap-2 px-3 py-1 w-full max-h-[220px] overflow-y-auto custom-scrollbar">
            {category.items.map((item) => (
              <ScheduleRow
                key={item.id}
                item={item}
                checked={Boolean(checkedItems[item.id])}
                onToggle={() => onToggleChecked(item.id)}
              />
            ))}
          </div>
          <button
            type="button"
            className="w-[312px] h-12 flex items-center justify-center bg-btn-quaternary rounded-token-s hover:bg-btn-pressed transition-colors shrink-0"
            aria-label={`${category.title} 일정 추가하기`}
          >
            <span className="text-body-02-m text-text-secondary">
              일정 추가하기
            </span>
          </button>
        </div>
      )}
    </section>
  );
};

export const ProjectScheduleSidebarSection = (): JSX.Element => {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    expo: true,
    "final-exam": true,
    "startup-contest": true,
  });
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const monthLabel = useMemo(() => "6월", []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleCheckedItem = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <aside className="flex mt-token-m w-[476px] shrink-0 h-[1000px] relative items-stretch rounded-[20px] overflow-hidden shadow-shadow-m">
      {/* 얇은 좌측 네비게이션 */}
      <nav
        aria-label="사이드바 탐색"
        className="w-[84px] shrink-0 h-[1000px] items-center px-5 py-8 bg-fill-inverse flex flex-col gap-10 relative"
      >
        <div className="inline-flex flex-col items-center justify-between relative flex-1 grow">
          <div className="inline-flex flex-col items-start gap-5 relative">
            {sidebarTopItems.map((item) => (
              <SidebarIconButton key={item.id} item={item} />
            ))}
          </div>
          <div className="items-start inline-flex flex-col gap-10 relative">
            {sidebarMiddleItems.map((item) => (
              <SidebarIconButton key={item.id} item={item} />
            ))}
          </div>
          <div className="items-start inline-flex flex-col gap-10 relative">
            {sidebarBottomItems.map((item) => (
              <SidebarIconButton key={item.id} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* 메인 마일스톤 관리 영역 */}
      <section className="relative flex-1 h-[1000px] bg-fill-surface rounded-[0px_32px_32px_0px] border-l border-border-default flex flex-col">
        <header className="flex w-full h-[100px] shrink-0 items-center justify-between pt-token-xl pb-token-l px-token-l bg-fill-surface z-10 rounded-tr-[32px]">
          <div className="text-heading-02 text-text-strong">
            {monthLabel}
          </div>
          <div
            className="inline-flex items-center gap-1 p-1 bg-btn-quaternary rounded-token-s"
            role="tablist"
            aria-label="보기 전환"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "card"}
              aria-label="카드 보기"
              onClick={() => setViewMode("card")}
              className={`flex items-center justify-center p-2 rounded-[9px] transition-colors ${
                viewMode === "card" ? "bg-fill-inverse shadow-sm text-text-strong" : "text-text-secondary hover:text-text-strong"
              }`}
            >
              <CardViewIcon className="w-6 h-6" />
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "list"}
              aria-label="리스트 보기"
              onClick={() => setViewMode("list")}
              className={`flex items-center justify-center p-2 rounded-[9px] transition-colors ${
                viewMode === "list" ? "bg-fill-inverse shadow-sm text-text-strong" : "text-text-secondary hover:text-text-strong"
              }`}
            >
              <ListViewIcon className="w-6 h-6" />
            </button>
          </div>
        </header>
        {/* Flexbox에서 내용이 부모를 뚫고 나가는 것을 방지하기 위해 min-h-0 추가 */}
        <div className="w-full h-[888px] min-h-0 flex flex-col items-center gap-5 pt-1 pb-3 px-5 overflow-y-auto custom-scrollbar">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              expanded={Boolean(expandedCategories[category.id])}
              onToggleExpanded={() => toggleCategory(category.id)}
              checkedItems={checkedItems}
              onToggleChecked={toggleCheckedItem}
            />
          ))}

          <button
            type="button"
            className="w-[352px] h-12 flex items-center justify-center bg-fill-primary rounded-token-s hover:opacity-90 transition-opacity shrink-0"
            aria-label="카테고리 생성"
          >
            <PlusIcon className="w-4 h-4 text-text-onFill" />
            <span className="text-body-02-m text-text-onFill ml-2">
              카테고리 생성
            </span>
          </button>
        </div>
      </section>
    </aside>
  );
};
