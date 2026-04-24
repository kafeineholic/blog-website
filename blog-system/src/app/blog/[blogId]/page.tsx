type BlogPageProps = {
	params: Promise<{
		blogId: string;
	}>;
};

export default async function BlogPage({ params }: BlogPageProps) {
	const { blogId } = await params;

	return <main>Blog post: {blogId}</main>;
}
