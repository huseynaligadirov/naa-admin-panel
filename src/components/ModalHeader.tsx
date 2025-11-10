import styles from "./CreatePostModal.module.css";

export default function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.modalHeader}>
      <div className={styles.modalHeaderLeft}>
        <div className={styles.languageSelector}>
          <button className={`${styles.langBtn} ${styles.langBtnActive}`}><img src="/azerbaijan.png" /> AZ</button>
          <button className={styles.langBtn}><img src="/united-kingdom.png" /> EN</button>
        </div>
      </div>
      <button className={styles.closeBtn} onClick={onClose}>
        ×
      </button>
    </div>
  );
}
