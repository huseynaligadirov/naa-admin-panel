import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import styles from "./CreatePostModal.module.css";

import ModalHeader from "./ModalHeader";
import TitleInput from "./TitleInput";
import SlugInput from "./SlugInput";
import CategorySelector from "./CategorySelector";
import CoverImageUpload from "./CoverImageUpload";
import RichTextEditor from "./RichTextEditor";

type FormData = {
  title: string;
  slug: string;
  category: "news" | "announcement";
  coverImage: FileList;
  htmlContent: string;
};

export default function CreatePostModal({ isOpen = true, onClose = () => {} }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    watch,
  } = useForm<FormData>({
    defaultValues: { category: "news", htmlContent: "" },
  });

  const coverImage = watch("coverImage");

  const [preview, setPreview] = useState<File | null>(null);

  const [step, setStep] = useState<number>(1);
  console.log(getValues());
  const onSubmit = (data: FormData) => console.log("Form Data:", data);

  useEffect(() => {
    if (coverImage && coverImage.length > 0) {
      const file = coverImage[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(file);

      
      

      // Clean up memory when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [coverImage]);

  if (!isOpen) return null;

  return (
    <div className={styles.createPostModalOverlay}>
      <div className={styles.createPostModal}>
        <ModalHeader onClose={onClose} />
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
          <TitleInput register={register} errors={errors} />
          <SlugInput register={register} />
          <Controller
            name="category"
            control={control}
            render={({ field }) => <CategorySelector field={field} />}
          />
          <CoverImageUpload register={register} errors={errors} />
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
          <img src={preview ? URL.createObjectURL(preview) : ""} alt="" />
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
