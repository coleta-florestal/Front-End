import { Page, Locator, expect } from '@playwright/test';

export class TalhaoPage {
  readonly page: Page;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    // Baseado exatamente no placeholder especificado no procedimento do CT 16.1
    this.searchInput = page.getByPlaceholder('Digite o número (ex: P01) ou status...');
  }

  /**
   * Navega até o talhão alvo do teste.
   * Você pode passar a URL direta via env (ex: /fazendas/1/talhoes/1) ou navegar pela UI.
   */
  async goto(talhaoPath = process.env.TEST_TALHAO_PATH ?? '/talhoes/1') {
    await this.page.goto(talhaoPath);
    await expect(this.searchInput).toBeVisible();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  /**
   * Retorna o locator de um card/linha de parcela pelo nome/número.
   * Se você tiver data-testid nos cards (ex: data-testid="parcela-card"),
   * substitua por: this.page.getByTestId('parcela-card')
   */
  parcelaItem(nome: string): Locator {
    return this.page.getByText(nome, { exact: true });
  }
}
