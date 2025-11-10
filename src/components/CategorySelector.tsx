import type      { ControllerRenderProps } from "react-hook-form";
import styles from "./CreatePostModal.module.css";

type Props = {
  field: ControllerRenderProps<any, "category">;
};

export default function CategorySelector({ field }: Props) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Category</label>
      <div className={styles.categoryButtons}>
        <button
          type="button"
          className={`${styles.categoryBtn} ${field.value === "news" ? styles.categoryBtnActive : ""}`}
          onClick={() => field.onChange("news")}
        >
          <img src="/news.svg" alt="News" />
          News
        </button>
        <button
          type="button"
          className={`${styles.categoryBtn} ${field.value === "announcement" ? styles.categoryBtnActive : ""}`}
          onClick={() => field.onChange("announcement")}
        >

          <img src="/announce.svg" alt="News" />
          Announcement
        </button>
      </div>
    </div>
  );
}
