// API service layer with axios instance

import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";
import { API_BASE_URL } from "../config/constants";
import { htmlToPlainText } from "../utils/plainText";
import type { CreatePostFormData, PostsResponse, ApiResponse, Post } from "../types";

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if needed
        // const token = localStorage.getItem("token");
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }

        // Ensure plainContent is always sent when htmlContent is present (POST/PUT/PATCH)
        const method = (config.method || "").toLowerCase();
        const isWriteMethod = method === "post" || method === "put" || method === "patch";
        if (isWriteMethod && config.data) {
          const data = config.data as any;

          // Handle FormData payloads
          if (typeof FormData !== "undefined" && data instanceof FormData) {
            const html = data.get("htmlContent");
            if (typeof html === "string") {
              // Always overwrite to keep in sync
              if (data.has("plainContent")) {
                data.delete("plainContent");
              }
              data.append("plainContent", htmlToPlainText(html));
            }
          } else if (typeof data === "object") {
            // Handle JSON-like payloads
            if ("htmlContent" in data) {
              data.plainContent = htmlToPlainText(data.htmlContent as string);
            }
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Handle unauthorized
        }
        return Promise.reject(error);
      }
    );
  }

  // Transform post data to match the expected structure
  private transformPost(post: any): Post {
    return {
      id: typeof post.id === "string" ? parseInt(post.id) || 0 : post.id,
      title: post.title || "",
      htmlContent: post.htmlContent || "",
      plainContent: post.plainContent || "",
      coverImageUrl: post.coverImageUrl || post.coverImage || "",
      coverImageLabel: post.coverImageLabel || post.coverImageName || undefined,
      galleryImagesUrl: post.galleryImagesUrl || post.galleryImages || [],
      category: post.category === "news" || post.category === "NEWS" ? "NEWS" : "ANNOUNCEMENT",
      videoUrl: post.videoUrl || null,
      url: post.url || post.slug || "",
      createdAt: post.createdAt || "",
      publishStatus: post.publishStatus || post.publish_status || undefined,
      status: (() => {
        const fromActiveStatus =
          typeof post.activeStatus === "string"
            ? post.activeStatus.toLowerCase()
            : undefined;
        if (fromActiveStatus === "active" || fromActiveStatus === "inactive") {
          return fromActiveStatus as "active" | "inactive";
        }
        const fromStatus =
          typeof post.status === "string" ? post.status.toLowerCase() : undefined;
        if (fromStatus === "active" || fromStatus === "inactive") {
          return fromStatus as "active" | "inactive";
        }
        if (typeof post.isActive === "boolean") {
          return post.isActive ? "active" : "inactive";
        }
        return undefined;
      })(),
    };
  }

  // Posts API
  async getPosts(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string,
    activeStatus?: "active" | "inactive",
    publishStatus?: "publish" | "draft"
  ): Promise<PostsResponse> {
    const params: {
      page: number;
      limit: number;
      category?: string;
      search?: string;
      activeStatus?: "active" | "inactive";
      publishStatus?: "publish" | "draft";
    } = {
      page,
      limit,
    };
    
    if (category && category !== "all") {
      params.category = category;
    }

    if (search && search.trim() !== "") {
      params.search = search.trim();
    }

    if (activeStatus === "active" || activeStatus === "inactive") {
      params.activeStatus = activeStatus;
    }

    if (publishStatus === "publish" || publishStatus === "draft") {
      params.publishStatus = publishStatus;
    }
    
    const response = await this.client.get<any>("/posts", {
      params,
    });
    
    // Transform posts to match expected structure
    const transformedData = {
      ...response.data,
      posts: (response.data.posts || []).map((post: any) => this.transformPost(post)),
    };
    
    return transformedData;
  }

  async createPost(formData: CreatePostFormData): Promise<ApiResponse<unknown>> {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("slug", formData.url);
    data.append("category", formData.category);
    data.append("language", formData.language);
    
    if (formData.coverImageLabel) {
      data.append("coverImageLabel", formData.coverImageLabel);
    }
    data.append("htmlContent", formData.htmlContent);
    
    // Convert HTML content to plain text and send it
    const plainContent = htmlToPlainText(formData.htmlContent);
    data.append("plainContent", plainContent);

    if (formData.videoUrl && formData.videoUrl.trim() !== "") {
      data.append("videoUrl", formData.videoUrl);
    }

    if (formData.coverImage?.[0]) {
      // Create a new File object with the name without extension
      const originalFile = formData.coverImage[0];
      const fileNameWithoutExt = originalFile.name.replace(/\.[^/.]+$/, "");
      const newFile = new File([originalFile], fileNameWithoutExt, { type: originalFile.type });
      data.append("coverImage", newFile);
    }
    
    if (formData.galleryImages?.length) {
      Array.from(formData.galleryImages).forEach((file) => {
        // Remove extension from gallery image filenames
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        const newFile = new File([file], fileNameWithoutExt, { type: file.type });
        data.append("galleryImages", newFile);
      });
    }

    const response = await this.client.post<ApiResponse<any>>(
      "/posts",
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    
    // Transform response if it contains post data
    if (response.data.data) {
      const transformedData = {
        ...response.data,
        data: this.transformPost(response.data.data),
      };
      return transformedData;
    }
    
    return response.data;
  }

  async getPost(id: number | string): Promise<Post> {
    const response = await this.client.get<any>(`/posts/${id}`);
    console.log("API getPost response:", response.data);
    // Handle different response structures
    const postData = response.data?.data || response.data?.post || response.data;
    console.log("Transformed post data:", this.transformPost(postData));
    return this.transformPost(postData);
  }

  async updatePost(id: number | string, formData: CreatePostFormData): Promise<ApiResponse<unknown>> {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("slug", formData.url);
    data.append("category", formData.category);
    data.append("language", formData.language);
    
    if (formData.coverImageLabel) {
      data.append("coverImageLabel", formData.coverImageLabel);
    }
    data.append("htmlContent", formData.htmlContent);
    
    // Convert HTML content to plain text and send it
    const plainContent = htmlToPlainText(formData.htmlContent);
    data.append("plainContent", plainContent);

    if (formData.videoUrl && formData.videoUrl.trim() !== "") {
      data.append("videoUrl", formData.videoUrl);
    }

    if (formData.coverImage?.[0]) {
      // Create a new File object with the name without extension
      const originalFile = formData.coverImage[0];
      const fileNameWithoutExt = originalFile.name.replace(/\.[^/.]+$/, "");
      const newFile = new File([originalFile], fileNameWithoutExt, { type: originalFile.type });
      data.append("coverImage", newFile);
    }
    
    if (formData.galleryImages?.length) {
      Array.from(formData.galleryImages).forEach((file) => {
        // Remove extension from gallery image filenames
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        const newFile = new File([file], fileNameWithoutExt, { type: file.type });
        data.append("galleryImages", newFile);
      });
    }

    // Include kept existing gallery image URLs in the same 'galleryImages' array (for edit mode)
    if (formData.keptGalleryImageUrls && formData.keptGalleryImageUrls.length > 0) {
      formData.keptGalleryImageUrls.forEach((url) => {
        // Append as plain string alongside files under the same key
        data.append("galleryImages", url);
      });
    }

    // Try PUT first, if it fails, the backend might use a different endpoint
    const response = await this.client.put<ApiResponse<any>>(
      `/posts/${id}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    ).catch(async (error) => {
      // If PUT fails with 404, try PATCH or different endpoint
      if (error.response?.status === 404) {
        console.log("PUT failed, trying PATCH...");
        try {
          return await this.client.patch<ApiResponse<any>>(
            `/posts/${id}`,
            data,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } catch (patchError) {
          // If PATCH also fails, try singular endpoint
          console.log("PATCH failed, trying /post/:id...");
          return await this.client.put<ApiResponse<any>>(
            `/post/${id}`,
            data,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        }
      }
      throw error;
    });
    
    // Transform response if it contains post data
    if (response.data.data) {
      const transformedData = {
        ...response.data,
        data: this.transformPost(response.data.data),
      };
      return transformedData;
    }
    
    return response.data;
  }

  async deletePost(id: number): Promise<ApiResponse<unknown>> {
    const response = await this.client.delete<ApiResponse<unknown>>(
      `/posts/${id}`
    );
    return response.data;
  }

  // Update publish status for a post (publish | draft)
  async updatePublishStatus(id: number, publishStatus: "publish" | "draft"): Promise<ApiResponse<unknown>> {
    const data = new FormData();
    data.append("publishStatus", publishStatus);

    const response = await this.client.patch<ApiResponse<any>>(
      `/posts/${id}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    ).catch(async () => {
      // Fallback to PUT if PATCH not supported (partial update)
      return this.client.put<ApiResponse<any>>(
        `/posts/${id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    });

    return response.data;
  }

  // Update active status for a post (active | inactive)
  async updateStatus(id: number, status: "active" | "inactive"): Promise<ApiResponse<unknown>> {
    const data = new FormData();
    data.append("activeStatus", status);

    const response = await this.client.patch<ApiResponse<any>>(
      `/posts/${id}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    ).catch(async () => {
      // Fallback to PUT
      return this.client.put<ApiResponse<any>>(
        `/posts/${id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    });

    return response.data;
  }
}

export const apiService = new ApiService();

