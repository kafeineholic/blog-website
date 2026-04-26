'use client';

import { useState } from 'react';
import { Alert, Button, CircularProgress, Stack, TextField, useTheme } from '@mui/material';
import { apiClient } from '@/app/lib/apiClient';

interface CommentFormProps {
	blogId: number;
	onCommentSubmitted?: () => void;
}

const thaiOrDigitsRegex = /^[\u0E00-\u0E7F0-9\s]+$/;

const CommentForm = ({ blogId, onCommentSubmitted }: CommentFormProps) => {
	const theme = useTheme();
	const [author, setAuthor] = useState('');
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const validateForm = () => {
		if (!author.trim()) {
			setError('Author name is required');
			return false;
		}
		if (!content.trim()) {
			setError('Comment content is required');
			return false;
		}
		if (content.length > 1000) {
			setError('Comment must be less than 1000 characters');
			return false;
		}
		if (!thaiOrDigitsRegex.test(content.trim())) {
			setError('Comment must contain Thai characters or digits 0-9 only');
			return false;
		}
		return true;
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError('');
		setSuccess('');

		if (!validateForm()) {
			return;
		}

		setLoading(true);
		try {
			await apiClient.submitComment(blogId, {
				author: author.trim(),
				content: content.trim(),
			});
			setSuccess('Comment submitted successfully! It will be reviewed by admin.');
			setAuthor('');
			setContent('');
			onCommentSubmitted?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to submit comment');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ maxWidth: 600 }}>
			<TextField
				label="Your Name"
				value={author}
				onChange={(event) => setAuthor(event.target.value)}
				fullWidth
				disabled={loading}
			/>
			<TextField
				label="Comment"
				value={content}
				onChange={(event) => setContent(event.target.value)}
				fullWidth
				multiline
				rows={4}
				disabled={loading}
				placeholder="กรอกข้อความเป็นภาษาไทยหรือเลข 0-9"
				helperText={`${content.length}/1000 characters`}
			/>
			{error ? <Alert severity="error">{error}</Alert> : null}
			{success ? <Alert severity="success">{success}</Alert> : null}
			<Button
				type="submit"
				variant="contained"
				disabled={loading}
				sx={{
					bgcolor: theme.colors?.ink950 ?? '#000',
					'&:hover': {
						bgcolor: theme.colors?.olive800 ?? '#333',
					},
				}}
			>
				{loading ? <CircularProgress size={24} /> : 'Submit Comment'}
			</Button>
		</Stack>
	);
};

export default CommentForm;
