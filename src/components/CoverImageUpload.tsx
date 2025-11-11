import { useEffect, useState } from "react";
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import styles from "./CreatePostModal.module.css";
import { API_BASE_URL } from "../config/constants";

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  existingImageUrl?: string;
  isEditMode?: boolean;
};

export default function CoverImageUpload({ register, errors, watch, setValue, existingImageUrl, isEditMode = false }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUsingExisting, setIsUsingExisting] = useState<boolean>(false);
  const coverImage = watch("coverImage");
  const coverImageError = errors.coverImage;

  // Set existing image as preview when in edit mode
  useEffect(() => {
    if (existingImageUrl && isEditMode && !coverImage?.length) {
      setPreview(existingImageUrl);
      setIsUsingExisting(true);
    }
  }, [existingImageUrl, isEditMode, coverImage]);

  // Update preview when coverImage changes (new upload)
  useEffect(() => {
    if (coverImage && coverImage.length > 0) {
      const file = coverImage[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setIsUsingExisting(false);

      // Auto-fill coverImageLabel with filename without extension
      const fileName = file.name;
      const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, ""); // Remove extension
      const currentLabel = watch("coverImageLabel");
      if (!currentLabel || currentLabel.trim() === "") {
        setValue("coverImageLabel", fileNameWithoutExt);
      }

      // Clean up memory when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    } else if (!coverImage?.length && !existingImageUrl) {
      setPreview(null);
      setIsUsingExisting(false);
    } else if (!coverImage?.length && existingImageUrl && isEditMode) {
      // Restore existing image if no new file is selected
      setPreview(existingImageUrl);
      setIsUsingExisting(true);
    }
  }, [coverImage, setValue, watch, existingImageUrl, isEditMode]);

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
          <img src="/gallery.svg" alt=""/> {isEditMode ? "Change Cover Image (Optional)" : "Upload Cover Image"}
        </div>
        <input
          type="file"
          accept="image/*"
          className={styles.fileInput}
          {...register("coverImage", {
            required: !isEditMode ? "Cover image is required" : false,
            validate: {
              fileType: (files: FileList) => {
                if (files && files.length > 0) {
                  const file = files[0];
                  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
                  if (!validTypes.includes(file.type)) {
                    return "Please upload a valid image file (JPG, PNG, or WEBP)";
                  }
                }
                return true;
              },
              fileSize: (files: FileList) => {
                if (files && files.length > 0) {
                  const file = files[0];
                  const maxSize = 5 * 1024 * 1024; // 5MB
                  if (file.size > maxSize) {
                    return "Image size must be less than 5MB";
                  }
                }
                return true;
              },
            },
          })}
        />
      </label>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      
      {preview && (
        <div className={styles.coverImagePreview}>
          <img
            src={preview.startsWith('upload')?`${API_BASE_URL}/${preview}`: preview}
            alt="Cover Preview"
            className={styles.coverPreviewImage}
          />
          {isUsingExisting && isEditMode && (
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#6b7280" }}>
              Current cover image (upload new to replace)
            </div>
          )}
          <div className={styles.photoLabelContainer}>
            <div className={styles.photoLabelInputWrapper}>
              <input
                type="text"
                value={watch("coverImageLabel")}
                className={styles.photoLabelInput}
                placeholder="Enter Image Label"
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