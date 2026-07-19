# Automaze Todo App

A fullstack task management application featuring a reactive frontend and a robust backend API for seamless task lifecycle management.

---

## 🛠 Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS, TypeScript
* **Backend:** Python (FastAPI/SQLAlchemy)
* **Database:** SQLite
* **Validation:** Zod
* **Deployment:** Vercel (Frontend) & Render (Backend)

## 🏗 Project Structure

* `/frontend`: Next.js application with Optimistic UI and modular state management.
* `/backend`: Python-based API handling data persistence and security.

## 🚀 Key Features

* **Optimistic UI:** Instant interface updates with automated rollback on error.
* **Fullstack Integrity:** End-to-end data validation.
* **Clean Architecture:** Decoupled frontend and backend for scalability.
* **Interactive Control:** Search, filtering, and sorting capabilities.

## 📦 Quick Start

1. **Clone:** `git clone https://github.com/snizhana202/automaze-todo-app.git`
2. **Install:** 
    * Frontend: Navigate to `cd frontend` and run `npm install`.
    * Backend: Navigate to `cd backend` and run `pip install -r requirements.txt`.
3. **Env:** 
    * Backend: Create a `.env` file in the `/backend` folder and set `DATABASE_URL`
    * Frontend: Create a `.env.local` file in the `/frontend` folder and set `NEXT_PUBLIC_API_URL`
4. **Run:** 
    * Backend: Start the server using `uvicorn main:app --reload`.
    * Frontend: Start the development server using `npm run dev`.

## 🤖 AI Workflow

I used Claude (Anthropic) throughout this project as a coding collaborator,
especially for the backend, since this was my first time working with Python.

**AI helped with:** overall project structure, the Python/FastAPI backend
(API design, database schema with SQLAlchemy), initial component scaffolding
on the frontend, most of the Tailwind/CSS styling.

**I handled:** implementing the feature logic myself based on approaches Claude suggested, UI/UX decisions,
and reviewing, testing, and adjusting every part of the app before deploying.

---

## 👤 Author

**Snizhana**
* **GitHub:** [snizhana202](https://github.com/snizhana202)
* **Live Demo:** [automaze-todo-app.vercel.app](https://automaze-todo-app.vercel.app/)
