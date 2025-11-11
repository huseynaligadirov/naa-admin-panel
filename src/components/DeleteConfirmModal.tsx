import styles from "./CreatePostModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  postTitle?: string;
  isDeleting?: boolean;
};

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, postTitle, isDeleting = false }: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.successModalOverlay}>
      <div className={styles.successModal}>
        <button className={styles.successCloseBtn} onClick={onClose} disabled={isDeleting}>
          ×
        </button>
        <div className={styles.successContent}>
          <div style={{ 
            width: "80px", 
            height: "80px", 
            borderRadius: "50%", 
            background: "#ef4444", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            marginBottom: "24px" 
          }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className={styles.successTitle}>Delete Post?</h2>
          <p className={styles.successMessage}>
            {postTitle 
              ? `Are you sure you want to delete "${postTitle.substring(0, 50)}${postTitle.length > 50 ? '...' : ''}"? This action cannot be undone.`
              : "Are you sure you want to delete this post? This action cannot be undone."}
          </p>
          <div style={{ display: "flex", gap: "12px", width: "100%" }}>
            <button 
              className={styles.successOkBtn} 
              onClick={onClose}
              disabled={isDeleting}
              style={{ 
                background: "#6b7280", 
                flex: 1 
              }}
            >
              Cancel
            </button>
            <button 
              className={styles.successOkBtn} 
              onClick={onConfirm}
              disabled={isDeleting}
              style={{ 
                background: "#ef4444", 
                flex: 1 
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


