import { test, expect } from '@playwright/test';
import { loguear } from './helpers';

test('crea una mesa nueva', async ({ page }) => {
  await loguear(page);
  await page.goto('/mesas');

  const numero = Math.floor(Math.random() * 1_000_000);

  await page.getByRole('button', { name: '+ Nueva mesa' }).click();
  await page.getByPlaceholder('Número').fill(String(numero));
  await page.getByPlaceholder('Capacidad').fill('4');
  await page.getByRole('button', { name: 'Agregar' }).click();

  await expect(page.locator('app-modal-crear-mesa')).toHaveCount(0);
  await expect(page.getByText(`Mesa ${numero}`)).toBeVisible();
});
