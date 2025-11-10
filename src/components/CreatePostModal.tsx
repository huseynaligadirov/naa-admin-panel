import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import styles from "./CreatePostModal.module.css";
import { titleToSlug } from "../utils/slug";

import ModalHeader from "./ModalHeader";
import TitleInput from "./TitleInput";
import SlugInput from "./SlugInput";
import CategorySelector from "./CategorySelector";
import CoverImageUpload from "./CoverImageUpload";
import RichTextEditor from "./RichTextEditor";
import GalleryImageUpload from "./GalleryImageUpload";

type FormData = {
  title: string;
  slug: string;
  category: "news" | "announcement";
  language: "az" | "en";
  coverImage: FileList;
  coverImageLabel?: string;
  galleryImages: FileList;
  htmlContent: string;
};

export default function CreatePostModal({ isOpen = true, onClose = () => {} }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: { category: "news", language: "az", htmlContent: "" },
  });

  const [step, setStep] = useState<number>(1);
  const title = watch("title");
  
  // Update slug in real-time based on title
  useEffect(() => {
    if (title) {
      const slug = titleToSlug(title);
      setValue("slug", slug);
    } else {
      setValue("slug", "");
    }
  }, [title, setValue]);

  console.log(getValues());
  const onSubmit = (data: FormData) => console.log("Form Data:", data);

  if (!isOpen) return null;

  return (
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
            <h2 className={styles.modalTitle}>Create News / Announcement</h2>
            <span className={styles.stepIndicator}>{step}/2</span>
          </div>
          <div className={styles.LineProgressBar}>
            <div
              style={{ background: "#243C7B" }}
              className={styles.progressLine}
            ></div>
            <div
              style={{ background: step == 2 ? "#243C7B" : "#E0E7FA" }}
              className={styles.progressLine}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.modalForm}>
          {
            step == 1 ? <>
            <TitleInput register={register} errors={errors} />
          <SlugInput register={register} watch={watch} />
          <Controller
            name="category"
            control={control}
            render={({ field }) => <CategorySelector field={field} />}
          />
          <CoverImageUpload register={register} errors={errors} watch={watch} setValue={setValue} />
          <Controller
            name="htmlContent"
            control={control}
            rules={{ required: "Content is required" }}
            render={({ field }) => (
              <RichTextEditor
                field={field}
                error={errors.htmlContent?.message}
              />
            )}
          />
            </> :           <GalleryImageUpload setValue={setValue} register={register} watch={watch} />
 
          }
          <button
            onClick={(e) => {
              e.preventDefault();
              if (step === 1) {
                setStep(2);
              } else {
                handleSubmit(onSubmit)();
              }
            }}
            className={styles.submitBtn}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
