import { test, expect, type Page } from '@playwright/test';

const hasCredentials = !!(process.env.TEST_USER_USERNAME && process.env.TEST_USER_PASSWORD);

async function loginAs(page: Page, username: string, password: string) {
  await page.goto('/login');
  await page.locator('[name="userName"]').fill(username);
  await page.locator('[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
}

test.describe('Smoke Tests', () => {
  test('root redirects to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('login page renders username and password fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('[name="userName"]')).toBeVisible();
    await expect(page.locator('[name="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
  });

  test('user can log in with test credentials', async ({ page }) => {
    test.skip(!hasCredentials, 'TEST_USER_USERNAME / TEST_USER_PASSWORD not set');
    await loginAs(page, process.env.TEST_USER_USERNAME!, process.env.TEST_USER_PASSWORD!);
  });

  test('jobs page loads after login', async ({ page }) => {
    test.skip(!hasCredentials, 'TEST_USER_USERNAME / TEST_USER_PASSWORD not set');
    await loginAs(page, process.env.TEST_USER_USERNAME!, process.env.TEST_USER_PASSWORD!);

    await page.goto('/company/jobs');
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
    await expect(page.locator('#root')).not.toBeEmpty();
  });
});
