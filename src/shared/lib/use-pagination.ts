export function usePagination({
  limit,
  offset,
  total,
}: {
  limit: number;
  offset: number;
  total: number;
}) {
  const hasPagination = total > limit;
  const pagesCount = Math.ceil(total / Number(limit));
  const page = Number(offset) / Number(limit) + 1;

  return {
    hasPagination,
    pagesCount,
    page,
  };
}
