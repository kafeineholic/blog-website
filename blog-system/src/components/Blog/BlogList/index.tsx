"use client";

import { useMemo, useState } from "react";
import { Stack, Typography, useTheme } from "@mui/material";
import type { BlogItem } from "@/app/lib/mock-data";
import BlogCardRow from "@/components/Blog/BlogCardRow";
import ListPagination from "@/components/Pagination";

interface BlogListProps {
	items: BlogItem[];
}

const PAGE_SIZE = 10;

const BlogList = ({ items }: BlogListProps) => {
	const theme = useTheme();
	const [page, setPage] = useState(1);

	const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
	const safePage = Math.min(page, pageCount);

	const pagedItems = useMemo(() => {
		const start = (safePage - 1) * PAGE_SIZE;
		return items.slice(start, start + PAGE_SIZE);
	}, [items, safePage]);

	return (
		<Stack spacing={2.5}>
			{pagedItems.length === 0 ? (
				<Typography variant="body1" sx={{ color: theme.colors.olive800 }}>
					No blogs found.
				</Typography>
			) : (
				pagedItems.map((item) => <BlogCardRow key={item.id} item={item} />)
			)}

			<ListPagination count={pageCount} page={safePage} onChange={setPage} />
		</Stack>
	);
};

export default BlogList;
