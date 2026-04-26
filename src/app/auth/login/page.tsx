'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, Button, CircularProgress, Container, Stack, TextField, Typography, useTheme } from '@mui/material';
import { apiClient } from '@/app/lib/apiClient';
import { useAuth } from '@/components/AuthProvider';

export default function AuthLoginPage() {
  const router = useRouter();
  const theme = useTheme();
  const { setToken } = useAuth();

  const [email, setEmail] = useState('admin@blog.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.login({ email: email.trim(), password });
      setToken(response.token);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      spacing={3}
      sx={{
        px: { xs: 2, sm: 4 },
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >

      <Container maxWidth="sm" >
        <Stack spacing={4} sx={{ py: 10 }} >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Admin Login
            </Typography>
            <Typography variant="body2" sx={{ color: theme.colors?.olive800 }}>
              Login with mock credentials to access admin features
            </Typography>
          </Box>

          <Stack component="form" onSubmit={handleLogin} spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              disabled={loading}
            />

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{
                bgcolor: theme.colors?.ink950 ?? '#000',
                py: 1.5,
                '&:hover': {
                  bgcolor: theme.colors?.olive800 ?? '#333',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
}
