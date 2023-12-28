import React, { useState } from "react";

import { api } from "../shared/api";
import { AxiosProgressEvent } from "axios";

function UploudPage() {
  const [file, setFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);

  console.log("upload", import.meta.env.VITE_BASE_URL_API);

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
      onUploadProgress: function (progressEvent: AxiosProgressEvent) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
        );
        setUploadProgress(percentCompleted);
      },
    };

    api
      .post("/upload", formData, config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error uploading file: ", error);
      });
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h1>React File Upload with Progress</h1>
        <input type="file" onChange={handleChange} accept=".zip,.rar,.7zip" />
        <button type="submit">Upload</button>
        <progress value={uploadProgress} max="100"></progress>
      </form>
    </div>








  );
}

export default UploudPage;
