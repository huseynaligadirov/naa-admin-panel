import { useState } from "react";
import "./App.css";
import CreatePostModal from "./components/CreatePostModal";
import Sidebar from "./components/layout/Sidebar";
import MainContent from "./components/layout/MainContent";
import type { SidebarState } from "./types";

const App: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editPostId, setEditPostId] = useState<number | string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    website: true,
    library: false,
    meteorology: false,
    museum: false,
  });

  const toggleSidebar = (section: keyof SidebarState): void => {
    setSidebarState((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);
    setCurrentPage(1); // Reset to first page when changing category filter
  };

  const handleCreatePost = () => {
    setEditPostId(null);
    setIsCreateModalOpen(true);
  };

  const handleEditPost = (postId: (string | number)) => {
    setEditPostId(postId);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditPostId(null);
  };

  return (
    <div className="panel">
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        postId={editPostId as number | string | null}
      />

      <Sidebar sidebarState={sidebarState} onToggle={toggleSidebar} />

      <MainContent
        onCreatePost={handleCreatePost}
        onEditPost={handleEditPost}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={handleCategoryFilterChange}
      />
    </div>
  );
};

export default App;
