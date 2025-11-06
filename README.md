# TAMA Farmers Trust Platform

A comprehensive web platform for the Tobacco Association of Malawi (TAMA) Farmers Trust, designed to support tobacco farmers with information, resources, and services.

## Project Overview

TAMA Farmers Trust platform provides a centralized hub for tobacco farmers in Malawi, offering:

- **Information Sharing**: News, blogs, and publications relevant to tobacco farming
- **Event Management**: Calendar of upcoming events and activities
- **Council Representation**: Information about council representatives
- **Job Opportunities**: Vacancy listings and application processes
- **Administrative Tools**: Content management and user administration

The platform is built using modern web technologies in a monorepo structure powered by Turborepo.


## Technology Stack

### Frontend
- **Framework**: Next.js with App Router
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components
- **State Management**: Redux Toolkit, Zustand, and React Context
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (react-query)

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT and NextAuth.js
- **File Storage**: AWS S3
- **Communication**: Nodemailer for emails, Twilio for SMS

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Package Management**: pnpm
- **Development**: Docker Compose for local development
- **Deployment**: Docker Compose for production

## Project Structure

The project follows a modular architecture with clear separation of concerns:

```
├── apps/
│   ├── api/            # Express.js backend
│   │   ├── prisma/     # Database schema and migrations
│   │   └── src/        # API source code
│   └── web/            # Next.js frontend
│       ├── public/     # Static assets
│       └── src/        # Frontend source code
│           ├── app/    # Next.js App Router pages
│           ├── components/ # Shared UI components
│           └── modules/ # Feature modules
│               ├── admin/  # Admin dashboard
│               ├── auth/   # Authentication
│               ├── client/ # Public-facing features
│               └── common/ # Shared module utilities
└── packages/        # Shared packages (UI, configs, etc.)
```

## Development Workflow


### Getting Started

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Set up environment variables (copy `.env.example` files)
4. Start the development environment with `pnpm dev`

## Using this example

Run the following command:

```sh
npx create-turbo@latest -e with-docker
```

## What's inside?

This Turborepo includes the following:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `api`: an [Express](https://expressjs.com/) server
- `@repo/ui`: a React component library
- `@repo/logger`: Isomorphic logger (a small wrapper around console.log)
- `@repo/eslint-config`: ESLint presets
- `@repo/typescript-config`: tsconfig.json's used throughout the monorepo
- `@repo/jest-presets`: Jest configurations

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Docker

This repo is configured to be built with Docker, and Docker compose. To build all apps in this repo:

```
# Install dependencies
yarn install

# Create a network, which allows containers to communicate
# with each other, by using their container name as a hostname
docker network create app_network

# Build prod using new BuildKit engine
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build

# Start prod in detached mode
docker-compose -f docker-compose.yml up -d
```

Open http://localhost:3000.

To shutdown all running containers:

```
# Stop all running containers
docker kill $(docker ps -q) && docker rm $(docker ps -a -q)
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

This example includes optional remote caching. In the Dockerfiles of the apps, uncomment the build arguments for `TURBO_TEAM` and `TURBO_TOKEN`. Then, pass these build arguments to your Docker build.

You can test this behavior using a command like:

`docker build -f apps/web/Dockerfile . --build-arg TURBO_TEAM=“your-team-name” --build-arg TURBO_TOKEN=“your-token“ --no-cache`

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting

## Deployment

### Production Deployment

The application is configured for Docker-based deployment:

```bash
# Build production images
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose-prod.yml build

# Start production services
docker-compose -f docker-compose-prod.yml up -d
```

### Environment Variables

Both the frontend and backend require environment variables to be properly configured:

- **API**: Copy `apps/api/env.example` to `apps/api/.env` and configure database connection, JWT secrets, etc.
- **Web**: Copy `apps/web/env.example` to `apps/web/.env` and configure API URL, authentication settings, etc.

## Database Management

### Prisma Commands

```bash
# Generate Prisma client
pnpm -F api generate

# Run database migrations
pnpm -F api db:migrate

# Open Prisma Studio
pnpm -F api studio
```

## Contributing

Contributions to the TAMA Farmers Trust platform are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

This project uses ESLint and Prettier for code formatting. Before submitting a PR, please ensure your code follows the style guidelines:

```bash
# Check code style
pnpm lint

# Format code
pnpm format
```


## Additional Resources

- [Project Planning](./planning.md) - Detailed project planning document
- [Tasks](./tasks.md) - Current project tasks and status
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features
- [Express.js Documentation](https://expressjs.com/) - Learn about Express.js
- [Prisma Documentation](https://www.prisma.io/docs/) - Learn about Prisma ORM
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Learn about Tailwind CSS
- [Shadcn UI Documentation](https://ui.shadcn.com/docs) - Learn about Shadcn UI components
