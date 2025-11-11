import styles from "./CreatePostModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  isDelete?: boolean;
};

export default function SuccessModal({ isOpen, onClose, isEdit = false, isDelete = false }: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.successModalOverlay}>
      <div className={styles.successModal}>
        <button className={styles.successCloseBtn} onClick={onClose}>
          ×
        </button>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                fill="white"
              />
            </svg>
          </div>
          <h2 className={styles.successTitle}>
            {isDelete ? "Deleted Successfully!" : isEdit ? "Updated Successfully!" : "Added Successfully!"}
          </h2>
          <p className={styles.successMessage}>
            {isDelete 
              ? "Post deleted successfully" 
              : isEdit 
              ? "Your news updated successfully" 
              : "Your news added successfully"}
          </p>
          <button className={styles.successOkBtn} onClick={onClose}>
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

