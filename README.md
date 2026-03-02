# Notes App

A web application for taking notes with support for tags and filters.

## Features

### Phase 1 (Implemented)

- ✅ Create, edit, and delete notes
- ✅ Archive/unarchive notes
- ✅ List active notes
- ✅ List archived notes

### Phase 2 (Implemented)

- ✅ Add/remove categories (tags) to notes
- ✅ Filter notes by category

## System Requirements

### Runtimes and Tools

- **Bun**: v1.3.5 or higher (for backend)
- **Node.js**: v18.17.0 or higher (for frontend)
- **npm**: v9.6.7 or higher
- **PostgreSQL**: v14 or higher (database - hosted on Neon)

### Operating System

- Linux or macOS (the startup script is optimized for these systems)

## Project Structure

```
Heredia-b00b82/
├── backend/          # REST API with Express and Bun
├── frontend/         # SPA with React and Vite
└── start.sh          # Script to start the application
```

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Heredia-b00b82
```

### 2. Database Configuration

The project uses PostgreSQL hosted on Neon. The database configuration is already set in `backend/.env`.

**Note**: The `.env` file is included in this repository for evaluation purposes only. It contains the connection string to a demo database on Neon. In a production environment, this file should never be committed to version control.

For more information about the database setup, see [DATABASE.md](DATABASE.md).

### 3. Run the application

From the project root:

```bash
chmod +x start.sh
./start.sh
```

This script will:

- Install backend dependencies (if needed)
- Install frontend dependencies (if needed)
- Configure Prisma and set up the database schema
- Start the backend on `http://localhost:3002`
- Start the frontend on `http://localhost:5173`

## Manual Installation (Alternative)

If you prefer to set up manually:

### Backend Setup

```bash
cd backend
bun install
bun --bun prisma generate
bun --bun prisma db push
```

### Frontend Setup

```bash
cd frontend
npm install
```

### Running the Application

**Terminal 1 - Backend:**

```bash
cd backend
bun run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

## Accessing the Application

Once started, access:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3002/api

## Login Credentials

The application requires registration. To create an account:

1. Go to http://localhost:5173
2. Click on "Sign up"
3. Create your username and password
4. Sign in with your credentials

## Architecture

### Backend

**Technologies:**

- Bun (Runtime)
- Express.js (Web framework)
- Prisma (ORM)
- PostgreSQL (Database)
- JWT (Authentication)

**Layer Structure:**

```
backend/src/
├── presentation/       # Controllers and Routes (Presentation layer)
├── application/        # Use Cases and DTOs (Application layer)
├── domain/            # Entities and Repositories (Domain layer)
└── infrastructure/    # Concrete implementations (Infrastructure layer)
```

**Architecture Pattern:** Clean Architecture with layer separation

### Frontend

**Technologies:**

- React 18
- TypeScript
- Vite (Build tool)
- TailwindCSS (Styles)
- React Query (Server state management)
- React Router (Navigation)
- Axios (HTTP client)

**Structure:**

```
frontend/src/
├── components/    # Reusable components
├── pages/         # Application pages
├── services/      # API services
├── hooks/         # Custom hooks
├── context/       # Context providers
└── types/         # TypeScript definitions
```

## REST API

The backend exposes a REST API with the following endpoints:

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Sign out
- `DELETE /api/auth/delete` - Delete account

### Notes

- `GET /api/note` - List notes (with filters and pagination)
- `POST /api/note` - Create note
- `PUT /api/note/:id` - Update note
- `PATCH /api/note/:id/archive` - Archive/unarchive note
- `DELETE /api/note/:id` - Delete note

### Tags

- `GET /api/tag` - List tags
- `POST /api/tag` - Create tag
- `DELETE /api/tag/:id` - Delete tag

## Database

The project uses PostgreSQL with Prisma ORM. The schema includes:

- **users**: Application users
- **notes**: Notes created by users
- **tags**: Tags/categories
- **note_tags**: Many-to-many relationship between notes and tags

## Development

### Backend

```bash
cd backend
bun run dev  # Development mode with hot reload
```

### Frontend

```bash
cd frontend
npm run dev     # Development mode
npm run build   # Build for production
npm run preview # Production preview
```

## Technical Notes

- The backend uses HTTP-only cookies for JWT authentication
- The frontend uses a Vite proxy for API requests in development
- The application implements pagination for notes and tags lists
- The Repository pattern is used for data abstraction
- Use cases encapsulate business logic
- The database is hosted on Neon (PostgreSQL cloud service)
