import type { UseFormRegister, FieldErrors } from "react-hook-form";
import styles from "./CreatePostModal.module.css";

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
};

export default function CoverImageUpload({ register, errors }: Props) {
  const coverImageError = errors.coverImage;

  let errorMessage: string | undefined;
  if (!coverImageError) {
    errorMessage = undefined;
  } else if (typeof coverImageError === "string") {
    errorMessage = coverImageError;
  } else if ("message" in coverImageError && typeof coverImageError.message === "string") {
    // coverImageError is a FieldError-like object
    errorMessage = coverImageError.message;
  } else {
    errorMessage = undefined;
  }

  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Cover Image</label>
      <label className={styles.uploadArea}>
     
        <div className={styles.uploadText}> <img src="/gallery.svg" alt=""/> Upload Cover Image</div>
        <input
          
          type="file"
          accept="image/*"
          className={styles.fileInput}
          {...register("coverImage", { required: "Cover image is required" })}
        />
      </label>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
}