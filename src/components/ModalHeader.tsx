import type { ControllerRenderProps } from "react-hook-form";
import styles from "./CreatePostModal.module.css";

type Props = {
  onClose: () => void;
  field: ControllerRenderProps<any, "language">;
};

export default function ModalHeader({ onClose, field }: Props) {
  const currentLanguage = field.value || "az";
  
  return (
    <div className={styles.modalHeader}>
      <div className={styles.modalHeaderLeft}>
        <div className={styles.languageSelector}>
          <button
            type="button"
            className={`${styles.langBtn} ${currentLanguage === "az" ? styles.langBtnActive : ""}`}
            onClick={() => field.onChange("az")}
          >
            <img src="/azerbaijan.png" alt="Azerbaijan" /> AZ
          </button>
          <button
            type="button"
            className={`${styles.langBtn} ${currentLanguage === "en" ? styles.langBtnActive : ""}`}
            onClick={() => field.onChange("en")}
          >
            <img src="/united-kingdom.png" alt="United Kingdom" /> EN
          </button>
        </div>
      </div>
      <button className={styles.closeBtn} onClick={onClose}>
        ×
      </button>
    </div>
  );
}
