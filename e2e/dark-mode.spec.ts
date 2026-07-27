import { test, expect } from '@playwright/test';
import { loguear } from './helpers';

test('el botón de tema alterna entre modo claro y oscuro', async ({ page }) => {
  await loguear(page);

  const html = page.locator('html');
  await expect(html).not.toHaveClass(/dark/);

  await page.getByRole('button', { name: 'Cambiar a modo oscuro' }).click();
  await expect(html).toHaveClass(/dark/);

  await page.getByRole('button', { name: 'Cambiar a modo claro' }).click();
  await expect(html).not.toHaveClass(/dark/);
});
