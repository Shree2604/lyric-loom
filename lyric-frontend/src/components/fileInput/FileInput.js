import { useRef } from "react";
import check from "./check.png";
import styles from "./styles.module.css";

const FileInput = ({ name, label, value, type, handleInputState, ...rest }) => {
  const inputRef = useRef();

  return (
    <div className={styles.container}>
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => handleInputState(name, e.currentTarget.files[0])}
        className={styles.input}
        {...rest}
      />
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className={styles.button}
      >
        {label}
      </button>

      {type === "image" && value && (
        <img
          src={typeof value === "string" ? value : URL.createObjectURL(value)}
          alt="file"
          className={styles.preview_img}
        />
      )}

      {type === "audio" && value && (
        <audio
          src={typeof value === "string" ? value : URL.createObjectURL(value)}
          controls
        />
      )}

      {value && (
        <div className={styles.progress_container}>
          <img src={check} alt="check" className={styles.check_img} />
        </div>
      )}
    </div>
  );
};

export default FileInput;
