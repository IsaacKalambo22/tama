# TAMA Farmers Trust - Project Planning

## Project Overview

TAMA Farmers Trust is a comprehensive platform designed to support tobacco farmers in Malawi. The platform provides various services including information sharing, event management, council representation, job postings, and administrative tools to help farmers access resources and support.

## Architecture

The project follows a modern web application architecture using a monorepo structure with Turborepo:

### Frontend (Next.js App Router)
- **Technology Stack**: Next.js 14+, React 19, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI (based on Radix UI primitives)
- **State Management**: Redux Toolkit, Zustand, React Context
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with class-variance-authority and tailwind-merge

### Backend (Express API)
- **Technology Stack**: Express.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT, NextAuth.js
- **File Storage**: AWS S3
- **Communication**: Nodemailer for emails, Twilio for SMS

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Development**: Local development with Docker Compose
- **Deployment**: Production deployment with Docker Compose

## Data Model

The application's data model includes the following key entities:

1. **Users**: Authentication and user management with role-based access control
2. **Shops**: Retail locations for farmers
3. **Reports and Publications**: Document management
4. **Forms**: Downloadable forms for farmers
5. **Blogs**: Content management for articles
6. **Team**: Team member profiles
7. **Stats**: Statistical information about the platform
8. **News**: News articles and updates
9. **Council Lists**: Information about council representatives
10. **Events**: Calendar of events and activities
11. **Vacancies**: Job postings and opportunities
12. **Services**: Services offered to farmers
13. **Carousel**: Homepage carousel content
14. **Image Text**: Content blocks with images and text

## Module Structure

The frontend application follows a modular architecture:

### Core Modules
- **Admin**: Administrative dashboard and tools
- **Auth**: Authentication and user management
- **Client**: Public-facing features for farmers
- **Common**: Shared components and utilities

## Development Workflow

1. **Local Development**:
   - Use `pnpm dev` to start the development environment
   - Frontend runs on port 3000, API on port 8000
   - Prisma Studio available for database management

2. **Building**:
   - Use `pnpm build` to build all packages and applications
   - Docker builds available for production deployment

3. **Testing**:
   - Unit tests with Jest
   - Component testing with React Testing Library
   - End-to-end testing (to be implemented)

4. **Deployment**:
   - Docker Compose for production deployment
   - Environment variables managed through .env files

## Project Roadmap

### Phase 1: Core Infrastructure
- Set up monorepo structure with Turborepo
- Implement basic frontend and backend architecture
- Set up database schema and ORM
- Implement authentication and authorization

### Phase 2: Feature Development
- Implement core modules (Admin, Auth, Client)
- Develop data management features
- Create user interfaces for all main features
- Implement file upload and management

### Phase 3: Enhancement and Optimization
- Implement advanced features
- Optimize performance
- Enhance user experience
- Add analytics and reporting

### Phase 4: Testing and Deployment
- Comprehensive testing
- Production deployment
- Documentation
- Training and onboarding

## Coding Standards

- Follow TypeScript best practices
- Use ESLint and Prettier for code quality
- Follow Next.js App Router patterns
- Implement proper error handling
- Use proper typing throughout the codebase
- Follow modular architecture principles
