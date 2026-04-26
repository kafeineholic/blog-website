import type {
	AuthLoginPayload,
	AuthLoginResponse,
	Blog,
	Comment,
	CommentStatus,
	CommentSubmitPayload,
	PaginatedResponse,
} from './types';
import { mockApiService } from './mockApiClient';

class ApiClient {
	async getBlogs(
		page: number = 1,
		limit: number = 10,
		search?: string
	): Promise<PaginatedResponse<Blog>> {
		return mockApiService.getBlogs(page, limit, search);
	}

	async getBlogBySlug(slug: string): Promise<Blog> {
		return mockApiService.getBlogBySlug(slug);
	}

	async getBlogComments(
		blogId: number,
		page: number = 1,
		limit: number = 10
	): Promise<PaginatedResponse<Comment>> {
		return mockApiService.getBlogComments(blogId, page, limit);
	}

	async submitComment(blogId: number, payload: CommentSubmitPayload): Promise<Comment> {
		return mockApiService.submitComment(blogId, payload.author, payload.content);
	}

	async login(payload: AuthLoginPayload): Promise<AuthLoginResponse> {
		return mockApiService.login(payload.email, payload.password);
	}

	async getAdminBlogs(
		page: number = 1,
		limit: number = 10,
		_token?: string
	): Promise<PaginatedResponse<Blog>> {
		return mockApiService.getAdminBlogs(page, limit);
	}

	async createBlog(payload: Partial<Blog>, _token?: string): Promise<Blog> {
		return mockApiService.createBlog(
			payload.title ?? '',
			payload.slug ?? '',
			payload.content ?? '',
			payload.excerpt ?? '',
			payload.coverImage ?? ''
		);
	}

	async updateBlog(blogId: number, payload: Partial<Blog>, _token?: string): Promise<Blog> {
		return mockApiService.updateBlog(
			blogId,
			payload.title,
			payload.content,
			payload.excerpt,
			payload.coverImage
		);
	}

	async publishBlog(blogId: number, _token?: string): Promise<Blog> {
		return mockApiService.publishBlog(blogId);
	}

	async unpublishBlog(blogId: number, _token?: string): Promise<Blog> {
		return mockApiService.unpublishBlog(blogId);
	}

	async deleteBlog(blogId: number, _token?: string): Promise<void> {
		return mockApiService.deleteBlog(blogId);
	}

	async getAdminComments(
		page: number = 1,
		limit: number = 10,
		status?: CommentStatus,
		_token?: string
	): Promise<PaginatedResponse<Comment>> {
		return mockApiService.getAdminComments(page, limit, status);
	}

	async approveComment(commentId: number, _token?: string): Promise<Comment> {
		return mockApiService.approveComment(commentId);
	}

	async rejectComment(commentId: number, _token?: string): Promise<Comment> {
		return mockApiService.rejectComment(commentId);
	}

	async deleteComment(commentId: number, _token?: string): Promise<void> {
		return mockApiService.deleteComment(commentId);
	}
}

export const apiClient = new ApiClient();
