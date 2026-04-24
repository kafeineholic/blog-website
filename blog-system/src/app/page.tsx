"use client";

import { useMemo, useState } from "react";
import { Stack, Typography } from "@mui/material";
import BlogSearchBar from "@/components/Blog/BlogSearchBar";
import BlogList from "@/components/Blog/BlogList";
import { mockBlogs } from "@/app/lib/mock-data";

const HomePage = () => {
  const [query, setQuery] = useState("");

  const doSearch = (value: string) => {
    setQuery(value);
  };

  const filteredBlogs = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return mockBlogs;
    }

    return mockBlogs.filter((blog) => {
      return (
        blog.title.toLowerCase().includes(keyword) ||
        blog.summary.toLowerCase().includes(keyword)
      );
    });
  }, [query]);

  return (
    <Stack spacing={3} sx={{ px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 4 } }}>
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

      <BlogList items={filteredBlogs} />
    </Stack>
  );
};

export default HomePage;
