// FileUpload.tsx
import React, { useState } from "react";
import axios from "axios";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", sessionStorage.getItem("LoginData") || "");
    try {
    const response = await axios.post(`${backendApiUrl}/v1/toy/holder/Upload`, formData);

      console.log(response.data);
      alert("File uploaded successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to upload file.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default FileUpload;