import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import FileInput from "./../fileInput/FileInput";
import config from "../../config";

const SongForm = ({ onClose }) => {
  const [data, setData] = useState({
    name: "",
    artist: "",
    song: null, // Audio file
    img: null, // Image file
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleInputState = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data before submission:", data);

    try {
      const authToken = localStorage.getItem("artistAuthToken") || localStorage.getItem("adminAuthToken");
      const url = `process.env.REACT_APP_API_BASE_URL/api/songs`;

      // Create FormData for file uploads
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("artist", data.artist);
      formData.append("song", data.song); 
      formData.append("img", data.img); 

      formData.append("status", "pending"); // Always set status to pending
      // Send the form data via POST request
      const { data: res } = await axios.post(url, formData, {
        headers: {
          "x-auth-token": authToken,
          "Content-Type": "multipart/form-data", 
        },
      });

      console.log(res);
      setSubmissionStatus("pending"); // Set to pending
      setErrorMessage("");
    } catch (error) {
      console.log(error);
      console.log("Sending other request");
      
      const authToken = localStorage.getItem("adminAuthToken");
      const url2 = `process.env.REACT_APP_API_BASE_URL/api/songs/artist`;
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("artist", data.artist);
      formData.append("song", data.song); // Append audio file
      formData.append("img", data.img); // Append image file

      // Send the form data via POST request
      const { data: res } = await axios.post(url2, formData, {
        headers: {
          "x-auth-token": authToken,
          "Content-Type": "multipart/form-data", // Important for file upload
        },
      });
      console.log(res);
      setSubmissionStatus("success");
      setErrorMessage("");
      console.error(
        "Error adding song:",
        error.response ? error.response.data : error.message
      );
      setSubmissionStatus("error");
      setErrorMessage(
        error.response
          ? error.response.data.message
          : "An unknown error occurred."
      );
    } finally {
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  return (
    <div className={styles.formContainer}>
      {submissionStatus === "pending" && (
        <div style={{ color: 'orange', marginBottom: 16 }}>
          Your song has been submitted and is pending admin approval.
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Add a New Song</h2>
        <h1 className={styles.heading}>Song Form</h1>
        <input
          type="text"
          className={styles.input}
          placeholder="Song Name"
          name="name"
          onChange={handleChange}
          value={data.name}
        />
        <input
          type="text"
          className={styles.input}
          placeholder="Artist Name"
          name="artist"
          onChange={handleChange}
          value={data.artist}
        />
        <FileInput
          name="img"
          label="Choose Image"
          handleInputState={handleInputState}
          type="image"
          value={data.img}
        />
        <FileInput
          name="song"
          label="Choose Song"
          handleInputState={handleInputState}
          type="audio"
          value={data.song}
        />
        <button type="submit" className={styles.submit_btn}>
          Submit
        </button>
      </form>
      {submissionStatus === "success" && (
        <p className={styles.successMessage}>Form submitted successfully!</p>
      )}
      {submissionStatus === "error" && (
        <p className={styles.errorMessage}>{errorMessage}</p>
      )}
    </div>
  );
};

export default SongForm;
