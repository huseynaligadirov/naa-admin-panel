import { ChevronDown, Settings } from "lucide-react";
import type { SidebarState } from "../../types";

interface SidebarProps {
  sidebarState: SidebarState;
  onToggle: (section: keyof SidebarState) => void;
}

export default function Sidebar({ sidebarState, onToggle }: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <img src="/naa_logo.svg" alt="NAA Logo" />
        </div>
        <span className="sidebar-title">NAA Control Panel</span>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-section">
          <button
            onClick={() => onToggle("website")}
            className="sidebar-toggle active"
          >
            <span>
              <img src="/home-2.svg" alt="" />
              NAA Website
            </span>
            <img src="/arrow-up.svg" alt="" />
          </button>
          {sidebarState.website && (
            <div className="sidebar-submenu">
              <button>Post</button>
              <button>Media Library</button>
              <button>System Settings</button>
            </div>
          )}
        </div>

        <div className="sidebar-section">
          <button
            onClick={() => onToggle("library")}
            className="sidebar-toggle"
          >
            <span>
              <img src="/book.svg" alt="" />
              Library
            </span>
            <ChevronDown
              className={`icon ${sidebarState.library ? "" : "rotated"}`}
            />
          </button>
        </div>

        <div className="sidebar-section">
          <button
            onClick={() => onToggle("meteorology")}
            className="sidebar-toggle"
          >
            <span>
              <img src="/Dibujo.svg" alt="" />
              Meteorology
            </span>
            <ChevronDown
              className={`icon ${sidebarState.meteorology ? "" : "rotated"}`}
            />
          </button>
        </div>

        <div className="sidebar-section">
          <button
            onClick={() => onToggle("museum")}
            className="sidebar-toggle"
          >
            <span>
              <img src="/Temple.svg" alt="" />
              Museum
            </span>
            <ChevronDown
              className={`icon ${sidebarState.museum ? "" : "rotated"}`}
            />
          </button>
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="settings-btn">
          <Settings size={16} />
          Settings
        </button>
        <div className="user-info">
          <div className="avatar">KA</div>
          <div className="user-details">
            <div className="username">Khayal Ahmadli</div>
            <div className="user-id">khahmadli</div>
          </div>
        </div>
      </div>
    </div>
  );
}

