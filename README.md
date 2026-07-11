# BookHaven - Full-Stack Bookstore

A modern, full-stack bookstore application built with a Java Spring Boot backend and a React (Vite) frontend.
<img width="1881" height="878" alt="Screenshot 2026-07-11 202728" src="https://github.com/user-attachments/assets/f6e1155b-2b1b-42a0-ae62-5b32778bd121" />
<img width="1881" height="892" alt="Screenshot 2026-07-11 202807" src="https://github.com/user-attachments/assets/55cea489-4eaf-4337-8eb0-62b14b0f71a7" />
<img width="1892" height="912" alt="Screenshot 2026-07-11 202826" src="https://github.com/user-attachments/assets/b56cf2aa-b672-4c95-96ee-a8e189ba6453" />
<img width="1878" height="902" alt="Screenshot 2026-07-11 202853" src="https://github.com/user-attachments/assets/88f352d4-3ec0-4ceb-9407-1317551ac7be" />
<img width="1882" height="916" alt="Screenshot 2026-07-11 203510" src="https://github.com/user-attachments/assets/e894c323-6f2e-48f4-84c2-1e8f4a1214db" />

## 🚀 How to Run the Project Locally

To run this project on your machine, you will need to open **two separate terminal windows**—one for the backend and one for the frontend.

### 1. Run the Backend (Java / Spring Boot)
The backend is configured to use an in-memory H2 database for local development, so no external database setup is required!

* **Folder:** `backend`
* **Command:** 
  ```bash
  mvn spring-boot:run
  ```
*(This will start the backend server on `http://localhost:8080`)*

### 2. Run the Frontend (React / Vite)
* **Folder:** `artifacts/bookstore`
* **Command:** 
  ```bash
  pnpm run dev
  ```
*(This will start the frontend development server on `http://localhost:5173`)*

Once both servers are running, open your web browser and navigate to [http://localhost:5173](http://localhost:5173) to view the application!

## 🛠️ Technology Stack
- **Backend:** Java, Spring Boot 3, Spring Data JPA, H2 Database
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Package Manager:** pnpm
- **Development Approach:** 🔮 **Vibe Coding** (AI-Assisted Development via advanced AI Agents)
