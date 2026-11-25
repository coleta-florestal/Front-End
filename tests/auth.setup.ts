import { test as setup } from '@playwright/test';
import path from 'path';
import { AUTH_TEST_TIMEOUT, signIn } from './fixture/login';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

const LOGIN_PATH = process.env.LOGIN_PATH ?? '/';

setup('autenticar usuário de teste', async ({ page }) => {
  setup.setTimeout(AUTH_TEST_TIMEOUT);

  await page.goto(LOGIN_PATH);
  await signIn(page);
  await page.context().storageState({ path: authFile });
});
