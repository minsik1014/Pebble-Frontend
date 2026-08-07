import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Trash2 } from "lucide-react";

import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import SearchIcon from "@/assets/icons/Search.svg?react";
import ClearIcon from "@/assets/icons/Close.svg?react";
import MySolidIcon from "@/assets/icons/user-solid.svg?react";
import { Toast } from "@/components/ui/Toast";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import {
  acceptFollowRequest,
  deleteFollow,
  getAllFollows,
  searchUsers,
  sendFollowRequest,
  type FollowListItem,
  type FollowUser,
  type SearchedUser,
} from "@/features/friends/api/followApi";
import {
  FOLLOW_UPDATED_EVENT,
} from "@/features/friends/utils/followSync";

const SEARCH_DEBOUNCE_MS = 300;

export default function FriendsPage(): JSX.Element {
  const { isSidebarOpen } = useCalendarLayoutContext();
  const [activeTab, setActiveTab] = useState<"friends" | "search">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<FollowListItem[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FollowListItem[]>([]);
  const [sentRequests, setSentRequests] = useState<FollowListItem[]>([]);
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [isListLoading, setIsListLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const normalizedSearchQuery = searchQuery.trim();

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, 2000);
  };

  const loadFollowLists = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setIsListLoading(true);
    }
    setErrorMessage("");

    try {
      const [friendsResponse, pendingResponse, sentResponse] =
        await Promise.all([
          getAllFollows("friends"),
          getAllFollows("pending"),
          getAllFollows("sent"),
        ]);

      setFriends(friendsResponse);
      setPendingRequests(pendingResponse);
      setSentRequests(sentResponse);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "친구 목록을 불러오지 못했어요.",
      );
    } finally {
      setIsListLoading(false);
    }
  }, []);
  const refreshCurrentSearch = useCallback(async () => {
    if (!normalizedSearchQuery) {
      return;
    }

    const response = await searchUsers(normalizedSearchQuery);
    setSearchResults(response.users);
  }, [normalizedSearchQuery]);

  useEffect(() => {
    void loadFollowLists(true);
  }, [loadFollowLists]);

  useEffect(() => {
    const refreshAllFollowData = () => {
      if (document.visibilityState === "visible") {
        void Promise.all([
          loadFollowLists(),
          refreshCurrentSearch(),
        ]).catch(() => undefined);
      }
    };
    const refreshAfterFollowUpdate = () => {
      void Promise.all([
        loadFollowLists(),
        refreshCurrentSearch(),
      ]).catch(() => undefined);
    };
    window.addEventListener("focus", refreshAllFollowData);
    document.addEventListener("visibilitychange", refreshAllFollowData);
    window.addEventListener(
      FOLLOW_UPDATED_EVENT,
      refreshAfterFollowUpdate,
    );

    return () => {
      window.removeEventListener("focus", refreshAllFollowData);
      document.removeEventListener(
        "visibilitychange",
        refreshAllFollowData,
      );
      window.removeEventListener(
        FOLLOW_UPDATED_EVENT,
        refreshAfterFollowUpdate,
      );
    };
  }, [loadFollowLists, refreshCurrentSearch]);

  useEffect(
    () => () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!normalizedSearchQuery) {
      setSearchResults([]);
      setIsSearching(false);
      setErrorMessage("");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      setErrorMessage("");

      try {
        const response = await searchUsers(
          normalizedSearchQuery,
          controller.signal,
        );
        setSearchResults(response.users);
      } catch (error) {
        if (!controller.signal.aborted) {
          setSearchResults([]);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "사용자를 검색하지 못했어요.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [normalizedSearchQuery]);

  const runAction = async (
    id: number,
    action: () => Promise<void>,
    successMessage: string,
  ) => {
    setProcessingId(id);
    setErrorMessage("");

    try {
      await action();
      await loadFollowLists();

      if (normalizedSearchQuery) {
        const response = await searchUsers(normalizedSearchQuery);
        setSearchResults(response.users);
      }

      showToast(successMessage);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "요청을 처리하지 못했어요.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleSendFollow = (user: SearchedUser) =>
    runAction(
      user.userId,
      async () => {
        await sendFollowRequest(user.userId);
      },
      `${user.nickname}님에게 친구 신청을 보냈어요`,
    );

  const handleAccept = (request: FollowListItem) =>
    runAction(
      request.followId,
      async () => {
        await acceptFollowRequest(request.followId);
      },
      `${request.nickname}님과 친구가 되었어요`,
    );

  const handleDelete = (
    followId: number,
    nickname: string,
    message: string,
  ) =>
    runAction(
      followId,
      () => deleteFollow(followId),
      `${nickname}님의 ${message}`,
    );

  return (
    <section
      className={`relative h-[1000px] shrink-0 overflow-hidden rounded-[20px] bg-fill-inverse shadow-shadow-m transition-all duration-300 ${
        isSidebarOpen ? "w-[924px]" : "w-[1316px]"
      }`}
    >
      <button
        type="button"
        onClick={() => window.history.back()}
        className="absolute left-6 top-10 z-20 flex size-11 items-center justify-center rounded-token-s text-text-strong transition-colors hover:bg-fill-surface"
        aria-label="이전 페이지로 돌아가기"
      >
        <ChevronLeftIcon className="size-6" />
      </button>

      <div className="h-full overflow-y-auto px-[72px] pb-12 custom-scrollbar">
        <div className="mx-auto w-full max-w-[780px] pt-10">
          <div className="relative flex h-12 items-center justify-center">
            <div className="grid h-12 w-64 grid-cols-2 gap-1 rounded-token-s bg-btn-quaternary p-1">
              {(["friends", "search"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-[9px] px-3 py-2 text-body-02-m transition-colors ${
                    activeTab === tab
                      ? "bg-fill-inverse text-text-primary shadow-[0px_0px_4px_rgba(23,23,23,0.1)]"
                      : "text-text-teritary"
                  }`}
                >
                  {tab === "friends" ? "모든 친구" : "친구 찾기"}
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="mx-auto mt-6 rounded-token-s bg-fill-surface px-4 py-3 text-body-03-r text-fill-danger"
            >
              {errorMessage}
            </p>
          )}

          {activeTab === "friends" ? (
            <div className="mt-14">
              {isListLoading ? (
                <StatusMessage message="친구 목록을 불러오는 중이에요..." />
              ) : (
                <>
                  {pendingRequests.length > 0 && (
                    <FollowSection
                      title="친구 요청"
                      count={pendingRequests.length}
                    >
                      {pendingRequests.map((request) => (
                        <FollowRow key={request.followId} user={request}>
                          <button
                            type="button"
                            disabled={processingId === request.followId}
                            onClick={() => void handleAccept(request)}
                            className="h-12 min-w-[92px] rounded-token-s bg-btn-primary px-8 py-3 text-body-02-m text-text-onFill disabled:opacity-50"
                          >
                            수락
                          </button>
                          <button
                            type="button"
                            disabled={processingId === request.followId}
                            onClick={() =>
                              void handleDelete(
                                request.followId,
                                request.nickname,
                                "요청을 거절했어요",
                              )
                            }
                            className="h-12 min-w-[92px] rounded-token-s bg-btn-quaternary px-8 py-3 text-body-02-m text-text-strong disabled:opacity-50"
                          >
                            거절
                          </button>
                        </FollowRow>
                      ))}
                    </FollowSection>
                  )}

                  {sentRequests.length > 0 && (
                    <FollowSection
                      title="보낸 요청"
                      count={sentRequests.length}
                      className="mt-12"
                    >
                      {sentRequests.map((request) => (
                        <FollowRow key={request.followId} user={request}>
                          <button
                            type="button"
                            disabled={processingId === request.followId}
                            onClick={() =>
                              void handleDelete(
                                request.followId,
                                request.nickname,
                                "친구 신청을 취소했어요",
                              )
                            }
                            className="h-12 min-w-[116px] rounded-token-s bg-btn-quaternary px-8 py-3 text-body-02-m text-text-strong disabled:opacity-50"
                          >
                            요청 취소
                          </button>
                        </FollowRow>
                      ))}
                    </FollowSection>
                  )}

                  <FollowSection
                    title="내 친구"
                    count={friends.length}
                    className={
                      pendingRequests.length > 0 || sentRequests.length > 0
                        ? "mt-12"
                        : ""
                    }
                  >
                    {friends.map((friend) => (
                      <FollowRow key={friend.followId} user={friend}>
                        <button
                          type="button"
                          disabled={processingId === friend.followId}
                          onClick={() =>
                            void handleDelete(
                              friend.followId,
                              friend.nickname,
                              "친구 관계를 삭제했어요",
                            )
                          }
                          className="relative flex size-11 items-center justify-center overflow-hidden rounded-token-s bg-fill-danger text-text-onFill transition-colors before:pointer-events-none before:absolute before:inset-0 before:transition-colors hover:before:bg-[rgba(250,250,250,0.25)] active:before:bg-[rgba(250,250,250,0.4)] disabled:opacity-50"
                          aria-label={`${friend.nickname} 친구 삭제`}
                        >
                          <Trash2 className="relative z-10 size-5" strokeWidth={2} />
                        </button>
                      </FollowRow>
                    ))}
                  </FollowSection>
                </>
              )}
            </div>
          ) : (
            <section className="mt-14" aria-labelledby="friend-search-heading">
              <h2 id="friend-search-heading" className="sr-only">
                친구 찾기
              </h2>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="닉네임 또는 이메일로 찾을 수 있어요"
                  className="h-14 w-full rounded-token-s border border-border-default bg-fill-inverse pl-12 pr-12 text-body-02-m text-text-strong outline-none transition-colors placeholder:text-text-teritary focus:border-text-secondary"
                  aria-label="친구 닉네임 또는 이메일 검색"
                />
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-6 -translate-y-1/2 text-text-teritary" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-text-teritary text-text-onFill hover:bg-text-secondary"
                    aria-label="검색어 지우기"
                  >
                    <ClearIcon className="size-3" />
                  </button>
                )}
              </div>

              {!normalizedSearchQuery ? (
                <SearchGuide />
              ) : isSearching ? (
                <StatusMessage message="사용자를 검색하는 중이에요..." />
              ) : searchResults.length ? (
                <div className="mt-10 flex flex-col gap-5" aria-live="polite">
                  <p className="text-body-02-m text-text-teritary">
                    검색 결과 ({searchResults.length})
                  </p>
                  {searchResults.map((user) => {
                    const friend = friends.find(
                      ({ userId }) => userId === user.userId,
                    );

                    return (
                      <FollowRow
                        key={user.userId}
                        user={user}
                        showUniqueTag={false}
                      >
                        {user.followStatus === "NONE" && (
                          <button
                            type="button"
                            disabled={processingId === user.userId}
                            onClick={() => void handleSendFollow(user)}
                            className="h-12 rounded-token-s bg-btn-primary px-8 py-3 text-body-02-m text-text-onFill disabled:opacity-50"
                          >
                            친구 신청
                          </button>
                        )}
                        {user.followStatus === "PENDING" && (
                          <button
                            type="button"
                            disabled
                            className="h-12 min-w-[96px] rounded-token-s bg-btn-quaternary px-8 py-3 text-body-02-m text-text-strong"
                          >
                            요청 중
                          </button>
                        )}
                        {user.followStatus === "ACCEPTED" && friend && (
                          <button
                            type="button"
                            disabled={processingId === friend.followId}
                            onClick={() =>
                              void handleDelete(
                                friend.followId,
                                user.nickname,
                                "친구 관계를 삭제했어요",
                              )
                            }
                            className="relative flex size-11 items-center justify-center overflow-hidden rounded-token-s bg-fill-danger text-text-onFill transition-colors before:pointer-events-none before:absolute before:inset-0 before:transition-colors hover:before:bg-[rgba(250,250,250,0.25)] active:before:bg-[rgba(250,250,250,0.4)] disabled:opacity-50"
                            aria-label={`${user.nickname} 친구 삭제`}
                          >
                            <Trash2 className="relative z-10 size-5" strokeWidth={2} />
                          </button>
                        )}
                      </FollowRow>
                    );
                  })}
                </div>
              ) : (
                <StatusMessage
                  title="검색 결과가 없어요"
                  message="닉네임 또는 이메일로 찾을 수 있어요"
                />
              )}
            </section>
          )}
        </div>
      </div>

      <Toast
        message={toastMessage}
        open={isToastVisible}
        className="absolute bottom-6 right-6 z-20"
      />
    </section>
  );
}

function FollowSection({
  title,
  count,
  className = "",
  children,
}: {
  title: string;
  count: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={className}>
      <h2 className="text-body-02-m text-text-teritary">
        {title} ({count})
      </h2>
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}

function FollowRow({
  user,
  showUniqueTag = true,
  children,
}: {
  user: FollowUser;
  showUniqueTag?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="group relative flex min-h-[88px] w-full items-center justify-between overflow-hidden rounded-token-m p-3 transition-colors hover:bg-[rgba(23,23,23,0.05)]">
      <div className="flex min-w-0 flex-1 items-center gap-5 pr-5">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-teritory bg-fill-surface text-text-secondary">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={`${user.nickname}님의 프로필`}
              className="size-full object-cover"
            />
          ) : (
            <MySolidIcon className="size-8" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-body-01-sb text-text-strong">{user.nickname}</p>
          {showUniqueTag && (
            <p className="mt-1 text-body-02-m text-text-secondary">
              #{user.uniqueTag}
            </p>
          )}
        </div>
      </div>
      <div className="ml-auto flex shrink-0 gap-3">{children}</div>
    </div>
  );
}

function SearchGuide() {
  return (
    <StatusMessage
      title="친구를 검색해 보세요"
      message="닉네임 또는 이메일로 찾을 수 있어요"
    />
  );
}

function StatusMessage({
  title,
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div
      className="flex h-[500px] flex-col items-center justify-center text-center"
      aria-live="polite"
    >
      <SearchIcon className="size-16 text-border-default" />
      {title && (
        <p className="mt-6 text-title-03-sb text-text-secondary">{title}</p>
      )}
      <p className={`${title ? "mt-2" : "mt-6"} text-body-02-r text-text-teritary`}>
        {message}
      </p>
    </div>
  );
}
