---
applyTo: '**'
---

# 🧠 Project Context

This repository contains a **React + Java Spring Boot** full-stack application.

- **Frontend:** React 18 with TypeScript  
  - Uses Vite or CRA (adjust this line if different)  
  - Styling: TailwindCSS  
  - State management: React Query + Context  
  - Testing: Vitest / React Testing Library

- **Backend:** Java 17+ (Spring Boot 3.x)  
  - Frameworks: Spring Web, Spring Data JPA, Spring Security  
  - Database: PostgreSQL  
  - Build Tool: Maven  
  - Packaging: Docker

- **API:** REST-based communication between frontend and backend  
- **Auth:** JWT tokens with refresh mechanism  
- **Deployment:** Docker Compose (dev), Kubernetes (prod)

---

# ⚙️ Coding Guidelines

### Frontend (React)
- Use **functional components** and **React Hooks**.
- Keep components **small and focused** — one logical purpose each.
- Type everything explicitly with TypeScript.
- Use **async/await** for API calls (wrapped via a central `apiClient`).
- Follow **ESLint + Prettier** conventions.
- Always check null/undefined safety.
- When adding new code:
  - Add at least one meaningful test if possible.
  - Prefer React Query for async data fetching instead of manual `useEffect`.
  - Use Tailwind utility classes, avoid inline styles unless necessary.

### Backend (Java Spring Boot)
- Follow layered structure:
  - controller/
  - service/
  - repository/
  - model/
  - config/
  - Use `@Service` for business logic, `@Repository` for data access.
- Controllers should stay thin (validation + mapping only).
- Use DTOs for request/response instead of exposing entities.
- Add Javadoc for new public methods.
- Follow consistent naming: `*Service`, `*Controller`, `*Repository`.
- Always handle exceptions via `@ControllerAdvice` or a global handler.

### Shared Rules
- Prefer **clarity over cleverness**.
- Keep function/method names descriptive.
- Include **inline comments** for complex logic.
- Maintain consistent file organization and imports.
- Optimize for readability and maintainability.

---

# 🧩 AI Usage Guidelines

When generating code, AI should:
1. **Follow these conventions** strictly (React + Spring Boot).
2. Explain reasoning briefly in comments (especially for non-trivial logic).
3. Use **existing project patterns** and file structure when adding code.
4. Avoid generating secrets, keys, or sensitive config values.
5. Prefer reusing helper functions, utilities, and components when available.
6. Include meaningful commit messages if suggesting commits.

When asked to **review or refactor**:
- Point out potential bugs, anti-patterns, or inconsistent code.
- Suggest performance or security improvements.
- Never delete logic unless explicitly asked.

---

# 🧭 Example Prompts to Expect

- “Add JWT refresh token endpoint in backend.”
- “Create reusable modal component for form confirmation.”
- “Refactor UserService to use constructor-based injection.”
- “Generate Dockerfile for backend.”
- “Review code for security issues in authentication flow.”

---

# 🧱 Project Philosophy

> “Simple, typed, and testable.”

The goal is a clean, maintainable full-stack app where backend services are robust and frontend components are modular and typed.

---

# ✅ Output Format

When replying:
- Provide code in Markdown blocks with correct language tags (` ```java `, ` ```tsx `, etc.).
- When editing multiple files, include clear file paths and short explanations.
- Avoid unnecessary explanations unless the user asks for them.

---

# 💬 Maintainer Notes

Primary team stack:
- **IDE:** VS Code  
- **AI Model:** GPT-5-mini (default), GPT-5-turbo for large refactors  
- **CI/CD:** GitHub Actions  
- **Environment:** dev → staging → prod pipeline

---

# 🧩 End of Instructions
