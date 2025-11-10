import React, { useState } from "react";
import {
  ChevronDown,
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./App.css";
import CreatePostModal from "./components/CreatePostModal";

// Define post type
interface Post {
  id: number;
  title: string;
  description: string;
  type: "News" | "Announcement";
  date: string;
  time: string;
  status: string;
  publishStatus: string;
  author: string;
  image: string;
}

// Define sidebar state type
interface SidebarState {
  website: boolean;
  library: boolean;
  meteorology: boolean;
  museum: boolean;
}

const App: React.FC = () => {
  // const [selectedCategory, setSelectedCategory] = useState<string>("All Posts");
  // const [selectedStatus, setSelectedStatus] = useState<string>("All Status");
  const [selectedCategory] = useState<string>("All Posts");
  const [selectedStatus] = useState<string>("All Status");

  


  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showSidebar, setShowSidebar] = useState<SidebarState>({
    website: true,
    library: false,
    meteorology: false,
    museum: false,
  });

  const posts: Post[] = [
    {
      id: 1,
      title: "Milli Aviasiya Akade...",
      description:
        "Milli Aviasiya Akademiyasının təşkilatçılığı ilə həyata k...",
      type: "News",
      date: "06/11/2026",
      time: "10:19 AM",
      status: "Active",
      publishStatus: "Publish",
      author: "snovruzlu",
      image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fmodern.az%2Faz%2Faktual%2F113185%2Fldquoaviasiya-haqqindardquo-qanun-deyisdi-1-ve-3-avro-oumldenilmeyecek%2F&psig=AOvVaw3BKXZfAPw6J1Q6lSm2fGCW&ust=1762851109915000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIDGqKOa55ADFQAAAAAdAAAAABAE",
    },
  
  ];

  const toggleSidebar = (section: keyof SidebarState): void => {
    setShowSidebar((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="panel">
      {/* Sidebar */}

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <img src="/naa_logo.svg" alt=""  />
          </div>
          <span className="sidebar-title">NAA Control Panel</span>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section">
            <button
              onClick={() => toggleSidebar("website")}
              className="sidebar-toggle active"
            >
              <span>
                <img src="/home-2.svg" alt=""  />
                NAA Website</span>
              <img src="/arrow-up.svg" alt=""  />
            </button>
            {showSidebar.website && (
              <div className="sidebar-submenu">
                <button>Post</button>
                <button>Media Library</button>
                <button>System Settings</button>
              </div>
            )}
          </div>

          <div className="sidebar-section">
            <button
              onClick={() => toggleSidebar("library")}
              className="sidebar-toggle"
            >
              <span>
                <img src="/book.svg" alt=""  />
                Library
                </span>
              <ChevronDown
                className={`icon ${showSidebar.library ? "" : "rotated"}`}
              />
            </button>
          </div>

          <div className="sidebar-section">
            <button
              onClick={() => toggleSidebar("meteorology")}
              className="sidebar-toggle"
            >
              <span>
                <img src="/Dibujo.svg" alt=""  />
                Meteorology</span>
              <ChevronDown
                className={`icon ${showSidebar.meteorology ? "" : "rotated"}`}
              />
            </button>
          </div>

          <div className="sidebar-section">
            <button
              onClick={() => toggleSidebar("museum")}
              className="sidebar-toggle"
            >
              <span>
                <img src="/Temple.svg" alt=""  />
                Museum</span>
              <ChevronDown
                className={`icon ${showSidebar.museum ? "" : "rotated"}`}
              />
            </button>
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="settings-btn">⚙️ Settings</button>
          <div className="user-info">
            <div className="avatar">KA</div>
            <div>
              <div className="username">Khayal Ahmadli</div>
              <div className="user-id">khahmadli</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main">
        <div className="main-header">
          <div>
            <h1>News & Announcements</h1>
            <p>210 Posts</p>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} className="add-btn">
            <Plus size={16} /> Add News or Announcement
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          <button className="filter-btn">
            {selectedCategory} <ChevronDown size={16} />
          </button>
          <button className="filter-btn">
            {selectedStatus} <ChevronDown size={16} />
          </button>
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input type="text" placeholder="Search" />
          </div>
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
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="post-info">
                      <div className="post-image"> <img src={post.image} alt="" /> </div>
                      <div>
                        <div className="post-title">{post.title}</div>
                        <div className="post-desc">{post.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`type-badge ${
                        post.type === "News" ? "news" : "announcement"
                      }`}
                    >
                      {post.type}
                    </span>
                  </td>
                  <td>
                    <div>{post.date}</div>
                    <small>{post.time}</small>
                  </td>
                  <td>
                    <span className="status-active">● {post.status}</span>
                  </td>
                  <td>
                    <button className="publish-btn">
                      ● {post.publishStatus} <ChevronDown size={12} />
                    </button>
                  </td>
                  <td>{post.author}</td>
                  <td>
                    <button className="icon-btn">
                      <Edit2 size={14} />
                    </button>
                    <button className="icon-btn">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button>
            <ChevronLeft size={18} />
          </button>
          <div className="page-numbers">
            {[1, 2, 3, 4, 5, 6, 7].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={page === currentPage ? "active" : ""}
              >
                {page}
              </button>
            ))}
          </div>
          <button>
            <ChevronRight size={18} />
          </button>
          <div className="per-page">
            10 / Page <ChevronDown size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
