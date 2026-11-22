import { test, expect, type Page } from '@playwright/test';

async function prepareLoginPage(page: Page) {
  // Dismiss desktop alert modal for deterministic layout tests
  await page.addInitScript(() => sessionStorage.setItem('desktop_alert_dismissed', 'true'));
  await page.goto('/login');
}

test.describe('Login Page — UI Elements & Layout', () => {
  test.beforeEach(async ({ page }) => {
    await prepareLoginPage(page);
  });

  test('renders all essential authentication elements in login mode', async ({ page }) => {
    // Universal elements across both versions
    await expect(page.locator('[name="userName"]')).toBeVisible();
    await expect(page.locator('[name="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /Log in|Sign in/i })).toBeVisible();

    // Features specific to the updated Login design
    const isNewUi = await page.locator('#rl-user').isVisible();
    if (isNewUi) {
      const accountTab = page.getByRole('tab', { name: 'I have an account' });
      const signupTab = page.getByRole('tab', { name: "I'm new here" });
      await expect(accountTab).toBeVisible();
      await expect(signupTab).toBeVisible();
      await expect(accountTab).toHaveAttribute('aria-selected', 'true');

      await expect(page.locator('#rl-pass')).toHaveAttribute('type', 'password');
      await expect(page.getByRole('button', { name: 'Show' })).toBeVisible();
      await expect(
        page.getByRole('button', { name: "Can't get in? Reset your password" })
      ).toBeVisible();
      await expect(page.locator('a[href^="mailto:support@workfloow.app"]')).toBeVisible();
      await expect(
        page.getByText('Your jobs and customer details are kept private')
      ).toBeVisible();
      await expect(page.getByText('Continue with Google')).toBeVisible();
    }
  });

  test('toggles password visibility between text and password types', async ({ page }) => {
    const isNewUi = await page.locator('#rl-user').isVisible();
    test.skip(!isNewUi, 'New login password toggle is specific to the updated UI');

    const passwordInput = page.locator('#rl-pass');
    const toggleButton = page.locator('button', { hasText: /Show|Hide/ });

    await passwordInput.fill('MySecretPassword123');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click Show -> converts to text
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(toggleButton).toHaveText('Hide');

    // Click Hide -> converts back to password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(toggleButton).toHaveText('Show');
  });

  test('navigates to forgot password page when reset link is clicked', async ({ page }) => {
    const isNewUi = await page.locator('#rl-user').isVisible();
    if (isNewUi) {
      await page.getByRole('button', { name: "Can't get in? Reset your password" }).click();
    } else {
      await page.getByText(/Forgot Password\?/i).click();
    }
    await expect(page).toHaveURL(/\/forgot-password/);
  });
});

test.describe('Login Page — Mode Switching & Sign Up Form', () => {
  test.beforeEach(async ({ page }) => {
    await prepareLoginPage(page);
  });

  test('switches to sign-up mode and updates headings, inputs, and buttons', async ({ page }) => {
    const isNewUi = await page.locator('#rl-user').isVisible();
    test.skip(!isNewUi, 'Tab mode switching is specific to the updated UI');

    // Switch to sign-up mode
    await page.getByRole('tab', { name: "I'm new here" }).click();
    await expect(page.getByRole('tab', { name: "I'm new here" })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    // Name field appears
    const nameInput = page.locator('#rl-name');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveAttribute('placeholder', 'Sam Taylor');

    // Submit button changes to Continue
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();

    // Reset password button is hidden in signup mode
    await expect(
      page.getByRole('button', { name: "Can't get in? Reset your password" })
    ).not.toBeVisible();

    // Subheading displays 14-day free trial text
    await expect(page.getByText(/Free for 14 days/i)).toBeVisible();

    // Typing name dynamically updates heading
    await nameInput.fill('Taylor Swift');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Hi Taylor');

    // Switching back to login restores login state
    await page.getByRole('tab', { name: 'I have an account' }).click();
    await expect(page.locator('#rl-name')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: "Can't get in? Reset your password" })
    ).toBeVisible();
  });

  test('validates required fields in signup mode step-by-step', async ({ page }) => {
    const isNewUi = await page.locator('#rl-user').isVisible();
    test.skip(!isNewUi, 'Multi-step signup validation is specific to the updated UI');

    await page.getByRole('tab', { name: "I'm new here" }).click();

    // 1. Submit with empty name
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('alert')).toContainText(
      'Add your name so we know what to call you.'
    );

    // 2. Fill name, submit with empty username/email
    await page.locator('#rl-name').fill('Alex Morgan');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('alert')).toContainText(
      'Add your email or mobile number.'
    );

    // 3. Fill username, submit with short password (< 8 chars)
    await page.locator('#rl-user').fill('alex@example.com');
    await page.locator('#rl-pass').fill('short');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('alert')).toContainText(
      'Make a password to keep your account safe.'
    );
  });
});

test.describe('Login Page — Authentication & Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await prepareLoginPage(page);
  });

  test('validates empty submission in login mode', async ({ page }) => {
    await page.getByRole('button', { name: /Log in|Sign in/i }).click();
    // In both versions, validation errors are displayed (via alert role or helper text)
    const errorNotice = page.locator('[role="alert"], [class*="error"], [aria-invalid="true"]');
    await expect(errorNotice.first()).toBeVisible();
  });

  test('displays error alert when login credentials are invalid', async ({ page }) => {
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid username or password' }),
      });
    });

    await page.locator('[name="userName"]').fill('nonexistent_user');
    await page.locator('[name="password"]').fill('incorrect_password');
    await page.getByRole('button', { name: /Log in|Sign in/i }).click();

    await expect(page.getByText('Invalid username or password')).toBeVisible();
  });

  test('shows resend verification email link when user is disabled/unverified', async ({
    page,
  }) => {
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'User is disabled' }),
      });
    });

    await page.locator('[name="userName"]').fill('unverified@example.com');
    await page.locator('[name="password"]').fill('password123');
    await page.getByRole('button', { name: /Log in|Sign in/i }).click();

    await expect(
      page.getByText('Please verify your email before logging in.')
    ).toBeVisible();

    const resendLink = page.getByRole('link', { name: 'Resend verification email' });
    await expect(resendLink).toBeVisible();
  });
});
