import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

const LOGIN_PATH = process.env.LOGIN_PATH ?? '/';
const USER = {
  email: process.env.TEST_USER_EMAIL ?? 'userteste@glupta.com',
  password: process.env.TEST_USER_PASSWORD ?? 'S3nh@Teste',
};

setup('autenticar usuário de teste', async ({ page }) => {
  await page.goto(LOGIN_PATH);

  await page
    .getByLabel(/e-?mail/i)
    .or(page.getByPlaceholder(/e-?mail/i))
    .first()
    .fill(USER.email);
  await page
    .getByLabel(/^senha/i)
    .or(page.getByPlaceholder(/^senha/i))
    .first()
    .fill(USER.password);
  await page.getByRole('button', { name: 'Entrar' }).click();

  // Garante que o login terminou e os tokens/cookies foram gravados antes de salvar o estado
  await expect(page.getByText('Sair').first()).toBeVisible();

  // Salva cookies e localStorage no arquivo JSON
  await page.context().storageState({ path: authFile });
});
