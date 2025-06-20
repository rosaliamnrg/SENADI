import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import LayoutAdmin from "./layout";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminUpload() {
  const [loading, setLoading] = useState(false);
  const [fileKnowledge, setFileKnowledge] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const {
    isAuthenticated,
    isAdmin,
    loading: authLoading,
    fetchWithAuth,
  } = useAuth();

  useEffect(() => {
    const loadFile = async () => {
      if (!isAuthenticated || !isAdmin) return;

      try {
        setLoading(true);
        setError("");

        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/get_file`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Gagal memuat daftar file");
        }

        const data = await response.json();
        if (data.success) {
          setFileKnowledge(data.files);
        }
      } catch (error) {
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin && !authLoading) {
      loadFile();
    }
  }, [isAuthenticated, isAdmin, authLoading, fetchWithAuth]);

  const handleUploadButtonClick = () => {
    // Memicu klik pada input file tersembunyi
    fileInputRef.current.click();
  };
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Pilih file terlebih dahulu");
      return;
    }

    try {
      setUploadLoading(true);
      setError("");

      console.log("Uploading file:", file.name, file.type, file.size);

      // Buat FormData baru
      const formData = new FormData();
      formData.append("file", file); // Gunakan 'file' sebagai key

      // Debug logs
      for (let [key, value] of formData.entries()) {
        console.log(
          `FormData: ${key} = ${value instanceof File ? value.name : value}`
        );
      }

      // Buat fetch request biasa, bukan fetchWithAuth, untuk menghindari masalah headers
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset input file
        }
        alert("File berhasil diunggah");
      } else {
        throw new Error(data.error || "Gagal mengunggah file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Gagal mengunggah file: " + error.message);
    } finally {
      setUploadLoading(false);
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log(
        "File selected:",
        selectedFile.name,
        selectedFile.type,
        selectedFile.size
      );
      setFile(selectedFile);
    }
  };

  const handleDelete = async (filename) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/delete/${filename}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Berhasil menghapus file knowledge!");
      }
    } catch (e) {
      setError("Tidak berhasil menghapus file knowledge!");
    }
  };

  return (
    <>
      <LayoutAdmin>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ width: "70%" }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Daftar File Knowledge
              </Typography>

              <Card sx={{ mx: "auto", mt: 2 }}>
                <table
                    style={{
                      width: "100%",
                      border: "1px solid",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead style={{ textAlign: "center" }}>
                      <tr>
                        <th style={{ border: "1px solid #D9D9D9" }}>No</th>
                        <th style={{ border: "1px solid #D9D9D9" }}>Nama File</th>
                        {/* <th style={{ border: "1px solid" }}>Tipe File</th> */}
                        <th style={{ border: "1px solid #D9D9D9" }}>Tanggal/Waktu</th>
                        <th style={{ border: "1px solid #D9D9D9" }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody style={{ textAlign: "center", border: "1px solid #D9D9D9" }}>
                      {loading ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            border: "#D9D9D9"
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      ) : (
                        fileKnowledge.length > 0 &&
                        fileKnowledge.map((file, index) => (
                          <tr key={file.id} style={{ height: "30px" }}>
                            <td style={{ border: "1px solid #D9D9D9", padding: "3px" }}>
                              {index + 1}
                            </td>
                            <td
                              style={{
                                textAlign: "left",
                                border: "1px solid #D9D9D9",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "200px",
                                padding: "3px",
                              }}
                              title={file.filename} // Shows the full filename on hover
                            >
                              {file.filename}
                            </td>
                            {/* <td
                              style={{
                                border: "1px solid",
                                width: "80px",
                                padding: "3px",
                              }}
                            >
                              {file.file_type}
                            </td> */}
                            <td
                              style={{
                                border: "1px solid #D9D9D9",
                                width: "250px",
                                padding: "3px",
                              }}
                            >
                              {file.upload_date}
                            </td>
                            <td style={{ border: "1px solid #D9D9D9", padding: "3px" }}>
                              <span
                                onClick={() => handleDelete(file.filename)}
                                style={{ cursor: 'pointer', color: '#06344E' }}
                              >
                                <DeleteIcon />
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
              </Card>
            </Box>
          </div>

          <div style={{ width: "30%" }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Tambah File Knowledge
              </Typography>

              <Card sx={{ maxWidth: 500, mx: "auto", mt: 2 }}>
                <CardContent>
                  <form onSubmit={handleUpload}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ textAlign: "center", mb: 2 }}>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                            accept=".pdf,.xlsx,.xls,.csv"
                          />
                          <Button
                            variant="outlined"
                            onClick={handleUploadButtonClick}
                            disabled={uploadLoading}
                            sx={{ mb: 2 }}
                            fullWidth
                          >
                            Pilih File
                          </Button>

                          {file && (
                            <Paper
                              sx={{
                                p: 2,
                                bgcolor: "rgba(0, 0, 0, 0.03)",
                                mt: 2,
                              }}
                            >
                              <Typography variant="body2">
                                File: <strong>{file.name}</strong> (
                                {(file.size / 1024).toFixed(1)} KB)
                              </Typography>
                            </Paper>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          startIcon={
                            uploadLoading ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <AddIcon />
                            )
                          }
                          disabled={!file || uploadLoading}
                          fullWidth
                        >
                          {uploadLoading ? "Mengunggah..." : "Upload File"}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Box>
          </div>
        </div>
      </LayoutAdmin>
    </>
  );
}
