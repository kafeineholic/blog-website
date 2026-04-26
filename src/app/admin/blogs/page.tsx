'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import type { Blog } from '@/app/lib/types';

export default function AdminBlogsPage() {
  const theme = useTheme();
  const { token } = useAuth();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.getAdminBlogs(1, 500, token ?? undefined);
      setBlogs(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiClient.getAdminBlogs(1, 500, token ?? undefined);
        if (mounted) {
          setBlogs(response.data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load blogs');
          setBlogs([]);
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

  const pageCount = useMemo(() => Math.max(1, Math.ceil(blogs.length / pageSize)), [blogs.length]);
  const safePage = Math.min(page, pageCount);
  const pagedBlogs = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return blogs.slice(start, start + pageSize);
  }, [blogs, safePage]);

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCoverImage('');
  };

  const handleCreate = async () => {
    try {
      await apiClient.createBlog(
        {
          title,
          slug,
          excerpt,
          content,
          coverImage,
        },
        token ?? undefined
      );
      setOpenCreate(false);
      resetForm();
      fetchBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create blog');
    }
  };

  const handleOpenEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setSlug(blog.slug);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setCoverImage(blog.coverImage ?? '');
    setOpenEdit(true);
  };

  const handleEdit = async () => {
    if (!editingBlog) return;
    try {
      await apiClient.updateBlog(
        editingBlog.id,
        {
          title,
          excerpt,
          content,
          coverImage,
        },
        token ?? undefined
      );
      setOpenEdit(false);
      setEditingBlog(null);
      resetForm();
      fetchBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update blog');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteBlog(id, token ?? undefined);
      fetchBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog');
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    try {
      if (blog.isPublished) {
        await apiClient.unpublishBlog(blog.id, token ?? undefined);
      } else {
        await apiClient.publishBlog(blog.id, token ?? undefined);
      }
      fetchBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update publish status');
    }
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack spacing={0.5}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Blog Management
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors?.olive800 }}>
            Edit blog, publish/unpublish, and manage posts.
          </Typography>
        </Stack>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Create Blog
        </Button>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Stack sx={{ alignItems: 'center', py: 4 }}>
          <CircularProgress />
        </Stack>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ border: `1px solid ${theme.colors?.ink950}` }}>
            <Table>
              <TableHead sx={{ bgcolor: theme.colors?.snow50 }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Slug</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Views</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>{blog.id}</TableCell>
                    <TableCell>{blog.title}</TableCell>
                    <TableCell>{blog.slug}</TableCell>
                    <TableCell>{blog.isPublished ? 'PUBLISHED' : 'DRAFT'}</TableCell>
                    <TableCell>{blog.viewCount}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                        <Button size="small" variant="contained" onClick={() => handleOpenEdit(blog)}>
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color={blog.isPublished ? 'warning' : 'success'}
                          onClick={() => handleTogglePublish(blog)}
                        >
                          {blog.isPublished ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button size="small" variant="contained" color="error" onClick={() => handleDelete(blog.id)}>
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
            <Button variant="outlined" disabled={safePage <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
              Prev
            </Button>
            <Typography sx={{ px: 1.5, py: 1 }}>{`${safePage} / ${pageCount}`}</Typography>
            <Button variant="outlined" disabled={safePage >= pageCount} onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}>
              Next
            </Button>
          </Stack>
        </>
      )}

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Blog</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} fullWidth />
            <TextField label="Slug" value={slug} onChange={(event) => setSlug(event.target.value)} fullWidth />
            <TextField label="Excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} fullWidth />
            <TextField label="Content" value={content} onChange={(event) => setContent(event.target.value)} multiline rows={6} fullWidth />
            <TextField label="Cover Image URL" value={coverImage} onChange={(event) => setCoverImage(event.target.value)} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Blog</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} fullWidth />
            <TextField label="Slug" value={slug} fullWidth disabled />
            <TextField label="Excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} fullWidth />
            <TextField label="Content" value={content} onChange={(event) => setContent(event.target.value)} multiline rows={6} fullWidth />
            <TextField label="Cover Image URL" value={coverImage} onChange={(event) => setCoverImage(event.target.value)} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
