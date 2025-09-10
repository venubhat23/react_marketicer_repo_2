import React, { useState } from "react";
import { MDButton, CircularProgress, Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FileUpload = ({ setUploadedImageUrl }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uploadImageApi = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://kitintellect.tech/storage/public/api/upload/aaFacebook", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.url) {
        setUploadedImageUrl(data.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileUpload = () => {
    if (file) {
      setUploading(true);
      uploadImageApi(file);
      setUploading(false);
    }
  };

  return (
    <Box>
      <MDButton
        component="label"
        variant="gradient"
        color="info"
        startIcon={<CloudUploadIcon />}
        sx={{ width: "100%", color: "#fff" }}
      >
        Select File
        <input type="file" hidden onChange={handleFileChange} />
      </MDButton>

      <MDButton
        variant="gradient"
        color="info"
        sx={{ marginTop: 2, width: "100%", color: "#fff" }}
        onClick={handleFileUpload}
        disabled={uploading}
      >
        {uploading ? <CircularProgress size={24} /> : "Upload"}
      </MDButton>

      {file && (
        <Box mt={2}>
          <Typography variant="body1">Uploaded Image:</Typography>
          <img src={file} alt="Uploaded" style={{ width: "100px", height: "auto" }} />
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
