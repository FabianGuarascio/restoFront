import { test, expect } from '@playwright/test';

test('navega entre Pedidos, Mesas y Menú', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/pedidos$/);
  await expect(page.getByRole('heading', { name: 'Pedidos' })).toBeVisible();

  await page.getByRole('link', { name: 'Mesas' }).click();
  await expect(page).toHaveURL(/\/mesas$/);
  await expect(page.getByRole('heading', { name: 'Mesas' })).toBeVisible();

  await page.getByRole('link', { name: 'Menú' }).click();
  await expect(page).toHaveURL(/\/menu$/);
  await expect(page.getByRole('heading', { name: 'Categorías' })).toBeVisible();
});
