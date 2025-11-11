import type { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import styles from "./CreatePostModal.module.css";

type Props = {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  errors?: FieldErrors;
};

export default function SlugInput({ register, watch, errors }: Props) {
  const slug = watch("url") || "";
  const displayValue = slug ? `naa.edu.az/${slug}` : "naa.edu.az/";

  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>URL</label>
      {/* Hidden input to register the slug field with react-hook-form */}
      <input
        type="hidden"
        {...register("url", {
          minLength: {
            value: 3,
            message: "Slug must be at least 3 characters",
          },
        })}
      />
      <input
        value={displayValue}
        className={`${styles.formInput} ${styles.formInputReadonly}`}
        placeholder="naa.edu.az/"
        readOnly
      />
      {errors?.url && (
        <p className={styles.errorMessage}>{errors.url.message as string}</p>
      )}
    </div>
  );
}
