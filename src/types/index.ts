// Shared types for the application

export interface Post {
  id: number;
  title: string;
  htmlContent: string;
  plainContent: string;
  coverImageUrl: string;
  coverImageLabel?: string;
  galleryImagesUrl: string[];
  category: "NEWS" | "ANNOUNCEMENT";
  videoUrl: string | null;
  url: string;
  createdAt: string;
  publishStatus?: "publish" | "draft";
  status?: "active" | "inactive";
}

export interface SidebarState {
  website: boolean;
  library: boolean;
  meteorology: boolean;
  museum: boolean;
}

export interface CreatePostFormData {
  title: string;
  url: string;
  category: "news" | "announcement";
  language: "az" | "en";
  coverImage: FileList;
  coverImageLabel?: string;
  galleryImages: FileList;
  htmlContent: string;
  plainContent?: string;
  videoUrl?: string;
  keptGalleryImageUrls?: string[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PostsResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  posts: Post[];
}

