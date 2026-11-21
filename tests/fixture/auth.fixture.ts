// tests/fixtures/auth.fixture.ts
import { test as base, expect } from '@playwright/test';

const USER = {
  email: process.env.TEST_USER_EMAIL ?? 'userteste@glupta.com',
  password: process.env.TEST_USER_PASSWORD ?? 'S3nh@Teste',
};

export const test = base.extend({
  page: async ({ page }, Use) => {
    // Escuta toda navegação: se cair na tela de login, autentica na hora
    const originalGoto = page.goto.bind(page);

    page.goto = async (url, options) => {
      const response = await originalGoto(url, options);

      const loginButton = page.getByRole('button', { name: 'Entrar' });
      if (await loginButton.isVisible({ timeout: 2500 }).catch(() => false)) {
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
        await loginButton.click();

        await expect(page.getByText('Sair').first()).toBeVisible();

        // Após logar, navega novamente para a rota original que o teste pediu
        return await originalGoto(url, options);
      }

      return response;
    };

    await Use(page);
  },
});

export { expect } from '@playwright/test';
