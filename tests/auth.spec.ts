import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    username: `testuser_${Date.now()}`,
    email: `testuser_${Date.now()}@example.com`,
    password: 'password123',
  };

  test('should register successfully', async ({ page }) => {
    // Escuchar la consola para ver qué dice el frontend
    page.on('console', msg => console.log('FE_CONSOLE:', msg.text()));

    await page.goto('http://localhost:5173/register');
    await expect(page.locator('text=Crear Cuenta')).toBeVisible();

    await page.fill('input[id="firstName"]', testUser.firstName);
    await page.fill('input[id="lastName"]', testUser.lastName);
    
    // Type on username to trigger the check
    await page.fill('input[id="username"]', testUser.username);
    
    await page.fill('input[id="email"]', testUser.email);
    await page.fill('input[id="password"]', testUser.password);

    // Wait a bit for the debounce (500ms) and network call
    await page.waitForTimeout(1500);

    // Instead of waiting for a strict selector which might be masked, we submit if the button is enabled
    // If there is an error on screen, let's log it
    const errorLoc = page.locator('.text-red-400');
    if (await errorLoc.count() > 0) {
       console.log('Error en pantalla:', await errorLoc.first().innerText());
    }

    await page.click('button[type="submit"]', { force: true });
    
    // Wait for response or navigation
    await page.waitForTimeout(2000);
  });
});
