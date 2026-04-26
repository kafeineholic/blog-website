export interface User {
	id: number;
	email: string;
	createdAt: string;
}

export type CommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Comment {
	id: number;
	blogId: number;
	author: string;
	content: string;
	status: CommentStatus;
	createdAt: string;
}

export interface BlogImage {
	id: number;
	url: string;
	sortOrder: number;
}

export interface Blog {
	id: number;
	title: string;
	slug: string;
	content: string;
	excerpt: string;
	coverImage?: string;
	isPublished: boolean;
	viewCount: number;
	publishedAt?: string | null;
	createdAt: string;
	updatedAt: string;
	authorId: number;
	author: User;
	images: BlogImage[];
	comments: Comment[];
}

export interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: Pagination;
}

export interface CommentSubmitPayload {
	author: string;
	content: string;
}

export interface AuthLoginPayload {
	email: string;
	password: string;
}

export interface AuthLoginResponse {
	token: string;
	user: User;
}
