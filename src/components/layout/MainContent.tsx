import { useState, useEffect, useRef } from "react";
import { Search, Plus, ChevronDown, ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { usePosts } from "../../hooks/usePosts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../../services/api";
import DeleteConfirmModal from "../DeleteConfirmModal";
import SuccessModal from "../SuccessModal";
import type { Post } from "../../types";
import { API_BASE_URL } from "../../config/constants";

interface MainContentProps {
  onCreatePost: () => void;
  onEditPost: (postId: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (limit: number) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to format time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  const displayHours = date.getHours() % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
};

// Helper function to get category display name
const getCategoryDisplay = (category: string) => {
  return category === "NEWS" ? "News" : "Announcement";
};

// Helper function to truncate text
const truncateText = (text: string, maxLength: number = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Helper function to get subtitle (first part of title)
const getSubtitle = (title: string) => {
  const words = title.split(" ");
  if (words.length > 2) {
    return words.slice(0, 2).join(" ");
  }
  return words[0] || "";
};

export default function MainContent({
  onCreatePost,
  onEditPost,
  currentPage,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  categoryFilter,
  onCategoryFilterChange,
}: MainContentProps) {
  const [isPerPageOpen, setIsPerPageOpen] = useState(false);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const [deletePostTitle, setDeletePostTitle] = useState<string>("");
  const [showDeleteSuccess, setShowDeleteSuccess] = useState<boolean>(false);
  const perPageRef = useRef<HTMLDivElement>(null);
  const categoryFilterRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const { data, isLoading, isError } = usePosts(
    currentPage,
    itemsPerPage,
    categoryFilter,
    searchTerm,
    statusFilter === "all" ? undefined : statusFilter
  );

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setDeletePostId(null);
      setDeletePostTitle("");
      setShowDeleteSuccess(true);
    },
    onError: (error) => {
      console.error("❌ Delete error:", error);
    },
  });

  const handleDeleteClick = (post: Post) => {
    setDeletePostId(post.id);
    setDeletePostTitle(post.title);
  };

  const handleDeleteConfirm = () => {
    if (deletePostId) {
      deleteMutation.mutate(deletePostId);
    }
  };

  const handleDeleteCancel = () => {
    setDeletePostId(null);
    setDeletePostTitle("");
  };

  const perPageOptions = [10, 20, 30, 50, 100];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (perPageRef.current && !perPageRef.current.contains(event.target as Node)) {
        setIsPerPageOpen(false);
      }
      if (categoryFilterRef.current && !categoryFilterRef.current.contains(event.target as Node)) {
        setIsCategoryFilterOpen(false);
      }
    };

    if (isPerPageOpen || isCategoryFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPerPageOpen, isCategoryFilterOpen]);

  return (
    <>
      <DeleteConfirmModal
        isOpen={deletePostId !== null}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        postTitle={deletePostTitle}
        isDeleting={deleteMutation.isPending}
      />
      <SuccessModal
        isOpen={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
        isEdit={false}
        isDelete={true}
      />
      <div className="main">
      <div className="main-header">
        <div>
          <h1>News & Announcements</h1>
          <p>{data?.total || 0} Posts</p>
        </div>
        <button onClick={onCreatePost} className="add-btn">
          <Plus size={16} /> Add News or Announcement
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-dropdown" ref={categoryFilterRef}>
          <button
            className="filter-btn"
            onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)}
          >
            {categoryFilter === "all"
              ? "All Posts"
              : categoryFilter === "news"
              ? "News"
              : "Announcement"}{" "}
            <ChevronDown size={16} />
          </button>
          {isCategoryFilterOpen && (
            <div className="filter-dropdown-menu">
              <button
                className={`filter-option ${categoryFilter === "all" ? "active" : ""}`}
                onClick={() => {
                  onCategoryFilterChange("all");
                  setIsCategoryFilterOpen(false);
                }}
              >
                All Posts
              </button>
              <button
                className={`filter-option ${categoryFilter === "news" ? "active" : ""}`}
                onClick={() => {
                  onCategoryFilterChange("news");
                  setIsCategoryFilterOpen(false);
                }}
              >
                News
              </button>
              <button
                className={`filter-option ${categoryFilter === "announcement" ? "active" : ""}`}
                onClick={() => {
                  onCategoryFilterChange("announcement");
                  setIsCategoryFilterOpen(false);
                }}
              >
                Announcement
              </button>
            </div>
          )}
        </div>
        <div className="filter-btn" style={{ padding: 0, border: "none", background: "transparent" }}>
          <select
            value={statusFilter}
            onChange={(e) => {
              const value = e.target.value as "all" | "active" | "inactive";
              setStatusFilter(value);
              onPageChange(1);
            }}
            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #E5E7EB", background: "white" }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="search-box">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onPageChange(1);
            }}
          />
        </div>

        {/* Temporary static selectbox (no functionality) */}
        <button className="filter-btn" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#16a34a",
            }}
          ></span>
          Publish <ChevronDown size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Post</th>
              <th>Type</th>
              <th>Sharing time</th>
              <th>Status</th>
              <th>Publish Status</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7}>Loading...</td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7}>Error loading posts. Please try again.</td>
              </tr>
            ) : data?.posts && data.posts.length > 0 ? (
              data.posts.map((post: Post) => (
                <tr key={post.id}>
                  <td>
                    <div className="post-info">
                      <div className="post-image">
                        <img
                          src={post.coverImageUrl.startsWith('upload')?`${API_BASE_URL }/${post.coverImageUrl}`: post.coverImageUrl || "/placeholder-image.png"}
                          alt={post.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder-image.png";
                          }}
                        />
                      </div>
                      <div className="post-content">
                        <div className="post-title">{truncateText(post.title, 30)}</div>
                        <div className="post-subtitle">{getSubtitle(post.title)}</div>
                        <div className="post-desc">
                          {truncateText(post.plainContent, 60)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`type-badge ${
                        post.category === "NEWS" ? "news" : "announcement"
                      }`}
                    >
                      {getCategoryDisplay(post.category)}
                    </span>
                  </td>
                  <td>
                    <div className="date-time">
                      <div className="date-text">{formatDate(post.createdAt)}</div>
                      <div className="time-text">{formatTime(post.createdAt)}</div>
                    </div>
                  </td>
                  <td>
                    <div className="status-select-wrapper" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        className="status-dot"
                        style={{
                          display: "inline-block",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: (post.status || "active") === "active" ? "#16a34a" : "#ef4444",
                        }}
                      ></span>
                      <select
                        value={post.status || "active"}
                        onChange={(e) => {
                          const value = (e.target.value as "active" | "inactive");
                          apiService.updateStatus(post.id, value).then(() => {
                            queryClient.invalidateQueries({ queryKey: ["posts"] });
                          });
                        }}
                        className="status-select"
                        style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #E5E7EB", background: "white" }}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className="publish-select-wrapper" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        className="publish-dot"
                        style={{
                          display: "inline-block",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: (post.publishStatus || "publish") === "publish" ? "#16a34a" : "#f59e0b",
                        }}
                      ></span>
                      <select
                        value={post.publishStatus || "publish"}
                        onChange={(e) => {
                          const value = (e.target.value as "publish" | "draft");
                          apiService.updatePublishStatus(post.id, value).then(() => {
                            queryClient.invalidateQueries({ queryKey: ["posts"] });
                          });
                        }}
                        className="publish-select"
                        style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #E5E7EB", background: "white" }}
                      >
                        <option value="publish">Publish</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </td>
                  <td className="author-cell">snovruzlu</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="icon-btn edit-btn"
                        onClick={() => {
                          onEditPost(post.id)
                          console.log(post)
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        className="icon-btn delete-btn"
                        onClick={() => handleDeleteClick(post)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No posts found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 0 && (
        <div className="pagination">
          <button
            className="pagination-nav-btn"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
          </button>
          <div className="page-numbers">
            {Array.from({ length: Math.min(data.totalPages, 7) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`page-number ${page === currentPage ? "active" : ""}`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          <button
            className="pagination-nav-btn"
            onClick={() => onPageChange(Math.min(data.totalPages, currentPage + 1))}
            disabled={currentPage === data.totalPages}
          >
            <ChevronRight size={18} />
          </button>
          <div className="per-page-container" ref={perPageRef}>
            <button
              className="per-page-btn"
              onClick={() => setIsPerPageOpen(!isPerPageOpen)}
            >
              {itemsPerPage} / Page <ChevronDown size={14} />
            </button>
            {isPerPageOpen && (
              <div className="per-page-dropdown">
                {perPageOptions.map((option) => (
                  <button
                    key={option}
                    className={`per-page-option ${
                      itemsPerPage === option ? "active" : ""
                    }`}
                    onClick={() => {
                      onItemsPerPageChange(option);
                      setIsPerPageOpen(false);
                    }}
                  >
                    {option} / Page
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}

