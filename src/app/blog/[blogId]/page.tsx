'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Alert, Box, Chip, CircularProgress, Stack, Typography, useTheme } from '@mui/material';
import { apiClient } from '@/app/lib/apiClient';
import type { Blog } from '@/app/lib/types';
import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';

export default function BlogPage() {
	const params = useParams();
	const slug = params.blogId as string;
	const theme = useTheme();

	const [blog, setBlog] = useState<Blog | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	
	// Prevent double execution in development
	const hasFetched = useRef(false);

	useEffect(() => {
		const run = async () => {
			if (hasFetched.current) return; // Prevent double execution
			hasFetched.current = true;
			
			setLoading(true);
			setError('');
			try {
				const data = await apiClient.getBlogBySlug(slug);
				setBlog(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load blog');
			} finally {
				setLoading(false);
			}
		};

		if (slug && !hasFetched.current) {
			run();
		}
	}, [slug]);

	return (
		<Stack spacing={4} sx={{ px: { xs: 2, sm: 4 }, py: { xs: 12, sm: 14 } }}>
				{loading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
						<CircularProgress />
					</Box>
				) : null}

				{!loading && error ? <Alert severity="error">{error}</Alert> : null}

				{!loading && !error && !blog ? <Typography>Blog not found</Typography> : null}

				{!loading && !error && blog ? (
					<>
						<Stack spacing={2}>
							<Typography variant="caption" sx={{ letterSpacing: '0.16em', color: theme.colors?.olive800 }}>
								{new Date(blog.publishedAt ?? blog.createdAt).toLocaleDateString('th-TH')}
							</Typography>
							<Typography variant="h3" sx={{ fontWeight: 700, color: theme.colors?.ink950 }}>
								{blog.title}
							</Typography>
							<Typography variant="body1" sx={{ color: theme.colors?.olive800 }}>
								By {blog.author?.email ?? 'Unknown'}
							</Typography>

							{blog.images.length > 0 ? (
								<Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
									{blog.images.slice(0, 6).map((img) => (
										<Chip
											key={img.id}
											label={`Image ${img.sortOrder + 1}`}
											size="small"
											sx={{ bgcolor: theme.colors?.snow50, border: `1px solid ${theme.colors?.ink950}` }}
										/>
									))}
								</Stack>
							) : null}
						</Stack>

						{blog.coverImage ? (
							<Box
								sx={{
									width: '100%',
									height: 300,
									borderRadius: 2,
									overflow: 'hidden',
									bgcolor: 'gray',
									backgroundImage: `url(${blog.coverImage})`,
									backgroundSize: 'cover',
									backgroundPosition: 'center',
								}}
							/>
						) : null}

						<Stack spacing={2}>
							<Typography variant="h6" sx={{ color: theme.colors?.olive800, fontWeight: 600 }}>
								{blog.excerpt}
							</Typography>
							<Typography variant="body1" sx={{ color: theme.colors?.ink950, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
								{blog.content}
							</Typography>
						</Stack>

						<Stack direction="row" spacing={2} sx={{ borderTop: `1px solid ${theme.colors?.ink950}`, pt: 2 }}>
							<Typography variant="body2" sx={{ color: theme.colors?.olive800 }}>
								Views: {blog.viewCount}
							</Typography>
							<Typography variant="body2" sx={{ color: theme.colors?.olive800 }}>
								Comments: {blog.comments.filter((c) => c.status === 'APPROVED').length}
							</Typography>
						</Stack>

						<Stack spacing={3} sx={{ borderTop: `2px solid ${theme.colors?.ink950}`, pt: 3 }}>
							<Typography variant="h5" sx={{ fontWeight: 700, color: theme.colors?.ink950 }}>
								Comments
							</Typography>
							<CommentForm blogId={blog.id} />
							<CommentList comments={blog.comments} />
						</Stack>
					</>
				) : null}
		</Stack>
	);
}
