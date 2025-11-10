import type { UseFormRegister, FieldErrors } from "react-hook-form";
import styles from "./CreatePostModal.module.css";

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors;
};

export default function TitleInput({ register, errors }: Props) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Title</label>
      <input
        {...register("title", { required: "Title is required" })}
        className={styles.formInput}
        placeholder="Enter title"
      />
      {(errors.title as any)?.message && <p className={styles.errorMessage}>{(errors.title as any).message}</p>}
    </div>
  );
}
