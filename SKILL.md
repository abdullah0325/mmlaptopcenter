---
name: mmlaptopcenter
description: Development rules for MM Laptop Center
---

# MM Laptop Center Development Rules

Use for all development, refactoring, bug fixes, APIs, UI, database, and optimization tasks.

## Safety

- Preserve existing functionality.
- Never reset the database or delete production data.
- Never run seed scripts unless requested.
- Do not modify unrelated files or business logic.
- Avoid breaking changes.

## Workflow

1. Analyze the existing code.
2. Understand dependencies.
3. Update only what the task requires.
4. Keep changes isolated.
5. Verify no side effects.

## Code Standards

- Reuse existing components.
- Keep components small and modular.
- Reduce duplication.
- Use clear naming.
- Separate UI, business logic, and data access.
- Keep the current project structure.

## Frontend

- Use Next.js and TypeScript.
- Use Tailwind CSS only unless another library is required.
- Keep the UI responsive across all devices.
- Prefer built-in Next.js features.

## Backend

- Optimize database queries.
- Preserve the current schema.
- Protect API routes.
- Validate and sanitize inputs.
- Use proper error handling.

## Performance

- Keep pages lightweight.
- Minimize re-renders.
- Reduce unnecessary dependencies.
- Use dynamic imports when beneficial.

## Project Context

- Project: **MM Laptop Center**
- Domain: Laptop & Accessories eCommerce
- Products: Laptops, MacBooks, Gaming PCs, Components, Accessories
- Prioritize performance, maintainability, and clean architecture.

## Restrictions

- No unnecessary packages.
- No unrelated refactoring.
- No unnecessary file edits.
- Focus only on the requested task.