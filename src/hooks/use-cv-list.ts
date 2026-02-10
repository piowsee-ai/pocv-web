import { useQuery } from "@tanstack/react-query";
import { CVList } from "@/types/cv";

export const CV_LIST_QUERY_KEY = ["cv_list"] as const;

// Centralized fetcher for CV list
async function fetchCVList(): Promise<{ data: CVList[] }> {
  const response = await fetch("/api/cv/me");
  if (!response.ok) {
    throw new Error("Failed to fetch CVs");
  }
  return response.json();
}

// Custom hook for CV list query
export function useCVList() {
  return useQuery({
    queryKey: CV_LIST_QUERY_KEY,
    queryFn: fetchCVList,
    retry: 0,
  });
}
