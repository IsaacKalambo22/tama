# TAMA Farmers Trust - Code Standards

This document outlines the coding standards and best practices for the TAMA Farmers Trust project. Following these guidelines ensures code consistency, maintainability, and quality across the codebase.

## General Guidelines

- Use pnpm as the package manager for the project
- Follow TypeScript best practices with strict type checking
- Implement self-documenting code with clear naming conventions
- Add comments for complex logic and business rules
- Keep files and functions small and focused on a single responsibility

## File and Code Organization

### File Size Limits
- **Maximum file length: 500 lines**
  - Split larger files into smaller, focused modules
  - Use composition to combine functionality
- **Maximum function length: 50 lines**
  - Break complex functions into smaller, reusable functions
  - Follow the single responsibility principle

### Project Structure
- Follow Next.js App Router patterns for the frontend
- Organize features in a modules directory by functional domain
- Structure each module as a self-contained unit:
  - `components/` - UI components specific to this module
  - `hooks/` - Custom React hooks
  - `services/` - Business logic and API interactions
  - `utils/` - Helper functions
  - `types/` - TypeScript interfaces and types
  - `constants.ts` - Module-specific constants
  - `index.ts` - Public API exports (only expose what's needed)

### Shared Code Organization
- `/lib` - Core utilities and shared logic
- `/components` - Reusable UI components
- `/config` - Exported environment variables
- `/hooks` - Shared custom React hooks
- `/contexts` - Global state and context providers
- `/types` - Shared TypeScript types
- `/styles` - Global styles and theming

### Folder Nesting
- Keep folder nesting to a maximum of 4 levels to maintain navigability
- Use index files to simplify imports from deeply nested structures

## Styling and UI

### Component Structure
- Each component must have its own folder named in kebab-case (e.g., `button/`)
- Primary component files named `index.tsx` with the component name defined inside
- Use Tailwind CSS for styling
- Use Shadcn UI components as the foundation for UI elements
- Implement consistent spacing and layout patterns

### CSS Guidelines
- Use Tailwind CSS utility classes for styling
- Use `class-variance-authority` for component variants
- Use `tailwind-merge` to handle class conflicts
- Extract common patterns into reusable components
- Follow mobile-first responsive design principles

## TypeScript Implementation

- Use TypeScript with strict type checking enabled
- Define explicit interfaces or types for:
  - Component props
  - Function parameters and return values
  - State objects
  - API requests and responses
- Co-locate types with implementation or in dedicated type files within the same module
- Never use `any` type except in exceptional cases with explanatory comments
- Utilize advanced TypeScript features:
  - Generics for reusable components
  - Utility types (Partial, Pick, Omit)
  - Union and intersection types
  - Discriminated unions for state management

### Type Patterns
```typescript
// API response wrapper
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

// Component with children
type ComponentWithChildren<P = {}> = P & {
  children?: React.ReactNode;
};
```

## State Management & Logic

- Use React Context for state management
- Apply proper state management patterns:
  - Context for widely shared state
  - Reducers for complex state logic
  - Local state for component-specific concerns
- Implement performance optimizations:
  - React.memo for expensive components
  - useMemo and useCallback for referential stability
  - Virtualization for long lists
  - Code splitting and lazy loading

## Data Fetching & Forms

- Use TanStack Query (react-query) for frontend data fetching
- Use React Hook Form for form handling
- Use Zod for validation
- Always validate data before form submission:
  - Define Zod schemas for all form data
  - Use schema validation with `resolver: zodResolver(schema)` in form configuration
  - Implement client-side validation before submission
  - Add server-side validation as a secondary defense
- Handle form states properly:
  - Use `formState.isSubmitting` to disable buttons during submission
  - Use `formState.isLoading` to show loading indicators
  - Display appropriate UI feedback during different form states
  - Implement proper error handling for form submission failures

### Form Pattern Example
```typescript
// Form schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Form component
const LoginForm = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      // Form submission logic
    } catch (error) {
      // Error handling
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
};
```

## Next.js App Router Standards

- Use ES6+ syntax exclusively
- Leverage the App Router architecture with /app directory structure
- Follow Server Component by default approach:
  - Server Components: Default for all components (no directive needed)
  - Client Components: Add `"use client"` directive at the top of the file
- Apply appropriate file conventions:
  - `page.tsx` for routable pages
  - `layout.tsx` for layouts wrapping child routes
  - `loading.tsx` for loading states
  - `error.tsx` for error boundaries
  - `not-found.tsx` for 404 handling
  - `route.ts` for API endpoints
- Create efficient layouts:
  - Use nested layouts to share UI across routes
  - Keep layout components lightweight
  - Use suspense boundaries appropriately

## API and Backend Standards

- Implement layered architecture:
  - Presentation layer (components)
  - Business logic layer (services, hooks)
  - Data access layer (API clients, storage)
- Implement route handlers with standard patterns:
  - Use `export async function GET/POST/PUT/DELETE` in route.ts files
  - Consistent response formatting with NextResponse
  - Proper error handling and status codes
  - Apply middleware for cross-cutting concerns
- Use Prisma for database access:
  - Define clear schema models
  - Use transactions for related operations
  - Implement proper error handling
  - Follow naming conventions for models and fields

## Testing Standards

- Write unit tests for critical business logic
- Create component tests for UI elements
- Implement integration tests for key user flows
- Use Jest and React Testing Library for frontend testing
- Follow the Testing Trophy approach:
  - Focus on integration tests for most coverage
  - Use unit tests for complex logic
  - Add end-to-end tests for critical paths
  - Use static typing to prevent type errors

## Code Review Guidelines

- Review code for adherence to these standards
- Check for proper error handling
- Verify type safety and proper TypeScript usage
- Ensure responsive design implementation
- Look for performance optimizations
- Validate accessibility compliance
- Confirm proper test coverage

## Documentation

- Add JSDoc comments for public APIs and complex functions
- Create README files for modules explaining their purpose and usage
- Document component props and behavior
- Keep documentation up-to-date with code changes
- Use TypeScript types as living documentation

By following these standards, we ensure the TAMA Farmers Trust codebase remains maintainable, scalable, and of high quality as the project evolves.

