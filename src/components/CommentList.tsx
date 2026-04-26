'use client';

import { Stack, Typography, useTheme } from '@mui/material';
import type { Comment } from '@/app/lib/types';

interface CommentListProps {
	comments: Comment[];
}

const CommentList = ({ comments }: CommentListProps) => {
	const theme = useTheme();
	const approvedComments = comments.filter((comment) => comment.status === 'APPROVED');

	if (approvedComments.length === 0) {
		return (
			<Typography variant="body2" sx={{ color: theme.colors?.olive800, fontStyle: 'italic' }}>
				No comments yet.
			</Typography>
		);
	}

	return (
		<Stack spacing={2}>
			{approvedComments.map((comment) => (
				<Stack
					key={comment.id}
					spacing={0.5}
					sx={{
						p: 2,
						borderLeft: `3px solid ${theme.colors?.ink950}`,
						bgcolor: theme.colors?.snow50,
					}}
				>
					<Stack direction="row" sx={{ justifyContent: 'space-between' }}>
						<Typography variant="body2" sx={{ fontWeight: 600 }}>
							{comment.author}
						</Typography>
						<Typography variant="caption" sx={{ color: theme.colors?.olive800 }}>
							{new Date(comment.createdAt).toLocaleDateString('th-TH')}
						</Typography>
					</Stack>
					<Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
						{comment.content}
					</Typography>
				</Stack>
			))}
		</Stack>
	);
};

export default CommentList;
