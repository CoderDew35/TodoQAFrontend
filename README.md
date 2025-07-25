# Todo Frontend Application

This folder contains the client‑side portion of the todo application. The
frontend is built with **React** and **TypeScript**, uses **Vite** as the
development server and build tool, and leverages **Zustand** for state
management. Styling is provided by **Tailwind CSS**, and **React Router**
handles navigation between pages. Axios is used to communicate with the
backend API.

## Features

* **Authentication** – users can register and log in via email and password.
  The application stores the JWT token in `localStorage` using Zustand’s
  persistence middleware.
* **Dark mode** – the UI uses Tailwind’s dark mode classes and defaults
  to a dark theme. All components adapt automatically to dark mode.
* **Todo management** – authenticated users can create, edit and delete
  their own todo items. Each todo includes a title, optional description,
  category and priority. Creation and update timestamps are displayed.
* **Categories with drop‑down and “Other…”** – categories are fetched from
  the backend and displayed in a drop‑down. Selecting “Other…” allows the
  user to create a new category inline.
* **Priority selection** – todos have a priority (`Low`, `Medium`, `High`)
  which can be set when creating or editing a todo.
* **Component‑based architecture** – pages and reusable components are
  organised logically under `src/pages`, `src/components`, `src/api` and
  `src/store`.
* **End‑to‑end tests** – Cypress tests drive the browser through the full
  user flow and verify that the UI behaves correctly.

## Project Structure

```
frontend/
  ├── index.html            # Entry point and dark mode root class
  ├── package.json          # Scripts and dependencies
  ├── tailwind.config.js    # Tailwind CSS configuration (dark mode enabled)
  ├── vite.config.ts        # Vite configuration
  ├── cypress/              # Cypress end‑to‑end tests
  │   └── e2e/todo.cy.ts    # Automated UI flow
  └── src/
      ├── main.tsx          # React entry point
      ├── App.tsx           # Router layout
      ├── pages/            # Login, register and todo list pages
      ├── components/       # Todo item component
      ├── store/            # Zustand stores for auth and todos
      └── api/              # Axios API helpers
```

## Getting Started

1. Navigate into the frontend directory:

   ```bash
   cd todo-app/frontend
   ```

2. Install dependencies (requires Node.js ≥ 18):

   ```bash
   npm install
   ```

3. Set the API base URL via the `VITE_API_BASE_URL` environment variable in a
   `.env` file at the project root (defaults to `http://localhost:5000` if
   omitted):

   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173` by default.

## Running End‑to‑End Tests

The Cypress suite exercises the full user flow, including registration,
login, category creation, priority selection, editing and deletion of
todos, and logout. To run the tests:

1. Ensure the backend API is running on the URL specified in `VITE_API_BASE_URL`.
2. Start the frontend dev server with `npm run dev`.
3. In a separate terminal, execute the tests in headless mode:

   ```bash
   npm run cypress
   ```

   Alternatively, open the interactive Cypress UI via `npx cypress open`.

## Building for Production

To produce an optimised production build of the app, run:

```bash
npm run build
```

The output will be written to `dist/`. You can serve these static files
using any web server or integrate them into a Docker image along with the
backend API.

## Key Libraries and Tools

| Library         | Purpose                                               |
|-----------------|-------------------------------------------------------|
| React           | UI library for building interactive components        |
| TypeScript      | Typed superset of JavaScript for safer development    |
| Vite            | Next‑generation build tool and dev server             |
| Zustand         | Lightweight state management with persistence         |
| Tailwind CSS    | Utility‑first CSS framework with dark mode support    |
| React Router    | Declarative client‑side routing                       |
| Axios           | Promise‑based HTTP client for API calls               |
| Cypress         | End‑to‑end testing framework                          |
