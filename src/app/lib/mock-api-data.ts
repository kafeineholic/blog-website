import type { Blog, Comment, CommentStatus, User } from './types';

export const mockUsers: User[] = [
	{
		id: 1,
		email: 'admin@blog.com',
		createdAt: '2026-01-01T00:00:00Z',
	},
	{
		id: 2,
		email: 'author@blog.com',
		createdAt: '2026-01-05T00:00:00Z',
	},
];

export const mockAdmin: User = {
	id: 1,
	email: 'admin@blog.com',
	createdAt: '2026-01-01T00:00:00Z',
};

export const mockAdminPassword = 'admin123';

const BLOG_TOTAL = 23;

const buildBlog = (id: number): Blog => {
	const day = ((id - 1) % 28) + 1;
	const dayText = String(day).padStart(2, '0');
	const createdAt = `2026-03-${dayText}T08:00:00Z`;
	const publishedAt = `2026-04-${dayText}T09:00:00Z`;

	return {
		id,
		title: `Blog Post ${id}`,
		slug: `blog-post-${id}`,
		content: `เนื้อหาบทความ ${id} สำหรับทดสอบระบบหน้าเว็บและแอดมิน`,
		excerpt: `สรุปบทความ ${id} แบบสั้น`,
		coverImage: `https://picsum.photos/seed/blog-${id}/1200/600`,
		isPublished: true,
		viewCount: 100 + id,
		publishedAt,
		createdAt,
		updatedAt: createdAt,
		authorId: mockAdmin.id,
		author: mockAdmin,
		images: [
			{
				id,
				url: `https://picsum.photos/seed/blog-img-${id}/400/240`,
				sortOrder: 0,
			},
		],
		comments: [],
	};
};

export const mockBlogs: Blog[] = Array.from({ length: BLOG_TOTAL }, (_, idx) =>
	buildBlog(idx + 1)
);

export const mockComments: Comment[] = [
	{
		id: 1,
		blogId: 1,
		author: 'ผู้ใช้1',
		content: 'ดีมาก 123',
		status: 'APPROVED' as CommentStatus,
		createdAt: '2026-04-20T10:30:00Z',
	},
	{
		id: 2,
		blogId: 1,
		author: 'ผู้ใช้2',
		content: 'เนื้อหาดี 456',
		status: 'PENDING' as CommentStatus,
		createdAt: '2026-04-21T11:00:00Z',
	},
	{
		id: 3,
		blogId: 2,
		author: 'ผู้ใช้3',
		content: 'ขอบคุณ 789',
		status: 'APPROVED' as CommentStatus,
		createdAt: '2026-04-22T09:00:00Z',
	},
	{
		id: 4,
		blogId: 3,
		author: 'ผู้ใช้4',
		content: 'รออัปเดต 999',
		status: 'REJECTED' as CommentStatus,
		createdAt: '2026-04-23T12:00:00Z',
	},
	{
		id: 5,
		blogId: 5,
		author: 'ผู้ใช้5',
		content: 'เยี่ยมมาก 2026',
		status: 'PENDING' as CommentStatus,
		createdAt: '2026-04-24T08:45:00Z',
	},
	{
		id: 6,
		blogId: 8,
		author: 'ผู้ใช้6',
		content: 'ข้อมูลครบ 88',
		status: 'APPROVED' as CommentStatus,
		createdAt: '2026-04-25T07:20:00Z',
	},
];

for (const blog of mockBlogs) {
	blog.comments = mockComments.filter((comment) => comment.blogId === blog.id);
}

export const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
