import { test, expect } from './fixture/auth.fixture';
import { ParcelaPage } from './pages/ParcelaPage';

test.describe('UC23 - Excluir Árvore da Parcela', () => {
  let parcelaPage: ParcelaPage;
  const uniqueSuffix = () => String(Date.now()).slice(-5);

  test.beforeEach(async ({ page }) => {
    parcelaPage = new ParcelaPage(page);
    await parcelaPage.goto();
  });

  test('CT - 23.1 Exclusão bem-sucedida de uma árvore', async ({ page }) => {
    const numeroArvore = `DEL-${uniqueSuffix()}`;
    await parcelaPage.cadastrarArvoreRapida(numeroArvore);

    // Ancora com ^ e $ para pegar apenas o <p> do ParcelCard ("3 árvores registradas");
    // sem o $ também casa o "3 árvores registradas · faltam X para a meta" da seção
    const metricaArvores = page.getByText(/^\d+\s+árvores\s+registradas$/i);
    const textoContagemAntes = await metricaArvores.textContent();

    await parcelaPage.botaoLixeiraDaArvore(numeroArvore).click();
    await expect(parcelaPage.confirmarExclusaoButton).toBeVisible();
    await parcelaPage.confirmarExclusaoButton.click();

    await expect(parcelaPage.confirmarExclusaoButton).toBeHidden();
    await expect(parcelaPage.arvoreNaLista(numeroArvore)).toBeHidden();

    if (textoContagemAntes) {
      await expect(metricaArvores).not.toHaveText(textoContagemAntes);
    }
  });

  test('CT - 23.2 Cancelamento da exclusão', async () => {
    const numeroArvore = `KEEP-${uniqueSuffix()}`;
    await parcelaPage.cadastrarArvoreRapida(numeroArvore);

    // Pré-condição 3: abrir o modal de confirmação
    await parcelaPage.botaoLixeiraDaArvore(numeroArvore).click();
    await expect(parcelaPage.confirmarExclusaoButton).toBeVisible();

    // Procedimento: clicar em "Cancelar"
    await parcelaPage.cancelarExclusaoButton.click();

    // Resultado esperado: modal fecha e árvore continua intacta
    await expect(parcelaPage.confirmarExclusaoButton).toBeHidden();
    await expect(parcelaPage.arvoreNaLista(numeroArvore)).toBeVisible();
  });

  test('CT - 23.3 Trata falhas de comunicação durante a exclusão', async ({ page, context }) => {
    const numeroArvore = `OFF-${uniqueSuffix()}`;
    await parcelaPage.cadastrarArvoreRapida(numeroArvore);

    // Pré-condição 3: abrir o modal de confirmação
    await parcelaPage.botaoLixeiraDaArvore(numeroArvore).click();
    await expect(parcelaPage.confirmarExclusaoButton).toBeVisible();

    // Pré-condição 4 / Passo 1: desativa a internet do navegador
    await context.setOffline(true);

    try {
      // Passo 2: clica em "Excluir árvore" sem conexão
      await parcelaPage.confirmarExclusaoButton.click();

      // Resultado esperado: exibe erro de comunicação e não exclui a árvore
      await expect(
        page.getByText(
          /não foi possível conectar|erro de conexão|falha na comunicação|offline|network/i,
        ),
      ).toBeVisible();

      // Restaura a conexão para validar que a árvore continua salva
      await context.setOffline(false);
      await parcelaPage.goto();
      await expect(parcelaPage.arvoreNaLista(numeroArvore)).toBeVisible();
    } finally {
      // Garante que o navegador sempre volte a ficar online mesmo se o teste falhar
      await context.setOffline(false);
    }
  });

  test('CT - 23.4 Exibe empty state ao excluir a última e única árvore da parcela', async ({
    page,
  }) => {
    // A parcela pode ter muitas árvores de execuções anteriores e o slowMo deixa cada exclusão lenta
    test.setTimeout(180_000);

    // Garante que existe ao menos 1 árvore e exclui todas as árvores existentes da parcela
    const numeroUnica = `LAST-${uniqueSuffix()}`;
    await parcelaPage.cadastrarArvoreRapida(numeroUnica);
    await parcelaPage.excluirTodasArvores();

    // ponytail: a tela ainda não tem empty state com mensagem; valida lista vazia e métrica zerada
    await expect(page.getByText(/^Nº\s+/)).toHaveCount(0);
    await expect(page.getByText(/^0\s+árvores\s+registradas$/i)).toBeVisible();
  });

  test('CT - 23.5 Recalcula as métricas da parcela após excluir uma de duas árvores', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    // Garante que a parcela comece vazia para ter exatamente 2 árvores controladas
    await parcelaPage.excluirTodasArvores();

    // Pré-condição 3: cadastra exatamente duas árvores com medidas distintas
    const arvore1 = `M1-${uniqueSuffix()}`;
    const arvore2 = `M2-${uniqueSuffix()}`;
    await parcelaPage.cadastrarArvoreRapida(arvore1, '10.0', '10.0');
    await parcelaPage.cadastrarArvoreRapida(arvore2, '30.0', '20.0');

    // Confirma que a contagem inicial é de 2 árvores no card de métrica
    await expect(page.getByText(/^2\s+árvores\s+registradas$/i)).toBeVisible();

    // Exclui a segunda árvore
    await parcelaPage.botaoLixeiraDaArvore(arvore2).click();
    await parcelaPage.confirmarExclusaoButton.click();

    // Resultado esperado: apenas arvore1 resta e a métrica atualiza para 1 árvore
    await expect(parcelaPage.arvoreNaLista(arvore2)).toBeHidden();
    await expect(parcelaPage.arvoreNaLista(arvore1)).toBeVisible();
    // A tela não flexiona para o singular: mostra "1 árvores registradas"
    await expect(page.getByText(/^1\s+árvores\s+registradas$/i)).toBeVisible();
  });
});
