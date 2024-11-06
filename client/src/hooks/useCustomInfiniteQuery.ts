import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";

// CustomQueryParams 인터페이스 정의
export interface CustomQueryParams<T> {
  queryKey: string;
  rowsPerPage: number;
  queryFn: (context?: QueryFunctionContext) => Promise<T>;
}

// useCustomInfiniteQuery 훅 정의
export default function useCustomInfiniteQuery<T>({
  params,
}: {
  params: CustomQueryParams<T>;
}) {
  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    ...result
  } = useInfiniteQuery<T, Error>({
    queryKey: [params.queryKey],
    queryFn: params.queryFn,
    initialPageParam: 1, // 기본 페이지 번호
    getNextPageParam: (lastPage) => (lastPage as any).nextCursor, // nextCursor가 T의 속성 중 하나라고 가정
    getPreviousPageParam: (firstPage) => (firstPage as any).prevCursor, // prevCursor도 마찬가지로 가정
  });

  return {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    ...result,
  };
}
