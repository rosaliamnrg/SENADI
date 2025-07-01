import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import LayoutAdmin from "./layout";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Grid,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function AdminChat() {
  const [tab, setTab] = useState(0);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    isAuthenticated,
    isAdmin,
    loading: authLoading,
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
    }
  }, [isAuthenticated, isAdmin, authLoading, fetchWithAuth]);

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
    <Box sx={{ height: "100vh", overflow: "hidden" }}>
      <LayoutAdmin>
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
        <Grid
          container
          spacing={2}
          sx={{
            height: "calc(100vh - 112px)",
            overflow: "hidden",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              height: { xs: selectedChat ? 0 : "100%", md: "100%" },
              display: { xs: selectedChat ? "none" : "block", md: "block" },
            }}
          >
            {/* Daftar Chat */}
          </Grid>

          <Grid
            item
            xs={12}
            md={8}
            sx={{
              height: "100%",
              display: { xs: selectedChat ? "block" : "none", md: "block" },
            }}
          >
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
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="h6">Detail Chat</Typography>
                      <Button
                        variant="text"
                        onClick={() => setSelectedChat(null)}
                        sx={{
                          display: { xs: "inline-block", md: "none" },
                          mt: 1,
                        }}
                      >
                        ← Kembali
                      </Button>
                    </Box>
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
                  {/* ...lanjutkan sisa UI seperti biasa */}
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
      </LayoutAdmin>
    </Box>
  );
}
