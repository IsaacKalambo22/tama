# TAMA Farmers Trust - Development Setup Guide

This guide will help you set up the TAMA Farmers Trust project for local development.

## Prerequisites

- Node.js (v16+)
- pnpm (v10.6.5+)
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tama-farmers-trust
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

#### API Environment

Copy the example environment file and update it with your settings:

```bash
cp apps/api/env.example apps/api/.env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: API server port (default: 8001)
- `JWT_ACCESS_SECRET_KEY`: Secret for JWT access tokens
- `JWT_REFRESH_SECRET_KEY`: Secret for JWT refresh tokens
- `CLIENT_BASE_URL`: Frontend URL (default: http://localhost:3000)
- Email configuration for notifications

#### Web Environment

Copy the example environment file and update it with your settings:

```bash
cp apps/web/env.example apps/web/.env
```

Required variables:
- `AUTH_SECRET`: NextAuth.js secret
- `NEXT_PUBLIC_API_ENDPOINT`: Backend API URL (default: http://localhost:8000/tama)
- AWS S3 configuration for file storage

### 4. Set Up Database

#### Option 1: Using Docker

```bash
# Create a network for the containers
docker network create app_network

# Start the database container
docker-compose up -d db
```

#### Option 2: Local PostgreSQL

If you're using a local PostgreSQL instance:

1. Create a database named `tama`
2. Update the `DATABASE_URL` in `apps/api/.env`
3. Run migrations:

```bash
cd apps/api
pnpm db:migrate
```

### 5. Start Development Servers

```bash
# Start all services in development mode
pnpm dev
```

This will start:
- Frontend: http://localhost:3000
- API: http://localhost:8001

### 6. Access Prisma Studio (Database UI)

```bash
cd apps/api
pnpm studio
```

This will open Prisma Studio at http://localhost:5555

## Development Workflow

### Code Structure

The project follows a modular architecture:

- **Frontend**: Next.js App Router with modular organization
  - `src/modules/`: Feature-based modules (admin, client, auth, common)
  - `src/components/`: Shared UI components
  - `src/lib/`: Utility functions and helpers

- **Backend**: Express.js with controller-based organization
  - `src/controllers/`: Business logic
  - `src/routes/`: API endpoints
  - `src/middlewares/`: Request processing middleware

### Best Practices

1. **Component Structure**:
   - Each component should be in its own folder
   - Use index.tsx as the main component file
   - Keep components under 500 lines
   - Follow the Shadcn UI patterns

2. **State Management**:
   - Use React Context for shared state
   - Use Redux for complex global state
   - Use Zustand for simpler global state
   - Use React Query for server state

3. **API Calls**:
   - Use React Query for data fetching
   - Implement proper error handling
   - Use loading states appropriately

4. **Styling**:
   - Use Tailwind CSS for styling
   - Follow the project's design system
   - Use class-variance-authority for component variants

5. **Form Handling**:
   - Use React Hook Form for forms
   - Implement Zod validation schemas
   - Handle form submission states properly

## Docker Development

To use Docker for development:

```bash
# Start development environment with Docker
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify your PostgreSQL service is running
2. Check the `DATABASE_URL` in your `.env` file
3. Ensure the database exists and is accessible

### API Connection Issues

If the frontend cannot connect to the API:

1. Verify the API is running (`pnpm -F api dev`)
2. Check the `NEXT_PUBLIC_API_ENDPOINT` in the web `.env` file
3. Ensure CORS is properly configured in the API

### Build Errors

If you encounter build errors:

1. Clean the build cache: `pnpm clean`
2. Reinstall dependencies: `pnpm install`
3. Check for TypeScript errors: `pnpm -F web lint`
