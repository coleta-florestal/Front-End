import { Page, Locator, expect } from '@playwright/test';

export interface DadosArvore {
  numero: string;
  dap?: string;
  altura?: string;
  qualidadeFusteSanidade?: string;
  observacoes?: string;
}

export class ParcelaPage {
  readonly page: Page;

  // Tela de visualização da parcela
  readonly addArvoresButton: Locator;

  // Tela / Modal de cadastro em lote
  readonly numeroInput: Locator;
  readonly dapInput: Locator;
  readonly alturaInput: Locator;
  readonly qualidadeInput: Locator;
  readonly observacoesInput: Locator;
  readonly adicionarAoLoteButton: Locator;
  readonly salvarButton: Locator;
  readonly fecharButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.addArvoresButton = page.getByRole('button', { name: /\+\s*Adicionar Árvores/i });

    this.numeroInput = page
      .getByLabel(/n[º°o]/i)
      .or(page.getByPlaceholder(/n[º°o]/i))
      .first();
    this.dapInput = page.getByLabel(/dap/i).or(page.getByPlaceholder(/dap/i)).first();
    this.alturaInput = page
      .getByLabel(/altura/i)
      .or(page.getByPlaceholder(/altura/i))
      .first();
    this.qualidadeInput = page.getByRole('combobox', { name: 'Qualidade/Fuste/Sanidade' });
    this.observacoesInput = page
      .getByLabel(/observa[çc][õo]es/i)
      .or(page.getByPlaceholder(/observa[çc][õo]es/i))
      .first();

    this.adicionarAoLoteButton = page.getByRole('button', { name: 'Adicionar ao Lote' });
    this.salvarButton = page.getByRole('button', { name: 'Salvar', exact: true });
    this.fecharButton = page.getByRole('button', { name: 'Fechar' });
  }

  /**
   * Navega até uma parcela em andamento (não concluída).
   */
  async goto(parcelaPath = process.env.TEST_PARCELA_PATH ?? '/parcelas/1') {
    await this.page.goto(parcelaPath);
    await expect(this.addArvoresButton).toBeVisible();
  }

  async abrirCadastroArvores() {
    await this.addArvoresButton.click();
    await expect(this.adicionarAoLoteButton).toBeVisible();
  }

  async preencherFormularioArvore(dados: DadosArvore) {
    await this.numeroInput.fill(dados.numero);
    if (dados.dap !== undefined) await this.dapInput.fill(dados.dap);
    if (dados.altura !== undefined) await this.alturaInput.fill(dados.altura);
    if (dados.qualidadeFusteSanidade !== undefined) {
      await this.qualidadeInput.selectOption({ label: dados.qualidadeFusteSanidade });
    }
    if (dados.observacoes !== undefined) {
      await this.observacoesInput.fill(dados.observacoes);
    }
  }

  arvoreNaLista(numero: string): Locator {
    return this.page.getByText(`Nº ${numero}`, { exact: true });
  }

  // Botões do modal de confirmação de exclusão
  get confirmarExclusaoButton(): Locator {
    return this.page.getByRole('button', { name: 'Excluir árvore' });
  }

  get cancelarExclusaoButton(): Locator {
    return this.page.getByRole('button', { name: 'Cancelar' });
  }

  /**
   * Localiza o botão de lixeira dentro do card específico da árvore informada
   */
  botaoLixeiraDaArvore(numero: string): Locator {
    const botao = this.page.getByRole('button', { name: 'Remover árvore' });
    // Filtra pelo texto E pelo botão: só com o texto, o .last() pegava o div interno
    // do "Nº", que é irmão do div da lixeira e não contém o botão
    const card = this.page
      .locator('div')
      .filter({ has: this.page.getByText(`Nº ${numero}`, { exact: true }) })
      .filter({ has: botao })
      .last();

    return card.getByRole('button', { name: 'Remover árvore' });
  }

  /**
   * Exclui todas as árvores da parcela, uma a uma, pela UI
   */
  async excluirTodasArvores() {
    const cards = this.page.getByText(/^Nº\s+/);
    while ((await cards.count()) > 0) {
      const codigo = ((await cards.first().textContent()) ?? '').replace(/^Nº\s+/, '').trim();
      await this.botaoLixeiraDaArvore(codigo).click();
      await this.confirmarExclusaoButton.click();
      // Espera pelo código, não pelo .first(): o .first() é reavaliado e passa a apontar para a próxima árvore
      await expect(this.arvoreNaLista(codigo)).toBeHidden();
    }
  }

  /**
   * Helper para preparar a pré-condição de cada CT criando uma árvore nova na parcela
   */
  async cadastrarArvoreRapida(numero: string, dap = '20.0', altura = '12.0') {
    await this.abrirCadastroArvores();
    await this.preencherFormularioArvore({ numero, dap, altura });
    await this.adicionarAoLoteButton.click();
    await this.salvarButton.click();
    await expect(this.addArvoresButton).toBeVisible({ timeout: 15000 });
    await expect(this.arvoreNaLista(numero)).toBeVisible();
  }
}
