import { test, expect } from './fixture/auth.fixture';
import { TalhaoPage } from './pages/TalhaoPage';

test.describe('UC16 - Pesquisar Parcelas no Talhão', () => {
  let talhaoPage: TalhaoPage;

  test.beforeEach(async ({ page }) => {
    // Já inicia autenticado via storageState!
    talhaoPage = new TalhaoPage(page);
    await talhaoPage.goto();
  });

  test('CT - 16.1 Localizar parcela pelo número exato', async () => {
    await talhaoPage.search('P01');

    await expect(talhaoPage.parcelaItem('P01')).toBeVisible();
    await expect(talhaoPage.parcelaItem('P02')).toBeHidden();
  });

  test('CT - 16.2 Pesquisa aceita correspondências parciais', async () => {
    await talhaoPage.search('P0');

    await expect(talhaoPage.parcelaItem('P01')).toBeVisible();
    await expect(talhaoPage.parcelaItem('P02')).toBeVisible();
  });

  test('CT - 16.3 Comportamento ao pesquisar parcela inexistente', async ({ page }) => {
    await talhaoPage.search('Inexistente');

    await expect(talhaoPage.parcelaItem('P01')).toBeHidden();
    await expect(talhaoPage.parcelaItem('P02')).toBeHidden();
    await expect(page.getByText('Nenhuma parcela encontrada com "Inexistente"')).toBeVisible();
  });

  test('CT - 16.4 Limpar pesquisa restaura a lista original', async () => {
    // Pré-condição 3 do CT 16.4: lista já deve estar filtrada
    await talhaoPage.search('P01');
    await expect(talhaoPage.parcelaItem('P02')).toBeHidden();

    // Procedimento: apaga todo o texto digitado
    await talhaoPage.clearSearch();

    // Resultado esperado: lista completa retorna
    await expect(talhaoPage.parcelaItem('P01')).toBeVisible();
    await expect(talhaoPage.parcelaItem('P02')).toBeVisible();
  });

  test('CT - 16.5 Pesquisa não diferencia maiúsculas de minúsculas (Case Insensitive)', async () => {
    // Nota: na planilha a pré-condição menciona "Parcela Delta", mas o procedimento digita "p01"
    // e o resultado esperado valida "P01" — o teste segue o procedimento e resultado esperado.
    await talhaoPage.search('p01');

    await expect(talhaoPage.parcelaItem('P01')).toBeVisible();
    await expect(talhaoPage.parcelaItem('P02')).toBeHidden();
  });

  test('CT - 16.6 Pesquisa aceita o status da parcela', async ({ page }) => {
    await talhaoPage.search('andamento');

    // Valida que a badge exata "EM ANDAMENTO" aparece na lista filtrada
    await expect(page.getByText('EM ANDAMENTO', { exact: true }).first()).toBeVisible();

    // Valida que nenhuma badge de outro status (ex: CONCLUÍDA ou PENDENTE) está visível
    await expect(page.getByText('CONCLUÍDA', { exact: true })).toHaveCount(0);
    await expect(page.getByText('PENDENTE', { exact: true })).toHaveCount(0);
  });
});
