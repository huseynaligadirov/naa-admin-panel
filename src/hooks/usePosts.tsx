import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiService } from "../services/api";
import { DEFAULT_PAGINATION } from "../config/constants";

export const usePosts = (
  page: number = DEFAULT_PAGINATION.PAGE,
  limit: number = DEFAULT_PAGINATION.LIMIT,
  category?: string,
  search?: string,
  activeStatus?: "active" | "inactive",
  publishStatus?: "publish" | "draft"
) => {
  return useQuery({
    queryKey: ["posts", page, limit, category, search, activeStatus, publishStatus],
    queryFn: () => apiService.getPosts(page, limit, category, search, activeStatus, publishStatus),
    placeholderData: keepPreviousData,
  });
};
