import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import SearchIcon from "@/assets/icons/Search.svg?react";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { useFriendStore } from "@/features/friends/store/useFriendStore";
import type { Friend } from "@/features/friends/types/friend";

export default function FriendsPage(): JSX.Element {
  const { isSidebarOpen } = useCalendarLayoutContext();
  const [activeTab, setActiveTab] = useState<"friends" | "search">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const friends = useFriendStore((state) => state.friends);
  const requests = useFriendStore((state) => state.requests);
  const pendingRequests = requests.filter(
    ({ status }) => status === "PENDING",
  );
  const respondRequest = useFriendStore((state) => state.respondRequest);
  const deleteFriend = useFriendStore((state) => state.deleteFriend);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    },
    [],
  );

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

  const handleRequestResponse = (
    requestId: number,
    nickname: string,
    action: "ACCEPT" | "REJECT",
  ) => {
    respondRequest(requestId, action);
    showToast(
      action === "ACCEPT"
        ? `${nickname}님과 친구가 되었어요`
        : `${nickname}님의 요청을 거절했어요`,
    );
  };

  const handleDeleteFriend = (friendId: number, nickname: string) => {
    deleteFriend(friendId);
    showToast(`${nickname}님을 친구에서 삭제했어요`);
  };

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const searchResults = normalizedSearchQuery
    ? friends.filter(
        ({ id, nickname }) =>
          nickname.toLowerCase().includes(normalizedSearchQuery) ||
          String(id).includes(normalizedSearchQuery),
      )
    : [];

  return (
    <section
      className={`relative h-[1000px] shrink-0 overflow-hidden rounded-[20px] bg-fill-inverse shadow-shadow-m transition-all duration-300 ${
        isSidebarOpen ? "w-[924px]" : "w-[1316px]"
      }`}
    >
      <div className="h-full overflow-y-auto px-[72px] pb-12 custom-scrollbar">
        <div className="mx-auto w-full max-w-[780px] pt-10">
          <div className="relative flex h-12 items-center justify-center">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="absolute left-0 flex size-11 items-center justify-center rounded-token-s text-text-strong transition-colors hover:bg-fill-surface"
              aria-label="이전 페이지로 돌아가기"
            >
              <ChevronLeftIcon className="size-6" />
            </button>

            <div className="grid h-11 w-[440px] grid-cols-2 rounded-token-s bg-fill-surface p-1">
              <button
                type="button"
                onClick={() => setActiveTab("friends")}
                className={`rounded-[6px] text-body-02-m transition-colors ${
                  activeTab === "friends"
                    ? "bg-fill-inverse text-text-strong shadow-sm"
                    : "text-text-teritary"
                }`}
              >
                모든 친구
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("search")}
                className={`rounded-[6px] text-body-02-m transition-colors ${
                  activeTab === "search"
                    ? "bg-fill-inverse text-text-strong shadow-sm"
                    : "text-text-teritary"
                }`}
              >
                친구 찾기
              </button>
            </div>
          </div>

          {activeTab === "friends" ? (
            <div className="mt-14">
              <section aria-labelledby="friend-request-heading">
                <h2
                  id="friend-request-heading"
                  className="text-body-02-m text-text-teritary"
                >
                  친구 요청 ({pendingRequests.length})
                </h2>

                <div className="mt-5 flex flex-col gap-5">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="flex min-h-16 items-center">
                      <FriendProfile friend={request.user} />
                      <div className="ml-auto flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleRequestResponse(
                              request.id,
                              request.user.nickname,
                              "ACCEPT",
                            )
                          }
                          className="h-11 min-w-[80px] rounded-token-s bg-fill-primary px-5 text-body-02-m text-text-onFill"
                        >
                          수락
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleRequestResponse(
                              request.id,
                              request.user.nickname,
                              "REJECT",
                            )
                          }
                          className="h-11 min-w-[80px] rounded-token-s bg-fill-surface px-5 text-body-02-m text-text-strong"
                        >
                          거절
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-12" aria-labelledby="friends-heading">
                <h2
                  id="friends-heading"
                  className="text-body-02-m text-text-teritary"
                >
                  내 친구 ({friends.length})
                </h2>
                <div className="mt-5 flex flex-col gap-5">
                  {friends.map((friend) => (
                    <div key={friend.id} className="flex min-h-16 items-center">
                      <FriendProfile friend={friend} />
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteFriend(friend.id, friend.nickname)
                        }
                        className="ml-auto flex size-11 items-center justify-center rounded-token-s bg-[#FF8A8A] text-text-onFill transition-opacity hover:opacity-80"
                        aria-label={`${friend.nickname} 친구 삭제`}
                      >
                        <Trash2 className="size-5" strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <section className="mt-14" aria-labelledby="friend-search-heading">
              <h2 id="friend-search-heading" className="sr-only">
                친구 찾기
              </h2>

              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="닉네임 또는 이메일로 찾을 수 있어요"
                  className="h-14 w-full rounded-token-s border border-border-default bg-fill-inverse px-4 pr-14 text-body-02-m text-text-strong outline-none transition-colors placeholder:text-text-teritary focus:border-text-secondary"
                  aria-label="친구 닉네임 또는 이메일 검색"
                />
                <SearchIcon className="pointer-events-none absolute right-4 top-1/2 size-6 -translate-y-1/2 text-text-teritary" />
              </div>

              {!normalizedSearchQuery ? (
                <SearchGuide />
              ) : searchResults.length > 0 ? (
                <div className="mt-10 flex flex-col gap-5" aria-live="polite">
                  <p className="text-body-02-m text-text-teritary">
                    검색 결과 ({searchResults.length})
                  </p>
                  {searchResults.map((friend) => (
                    <div key={friend.id} className="flex min-h-16 items-center">
                      <FriendProfile friend={friend} hideBio />
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteFriend(friend.id, friend.nickname)
                        }
                        className="ml-auto flex size-11 items-center justify-center rounded-token-s bg-[#FF8A8A] text-text-onFill transition-opacity hover:opacity-80"
                        aria-label={`${friend.nickname} 친구 삭제`}
                      >
                        <Trash2 className="size-5" strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="flex h-[500px] flex-col items-center justify-center text-center"
                  aria-live="polite"
                >
                  <SearchIcon className="size-16 text-border-default" />
                  <p className="mt-6 text-title-03-sb text-text-secondary">
                    검색 결과가 없어요
                  </p>
                  <p className="mt-2 text-body-02-r text-text-teritary">
                    닉네임 또는 이메일로 찾을 수 있어요
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none absolute bottom-6 right-6 z-20 min-w-[280px] rounded-[16px] bg-fill-primary px-5 py-3 text-body-02-m text-text-onFill shadow-lg transition-all duration-[450ms] ease-in-out ${
          isToastVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-3 opacity-0"
        }`}
      >
        {toastMessage}
      </div>
    </section>
  );
}

function SearchGuide(): JSX.Element {
  return (
    <div className="flex h-[570px] flex-col items-center justify-center text-center">
      <SearchIcon className="size-16 text-border-default" />
      <p className="mt-6 text-title-03-sb text-text-secondary">
        친구를 검색해 보세요
      </p>
      <p className="mt-2 text-body-02-r text-text-teritary">
        닉네임 또는 이메일로 찾을 수 있어요
      </p>
    </div>
  );
}

function FriendProfile({
  friend,
  hideBio = false,
}: {
  friend: Friend;
  hideBio?: boolean;
}): JSX.Element {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <img
        src={friend.imageUrl}
        alt=""
        className="size-16 shrink-0 rounded-full border border-border-default object-cover"
      />
      <div className={`min-w-0 ${hideBio ? "flex h-16 items-center" : ""}`}>
        <p
          className={`${
            hideBio ? "text-title-03-sb" : "text-body-01-sb"
          } text-text-strong`}
        >
          {friend.nickname}
        </p>
        {!hideBio && friend.bio && (
          <p className="mt-1 max-w-[650px] text-body-03-r text-text-secondary">
            {friend.bio}
          </p>
        )}
      </div>
    </div>
  );
}
