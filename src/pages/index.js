import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Box, Container, TextField, Button, Typography, Alert, Link } from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ 
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 1,
          boxShadow: 1
        }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
            >
              Login
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Belum punya akun?{' '}
            <Link href="/register" underline="hover">
              Register disini
            </Link>
          </Typography>

        </Box>
        </Box>
      </Container>
    </Box>
  );
}