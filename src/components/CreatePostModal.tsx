import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import styles from "./CreatePostModal.module.css";
import { titleToSlug } from "../utils/slug";
import { htmlToPlainText } from "../utils/plainText";
import { apiService } from "../services/api";
import { DEFAULT_FORM_VALUES } from "../config/constants";
import type { CreatePostFormData, Post } from "../types";

import ModalHeader from "./ModalHeader";
import TitleInput from "./TitleInput";
import SlugInput from "./SlugInput";
import CategorySelector from "./CategorySelector";
import CoverImageUpload from "./CoverImageUpload";
import RichTextEditor from "./RichTextEditor";
import GalleryImageUpload from "./GalleryImageUpload";
import SuccessModal from "./SuccessModal";

type CreatePostModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  postId?: number | string | null;
};

export default function CreatePostModal({ isOpen = true, onClose = () => {}, postId = null }: CreatePostModalProps) {
  const isEditMode = postId !== null;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreatePostFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onChange",
  });

  const queryClient = useQueryClient();
  const [step, setStep] = useState<number>(1);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const title = watch("title");
  const previousPostIdRef = useRef<number | null | string>(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset(DEFAULT_FORM_VALUES);
      setStep(1);
      setShowSuccessModal(false);
      previousPostIdRef.current = null;
    }
  }, [isOpen, reset]);

  // Reset form when switching from edit to create mode
  useEffect(() => {
    if (isOpen && !isEditMode && previousPostIdRef.current !== null) {
      // Switching from edit to create mode
      reset(DEFAULT_FORM_VALUES);
      setStep(1);
    }
    previousPostIdRef.current = postId;
  }, [isEditMode, isOpen, postId, reset]);

  // Fetch post data when editing
  const { data: postData, isLoading: isLoadingPost, error: postError } = useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: () => apiService.getPost(postId!),
    enabled: isEditMode && isOpen && postId !== null,
    retry: 1,
  });

  // Log errors if any
  useEffect(() => {
    if (postError) {
      console.error("Error fetching post:", postError);
    }
  }, [postError]);

  // Populate form when post data is loaded
  useEffect(() => {
    if (postData && isEditMode && isOpen) {
      console.log("Populating form with post data:", postData);
      console.log("Gallery images URL:", postData.galleryImagesUrl);
      const formValues: CreatePostFormData = {
        title: postData.title || "",
        url: postData.url || "",
        category: (postData.category?.toLowerCase() || "news") as "news" | "announcement",
        language: "az", // Default language
        htmlContent: postData.htmlContent || "",
        plainContent: postData.plainContent || htmlToPlainText(postData.htmlContent || ""),
        videoUrl: postData.videoUrl || "",
        coverImage: undefined as any,
        galleryImages: undefined as any,
        coverImageLabel: postData.coverImageLabel || "",
      };
      reset(formValues);
      // Note: coverImage and galleryImages are FileList, so we can't set them from URLs
      // Users will need to re-upload if they want to change images
    }
  }, [postData, isEditMode, isOpen, reset]);

  // Keep plainContent in sync with htmlContent
  const htmlContent = watch("htmlContent");
  useEffect(() => {
    const plain = htmlToPlainText(htmlContent || "");
    setValue("plainContent", plain, { shouldValidate: false, shouldDirty: true });
  }, [htmlContent, setValue]);

  // React Query mutation
  const mutation = useMutation({
    mutationFn: (formData: CreatePostFormData) => {
      if (isEditMode && postId) {
        return apiService.updatePost(postId, formData);
      }
      return apiService.createPost(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ["post", postId] });
      }
      setStep(1);
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error("❌ Upload error:", error);
    },
  });

  // Auto-generate slug from title (only in create mode)
  useEffect(() => {
    if (title && !isEditMode) {
      const slug = titleToSlug(title);
      setValue("url", slug);
    }
  }, [title, setValue, isEditMode]);

  const onSubmit = (data: CreatePostFormData) => {
    // Convert HTML content to plain text and add it to the data
    const plainContent = htmlToPlainText(data.htmlContent);
    const dataWithPlainContent = {
      ...data,
      plainContent,
    };
    
    mutation.mutate(dataWithPlainContent);
    console.log(dataWithPlainContent);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    reset(DEFAULT_FORM_VALUES);
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  if (isEditMode && isLoadingPost) {
    return (
      <div className={styles.createPostModalOverlay}>
        <div className={styles.createPostModal}>
          <div style={{ padding: "48px", textAlign: "center" }}>Loading post data...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleSuccessModalClose}
        isEdit={isEditMode}
      />
      {!showSuccessModal && (
        <div className={styles.createPostModalOverlay}>
      <div className={styles.createPostModal}>
        <Controller
          name="language"
          control={control}
          defaultValue="az"
          render={({ field }) => <ModalHeader onClose={onClose} field={field} />}
        />

        <div className={styles.modalTitleSection}>
          <div className={styles.modalTitleRow}>
            <h2 className={styles.modalTitle}>
              {isEditMode ? "Edit News / Announcement" : "Create News / Announcement"}
            </h2>
            <span className={styles.stepIndicator}>{step}/2</span>
          </div>
          <div className={styles.LineProgressBar}>
            <div
              style={{ background: "#243C7B" }}
              className={styles.progressLine}
            ></div>
            <div
              style={{ background: step === 2 ? "#243C7B" : "#E0E7FA" }}
              className={styles.progressLine}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.modalForm}>
          {step === 1 ? (
            <>
              <TitleInput register={register} errors={errors} />
              <SlugInput register={register} watch={watch} errors={errors} />
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <CategorySelector field={field} error={errors.category?.message} />
                )}
              />
              <CoverImageUpload
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                existingImageUrl={postData?.coverImageUrl}
                isEditMode={isEditMode}
              />
              <Controller
                name="htmlContent"
                control={control}
                rules={{
                  required: "Content is required",
                  validate: (value) => {
                    if (!value || value.trim() === "" || value === "<p><br></p>" || value === "<p></p>") {
                      return "Content cannot be empty";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <RichTextEditor field={field} error={errors.htmlContent?.message} />
                )}
              />
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Video URL (Optional)</label>
                <input
                  type="url"
                  className={styles.formInput}
                  placeholder="https://example.com/video"
                  {...register("videoUrl", {
                    validate: (value) => {
                      if (value && value.trim() !== "") {
                        try {
                          new URL(value);
                          return true;
                        } catch {
                          return "Please enter a valid URL";
                        }
                      }
                      return true;
                    },
                  })}
                />
                {errors.videoUrl && (
                  <p className={styles.errorMessage}>{errors.videoUrl.message as string}</p>
                )}
              </div>
            </>
          ) : (
            <GalleryImageUpload
              key={postData?.id || 'gallery-upload'} // Force re-render when postData changes
              setValue={setValue}
              register={register}
              watch={watch}
              existingGalleryImages={isEditMode && postData ? (postData.galleryImagesUrl || []) : []}
              isEditMode={isEditMode}
            />
          )}

          <button
            type={step === 2 ? "submit" : "button"}
            onClick={(e) => {
              e.preventDefault();
              if (step === 1) {
                // Validate step 1 fields before proceeding
                handleSubmit(
                  () => setStep(2),
                  (errors) => {
                    console.log("Validation errors:", errors);
                  }
                )();
              } else {
                handleSubmit(onSubmit)();
              }
            }}
            className={styles.submitBtn}
            disabled={mutation.isPending}
          >
            {mutation.isPending 
              ? (isEditMode ? "Updating..." : "Uploading...") 
              : step === 1 
              ? "Next" 
              : (isEditMode ? "Update" : "Submit")}
          </button>
        </form>
      </div>
    </div>
      )}
    </>
  );
}
