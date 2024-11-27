# Monorepo Project

This repository is structured as a **monorepo** containing two main folders:

- **Frontend**: A Next.js application built with modern UI libraries.
- **Server**: A Node.js and Express API server with TypeScript and Prisma.

Follow the steps below to set up the project and understand the tools and technologies used.

---

## Tech Stack

### **Frontend**:
- **[Next.js](https://nextjs.org/)**: React framework for server-side rendering, routing, and building modern web apps.
- **[ShadCN UI](https://shadcn.dev/)**: A pre-configured component library for building accessible and customizable UIs.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for fast and responsive UI development.
- **[Auth.js](https://authjs.dev/)**: Authentication library for handling secure user login and sessions.

### **Backend**:
- **[Node.js](https://nodejs.org/)**: JavaScript runtime environment for building scalable server-side applications.
- **[Express](https://expressjs.com/)**: Minimalist web framework for Node.js to handle API requests.
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe JavaScript for better development experience and maintainability.
- **[Prisma](https://www.prisma.io/)**: ORM for database modeling and query management.
- **[Multer](https://github.com/expressjs/multer)**: Middleware for handling multipart/form-data (file uploads).
- **[PostgreSQL](https://www.postgresql.org/)**: A powerful, open-source relational database for data management.

---

## Setup Instructions

```bash
# 1. Clone the Repository
git clone <repository-url>
cd <repository-folder>

# 2. Environment Variables
# Rename env.example to env in both `server` and `frontend` folders.
# Update the necessary values such as:
# - Backend: PostgreSQL connection string, API secrets, and environment configurations.
# - Frontend: API base URL and environment-specific keys.

# 3. Backend Setup
cd server
npm install
npm run dev

# 4. Frontend Setup
cd frontend
pnpm install
pnpm run dev

# 5. Access the Application
# Frontend: By default, the app will run on http://localhost:3000.
# Backend: The API server will run on http://localhost:5000 or the specified port in the `.env`.
