import { useCallback, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

import { createQueryString } from "@/lib/utils";
import { SearchParams } from "@/types";

export const useUpdateQuery = (searchParams: SearchParams) => {
  const router = useRouter();
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const updateQuery = useCallback(
    (updates: Record<string, string | number | boolean | null | undefined>) => {
      router.push(createQueryString(searchParamsRef.current, updates), {
        scroll: false,
      });
    },
    [router],
  );

  return updateQuery;
};
