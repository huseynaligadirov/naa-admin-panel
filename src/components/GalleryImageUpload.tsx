import React, { useEffect, useState } from "react";
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import styles from "./CreatePostModal.module.css";

type Props = {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
};

const GalleryImageUpload: React.FC<Props> = ({  watch, setValue }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const galleryImages = watch("galleryImages");

  // Handle file selection (merge new with existing)
  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    const existingFiles = galleryImages ? Array.from(galleryImages) : [];

    // Merge old + new
    const allFiles = [...existingFiles, ...newFiles];

    // Update react-hook-form value manually
    const dataTransfer = new DataTransfer();
    allFiles.forEach((file: any) => dataTransfer.items.add(file));
    setValue("galleryImages", dataTransfer.files);

    // Refresh previews
    const urls = allFiles.map((file: any) => URL.createObjectURL(file));
    setPreviews(urls);
  };

  // Update previews when value changes externally
  useEffect(() => {
    if (galleryImages && galleryImages.length > 0) {
      const urls = Array.from(galleryImages).map((file: any) =>
        URL.createObjectURL(file)
      );
      setPreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setPreviews([]);
    }
  }, [galleryImages]);

  // Remove a selected image
  const removeImage = (index: number) => {
    const updated = Array.from(galleryImages).filter((_, i) => i !== index);
    const dataTransfer = new DataTransfer();
    updated.forEach((file: any) => dataTransfer.items.add(file));
    setValue("galleryImages", dataTransfer.files);
  };

  return (
    <div style={{border: "1px solid #d9d8d8", borderRadius: "10px", padding: "12px"}} className={styles.formGroup}>
      <label className={styles.formLabel}>Gallery Images</label>
      <span  className={styles.formDescription}>JPG/PNG, multiple allowed</span>
      <label className={styles.uploadArea}>
        <div className={styles.uploadText}>
          <img src="/gallery.svg" alt=""/> Upload Gallery Images
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className={styles.fileInput}
        />
      </label>

      {previews.length > 0 && (
        <div className={styles.galleryPreviewGrid}>
          {previews.map((src, i) => (
            <div key={i} className={styles.galleryPreviewItem}>
              <img
                src={src}
                alt={`Gallery Preview ${i + 1}`}
                className={styles.galleryPreviewImage}
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className={styles.galleryRemoveBtn}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryImageUpload;
