import Link from "next/link";
import { Box, Stack, Typography, useTheme } from "@mui/material";

interface BlogItem {
	id: number;
	title: string;
	date: string;
	summary: string;
	views: number;
	slug: string;
}

interface BlogCardRowProps {
	item: BlogItem;
}

const BlogCardRow = ({ item }: BlogCardRowProps) => {
	const theme = useTheme();
	return (
		<Stack
			direction={{ xs: "column", md: "row" }}
			sx={{
				border: `2px solid ${theme.colors.ink950}`,
				borderRadius: 3,
				overflow: "hidden",
				bgcolor: theme.colors.snow50,
			}}
		>
			<Box
				sx={{
					minHeight: 160,
					width: { xs: "100%", md: 280 },
					background:
						"radial-gradient(circle at 30% 30%, #f7d499 0%, #ef9f58 45%, #dd6b20 100%)",
				}}
			/>

			<Stack sx={{ flex: 1, p: 2.5, justifyContent: "space-between", gap: 1.5 }}>
				<Stack spacing={0.75}>
					<Typography variant="caption" sx={{ letterSpacing: "0.16em", color: theme.colors.olive800 }}>
						{item.date}
					</Typography>
					<Typography variant="h6" sx={{ color: theme.colors.ink950, lineHeight: 1.2 }}>
						{item.title}
					</Typography>
					<Typography variant="body2" sx={{ color: theme.colors.olive800 }}>
						{item.summary}
					</Typography>
				</Stack>

				<Stack
					direction="row"
					sx={{
						alignItems: "center",
						justifyContent: "space-between",
						borderTop: `2px solid ${theme.colors.ink950}`,
						pt: 1.5,
					}}
				>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						{item.views} views
					</Typography>

					<Link
						href={`/blog/${item.slug}`}
						className="rounded-full border-2 border-black px-4 py-1 text-sm font-semibold transition-colors hover:bg-black hover:text-white"
					>
						more
					</Link>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default BlogCardRow;
