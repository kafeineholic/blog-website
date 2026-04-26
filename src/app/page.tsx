"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, CircularProgress, Stack, Typography } from "@mui/material";
import BlogSearchBar from "@/components/Blog/BlogSearchBar";
import BlogList from "@/components/Blog/BlogList";
import { apiClient } from "@/app/lib/apiClient";
import type { Blog } from "@/app/lib/types";

interface BlogItem {
  id: number;
  title: string;
  date: string;
  summary: string;
  views: number;
  slug: string;
}

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiClient.getBlogs(1, 1000);
        const items = response.data.map((blog: Blog) => ({
          id: blog.id,
          title: blog.title,
          slug: blog.slug,
          date: new Date(blog.publishedAt ?? blog.createdAt).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          summary: blog.excerpt,
          views: blog.viewCount,
        }));
        setBlogs(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blogs');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const doSearch = (value: string) => {
    setQuery(value);
  };

  const filteredBlogs = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return blogs;
    }

    return blogs.filter((blog) => {
      return (
        blog.title.toLowerCase().includes(keyword) ||
        blog.summary.toLowerCase().includes(keyword)
      );
    });
  }, [query, blogs]);

  return (
    <Stack spacing={3} sx={{ px: { xs: 2, sm: 4 }, py: { xs: 12, sm: 14 }}}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Blog
          </Typography>
          <BlogSearchBar onSearch={doSearch} />
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}
        {loading ? (
          <Stack sx={{ py: 4, alignItems: 'center' }}>
            <CircularProgress />
          </Stack>
        ) : (
          <BlogList items={filteredBlogs} />
        )}
      </Stack>
  );
};

export default HomePage;
