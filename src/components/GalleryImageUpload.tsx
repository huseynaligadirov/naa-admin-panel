import React, { useEffect, useState } from "react";
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";

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
    <div>
      <label className="block font-semibold mb-1">Gallery Images:</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="cursor-pointer"
      />

      {previews.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {previews.map((src, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={src}
                alt={`Gallery Preview ${i + 1}`}
                style={{
                  width: "100%",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  cursor: "pointer",
                }}
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
