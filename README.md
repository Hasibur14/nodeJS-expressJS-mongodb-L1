# Blog Backend (Node.js + Express + MongoDB)

A scalable REST API starter using a layered architecture, with a Blog module as a working CRUD example.

## Folder Structure

```
blog-backend/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   └── Blog.js             # Mongoose schema
├── controllers/
│   └── blogController.js   # Business logic
├── routes/
│   └── blogRoutes.js       # Route definitions
├── middleware/
│   └── errorHandler.js     # 404 + centralized error handling
├── utils/
│   └── ApiError.js         # Custom error class
├── app.js                  # Express app (middleware + routes)
├── server.js               # Entry point (DB connect + listen)
├── .env.example
└── package.json
```

This structure scales well: to add a new resource (e.g. `users`, `comments`), just add a model, controller, and routes file, then mount it in `app.js` — no changes needed elsewhere.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   - `MONGO_URI` — local MongoDB (`mongodb://127.0.0.1:27017/blogdb`) or a MongoDB Atlas connection string.

3. Run in development (auto-restart on changes):
   ```bash
   npm run dev
   ```

4. Or run in production:
   ```bash
   npm start
   ```

Server starts at `http://localhost:5000` by default. Health check: `GET /api/health`.

## Blog API Endpoints

| Method | Endpoint              | Description                                  |
|--------|-----------------------|-----------------------------------------------|
| POST   | `/api/blogs`           | Create a new blog                            |
| GET    | `/api/blogs`           | Get all blogs (pagination, search, filters)  |
| GET    | `/api/blogs/:id`       | Get single blog by ID or slug                |
| PUT    | `/api/blogs/:id`       | Update a blog                                |
| DELETE | `/api/blogs/:id`       | Delete a blog                                |

### Query params for `GET /api/blogs`
- `page`, `limit` — pagination
- `search` — full-text search on title/content
- `tag` — filter by tag
- `published` — `true` / `false`

### Example: Create a blog
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started with Express",
    "content": "Express is a minimal Node.js framework...",
    "author": "Jane Doe",
    "tags": ["node", "express"],
    "published": true
  }'
```

### Example: Get blogs with search + pagination
```bash
curl "http://localhost:5000/api/blogs?search=express&page=1&limit=5"
```

## Notes for Scaling Further

- **Auth**: Add a `middleware/auth.js` with JWT verification and protect routes like `POST`/`PUT`/`DELETE` in `blogRoutes.js`.
- **Validation**: For stricter input validation, add `express-validator` or `zod` checks in the routes before hitting controllers.
- **New resources**: Copy the Blog pattern (model → controller → routes → mount in `app.js`) for `User`, `Comment`, `Category`, etc.
- **Testing**: Add `jest` + `supertest` for controller/route tests.
- **Rate limiting**: Add `express-rate-limit` in `app.js` for public APIs.
