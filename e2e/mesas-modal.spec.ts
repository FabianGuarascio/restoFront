import { test, expect } from '@playwright/test';

test('abre y cancela el modal de nueva mesa', async ({ page }) => {
  await page.goto('/mesas');

  await page.getByRole('button', { name: '+ Nueva mesa' }).click();

  await expect(page.getByRole('heading', { name: 'Nueva mesa' })).toBeVisible();
  await expect(page.getByPlaceholder('Número')).toBeVisible();
  await expect(page.getByPlaceholder('Capacidad')).toBeVisible();

  await page.getByRole('button', { name: 'Cancelar' }).click();
  await expect(page.locator('app-modal-crear-mesa')).toHaveCount(0);
});
