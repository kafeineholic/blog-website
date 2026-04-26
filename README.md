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

## Admin Workflow

### Authentication Flow

1. Navigate to `/auth/login`
2. Login with mock credentials:
   - **Email:** `admin@blog.com`
   - **Password:** `admin123`
3. Access token is stored in `AuthContext`
4. Redirected to `/admin` dashboard

### Blog Management

**Operations:**
- ✅ **Create** — Add new blog post with title, slug, excerpt, content, cover image
- ✅ **List** — View all blogs (drafts + published) with pagination
- ✅ **Edit** — Modify existing blog details (slug is immutable)
- ✅ **Publish/Unpublish** — Toggle blog visibility and set `publishedAt` timestamp
- ✅ **Delete** — Remove blog post and associated data

**Features:**
- Real-time status updates
- Automatic `viewCount` tracking on blog detail views
- Support for cover images
- Title-based search (on frontend)

### Comment Moderation

**Operations:**
- ✅ **View** — Browse all visitor comments
- ✅ **Filter** — Filter by status (PENDING, APPROVED, REJECTED)
- ✅ **Approve** — Make comment visible on blog post
- ✅ **Reject** — Hide rejected comments
- ✅ **Delete** — Remove comment permanently

**Comment Validation:**
- Author name (required)
- Content: **Thai characters and digits only** (regex: `/^[ก-๙0-9\s]+$/`)
- Unpublished comments are hidden from public view

---

## Project Structure

```
blog-website/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin routes (protected)
│   │   │   ├── layout.tsx      # Admin layout with auth & sidebar
│   │   │   ├── page.tsx        # Admin dashboard
│   │   │   ├── blogs/          # Blog management
│   │   │   │   └── page.tsx
│   │   │   └── comments/       # Comment moderation
│   │   │       └── page.tsx
│   │   ├── auth/
│   │   │   └── login/          # Login page
│   │   │       └── page.tsx
│   │   ├── blog/
│   │   │   └── [blogId]/       # Blog detail page
│   │   │       └── page.tsx
│   │   ├── lib/
│   │   │   ├── apiClient.ts    # API client wrapper
│   │   │   ├── mockApiClient.ts # Mock API service
│   │   │   ├── mock-api-data.ts # Mock data
│   │   │   ├── types.ts        # TypeScript types
│   │   │   └── mui-theme.ts    # MUI theme config
│   │   ├── components/
│   │   │   ├── AuthProvider.tsx  # Auth context provider
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── BlogList/
│   │   │   └── ... other components
│   │   └── layout.tsx          # Root layout
│   └── docs/
│       ├── schema.prisma       # Prisma schema (reference only)
│       └── openapi.yaml        # API documentation
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.js
└── eslint.config.mjs
```

---

## NPM Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build optimized production bundle
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

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

---

## Environment Configuration

No environment variables are required for development. The application uses:
- **In-memory mock data** for blogs, comments, and users
- **Local storage** for authentication tokens
- **URL-based routing** for navigation

> **Note:** To integrate with a real backend API (NestJS + PostgreSQL as documented in README2.md), you would need to update `apiClient.ts` to make actual HTTP requests instead of calling `mockApiService`.

---

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

## Important Notes

1. **Authentication:** Uses mock JWT tokens. In production, implement real JWT validation on the backend.

2. **Data Persistence:** All data is stored in memory. Refreshing the browser will reset to mock data. For production, connect to a PostgreSQL database using the Prisma schema.

3. **Comment Validation:** Thai character validation is performed on the frontend. Server-side validation should be added in a real backend (see regex: `/^[ก-๙0-9\s]+$/`).

4. **Route Protection:** Admin routes (`/admin/*`) require authentication. Protected by layout-level checks in `AdminManagerLayout`.

5. **File Cleanup:** Removed stale/duplicate files:
   - ❌ `/src/app/lib/api.ts` (empty)
   - ❌ `/src/app/lib/apiClient.ts.new` (empty)
   - ❌ `/src/app/lib/mock-data.ts` (old data structure)
   - ❌ `/src/app/lib/utils.ts` (empty)
   - ❌ `/src/app/lib/theme.ts` (unused, replaced by mui-theme.ts)
   - ❌ `/src/app/admin/login` (redundant redirect)

---

## Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### TypeScript Errors
```bash
# Regenerate TypeScript types
npm run build
```

### Login Not Working
- Check that you're using the correct credentials: `admin@blog.com` / `admin123`
- Clear browser storage: `localStorage.clear()`
- Ensure cookies are enabled

---

## Future Enhancements

To extend this project:

1. **Real Backend Integration**
   - Replace `mockApiService` with actual HTTP calls in `apiClient.ts`
   - Set up NestJS backend (see README2.md for architecture)
   - Connect PostgreSQL database with Prisma

2. **Image Management**
   - Implement image upload to support 6 images per blog
   - Add image gallery component

3. **Advanced Features**
   - Comment nested replies
   - Blog categories/tags
   - User roles (editor, author, admin)
   - Email notifications
   - Analytics dashboard

4. **Performance**
   - Add caching strategies
   - Implement pagination optimizations
   - Add image lazy loading

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## License

This project is provided as-is for educational purposes.
