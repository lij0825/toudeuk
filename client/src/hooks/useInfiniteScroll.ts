import { useCallback, useEffect, useRef } from "react";
import { UseInfiniteQueryResult } from "@tanstack/react-query";

interface InfiniteScrollParams<T> {
  fetchNextPage: UseInfiniteQueryResult<T>["fetchNextPage"];
  hasNextPage: boolean | undefined;
  fetchPreviousPage?: UseInfiniteQueryResult<T>["fetchPreviousPage"];
  hasPreviousPage?: boolean;
  enabled?: boolean;
}

export default function useInfiniteScroll<T>({
  fetchNextPage,
  hasNextPage,
  fetchPreviousPage,
  hasPreviousPage,
  enabled = true,
}: InfiniteScrollParams<T>): React.RefObject<HTMLDivElement> {
  const targetRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
      if (entry.isIntersecting && hasPreviousPage && fetchPreviousPage) {
        fetchPreviousPage();
      }
    },
    [fetchNextPage, hasNextPage, fetchPreviousPage, hasPreviousPage]
  );

  // 옵저버 설정
  useEffect(() => {
    if (!enabled) {
      console.log("Infinite scroll disabled, skipping observer setup");
      return;
    }
    if (!targetRef.current) return;
    // targetRef가 설정되었을 때만 옵저버 생성

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "20px",
      threshold: 1.0,
    });
    observer.observe(targetRef.current);
    console.log("Observer set up on:", targetRef.current);

    return () => observer.disconnect();
  }, [handleObserver, enabled]);

  return targetRef;
}
