/// <reference types="cypress" />

/**
 * End‑to‑end tests for the todo application. This test covers the
 * registration of a new user, login, creation of a todo, updating
 * and deleting that todo, and finally logging out. A unique email is
 * generated for each run to ensure idempotency.
 */
describe('Todo App Flow', () => {
  it('allows a user to register, login, manage todos and logout', () => {
    const email = `user_${Date.now()}@example.com`;
    const password = 'Password123!';

    // Visit registration page
    cy.visit('/register');
    // Fill registration form and submit
    cy.get('[data-testid="register-email-input"]').type(email);
    cy.get('[data-testid="register-password-input"]').type(password);
    cy.get('[data-testid="register-submit"]').click();

    // After registration the user is redirected to login
    cy.url().should('include', '/login');
    // Login with the newly created account
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-submit"]').click();

    // Should navigate to the todos page
    cy.url().should('include', '/todos');
    // Wait a moment for categories and todos to load. Without this wait the test
    // occasionally races the network and becomes flaky. This delay also
    // intentionally slows the test down per the requirements.
    cy.wait(1000);
    cy.contains('No todos yet.');

    // Create a new todo with a new category and high priority
    cy.get('[data-testid="new-title"]').type('My first todo');
    cy.get('[data-testid="new-description"]').type('This is a test todo');
    // Select Other in category dropdown
    cy.get('[data-testid="new-category-select"]').select('__other__');
    cy.get('[data-testid="new-category-input"]').type('TestCat');
    // Select High priority
    cy.get('[data-testid="new-priority"]').select('High');
    cy.get('[data-testid="create-button"]').click();

    // The new todo should appear in the list
    cy.get('[data-testid="todo-item"]').should('have.length', 1);
    cy.contains('[data-testid="todo-item"]', 'My first todo');
    cy.contains('[data-testid="todo-priority"]', 'High');

    // Wait briefly before editing to allow the UI to update
    cy.wait(500);

    // Edit the todo: change title and priority to Low
    cy.get('[data-testid="edit-button"]').click();
    cy.get('[data-testid="edit-title"]').clear().type('Updated todo');
    cy.get('[data-testid="edit-priority"]').select('Low');
    cy.get('[data-testid="save-button"]').click();
    cy.contains('[data-testid="todo-item"]', 'Updated todo');
    cy.contains('[data-testid="todo-priority"]', 'Low');

    // Delete the todo
    cy.get('[data-testid="delete-button"]').click();
    cy.contains('No todos yet.');

    // Logout
    cy.get('[data-testid="logout-button"]').click();
    cy.url().should('include', '/login');
  });
});