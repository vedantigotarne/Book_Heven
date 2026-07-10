---
name: Book Haven stack decisions
description: Key technical decisions for the Book Haven bookstore project
---

## Stack
- **Backend**: Spring Boot 3.1.12 on Java 19 (GraalVM), Maven, context-path=/api
- **Database**: Replit built-in PostgreSQL (user asked for MySQL; using PG because it's provisioned; code is identical — swap driver + URL to switch)
- **Frontend**: React + Vite in artifacts/bookstore, port 19990, base path "/"
- **API client**: Orval-generated hooks in `@workspace/api-client-react`
- **Auth**: Session-based via HttpSession; Spring Security disabled (CSRF off, all requests permitted); BCryptPasswordEncoder used for passwords
- **Backend location**: `backend/` (workspace root), artifact `artifacts/api-server`

## Critical pattern: queryKey required
All Orval-generated query hooks in this project MUST include `queryKey` in the `query` options object:
```ts
useGetCurrentUser({ query: { retry: false, queryKey: getGetCurrentUserQueryKey() } })
useGetCart({ query: { enabled: isLoggedIn, queryKey: getGetCartQueryKey() } })
```
Without it, TypeScript fails with "Property 'queryKey' is missing".

**Why:** The generated hook types require queryKey in UseQueryOptions. TanStack Query v5 enforces this at the type level.

## Book import fix
Never import from deep package paths like `@workspace/api-client-react/src/generated/api.schemas`.
Always import from the public barrel: `import { Book } from "@workspace/api-client-react"`

## MySQL switch
To switch from PostgreSQL to MySQL in Spring Boot:
1. Swap dependency in pom.xml: remove postgresql, add mysql-connector-j
2. Change application.properties datasource URL to jdbc:mysql://localhost:3306/bookstore_db
3. Change driver-class-name to com.mysql.cj.jdbc.Driver
4. Remove hibernate.dialect property (auto-detected)
