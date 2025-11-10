import type { UseFormRegister, UseFormWatch } from "react-hook-form";
import styles from "./CreatePostModal.module.css";

type Props = {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
};

export default function SlugInput({ register, watch }: Props) {
  const slug = watch("slug") || "";
  const displayValue = slug ? `naa.edu.az/${slug}` : "naa.edu.az/";

  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Slug</label>
      {/* Hidden input to register the slug field with react-hook-form */}
      <input type="hidden" {...register("slug")} />
      <input
        value={displayValue}
        className={`${styles.formInput} ${styles.formInputReadonly}`}
        placeholder="naa.edu.az/"
        readOnly
      />
    </div>
  );
}
