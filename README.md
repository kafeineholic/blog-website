# Blog System

A fully operational blog website built with **Next.js 16** (App Router), **React 19**, **TypeScript**, and **Material-UI**. Features a complete admin workflow with blog CRUD operations and comment moderation.

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run in Development

```bash
npm run dev
```

The application will start at **http://localhost:3000**

### 3. Build for Production

```bash
npm run build
npm run start
```

---

## Key Routes & Features

### Public Routes

| Route | Description |
|---|---|
| `/` | **Home Page** — Browse all published blogs with search and pagination (10 per page) |
| `/blog/[blogId]` | **Blog Detail** — Read full blog post with images, view count, and approved comments |

### Authentication

| Route | Description |
|---|---|
| `/auth/login` | **Admin Login** — Access the admin panel with credentials |

### Admin Dashboard (Protected)

| Route | Description |
|---|---|
| `/admin` | **Admin Dashboard** — Overview of available admin operations |
| `/admin/blogs` | **Blog Management** — Create, edit, publish/unpublish, and delete blogs |
| `/admin/comments` | **Comment Moderation** — View, approve, reject, or delete visitor comments |

---

## Data Models

### Blog

```typescript
interface Blog {
  id: number;
  title: string;
  slug: string;                 // URL-friendly identifier
  content: string;              // Full blog content
  excerpt: string;              // Summary text
  coverImage?: string;          // Cover image URL
  isPublished: boolean;         // Publication status
  viewCount: number;            // Auto-incremented on detail view
  publishedAt?: string | null;  // Set when published
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: User;
  images: BlogImage[];          // Max 6 images per blog
  comments: Comment[];          // Related comments
}
```

### Comment

```typescript
type CommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface Comment {
  id: number;
  blogId: number;
  author: string;               // Visitor name
  content: string;              // Thai chars + digits only
  status: CommentStatus;        // Publication status
  createdAt: string;
}
```

### User

```typescript
interface User {
  id: number;
  email: string;                // Unique identifier
  createdAt: string;
}
```

## API Layer Documentation

### Mock API Service

The `mockApiClient.ts` provides the following methods:

**Blogs:**
- `getBlogs(page, limit, search?)` — Get published blogs
- `getBlogBySlug(slug)` — Get single blog
- `getAdminBlogs(page, limit)` — Get all blogs (admin)
- `createBlog(...)` — Create new blog
- `updateBlog(id, ...)` — Update blog
- `deleteBlog(id)` — Delete blog
- `publishBlog(id)` / `unpublishBlog(id)` — Toggle publish status

**Comments:**
- `getBlogComments(blogId, page, limit)` — Get approved comments
- `getAdminComments(page, limit, status?)` — Get all comments (admin)
- `submitComment(...)` — Submit new comment
- `approveComment(id)` — Approve comment
- `rejectComment(id)` — Reject comment
- `deleteComment(id)` — Delete comment

**Authentication:**
- `login(email, password)` — Admin login

---

## API Endpoints Overview

This section documents the complete API surface. The current implementation uses a mock API service (in-memory). For production, implement these endpoints in a real backend.

### Public Endpoints (No Authentication)

#### Blogs

| Method | Endpoint | Description | Query Params |
|---|---|---|---|
| `GET` | `/api/blogs` | Get all published blogs | `page`, `limit`, `search` |
| `GET` | `/api/blogs/:slug` | Get single blog by slug | — |
| `GET` | `/api/comments/:blogId` | Get approved comments for blog | `page`, `limit` |
| `POST` | `/api/comments/:blogId` | Submit a new comment | — |

**Response Example (GET /api/blogs):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Blog Post Title",
      "slug": "blog-post-title",
      "excerpt": "Brief summary...",
      "coverImage": "https://...",
      "isPublished": true,
      "viewCount": 42,
      "publishedAt": "2026-04-26T09:00:00Z",
      "createdAt": "2026-03-15T08:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 23,
    "totalPages": 3
  }
}
```

### Admin Endpoints (Requires Authentication)

#### Authentication

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `POST` | `/api/auth/login` | Admin login | `{ "email": string, "password": string }` |

**Response Example (POST /auth/login):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@blog.com",
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

#### Admin Blogs

| Method | Endpoint | Description | Body/Query |
|---|---|---|---|
| `GET` | `/api/admin/blogs` | Get all blogs (drafts + published) | `page`, `limit` |
| `POST` | `/api/admin/blogs` | Create new blog | See schema below |
| `PATCH` | `/api/admin/blogs/:id` | Update blog | Partial blog fields |
| `DELETE` | `/api/admin/blogs/:id` | Delete blog | — |
| `PATCH` | `/api/admin/blogs/:id/publish` | Publish blog | — |
| `PATCH` | `/api/admin/blogs/:id/unpublish` | Unpublish blog | — |

**Create Blog Request Body:**
```json
{
  "title": "New Blog Post",
  "slug": "new-blog-post",
  "excerpt": "Brief summary",
  "content": "Full blog content with **markdown** support",
  "coverImage": "https://example.com/image.jpg"
}
```

**Update Blog Request Body:**
```json
{
  "title": "Updated Title",
  "excerpt": "New excerpt",
  "content": "Updated content",
  "coverImage": "https://example.com/new-image.jpg"
}
```

#### Admin Comments

| Method | Endpoint | Description | Query/Params |
|---|---|---|---|
| `GET` | `/api/admin/comments` | Get all comments (filtered) | `page`, `limit`, `status` |
| `PATCH` | `/api/admin/comments/:id/approve` | Approve comment | — |
| `PATCH` | `/api/admin/comments/:id/reject` | Reject comment | — |
| `DELETE` | `/api/admin/comments/:id` | Delete comment | — |

**Get Comments Response:**
```json
{
  "data": [
    {
      "id": 1,
      "blogId": 1,
      "author": "John Doe",
      "content": "ความเห็นที่ดี 123",
      "status": "PENDING",
      "createdAt": "2026-04-26T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### Error Responses

All endpoints return errors in this format:

| Status | Response | Description |
|---|---|---|
| `400` | `{ "error": "Bad Request", "message": "..." }` | Invalid input |
| `401` | `{ "error": "Unauthorized", "message": "..." }` | Missing/invalid auth token |
| `403` | `{ "error": "Forbidden", "message": "..." }` | Insufficient permissions |
| `404` | `{ "error": "Not Found", "message": "..." }` | Resource not found |
| `500` | `{ "error": "Server Error", "message": "..." }` | Server-side error |


---

## Current Limitations
- UI design is kept minimal and not fully polished
- Backend is not implemented (mock API is used instead)
- Authentication is simulated (no real JWT implementation)
- Some advanced features such as image upload and rich text editor are not included

--- 

## Future Enhancements

To extend this project:

- Enhance UI/UX with better spacing, typography, and responsive design
- Implement real backend using NestJS and connect with PostgreSQL
- Add authentication system with JWT for admin access
- Improve performance with server-side rendering and caching
- Add image upload functionality and content editor for blog creation
- Implement proper error handling and loading states across all pages


