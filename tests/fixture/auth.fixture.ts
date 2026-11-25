import { test as base } from '@playwright/test';
import { AUTH_TEST_TIMEOUT, signIn } from './login';

export const test = base.extend({
  page: async ({ page }, runWithPage, testInfo) => {
    const originalGoto = page.goto.bind(page);

    page.goto = async (url, options) => {
      const response = await originalGoto(url, options);

      const loginButton = page.getByRole('button', { name: 'Entrar', exact: true });
      if (await loginButton.isVisible()) {
        if (testInfo.timeout > 0 && testInfo.timeout < AUTH_TEST_TIMEOUT) {
          testInfo.setTimeout(AUTH_TEST_TIMEOUT);
        }
        await signIn(page);

        // Após logar, navega novamente para a rota original que o teste pediu
        return originalGoto(url, options);
      }

      return response;
    };

    await runWithPage(page);
  },
});

export { expect } from '@playwright/test';
