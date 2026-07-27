import { Page } from '@playwright/test';

const USUARIO_E2E = process.env['E2E_USUARIO'] ?? 'juan';
const PASSWORD_E2E = process.env['E2E_PASSWORD'];

export async function loguear(page: Page): Promise<void> {
  if (!PASSWORD_E2E) {
    throw new Error(
      'Falta la variable de entorno E2E_PASSWORD para correr los tests e2e (ver README).',
    );
  }

  await page.goto('/login');
  // Evita que el tour de onboarding (driver.js) se dispare y tape la UI con
  // su overlay — no es lo que estos tests están verificando.
  await page.evaluate(
    (usuario) => localStorage.setItem(`resto-tour-completado:${usuario}`, '1'),
    USUARIO_E2E,
  );
  await page.getByPlaceholder('Usuario').fill(USUARIO_E2E);
  await page.getByPlaceholder('Contraseña').fill(PASSWORD_E2E);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForURL('**/pedidos');
}
