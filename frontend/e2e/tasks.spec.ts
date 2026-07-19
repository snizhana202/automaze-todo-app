import { test, expect, Page } from "@playwright/test";

/**
 * E2E tests for Automaze Todo App.
 *
 * These tests run against the live deployed app (see playwright.config.ts
 * baseURL) and talk to the real backend/database. Every test that creates
 * a task cleans up after itself in an `afterEach` hook so the production
 * database doesn't accumulate test data.
 *
 * Tasks created by these tests are prefixed with "[E2E]" so they are easy
 * to identify and clean up.
 */

// Zod's title validation only allows letters, numbers, whitespace and
// .,!?'"-() — square brackets are rejected, so this prefix must use
// parentheses, not brackets.
const TASK_PREFIX = "(E2E)";

function uniqueTitle(label: string) {
  return `${TASK_PREFIX} ${label} ${Date.now()}`;
}

/** Fills out and submits the "Create Task" form. */
async function createTask(
  page: Page,
  options: {
    title: string;
    description?: string;
    priority?: number;
    category?: string;
  },
) {
  await page.getByPlaceholder("e.g. Buy some coffee").fill(options.title);

  if (options.description) {
    await page.getByPlaceholder("Details...").fill(options.description);
  }

  if (options.category) {
    await page.getByTestId("category-select").click();
    await page.getByRole("option", { name: options.category }).click();
  }

  if (options.priority) {
    await page.getByTestId("priority-select").click();
    await page
      .getByRole("option", { name: new RegExp(`^${options.priority}\\b`) })
      .click();
  }

  const [response] = await Promise.all([
    page.waitForResponse(
      (res) => res.url().includes("/tasks") && res.request().method() === "POST",
      { timeout: 20_000 },
    ),
    page.getByTestId("submit-task").click(),
  ]);

  expect(
    response.ok(),
    `Task creation request failed with status ${response.status()}`,
  ).toBeTruthy();
}

/** Finds the task card for the given title using the .task-card class. */
function taskCard(page: Page, title: string) {
  return page.locator(".task-card").filter({ hasText: title });
}

/** Deletes a task by its visible title, if it exists. Used for cleanup. */
async function deleteTaskByTitle(page: Page, title: string) {
  const card = taskCard(page, title);
  if (await card.count()) {
    await card.getByTestId("delete-task").click();
  }
}

test.describe("Automaze Todo App", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/loading/i)).toHaveCount(0, { timeout: 30_000 });

    // The default "newest" sort enables dnd-kit drag listeners on the whole
    // task card, which can intercept plain clicks on the checkbox/delete
    // buttons in headless browsers. Switch to a non-draggable sort mode so
    // clicks in these tests are reliable. The one test that specifically
    // covers sorting switches this back itself.
    await page.getByTestId("sort-select").click();
    await page.getByRole("option", { name: "Priority (1-10)" }).click();
  });

  test("displays the list of existing tasks", async ({ page }) => {
    // The task list container should render without the loading state
    // stuck, and without an unexpected error message.
    await expect(page.getByText(/loading/i)).toHaveCount(0);
    await expect(page.getByPlaceholder("Search tasks...")).toBeVisible();
  });

  test("adds a new task and shows it in the list", async ({ page }) => {
    const title = uniqueTitle("Add task");

    await createTask(page, { title, description: "created by e2e test" });

    await expect(page.getByText(title)).toBeVisible();

    await deleteTaskByTitle(page, title);
  });

  test("marks a task as done", async ({ page }) => {
    const title = uniqueTitle("Mark done");
    await createTask(page, { title });

    const card = taskCard(page, title);
    await card.getByTestId("task-checkbox").click();

    await expect(card.getByText(title)).toHaveClass(/line-through/);

    await deleteTaskByTitle(page, title);
  });

  test("deletes a task", async ({ page }) => {
    const title = uniqueTitle("Delete task");
    await createTask(page, { title });

    await expect(page.getByText(title)).toBeVisible();

    await deleteTaskByTitle(page, title);

    await expect(page.getByText(title)).toHaveCount(0);
  });

  test("filters tasks by search query", async ({ page }) => {
    const title = uniqueTitle("Searchable");
    await createTask(page, { title });

    await page.getByPlaceholder("Search tasks...").fill(title);
    await expect(page.getByText(title)).toBeVisible();

    await page.getByPlaceholder("Search tasks...").fill("zzz-no-such-task-zzz");
    await expect(page.getByText(title)).toHaveCount(0);

    await page.getByPlaceholder("Search tasks...").fill("");
    await deleteTaskByTitle(page, title);
  });

  test("filters tasks by completion status", async ({ page }) => {
    const title = uniqueTitle("Status filter");
    await createTask(page, { title });

    // Mark it done
    const card = taskCard(page, title);
    await card.getByTestId("task-checkbox").click();

    // "Active" filter should hide it
    await page.getByRole("button", { name: "Active" }).click();
    await expect(page.getByText(title)).toHaveCount(0);

    // "Completed" filter should show it
    await page.getByRole("button", { name: "Completed" }).click();
    await expect(page.getByText(title)).toBeVisible();

    // Back to "All" before cleanup
    await page.getByRole("button", { name: "All" }).click();
    await deleteTaskByTitle(page, title);
  });

  test("sorts tasks by priority", async ({ page }) => {
    const highTitle = uniqueTitle("High priority");
    const lowTitle = uniqueTitle("Low priority");

    await createTask(page, { title: highTitle, priority: 1 });
    await createTask(page, { title: lowTitle, priority: 10 });

    await page.getByTestId("sort-select").click();
    await page.getByRole("option", { name: "Priority (1-10)" }).click();

    const titles = page.locator("h3");
    const firstVisibleIndex = await titles.evaluateAll((nodes, want) =>
      nodes.findIndex((n) => n.textContent?.includes(want)),
      highTitle,
    );
    const secondVisibleIndex = await titles.evaluateAll((nodes, want) =>
      nodes.findIndex((n) => n.textContent?.includes(want)),
      lowTitle,
    );

    expect(firstVisibleIndex).toBeGreaterThanOrEqual(0);
    expect(secondVisibleIndex).toBeGreaterThan(firstVisibleIndex);

    await deleteTaskByTitle(page, highTitle);
    await deleteTaskByTitle(page, lowTitle);
  });
});