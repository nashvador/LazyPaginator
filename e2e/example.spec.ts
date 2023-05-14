import { test, expect } from '@playwright/test';

test('Displays Loader Page', async ({ page }) => {
	await page.goto('http://localhost:5173/');
	const locator = page.locator('#loader');

	await expect(locator).toBeVisible();
});

test('Diplays User One', async ({ page }) => {
	await page.goto('http://localhost:5173/');
	await page.waitForSelector('#user1');
	const locator = page.locator('#user1');

	await expect(locator).toContainText('Mignon Baxendale');
});
