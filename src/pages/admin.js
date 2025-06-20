import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Divider,
  Alert,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";

export default function Admin() {
  const [tab, setTab] = useState(1);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [file, setFile] = useState(null);
  const [fileKnowledge, setFileKnowledge] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  const {
    isAuthenticated,
    isAdmin,
    loading: authLoading,
    logout,
    fetchWithAuth,
  } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }

    if (!authLoading && !isAdmin) {
      router.push("/chat");
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

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

    const loadChats = async () => {
      if (!isAuthenticated || !isAdmin) return;

      try {
        setLoading(true);
        setError("");

        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/chats`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Gagal memuat daftar chat");
        }

        const data = await response.json();
        if (data.success) {
          // Hanya tampilkan chat yang memiliki pesan
          const chatsWithMessages = data.chats.filter(
            (chat) =>
              chat.message_count > 0 &&
              (chat.last_user_message || chat.last_bot_message)
          );
          setChats(chatsWithMessages);
        } else {
          throw new Error(data.error || "Gagal memuat daftar chat");
        }
      } catch (error) {
        console.error("Error loading chats:", error);
        setError("Gagal memuat daftar chat. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin && !authLoading) {
      loadChats();
      loadFile();
    }
  }, [isAuthenticated, isAdmin, authLoading, fetchWithAuth]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSelectChat = async (chatId) => {
    try {
      setSelectedChat(chatId);
      setLoading(true);
      setError("");

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/chats/${chatId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal memuat pesan chat");
      }

      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      } else {
        throw new Error(data.error || "Gagal memuat pesan chat");
      }
    } catch (error) {
      console.error("Error loading chat messages:", error);
      setError("Gagal memuat pesan chat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/verify/${selectedChat}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal memverifikasi chat");
      }

      const data = await response.json();
      if (data.success) {
        // Refresh chat list and selected chat
        const updatedChats = chats.map((chat) =>
          chat.id === selectedChat ? { ...chat, verified: true } : chat
        );
        setChats(updatedChats);

        // Find last bot message and mark as verified
        const updatedMessages = messages.map((msg) =>
          msg.sender === "bot" ? { ...msg, verified: true } : msg
        );
        setMessages(updatedMessages);
      } else {
        throw new Error(data.error || "Gagal memverifikasi chat");
      }
    } catch (error) {
      console.error("Error verifying chat:", error);
      setError("Gagal memverifikasi chat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCorrect = async (e) => {
    e.preventDefault();
    if (!selectedChat || !input.trim()) return;

    try {
      setLoading(true);
      setError("");

      // Find the last bot message
      const lastBotMessage = [...messages]
        .reverse()
        .find((msg) => msg.sender === "bot" && !msg.is_correction);

      if (!lastBotMessage) {
        throw new Error("Tidak ada pesan bot yang dapat dikoreksi");
      }

      console.log("Correcting message ID:", lastBotMessage.id);

      // Perbaiki URL - gunakan message_id, bukan chat_id
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/correct/${lastBotMessage.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            correction: input,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengoreksi jawaban");
      }

      const data = await response.json();
      if (data.success) {
        // Reload chat details to get the updated messages
        await handleSelectChat(selectedChat);
        setInput("");
      } else {
        throw new Error(data.error || "Gagal mengoreksi jawaban");
      }
    } catch (error) {
      console.error("Error correcting message:", error);
      setError("Gagal mengoreksi jawaban. Silakan coba lagi.");
    } finally {
      setLoading(false);
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

  const handleUploadButtonClick = () => {
    // Memicu klik pada input file tersembunyi
    fileInputRef.current.click();
  };

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
      setError("Tidak berhasil menghapus file knowledge!")
    }
  };

  if (authLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="relative" sx={{ backgroundColor: "#06344E" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        aria-label="admin tabs"
        sx={{ borderBottom: 1, borderColor: "divider", position: "static" }}
      >
        <Tab label="Kelola Chat" id="tab-0" />
        <Tab label="Upload File" id="tab-1" />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mt: 2, mx: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2, mx: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ flexGrow: 1, p: 2, overflow: "hidden", display: "flex" }}>
        {tab === 0 && (
          <Grid container spacing={2} sx={{ height: "100%" }}>
            <Grid item xs={12} md={4} sx={{ height: "100%" }}>
              <Paper
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
                  <Typography variant="h6">Daftar Chat</Typography>
                </Box>
                <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                  {loading && chats.length === 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : chats.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                      <Typography color="text.secondary">
                        Belum ada chat yang perlu diverifikasi
                      </Typography>
                    </Box>
                  ) : (
                    <List>
                      {chats.map((chat, index) => (
                        <React.Fragment key={chat.id}>
                          <ListItem
                            button
                            selected={selectedChat === chat.id}
                            onClick={() => handleSelectChat(chat.id)}
                          >
                            <ListItemText
                              primary={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography variant="body1">
                                    {chat.username ||
                                      `User #${chat.user_id.substring(0, 8)}`}
                                  </Typography>
                                  {chat.verified && (
                                    <CheckCircleIcon
                                      color="success"
                                      fontSize="small"
                                    />
                                  )}
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Box sx={{ mt: 1 }}>
                                    {chat.last_user_message && (
                                      <Typography
                                        variant="caption"
                                        component="div"
                                        sx={{
                                          color: "text.secondary",
                                          fontStyle: "italic",
                                          mb: 0.5,
                                        }}
                                      >
                                        <strong>Q:</strong>{" "}
                                        {chat.last_user_message}
                                      </Typography>
                                    )}
                                    {chat.last_bot_message && (
                                      <Typography
                                        variant="caption"
                                        component="div"
                                        sx={{
                                          color: chat.verified
                                            ? "success.main"
                                            : "text.primary",
                                          fontStyle: "italic",
                                          border: chat.verified
                                            ? "1px solid #59BA5D"
                                            : "1px dashed #ff9800",
                                          p: 0.5,
                                          borderRadius: "4px",
                                        }}
                                      >
                                        <strong>A:</strong>{" "}
                                        {chat.last_bot_message}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    component="div"
                                    sx={{ mt: 1 }}
                                  >
                                    {new Date(chat.created_at).toLocaleString(
                                      "id-ID"
                                    )}{" "}
                                    · {chat.message_count} pesan
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < chats.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8} sx={{ height: "100%" }}>
              <Paper
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {selectedChat ? (
                  <>
                    <Box
                      sx={{
                        p: 2,
                        borderBottom: "1px solid #e0e0e0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6">Detail Chat</Typography>
                      {messages.some(
                        (msg) => msg.sender === "bot" && !msg.is_corrected
                      ) && (
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={handleVerify}
                          disabled={loading}
                        >
                          Verifikasi Chat
                        </Button>
                      )}
                    </Box>

                    <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
                      {loading ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      ) : messages.length === 0 ? (
                        <Box sx={{ p: C, textAlign: "center" }}>
                          <Typography color="text.secondary">
                            Belum ada pesan di chat ini
                          </Typography>
                        </Box>
                      ) : (
                        messages.map((message, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              justifyContent:
                                message.sender === "user"
                                  ? "flex-end"
                                  : "flex-start",
                              mb: 2,
                            }}
                          >
                            <Paper
                              elevation={1}
                              sx={{
                                p: 2,
                                maxWidth: "80%",
                                bgcolor:
                                  message.sender === "user"
                                    ? "#D9EDF6"
                                    : "#F5F5F5",
                                borderLeft: message.is_correction
                                  ? "3px solid #59BA5D"
                                  : "none",
                                borderRight: message.is_corrected
                                  ? "3px solid orange"
                                  : "none",
                              }}
                            >
                              <Typography variant="body1">
                                {message.message}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", mt: 1 }}
                              >
                                {message.sender === "user" ? "Pengguna" : "Bot"}{" "}
                                ·{" "}
                                {new Date(message.created_at).toLocaleString(
                                  "id-ID"
                                )}
                              </Typography>

                              {message.is_corrected && (
                                <Typography
                                  variant="caption"
                                  color="warning.main"
                                  sx={{ display: "block", mt: 1 }}
                                >
                                  Jawaban ini telah dikoreksi
                                </Typography>
                              )}
                              {message.is_correction && (
                                <Typography
                                  variant="caption"
                                  color="success.main"
                                  sx={{ display: "block", mt: 1 }}
                                >
                                  Jawaban terkoreksi
                                </Typography>
                              )}
                            </Paper>
                          </Box>
                        ))
                      )}
                    </Box>

                    <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
                      <form onSubmit={handleCorrect}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            fullWidth
                            placeholder="Ketik koreksi untuk jawaban bot terakhir..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                          />
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!input.trim() || loading}
                            endIcon={
                              loading ? (
                                <CircularProgress size={20} />
                              ) : (
                                <SendIcon />
                              )
                            }
                          >
                            Koreksi
                          </Button>
                        </Box>
                      </form>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Typography color="text.secondary">
                      Pilih chat di daftar untuk melihat detail
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}

        {tab === 1 && (
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
                  <CardContent>
                    <table
                      style={{
                        width: "100%",
                        border: "1px solid",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead style={{ textAlign: "center" }}>
                        <tr>
                          <th style={{ border: "1px solid" }}>No</th>
                          <th style={{ border: "1px solid" }}>Nama File</th>
                          <th style={{ border: "1px solid" }}>Tipe File</th>
                          <th style={{ border: "1px solid" }}>Tanggal/Waktu</th>
                          <th style={{ border: "1px solid" }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody style={{ textAlign: "center" }}>
                        {loading ? (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100%",
                            }}
                          >
                            <CircularProgress />
                          </Box>
                        ) : (
                          fileKnowledge.length > 0 &&
                          fileKnowledge.map((file, index) => (
                            <tr key={file.id} style={{ height: "30px" }}>
                              <td
                                style={{ border: "1px solid", padding: "3px" }}
                              >
                                {index + 1}
                              </td>
                              <td
                                style={{
                                  textAlign: "left",
                                  border: "1px solid",
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
                              <td
                                style={{
                                  border: "1px solid",
                                  width: "80px",
                                  padding: "3px",
                                }}
                              >
                                {file.file_type}
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  width: "250px",
                                  padding: "3px",
                                }}
                              >
                                {file.upload_date}
                              </td>
                              <td
                                style={{ border: "1px solid", padding: "3px" }}
                              >
                                <button
                                  style={{
                                    padding: "5px",
                                    backgroundColor: "red",
                                  }}
                                  onClick={() => handleDelete(file.filename)}
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </CardContent>
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
        )}
      </Box>
    </Box>
  );
}
