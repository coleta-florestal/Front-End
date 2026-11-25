import { expect, type Page } from '@playwright/test';

export const AUTH_TEST_TIMEOUT = 120_000;

export async function signIn(page: Page) {
  const email = process.env.TEST_USER_EMAIL ?? 'userteste@glupta.com';
  const password = process.env.TEST_USER_PASSWORD ?? 'S3nh@Teste';

  await page
    .getByLabel(/e-?mail/i)
    .or(page.getByPlaceholder(/e-?mail/i))
    .first()
    .fill(email);
  await page
    .getByLabel(/^senha/i)
    .or(page.getByPlaceholder(/^senha/i))
    .first()
    .fill(password);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();

  // A primeira navegação pode incluir a compilação da rota e a consulta de perfil no servidor.
  await expect(page.getByRole('heading', { name: 'Fazendas', exact: true })).toBeVisible({
    timeout: 90_000,
  });
  await expect(page).toHaveURL((url) => url.pathname === '/platform/fazendas');
}
