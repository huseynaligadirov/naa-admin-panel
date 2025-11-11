import React, { useEffect, useState } from "react";
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import styles from "./CreatePostModal.module.css";
import { API_BASE_URL } from "../config/constants";

type Props = {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  existingGalleryImages?: string[];
  isEditMode?: boolean;
};

const GalleryImageUpload: React.FC<Props> = ({ watch, setValue, existingGalleryImages = [], isEditMode = false }) => {
  const [previews, setPreviews] = useState<Array<{ url: string; isFile: boolean; file?: File; originalUrl?: string }>>([]);
  const galleryImages = watch("galleryImages");

  // Initialize with existing images when in edit mode
  useEffect(() => {
    console.log("GalleryImageUpload - existingGalleryImages:", existingGalleryImages, "isEditMode:", isEditMode);
    if (existingGalleryImages && existingGalleryImages.length > 0 && isEditMode) {
      console.log("Initializing gallery images:", existingGalleryImages);
      const existingPreviews = existingGalleryImages.map(url => ({ 
        url, 
        isFile: false,
        originalUrl: url 
      }));
      console.log("Setting previews:", existingPreviews);
      setPreviews(existingPreviews);
      setValue("keptGalleryImageUrls", existingGalleryImages);
    } else if (!isEditMode) {
      // Clear previews when not in edit mode
      setPreviews([]);
    }
  }, [existingGalleryImages, isEditMode, setValue]);

  // Handle file selection (new uploads add to existing)
  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    const existingFiles = galleryImages ? Array.from(galleryImages) : [];

    // Merge old + new files
    const allFiles = [...existingFiles, ...newFiles];

    // Update react-hook-form value manually
    const dataTransfer = new DataTransfer();
    allFiles.forEach((file: any) => dataTransfer.items.add(file));
    setValue("galleryImages", dataTransfer.files);

    // Refresh previews - keep existing URL previews (that weren't removed) and add new file previews
    setPreviews(prevPreviews => {
      const existingUrlPreviews = prevPreviews
        .filter(p => !p.isFile)
        .map(p => ({ url: p.url, isFile: false, originalUrl: p.originalUrl || p.url }));
      const newFilePreviews = allFiles.map((file) => ({
        url: URL.createObjectURL(file as File),
        isFile: true,
        file: file as File,
      }));
      return [...existingUrlPreviews, ...newFilePreviews];
    });
    
    // Reset the input so the same file can be selected again if needed
    event.target.value = '';
  };

  // Update previews when galleryImages changes (but preserve existing URL previews)
  useEffect(() => {
    if (galleryImages && galleryImages.length > 0) {
      setPreviews(prevPreviews => {
        // Keep existing URL previews (that weren't removed)
        const existingUrlPreviews = prevPreviews
          .filter(p => !p.isFile)
          .map(p => ({ url: p.url, isFile: false, originalUrl: p.originalUrl || p.url }));
        
        // Add file previews
        const filePreviews = Array.from(galleryImages).map((file) => ({
          url: URL.createObjectURL(file as File),
          isFile: true,
          file: file as File,
        }));
        
        return [...existingUrlPreviews, ...filePreviews];
      });
    }
  }, [galleryImages]);

  // Remove a selected image
  const removeImage = (index: number) => {
    const preview = previews[index];
    const updatedPreviews = previews.filter((_, i) => i !== index);
    
    if (preview.isFile && preview.file) {
      // Remove file from FileList
      const files = galleryImages ? Array.from(galleryImages) : [];
      // Count how many file previews come before this one
      const filePreviewsBefore = previews.slice(0, index).filter(p => p.isFile).length;
      if (filePreviewsBefore < files.length) {
        const updated = files.filter((_, i) => i !== filePreviewsBefore);
        const dataTransfer = new DataTransfer();
        updated.forEach((file: any) => dataTransfer.items.add(file));
        setValue("galleryImages", dataTransfer.files);
      }
      // Revoke the object URL
      URL.revokeObjectURL(preview.url);
    } else {
      // Remove existing URL preview (in edit mode)
      // The keptGalleryImageUrls will be updated in the useEffect below
    }
    
    setPreviews(updatedPreviews);
  };

  // Update keptGalleryImageUrls when previews change (for existing images)
  useEffect(() => {
    const existingUrls = previews
      .filter(p => !p.isFile && p.originalUrl)
      .map(p => p.originalUrl!);
    
    // Store kept existing images in the form field
    setValue("keptGalleryImageUrls", existingUrls);
  }, [previews, setValue]);

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
          {previews.map((preview, i) => (
            <div key={i} className={styles.galleryPreviewItem}>
              <img
                src={preview.url.startsWith('upload')?`${API_BASE_URL}/${preview.url}`: preview.url}
                alt={`Gallery Preview ${i + 1}`}
                className={styles.galleryPreviewImage}
              />
              {preview.isFile && (
                <div style={{ position: "absolute", top: "4px", left: "4px", background: "#10b981", color: "white", padding: "2px 6px", borderRadius: "4px", fontSize: "10px" }}>
                  New
                </div>
              )}
              {!preview.isFile && isEditMode && (
                <div style={{ position: "absolute", top: "4px", left: "4px", background: "#6b7280", color: "white", padding: "2px 6px", borderRadius: "4px", fontSize: "10px" }}>
                  Current
                </div>
              )}
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
