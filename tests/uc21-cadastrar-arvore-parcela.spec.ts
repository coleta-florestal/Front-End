import { test, expect } from './fixture/auth.fixture';
import { ParcelaPage } from './pages/ParcelaPage';

test.describe('UC21 - Cadastrar Árvore na Parcela', () => {
  let parcelaPage: ParcelaPage;

  // Gera um identificador único por execução para não colidir no banco
  const uniqueSuffix = () => String(Date.now()).slice(-5);

  test.beforeEach(async ({ page }) => {
    // Já inicia com sessão ativa via storageState
    parcelaPage = new ParcelaPage(page);
    await parcelaPage.goto();
  });

  test('CT - 21.1 Cadastro bem-sucedido com todos os dados preenchidos', async () => {
    const numeroArvore = `ARV-${uniqueSuffix()}`;

    await parcelaPage.abrirCadastroArvores();
    await parcelaPage.preencherFormularioArvore({
      numero: numeroArvore,
      dap: '25.5',
      altura: '14.2',
      // Precisa bater exatamente com QUALIDADE_LABELS (há espaço antes do "m")
      qualidadeFusteSanidade: 'Bifurcada acima de 1,3 m',
      observacoes: 'Árvore matriz saudável',
    });

    await parcelaPage.adicionarAoLoteButton.click();
    await parcelaPage.salvarButton.click();

    await expect(parcelaPage.arvoreNaLista(numeroArvore)).toBeVisible();
  });

  test('CT - 21.2 Cadastro bem-sucedido sem o preenchimento das observações', async () => {
    const numeroArvore = `ARV-${uniqueSuffix()}`;

    await parcelaPage.abrirCadastroArvores();
    await parcelaPage.preencherFormularioArvore({
      numero: numeroArvore,
      dap: '18.0',
      altura: '11.5',
    });

    await parcelaPage.adicionarAoLoteButton.click();
    await parcelaPage.salvarButton.click();

    await expect(parcelaPage.arvoreNaLista(numeroArvore)).toBeVisible();
  });

  test('CT - 21.3 Impede adicionar ao lote se faltar campo obrigatório', async () => {
    await parcelaPage.abrirCadastroArvores();

    await parcelaPage.preencherFormularioArvore({
      numero: '999',
      altura: '12.0',
    });

    await expect(parcelaPage.adicionarAoLoteButton).toBeDisabled();
  });

  test('Cadastra uma árvore sem altura', async ({ page }) => {
    const numero = `SEM-ALT-${uniqueSuffix()}`;

    await parcelaPage.abrirCadastroArvores();
    await parcelaPage.preencherFormularioArvore({ numero, dap: '20.0' });
    await parcelaPage.adicionarAoLoteButton.click();

    const linha = page.getByRole('row').filter({ hasText: numero });
    await expect(linha.getByRole('cell').nth(2)).toHaveText('—');
    await parcelaPage.salvarButton.click();

    const arvore = parcelaPage.arvoreNaLista(numero);
    await expect(arvore).toBeVisible();
    await arvore.click();
    await expect(page.getByRole('heading', { name: `Árvore ${numero}` })).toBeVisible();
    await expect(
      page.getByText('Altura total').locator('..').getByText('—', { exact: true }),
    ).toBeVisible();
  });

  test('Rejeita alturas não positivas e calcula a média apenas com alturas informadas', async ({
    page,
  }) => {
    await parcelaPage.abrirCadastroArvores();
    await parcelaPage.preencherFormularioArvore({ numero: 'SEM-ALT', dap: '20.0' });

    for (const altura of ['0', '-1']) {
      await parcelaPage.alturaInput.fill(altura);
      await parcelaPage.adicionarAoLoteButton.click();
      await expect(page.getByText('Altura deve ser um número positivo')).toBeVisible();
    }

    await parcelaPage.alturaInput.clear();
    await parcelaPage.adicionarAoLoteButton.click();
    const mediaAltura = page.getByText('Média Altura:', { exact: true }).locator('..');
    await expect(mediaAltura.getByText('—', { exact: true })).toBeVisible();

    await parcelaPage.preencherFormularioArvore({ numero: 'COM-ALT', dap: '20.0', altura: '12.0' });
    await parcelaPage.adicionarAoLoteButton.click();
    await expect(mediaAltura.getByText('12.0 m', { exact: true })).toBeVisible();
  });

  //   test('CT - 21.4 Recusa valores acima do limite configurado para o DAP', async ({ page }) => {
  //     await parcelaPage.abrirCadastroArvores();
  //     await parcelaPage.preencherFormularioArvore({
  //       numero: `ARV-${uniqueSuffix()}`,
  //       dap: '9999',
  //       altura: '15.0',
  //     });

  //     await parcelaPage.adicionarAoLoteButton.click();
  //     await parcelaPage.salvarButton.click();

  //     // Valida a mensagem de erro retornada pelo servidor sobre o limite de DAP
  //     await expect(page.getByText(/limite.*dap|dap.*m[áa]ximo|excede o limite/i)).toBeVisible();
  //   });

  test('CT - 21.5 Cancelamento da ação sem salvar os dados', async ({ page }) => {
    const numeroDescartado = `DESC-${uniqueSuffix()}`;

    // Pré-condição 2: estar na tela de cadastro com árvores no lote
    await parcelaPage.abrirCadastroArvores();
    await parcelaPage.preencherFormularioArvore({
      numero: numeroDescartado,
      dap: '22.0',
      altura: '12.0',
    });
    await parcelaPage.adicionarAoLoteButton.click();

    // Aceita o window.confirm() nativo do navegador
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Há árvores não salvas');
      await dialog.accept();
    });

    await parcelaPage.fecharButton.click();

    // Aguarda a navegação de saída da tela de cadastro concluir
    await expect(parcelaPage.fecharButton).toBeHidden();

    // Volta para a tela da parcela (caso o "Fechar" tenha redirecionado para /platform/fazendas)
    await parcelaPage.goto();

    // Resultado esperado: o lote foi descartado e nenhuma árvore foi salva
    await expect(parcelaPage.arvoreNaLista(numeroDescartado)).toBeHidden();
  });
});
