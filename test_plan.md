# Test Plan for Todo Application

This document outlines the strategy used to verify the functional correctness of a simple full‑stack todo application. The application consists of a React front‑end written in TypeScript with Zustand for state management and Tailwind CSS for styling, and a back‑end Express API written in TypeScript with a MongoDB database. Automated tests cover both the API layer and the user interface.

## Objectives

* Ensure that users can register with an email and password and receive appropriate feedback on success or failure.
* Verify that authenticated users can log in and receive a valid JSON Web Token (JWT).
* Confirm that authenticated users can create, read, update and delete (CRUD) their own todo items. Each todo now includes a title, optional description, an optional category chosen from a drop‑down (or created on the fly) and a priority (`Low`, `Medium` or `High`).
* Validate that categories can be fetched from the API and that authenticated users can add new categories when the “Other…” option is selected.
* Ensure that the API returns and the UI displays `createdAt` and `updatedAt` timestamps for todos.
* Validate that unauthenticated requests to protected endpoints are rejected.
* Guarantee that front‑end pages render correctly in dark mode, manage state appropriately and integrate with the API.

## Test Scope

Two layers of automated tests are provided:

1. **API tests** using Jest and Supertest to exercise the Express endpoints directly.
2. **End‑to‑end (E2E) UI tests** using Cypress to drive a browser against the deployed front‑end and back‑end simultaneously.

Unit tests for individual React components could be added using the React Testing Library, but given the simplicity of the UI and the focus on end‑to‑end behaviour, they are considered out of scope for this challenge.

## Test Environment

* **Back‑end**: The API tests run against an in‑memory MongoDB instance provided by `mongodb‑memory‑server`. This avoids side effects and ensures repeatability. Environment variables such as `JWT_SECRET` and `MONGO_URI` are set within the tests.
* **Front‑end**: The E2E tests assume that the React app is served locally via Vite on `http://localhost:5173` and that the back‑end API is available at `http://localhost:5000`. Tailwind CSS is compiled as part of the Vite dev server.

## Tools and Libraries

| Layer       | Tooling                               | Purpose                              |
|------------|----------------------------------------|--------------------------------------|
| API        | Jest + ts‑jest                         | Test runner and TypeScript support   |
|            | Supertest                             | HTTP assertions against Express app  |
|            | mongodb‑memory‑server                 | Ephemeral MongoDB for isolation      |
| Front‑end  | Cypress                               | End‑to‑end browser automation        |
|            | Vite                                  | Development server for React         |
|            | Zustand                               | Predictable state management         |
|            | Tailwind CSS                          | Utility‑first styling                |

## API Test Cases

1. **Register User**
   * **Given** a POST request to `/api/auth/register` with a unique email and valid password
   * **When** the request is processed
   * **Then** the response status is 201 and the JSON body contains the user’s email without the password field.

2. **Login User**
   * **Given** a POST request to `/api/auth/login` with valid credentials
   * **When** the request is processed
   * **Then** the response status is 200 and the body contains a JWT token and user details without the password.

3. **Create Categories**
   * **Given** an authenticated user with a valid JWT
   * **When** the user sends POST requests to `/api/categories` with category names
   * **Then** each response status is 201 and the body contains the created category. Duplicate names should not create additional entries.

4. **List Categories**
   * **Given** one or more categories exist in the database
   * **When** a GET request is sent to `/api/categories`
   * **Then** the response status is 200 and the body is an alphabetically sorted array of category objects.

5. **Create Todo**
   * **Given** an authenticated user with a valid JWT and at least one category available
   * **When** the user sends a POST request to `/api/todos` with a title, optional description, a category name and a priority (`Low`, `Medium` or `High`)
   * **Then** the response status is 201 and the body contains the created todo item including its category, priority and identical `createdAt` and `updatedAt` timestamps.

6. **Read Todos**
   * **Given** an authenticated user with existing todos
   * **When** the user sends a GET request to `/api/todos`
   * **Then** the response status is 200 and the body is an array of the user’s todos ordered by creation date. Each todo should include its category, priority and timestamps.

7. **Update Todo**
   * **Given** an authenticated user and an existing todo ID
   * **When** the user sends a PUT request to `/api/todos/:id` with updated fields (including category and/or priority)
   * **Then** the response status is 200 and the body reflects the updated todo with an `updatedAt` timestamp greater than or equal to `createdAt`.

8. **Delete Todo**
   * **Given** an authenticated user and an existing todo ID
   * **When** the user sends a DELETE request to `/api/todos/:id`
   * **Then** the response status is 200 and the body contains the removed todo.

9. **Unauthorized Access**
   * **Given** a request to any `/api/todos` endpoint without a valid JWT
   * **When** the request is processed
   * **Then** the response status is 401 with an appropriate error message.

## End‑to‑End Test Cases (Cypress)

1. **Full User Flow**
   * Navigate to the registration page.
   * Register a new account with a unique email and password.
   * After redirect, log in using the same credentials.
   * Upon successful login, verify that the todo list page loads and initially displays a “No todos yet” message. Wait briefly for categories to load.
   * Create a new todo:
     * Enter a title and description.
     * Use the category drop‑down to select “Other…” and provide a new category name. The front‑end should send this to the back‑end which creates the category and returns it.
     * Choose a priority value of “High” from the priority drop‑down.
     * Submit the form. Verify the new item appears in the list with its category and “High” priority displayed, along with created timestamp.
   * Edit the newly created todo:
     * Click “Edit” on the todo.
     * Change the title and priority to “Low.”
     * Save the changes. Confirm the list reflects the updated title and priority and shows an updated timestamp.
   * Delete the todo by clicking “Delete.” Verify the list shows the “No todos yet” message again.
   * Log out by clicking the coloured logout button. Confirm that the user is redirected to the login page.

## Running the Tests

### API Tests

From within the `todo-app/backend` directory, run:

```bash
npm install
npm test
```

This will compile the TypeScript code if necessary, spin up an in‑memory MongoDB instance and execute all Jest test suites found under `backend/tests/`.

### End‑to‑End Tests

1. Start the back‑end API: within `todo-app/backend`, run `npm install` and `npm run dev` (or `npm start` after building).
2. Start the front‑end: within `todo-app/frontend`, run `npm install` and `npm run dev` to launch the Vite dev server.
3. In a separate terminal from within `todo-app/frontend`, execute the Cypress tests in headless mode:

```bash
npm run cypress
```

Alternatively, run `npx cypress open` to launch the interactive Cypress test runner.