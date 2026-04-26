'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { apiClient } from '@/app/lib/apiClient';
import { useAuth } from '@/components/AuthProvider';
import type { Comment, CommentStatus } from '@/app/lib/types';

export default function AdminCommentsPage() {
  const theme = useTheme();
  const { token } = useAuth();

  const [comments, setComments] = useState<Comment[]>([]);
  const [status, setStatus] = useState<CommentStatus | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComments = async (nextStatus?: CommentStatus | '') => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.getAdminComments(1, 200, nextStatus || undefined, token ?? undefined);
      setComments(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const response = await apiClient.getAdminComments(1, 200, undefined, token ?? undefined);
        if (mounted) {
          setComments(response.data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load comments');
          setComments([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      mounted = false;
    };
  }, [token]);

  const handleApprove = async (commentId: number) => {
    try {
      await apiClient.approveComment(commentId, token ?? undefined);
      fetchComments(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve comment');
    }
  };

  const handleReject = async (commentId: number) => {
    try {
      await apiClient.rejectComment(commentId, token ?? undefined);
      fetchComments(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject comment');
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await apiClient.deleteComment(commentId, token ?? undefined);
      fetchComments(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Comment Moderation
        </Typography>
        <Typography variant="body2" sx={{ color: theme.colors?.olive800 }}>
          Filter, approve, reject, or delete comments.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          select
          label="Status"
          value={status}
          onChange={(event) => {
            const next = event.target.value as CommentStatus | '';
            setStatus(next);
            fetchComments(next);
          }}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="">ALL</MenuItem>
          <MenuItem value="PENDING">PENDING</MenuItem>
          <MenuItem value="APPROVED">APPROVED</MenuItem>
          <MenuItem value="REJECTED">REJECTED</MenuItem>
        </TextField>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Stack sx={{ alignItems: 'center', py: 4 }}>
          <CircularProgress />
        </Stack>
      ) : (
        <TableContainer component={Paper} sx={{ border: `1px solid ${theme.colors?.ink950}` }}>
          <Table>
            <TableHead sx={{ bgcolor: theme.colors?.snow50 }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Message</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>{comment.id}</TableCell>
                  <TableCell>{comment.author}</TableCell>
                  <TableCell>{comment.content}</TableCell>
                  <TableCell>{comment.status}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                      <Button size="small" color="success" variant="contained" onClick={() => handleApprove(comment.id)}>
                        Approve
                      </Button>
                      <Button size="small" color="warning" variant="contained" onClick={() => handleReject(comment.id)}>
                        Reject
                      </Button>
                      <Button size="small" color="error" variant="contained" onClick={() => handleDelete(comment.id)}>
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
}
