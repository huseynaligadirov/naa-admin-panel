import { useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
import styles from "./CreatePostModal.module.css";

type Props = {
  field: ControllerRenderProps<any, "htmlContent">;
  error?: string;
};

export default function RichTextEditor({ field, error }: Props) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    field.onChange(JSON.stringify(convertToRaw(state.getCurrentContent())));
  };

  const handleKeyCommand = (command: string, state: EditorState) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      handleEditorChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const toggleInlineStyle = (style: string) => handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  const toggleBlockType = (blockType: string) => handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));

  return (
    <div className={`${styles.formGroup} ${styles.richTextEditor}`}>
      <label className={styles.formLabel}>HTML Content</label>
      <p className={styles.editorHint}>
        Use the toolbar to format your text with bold, italic, headers, lists, and more.
      </p>
      <div className={styles.editorContainer}>
        <div className={styles.editorToolbar}>
          <button type="button" className={styles.editorBtn} onClick={() => toggleInlineStyle("BOLD")}>B</button>
          <button type="button" className={styles.editorBtn} onClick={() => toggleInlineStyle("ITALIC")}>I</button>
          <button type="button" className={styles.editorBtn} onClick={() => toggleInlineStyle("UNDERLINE")}>U</button>
          <button type="button" className={styles.editorBtn} onClick={() => toggleBlockType("header-one")}>H1</button>
          <button type="button" className={styles.editorBtn} onClick={() => toggleBlockType("unordered-list-item")}>•</button>
        </div>
        <div className={styles.editorContent}>
          <Editor
            editorState={editorState}
            onChange={handleEditorChange}
            handleKeyCommand={handleKeyCommand}
            placeholder="Write something..."
          />
        </div>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
