import Editor from "react-simple-wysiwyg";
import type { ContentEditableEvent } from "react-simple-wysiwyg";
import type { ControllerRenderProps } from "react-hook-form";
import styles from "./CreatePostModal.module.css";

type Props = {
  field: ControllerRenderProps<any, "htmlContent">;
  error?: string;
};

export default function RichTextEditor({ field, error }: Props) {
  const handleChange = (e: ContentEditableEvent) => {
    field.onChange(e.target.value);
  };

  return (
    <div className={`${styles.formGroup} ${styles.richTextEditor}`}>
      <label className={styles.formLabel}>HTML Content</label>
      <div className={styles.wysiwygEditorContainer}>
        <Editor
          value={field.value || ""}
          onChange={handleChange}
          containerProps={{
            className: styles.wysiwygEditor,
          }}
        />
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
