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

Base URL: `http://localhost:3000/api`

---

### GET /products

Returns all products. Supports optional category filtering via query parameter.

**Query Parameters**

| Parameter | Type | Description |
|---|---|---|
| `category` | string | Optional. Filter products by category (e.g. `Subscription`, `Physical`). |

**Response `200`**
```json
[
  {
    "id": "cuid",
    "name": "string",
    "description": "string | null",
    "price": "string (decimal)",
    "stock": "number",
    "category": "string | null",
    "imageUrl": "string | null",
    "status": "string | null",
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601"
  }
]
```

---

### GET /products/:id

**Response `200`** — same shape as a single item above.

**Response `404`**
```json
{ "message": "Product not found" }
```

---

### POST /products

**Request** — `Content-Type: application/json`
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "price": "number >= 0 (required)",
  "stock": "integer >= 0 (required)",
  "category": "string (optional)",
  "imageUrl": "string (optional)",
  "status": "string (optional)"
}
```

**Response `201`** — the created product object.

**Response `400`**
```json
{
  "message": "Invalid request body",
  "error": {
    "name": ["Name is required"],
    "price": ["Price must be greater than or equal to 0"]
  }
}
```

---

### PATCH /products/:id

All fields are optional. Only provided fields are updated.

**Request** — `Content-Type: application/json`
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "price": "number >= 0 (optional)",
  "stock": "integer >= 0 (optional)",
  "category": "string (optional)",
  "imageUrl": "string (optional)",
  "status": "string (optional)"
}
```

**Response `200`** — the updated product object.

**Response `400`** — same shape as POST validation error.

**Response `404`**
```json
{ "message": "Product not found" }
```

---

### PATCH /products/stock/increment/:id

Increments the stock of the specified product by 1.

**Request Body** — None required.

**Response `200`** — the updated product object with incremented stock.

**Response `404`**
```json
{ "message": "Product not found" }
```

---

### PATCH /products/stock/decrement/:id

Decrements the stock of the specified product by 1. Stock cannot fall below 0.

**Request Body** — None required.

**Response `200`** — the updated product object with decremented stock.

**Response `400`**
```json
{ "message": "Stock cannot be less than 0" }
```

**Response `404`**
```json
{ "message": "Product not found" }
```

---

### DELETE /products/:id

**Response `204`** — no body.

**Response `404`**
```json
{ "message": "Product not found" }
```

---

### POST /products/:id/image

**Request** — `Content-Type: multipart/form-data`

| Field | Type | Notes |
|---|---|---|
| `image` | file | Required. JPG, PNG, or WebP. Max 5 MB. |

**Response `200`** — the updated product object with the new `imageUrl`.

**Response `400`**
```json
{ "message": "image file is required" }
```

**Response `404`**
```json
{ "message": "Product not found" }
```


Images are served as static files: `GET /uploads/:filename`

