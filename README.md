# Product Inventory Management

## Tech Stack

**Backend**
- Node.js + TypeScript
- Express v5
- Prisma ORM + MySQL 8.4
- Zod (validation), Multer (image uploads)

**Frontend**
- Vue 3 (Composition API)
- Vite
- TailwindCSS v4

**Infrastructure**
- Docker + Docker Compose (MySQL, phpMyAdmin, backend, frontend)

---

## Running with Docker

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:51730 |
| Backend API | http://localhost:3000 |
| phpMyAdmin | http://localhost:8080 |

Uploaded images are persisted via a bind mount at `./backend/uploads`.

---

## Running Manually

### Prerequisites
- Node.js >= 22
- MySQL 8.x running locally

### Backend

1. Copy and configure env:

```bash
cd backend
```

Create a `.env` file:

```env
DATABASE_URL="mysql://root@localhost:3306/product_inventory"
DATABASE_HOST="localhost"
DATABASE_PORT="3306"
DATABASE_USER="root"
DATABASE_NAME="product_inventory"
```

> By default, mysql don't have root password.

2. Install dependencies and run migrations:

```bash
npm install
npx prisma migrate deploy
```

3. Start the dev server:

```bash
npm run dev
```

Backend runs on `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:51730`.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get a single product |
| POST | `/api/products` | Create a product |
| PATCH | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |
| POST | `/api/products/:id/image` | Upload/replace product image |

Images are served as static files from `/uploads/:filename`.

