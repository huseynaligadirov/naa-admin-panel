import type { UseFormRegister } from "react-hook-form";
import styles from "./CreatePostModal.module.css";

type Props = {
  register: UseFormRegister<any>;
};

export default function SlugInput({ register }: Props) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Slug</label>
      <input
        {...register("slug")}
        className={`${styles.formInput} ${styles.formInputReadonly}`}
        placeholder="naa.edu.az/"
        readOnly
      />
    </div>
  );
}
