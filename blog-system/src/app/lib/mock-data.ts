export interface BlogItem {
	id: number;
	title: string;
	date: string;
	summary: string;
	views: number;
}

export const mockBlogs: BlogItem[] = Array.from({ length: 30 }, (_, idx) => {
	const id = idx + 1;
	const day = (idx % 28) + 1;

	return {
		id,
		title: `Blog Post ${id}`,
		date: `Apr ${String(day).padStart(2, "0")}, 2026`,
		summary:
			"A short overview of this article, including key points and practical takeaways for readers.",
		views: 40 + id * 3,
	};
});
