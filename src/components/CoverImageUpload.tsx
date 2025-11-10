import { useEffect, useState } from "react";
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import styles from "./CreatePostModal.module.css";

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
};

export default function CoverImageUpload({ register, errors, watch, setValue }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const coverImage = watch("coverImage");
  const coverImageError = errors.coverImage;

  // Update preview when coverImage changes
  useEffect(() => {
    if (coverImage && coverImage.length > 0) {
      const file = coverImage[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Clean up memory when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [coverImage]);

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
        <div className={styles.uploadText}>
          <img src="/gallery.svg" alt=""/> Upload Cover Image
        </div>
        <input
          type="file"
          accept="image/*"
          className={styles.fileInput}
          {...register("coverImage", { required: "Cover image is required" })}
        />
      </label>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      
      {preview && (
        <div className={styles.coverImagePreview}>
          <img
            src={preview}
            alt="Cover Preview"
            className={styles.coverPreviewImage}
          />
          <div className={styles.photoLabelContainer}>
            <div className={styles.photoLabelInputWrapper}>
              <input
                type="text"
                className={styles.photoLabelInput}
                placeholder="Photo name"
                {...register("coverImageLabel")}
              />
              <button
                type="button"
                className={styles.photoLabelClearBtn}
                onClick={() => setValue("coverImageLabel", "")}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}