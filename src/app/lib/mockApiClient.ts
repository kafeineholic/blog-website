import {
	delay,
	mockAdmin,
	mockAdminPassword,
	mockBlogs,
	mockComments,
} from './mock-api-data';
import type {
	AuthLoginResponse,
	Blog,
	Comment,
	CommentStatus,
	PaginatedResponse,
} from './types';

let currentBlogs: Blog[] = JSON.parse(JSON.stringify(mockBlogs));
let currentComments: Comment[] = JSON.parse(JSON.stringify(mockComments));

const paginate = <T>(items: T[], page: number, limit: number): PaginatedResponse<T> => {
	const total = items.length;
	const totalPages = Math.max(1, Math.ceil(total / limit));
	const normalizedPage = Math.min(Math.max(page, 1), totalPages);
	const offset = (normalizedPage - 1) * limit;
	const data = items.slice(offset, offset + limit);

	return {
		data,
		pagination: {
			page: normalizedPage,
			limit,
			total,
			totalPages,
		},
	};
};

const syncBlogComments = () => {
	currentBlogs = currentBlogs.map((blog) => ({
		...blog,
		comments: currentComments.filter((comment) => comment.blogId === blog.id),
	}));
};

const ensureThaiOrDigitsOnly = (text: string) => {
	const thaiOrDigitsRegex = /^[\u0E00-\u0E7F0-9\s]+$/;
	return thaiOrDigitsRegex.test(text);
};

export const mockApiService = {
	async login(email: string, password: string): Promise<AuthLoginResponse> {
		await delay(250);

		if (email === mockAdmin.email && password === mockAdminPassword) {
			return {
				token: `mock-jwt-token-${Date.now()}`,
				user: mockAdmin,
			};
		}

		throw new Error('Invalid email or password');
	},

	async getBlogs(
		page: number = 1,
		limit: number = 10,
		search?: string
	): Promise<PaginatedResponse<Blog>> {
		await delay(250);

		let filtered = currentBlogs.filter((blog) => blog.isPublished);
		if (search) {
			const q = search.toLowerCase();
			filtered = filtered.filter(
				(blog) =>
					blog.title.toLowerCase().includes(q) ||
					blog.excerpt.toLowerCase().includes(q) ||
					blog.content.toLowerCase().includes(q)
			);
		}

		return paginate(filtered, page, limit);
	},

	async getBlogBySlug(slug: string): Promise<Blog> {
		await delay(250);

		const blog = currentBlogs.find((item) => item.slug === slug);
		if (!blog) {
			throw new Error('Blog not found');
		}

		blog.viewCount += 1;
		blog.updatedAt = new Date().toISOString();
		syncBlogComments();

		return blog;
	},

	async getBlogComments(
		blogId: number,
		page: number = 1,
		limit: number = 10
	): Promise<PaginatedResponse<Comment>> {
		await delay(250);

		const filtered = currentComments.filter(
			(comment) => comment.blogId === blogId && comment.status === 'APPROVED'
		);

		return paginate(filtered, page, limit);
	},

	async submitComment(blogId: number, author: string, content: string): Promise<Comment> {
		await delay(250);

		if (!author.trim()) {
			throw new Error('Author name is required');
		}
		if (!content.trim()) {
			throw new Error('Comment content is required');
		}
		if (content.length > 1000) {
			throw new Error('Comment must be less than 1000 characters');
		}
		if (!ensureThaiOrDigitsOnly(content.trim())) {
			throw new Error('Comment must contain Thai characters or digits 0-9 only');
		}

		const blog = currentBlogs.find((item) => item.id === blogId);
		if (!blog) {
			throw new Error('Blog not found');
		}

		const nextId = currentComments.length
			? Math.max(...currentComments.map((comment) => comment.id)) + 1
			: 1;

		const newComment: Comment = {
			id: nextId,
			blogId,
			author: author.trim(),
			content: content.trim(),
			status: 'PENDING',
			createdAt: new Date().toISOString(),
		};

		currentComments.push(newComment);
		syncBlogComments();

		return newComment;
	},

	async getAdminBlogs(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Blog>> {
		await delay(250);
		return paginate(currentBlogs, page, limit);
	},

	async createBlog(
		title: string,
		slug: string,
		content: string,
		excerpt: string,
		coverImage: string
	): Promise<Blog> {
		await delay(250);

		if (!title.trim()) {
			throw new Error('Title is required');
		}
		if (!slug.trim()) {
			throw new Error('Slug is required');
		}
		if (!content.trim()) {
			throw new Error('Content is required');
		}
		if (currentBlogs.some((blog) => blog.slug === slug.trim())) {
			throw new Error('Blog with this slug already exists');
		}

		const nextId = currentBlogs.length ? Math.max(...currentBlogs.map((blog) => blog.id)) + 1 : 1;
		const now = new Date().toISOString();

		const newBlog: Blog = {
			id: nextId,
			title: title.trim(),
			slug: slug.trim(),
			content: content.trim(),
			excerpt: excerpt.trim(),
			coverImage: coverImage.trim() || `https://picsum.photos/seed/blog-${nextId}/1200/600`,
			isPublished: false,
			viewCount: 0,
			publishedAt: null,
			createdAt: now,
			updatedAt: now,
			authorId: mockAdmin.id,
			author: mockAdmin,
			images: [],
			comments: [],
		};

		currentBlogs.push(newBlog);
		return newBlog;
	},

	async updateBlog(
		id: number,
		title?: string,
		content?: string,
		excerpt?: string,
		coverImage?: string
	): Promise<Blog> {
		await delay(250);

		const blog = currentBlogs.find((item) => item.id === id);
		if (!blog) {
			throw new Error('Blog not found');
		}

		if (title !== undefined) {
			blog.title = title.trim();
		}
		if (content !== undefined) {
			blog.content = content.trim();
		}
		if (excerpt !== undefined) {
			blog.excerpt = excerpt.trim();
		}
		if (coverImage !== undefined) {
			blog.coverImage = coverImage.trim();
		}
		blog.updatedAt = new Date().toISOString();

		return blog;
	},

	async publishBlog(id: number): Promise<Blog> {
		await delay(250);

		const blog = currentBlogs.find((item) => item.id === id);
		if (!blog) {
			throw new Error('Blog not found');
		}

		blog.isPublished = true;
		blog.publishedAt = new Date().toISOString();
		blog.updatedAt = new Date().toISOString();
		return blog;
	},

	async unpublishBlog(id: number): Promise<Blog> {
		await delay(250);

		const blog = currentBlogs.find((item) => item.id === id);
		if (!blog) {
			throw new Error('Blog not found');
		}

		blog.isPublished = false;
		blog.publishedAt = null;
		blog.updatedAt = new Date().toISOString();
		return blog;
	},

	async deleteBlog(id: number): Promise<void> {
		await delay(250);

		const index = currentBlogs.findIndex((item) => item.id === id);
		if (index === -1) {
			throw new Error('Blog not found');
		}

		currentBlogs.splice(index, 1);
		currentComments = currentComments.filter((comment) => comment.blogId !== id);
		syncBlogComments();
	},

	async getAdminComments(
		page: number = 1,
		limit: number = 10,
		status?: CommentStatus
	): Promise<PaginatedResponse<Comment>> {
		await delay(250);

		let filtered = currentComments;
		if (status) {
			filtered = filtered.filter((comment) => comment.status === status);
		}

		return paginate(filtered, page, limit);
	},

	async approveComment(id: number): Promise<Comment> {
		await delay(250);

		const comment = currentComments.find((item) => item.id === id);
		if (!comment) {
			throw new Error('Comment not found');
		}

		comment.status = 'APPROVED';
		syncBlogComments();
		return comment;
	},

	async rejectComment(id: number): Promise<Comment> {
		await delay(250);

		const comment = currentComments.find((item) => item.id === id);
		if (!comment) {
			throw new Error('Comment not found');
		}

		comment.status = 'REJECTED';
		syncBlogComments();
		return comment;
	},

	async deleteComment(id: number): Promise<void> {
		await delay(250);

		const index = currentComments.findIndex((item) => item.id === id);
		if (index === -1) {
			throw new Error('Comment not found');
		}

		currentComments.splice(index, 1);
		syncBlogComments();
	},
};
