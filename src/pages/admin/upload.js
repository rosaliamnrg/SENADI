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
import DeleteIcon from "@mui/icons-material/Delete";

export default function AdminUpload() {
  const [loading, setLoading] = useState(false);
  const [fileKnowledge, setFileKnowledge] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [files, setFiles] = useState([]);
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
          if (Array.isArray(data.files) && data.files.length > 0) {
            setFileKnowledge(data.files);
          } else {
            setFileKnowledge([]);
          }
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
    if (files.length === 0) {
      setError("Pilih file terlebih dahulu");
      return;
    }

    setUploadLoading(true);
    setError("");

    // Buat FormData baru
    for (const file of files) {
      console.log("Uploading file:", file.name, file.type, file.size);
      const formData = new FormData();
      formData.append("files", file); // Gunakan 'file' sebagai key

      try {
        // Debug logs
        // for (let [key, value] of formData.entries()) {
        //   console.log(
        //     `FormData: ${key} = ${value instanceof File ? value.name : value}`
        //   );
        // }

        // Buat fetch request biasa, bukan fetchWithAuth, untuk menghindari masalah headers
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload_github`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          console.error(`Gagal upload ${file.name}:`, data.error);
        } else {
          console.log(`Berhasil upload ${file.name}`);
        }
      } catch (err) {
        console.error(`Error saat upload ${file.name}:`, err.message);
      } finally {
        setUploadLoading(false);
      }
    }

    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setUploadLoading(false);
    alert("Proses upload selesai");
  };
  // const handleFileChange = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const selectedFile = e.target.files[0];
  //     console.log(
  //       "File selected:",
  //       selectedFile.name,
  //       selectedFile.type,
  //       selectedFile.size
  //     );
  //     setFile(selectedFile);
  //   }
  // };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDelete = async (filename) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/delete_github/${filename}`,
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
                      <th style={{ border: "1px solid #D9D9D9" }}>
                        Waktu dikirim
                      </th>
                      <th style={{ border: "1px solid #D9D9D9" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody
                    style={{ textAlign: "center", border: "1px solid #D9D9D9" }}
                  >
                    {loading ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          border: "#D9D9D9",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    ) : fileKnowledge.length == 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          style={{ padding: "10px", textAlign: "center" }}
                        >
                          Tidak ada file yang sudah dimasukkan
                        </td>
                      </tr>
                    ) : (
                      fileKnowledge.length > 0 &&
                      fileKnowledge.map((file, index) => (
                        <tr key={file.id} style={{ height: "30px" }}>
                          <td
                            style={{
                              border: "1px solid #D9D9D9",
                              padding: "3px",
                            }}
                          >
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
                            {new Date(file.created_at).toLocaleString("id-ID", {
                              month: "long",
                              year: "numeric",
                            })}
                          </td>
                          <td
                            style={{
                              border: "1px solid #D9D9D9",
                              padding: "3px",
                            }}
                          >
                            <span
                              onClick={() => handleDelete(file.filename)}
                              style={{ cursor: "pointer", color: "#06344E" }}
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
                            multiple
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

                          {/* ⬇️ Tambahkan preview file di sini */}
                          {files.length > 0 && (
                            <Paper
                              sx={{
                                p: 2,
                                bgcolor: "rgba(0, 0, 0, 0.03)",
                                mt: 2,
                              }}
                            >
                              {files.map((f, idx) => (
                                <Typography variant="body2" key={idx}>
                                  File: <strong>{f.name}</strong> (
                                  {(f.size / 1024).toFixed(1)} KB)
                                </Typography>
                              ))}
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
                          disabled={files.length == 0 || uploadLoading}
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
