# GLUPTA · Inventário Florestal

O GLUPTA é uma plataforma para coletar, acompanhar e analisar dados de florestas plantadas. A equipe de campo registra medições de árvores por parcela. Quem acompanha o inventário pode consultar o progresso da coleta, visualizar indicadores e gerar relatórios para apoiar decisões de manejo florestal.

Este repositório contém o front-end web. Uma API independente autentica usuários, armazena os dados do inventário e executa o processamento volumétrico.

## Sumário

- [Visão geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Mapa de rotas](#mapa-de-rotas)
- [Como rodar localmente](#como-rodar-localmente)
- [Scripts e verificações](#scripts-e-verificações)
- [Testes de ponta a ponta](#testes-de-ponta-a-ponta)
- [Build e Docker](#build-e-docker)
- [Solução de problemas](#solução-de-problemas)
- [Contribuição e releases](#contribuição-e-releases)
- [Licença](#licença)

## Visão geral

### Hierarquia do inventário

**Fazenda → Talhão → Parcela → Árvore**

Cada fazenda pode conter vários talhões. Cada talhão pode conter várias parcelas, e cada parcela pode conter várias árvores. Os identificadores dos pais acompanham a navegação e as chamadas da API para as entidades filhas.

| Entidade | Nome na API | O que representa                                                                                                                                    |
| -------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fazenda  | `farm`      | Unidade que reúne os talhões e consolida o acompanhamento do inventário.                                                                            |
| Talhão   | `plot`      | Área da fazenda, medida em hectares (ha), que agrupa as parcelas.                                                                                   |
| Parcela  | `subPlot`   | Unidade de amostragem, com área em metros quadrados (m²), meta de árvores e estado de coleta.                                                       |
| Árvore   | `tree`      | Registro individual com identificador, diâmetro à altura do peito (DAP) em centímetros, altura em metros quando informada, qualidade e observações. |

### Funcionalidades

- **Acesso e perfil** — cadastro sujeito a aprovação, login, recuperação de senha e edição de perfil.
- **Coleta de campo** — navegação entre fazendas, talhões e parcelas, pesquisa de parcelas, registro de árvores em lote e acompanhamento da meta de coleta por parcela.
- **Indicadores** — visão geral do progresso das fazendas e dashboards com métricas como quantidade de árvores por parcela e distribuição de qualidade.
- **Processamento e relatórios** — seleção de equação volumétrica para processar um talhão, consulta de resultados e estatísticas, exportação em CSV e impressão em PDF pelo navegador. A tela de relatório da fazenda oferece seleção de seções, prévia e impressão.
- **Administração** — análise de solicitações de cadastro, gestão de usuários e vínculos com projetos, configuração de equações e limites de validação e consulta de auditoria.

A etapa de relação hipsométrica é uma prévia na interface. O processamento volumétrico usa os dados e parâmetros aceitos pela API.

## Arquitetura

| Camada                | Tecnologias e responsabilidades                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Aplicação             | Next.js 16.4.6 com App Router, React 19 e TypeScript.                                                                         |
| Interface             | Tailwind CSS 4 com PostCSS, componentes React compartilhados e componentes organizados por domínio.                           |
| Integração            | Requisições HTTP com `fetch`, tipos de entrada e saída em TypeScript e funções que adaptam respostas da API para a interface. |
| Qualidade e automação | ESLint, Prettier, Playwright, Husky, Commitlint e GitHub Actions.                                                             |

### Rotas, layouts e estado

- O [layout raiz](src/app/layout.tsx) define idioma, fontes e notificações. O [layout da plataforma](src/app/platform/layout.tsx) fornece cabeçalho e barra lateral às rotas autenticadas.
- Os layouts são renderizados no servidor. Telas interativas usam Client Components para formulários, filtros, modais e carregamento de dados.
- A pasta [`src/types`](src/types) reúne os contratos de domínio. A pasta [`src/lib`](src/lib) contém utilitários de autenticação, indicadores, equações, auditoria e exportação, entre outros.
- O alias `@/` aponta para `src/`, conforme a configuração em [`tsconfig.json`](tsconfig.json).

### API, sessão e permissões

O [cliente HTTP](src/app/api/api.ts) centraliza a URL base, a serialização JSON, o envio do token Bearer e o tratamento das respostas. As telas fazem chamadas à API do backend, que precisa aceitar a origem do front-end para as chamadas de navegador. `src/app/api/api.ts` é um módulo compartilhado. O endpoint HTTP local de saúde é definido à parte em [`src/app/api/health/route.ts`](src/app/api/health/route.ts).

O cadastro cria uma solicitação pendente. Após a aprovação, o login recebe um JWT e guarda a sessão em cookie. O [proxy](src/proxy.ts) usa o estado da sessão para redirecionar a navegação. Na administração e no processamento de talhões, ele também consulta o papel atual do usuário no backend.

| Papel                  | Acesso na interface                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| `USER`                 | Telas operacionais conforme os dados e as permissões disponibilizados pela API.                               |
| `ADMIN`, `SUPER_ADMIN` | Acesso às áreas administrativas e ao processamento de talhões, sujeito às permissões de cada operação na API. |

### Componentes e tema

As primitivas `Button`, `Input`, `Select`, `Textarea` e `Icons` ficam em [`src/components/core`](src/components/core). Os componentes de domínio compõem essas primitivas em formulários, cartões, gráficos e modais. Em novas telas da plataforma, reutilize a navegação fornecida pelo layout.

O [tema global](src/app/globals.css) registra os tokens no Tailwind e define os estilos de impressão.

| Token                                           | Classes representativas                                  |
| ----------------------------------------------- | -------------------------------------------------------- |
| `--background`, `--foreground`                  | `bg-background`, `text-foreground`                       |
| `--color-verde-mata`, `--color-verde-eucalipto` | `text-verde-mata`, `bg-verde-mata`, `bg-verde-eucalipto` |
| `--color-creme-flor`                            | `bg-creme-flor`                                          |
| `--color-coral-flor`, `--color-marrom-casca`    | `text-coral-flor`, `text-marrom-casca`                   |

As fontes são Source Sans 3 para o texto da interface (`font-sans`), Newsreader para títulos (`font-newsreader`) e Geist Mono para texto monoespaçado (`font-mono`). Use a escala de espaçamento do Tailwind e comece pelo layout móvel, com `sm:`, `md:` e `lg:` conforme a necessidade.

## Estrutura de pastas

```text
.
├── .github/workflows/       # Lint, testes E2E, título de PR e releases
├── .husky/                  # Hooks de commit
├── public/assets/           # Logos e outros arquivos estáticos
├── src/
│   ├── app/                 # Rotas, layouts e estilos globais
│   │   ├── api/             # Cliente HTTP e endpoint de saúde
│   │   ├── cadastro/
│   │   ├── recuperar-acesso/
│   │   ├── redefinir-senha/
│   │   └── platform/        # Área autenticada
│   │       ├── dashboards/
│   │       ├── fazendas/    # Rotas aninhadas por fazenda, talhão e parcela
│   │       ├── painel-admin/
│   │       └── perfil/
│   ├── components/
│   │   ├── core/            # Primitivas de interface
│   │   ├── ui/              # Navegação e notificações
│   │   ├── modal/           # Diálogos e confirmações
│   │   ├── farm/, talhoes/, parcels/, trees/
│   │   ├── dashboard/, volumeCards/, processing/, report/
│   │   └── admin/, profile/
│   ├── lib/                 # Utilitários e transformação de dados
│   ├── types/               # Tipos do domínio e contratos de dados
│   └── proxy.ts             # Sessão e controle de acesso às rotas
├── tests/
│   ├── fixture/             # Fixture de autenticação
│   ├── pages/               # Page Objects
│   └── …                    # Setup de autenticação e cenários E2E
├── Dockerfile               # Build e execução standalone em contêiner
├── next.config.ts           # Configuração do Next.js
├── package.json             # Dependências e scripts
└── playwright.config.ts     # Servidor, navegador e configuração dos testes
```

## Mapa de rotas

Os segmentos entre colchetes representam os identificadores de cada nível do inventário. Os demais segmentos usam letras minúsculas, hífens quando necessário e grafia sem acentos.

### Acesso e infraestrutura

| Rota                | Finalidade                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `/`                 | Login.                                                                                   |
| `/cadastro`         | Solicitação de cadastro.                                                                 |
| `/recuperar-acesso` | Solicitação de recuperação de senha por e-mail.                                          |
| `/redefinir-senha`  | Definição de nova senha com o token de recuperação.                                      |
| `/reset-password`   | Redirecionamento de compatibilidade para `/redefinir-senha`, preservando o token da URL. |
| `GET /api/health`   | Estado do processo do front-end.                                                         |

### Plataforma

| Rota                                                               | Finalidade                                                |
| ------------------------------------------------------------------ | --------------------------------------------------------- |
| `/platform`                                                        | Visão geral e progresso das fazendas.                     |
| `/platform/fazendas`                                               | Lista de fazendas.                                        |
| `/platform/fazendas/[fazenda]`                                     | Detalhes da fazenda e lista de talhões.                   |
| `/platform/fazendas/[fazenda]/relatorio`                           | Prévia e impressão do relatório da fazenda.               |
| `/platform/fazendas/[fazenda]/[talhao]`                            | Detalhes do talhão e lista de parcelas.                   |
| `/platform/fazendas/[fazenda]/[talhao]/processamento`              | Processamento do talhão, disponível para administradores. |
| `/platform/fazendas/[fazenda]/[talhao]/[parcela]`                  | Detalhes da parcela e lista de árvores.                   |
| `/platform/fazendas/[fazenda]/[talhao]/[parcela]/cadastrar-arvore` | Cadastro de árvores na parcela.                           |
| `/platform/dashboards`                                             | Indicadores e gráficos por fazenda.                       |
| `/platform/perfil`                                                 | Dados e edição do perfil.                                 |

### Administração

| Rota                               | Finalidade                                    |
| ---------------------------------- | --------------------------------------------- |
| `/platform/painel-admin`           | Visão geral e solicitações pendentes.         |
| `/platform/painel-admin/usuarios`  | Gestão de usuários e permissões.              |
| `/platform/painel-admin/projetos`  | Gestão dos vínculos de usuários com projetos. |
| `/platform/painel-admin/equacao`   | Gestão de equações volumétricas.              |
| `/platform/painel-admin/validacao` | Configuração de limites de validação.         |
| `/platform/painel-admin/auditoria` | Consulta do histórico de auditoria.           |

## Como rodar localmente

Use Git, Node.js 24 e npm. A versão de Node.js acompanha a imagem Docker e os workflows de lint e release. Para usar a área autenticada, tenha uma instância acessível do backend e uma conta aprovada. O endereço e as permissões da conta dependem do ambiente escolhido.

1. Clone o repositório e instale as dependências pelo lockfile.

   ```bash
   git clone https://github.com/coleta-florestal/Front-End.git
   cd Front-End
   npm ci
   ```

2. Crie ou edite o arquivo `.env` na raiz. Substitua o endereço ilustrativo pela URL base do seu backend, incluindo o prefixo da API se o ambiente o utilizar.

   ```dotenv
   NEXT_PUBLIC_API_URL=https://api.example.com
   ```

   `NEXT_PUBLIC_API_URL` fica disponível no navegador. Use essa variável apenas para o endereço da API. Quando ela fica vazia, o cliente HTTP usa o endereço hospedado configurado no código. Defina a URL explicitamente para escolher o ambiente.

3. Inicie o servidor de desenvolvimento.

   ```bash
   npm run dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000) e entre com a conta aprovada. O login leva à lista de fazendas em `/platform/fazendas`. A visão geral fica em `/platform`. Se a conta ainda estiver pendente, solicite aprovação a um administrador do ambiente.

## Scripts e verificações

| Comando                          | Finalidade                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `npm run dev`                    | Inicia o Next.js em desenvolvimento.                                                                                           |
| `npm run lint`                   | Executa o ESLint.                                                                                                              |
| `npm run build`                  | Gera o build de produção, incluindo a saída standalone.                                                                        |
| `npm run start`                  | Executa o comando `next start` definido no manifesto. O procedimento standalone usado pelo projeto está na seção de build.     |
| `npm test`                       | Executa o Playwright em modo visual com um worker.                                                                             |
| `npm run prepare`                | Configura os hooks do Husky durante a instalação.                                                                              |
| `npx tsc --noEmit`               | Verifica os tipos separadamente. A configuração atual do build permite a geração da saída mesmo quando há erros de TypeScript. |
| `npx prettier --check README.md` | Confere a formatação deste documento.                                                                                          |

## Testes de ponta a ponta

A suíte do Playwright cobre pesquisa de parcelas, cadastro de árvores e exclusão de árvores. O setup faz login e salva o estado da sessão em `playwright/.auth/user.json`. O Chromium reutiliza esse estado, e os testes rodam com um worker porque os cenários de árvores compartilham a mesma parcela.

**Use uma parcela dedicada a testes.** Alguns cenários excluem todas as árvores da parcela apontada por `TEST_PARCELA_PATH` e criam registros na API.

No [arquivo de configuração](playwright.config.ts), o Playwright lê o `.env` da raiz. Acrescente as variáveis abaixo, substitua os valores ilustrativos e mantenha o `.env` e a sessão gerada fora do controle de versão.

```dotenv
TEST_USER_EMAIL=teste@example.com
TEST_USER_PASSWORD=SUBSTITUA_PELA_SENHA_DE_TESTE
TEST_TALHAO_PATH=/platform/fazendas/id-da-fazenda/id-do-talhao
TEST_PARCELA_PATH=/platform/fazendas/id-da-fazenda/id-do-talhao/id-da-parcela
```

- Use uma conta aprovada com acesso ao talhão de teste e permissão de cadastrar e excluir árvores na parcela.
- Aponte `TEST_TALHAO_PATH` para um talhão com as parcelas `P01` e `P02` e pelo menos uma parcela aberta com árvores, exibida como **EM ANDAMENTO**, para os cenários de pesquisa.
- Aponte `TEST_PARCELA_PATH` para uma parcela aberta com cadastro de árvores disponível.
- `LOGIN_PATH` é opcional e tem o valor padrão `/`.

```bash
npx playwright install chromium
npm test
```

Para executar sem abrir a janela do navegador e consultar o relatório HTML depois da execução, use os comandos abaixo.

```bash
npx playwright test
npx playwright show-report
```

O Playwright usa `http://localhost:3000` e inicia o servidor de desenvolvimento se necessário. Em ambiente local, ele pode reutilizar o servidor que já estiver nessa porta. Confirme que esse servidor aponta para a API de testes antes de rodar a suíte.

## Build e Docker

### Execução standalone

A [configuração do Next.js](next.config.ts) gera um servidor standalone. Com a URL da API configurada, execute os comandos abaixo a partir da raiz.

```bash
npm run build
cp -R public .next/standalone/
cp -R .next/static .next/standalone/.next/
node .next/standalone/server.js
```

As cópias disponibilizam os arquivos públicos e estáticos para o servidor gerado. O Next.js incorpora `NEXT_PUBLIC_API_URL` ao código entregue ao navegador durante o build. Gere um novo build ao trocar a URL.

### Execução em contêiner

O [Dockerfile](Dockerfile) compila com Node.js 24 Alpine e executa o servidor standalone na porta `3000`. Substitua a URL ilustrativa pela do backend acessível pelo navegador e pelo contêiner.

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.example.com -t glupta-front .
docker run --rm -p 3000:3000 glupta-front
```

### Verificação de saúde

```bash
curl -f http://localhost:3000/api/health
```

O endpoint devolve JSON com `status`, `uptime` em segundos e `timestamp`. Ele verifica o processo do front-end. Para confirmar a integração com o backend, faça login e carregue um recurso da plataforma, como a lista de fazendas.

## Solução de problemas

| Sintoma                                                            | O que verificar                                                                                                                                                                   |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Falha de conexão ao entrar ou carregar dados                       | Confirme a URL da API, se o backend está respondendo e se ele aceita a origem do front-end na configuração de CORS. Após editar o `.env`, reinicie o servidor de desenvolvimento. |
| O login informa que a conta está pendente                          | Verifique se um administrador aprovou a conta no ambiente configurado.                                                                                                            |
| A sessão expirou                                                   | Faça login novamente para obter um novo token.                                                                                                                                    |
| O build falha ao baixar fontes                                     | Confirme se o ambiente de build consegue acessar o Google Fonts. O layout raiz usa `next/font/google`.                                                                            |
| O Playwright não encontra o navegador                              | Execute `npx playwright install chromium`. Em Linux, se faltarem bibliotecas do sistema, use `npx playwright install --with-deps chromium`.                                       |
| O Playwright não encontra talhão, parcela ou controles de cadastro | Confira os caminhos, o status da parcela e as permissões da conta na API de testes.                                                                                               |
| O contêiner continua chamando a API anterior                       | Refaça a imagem com o novo `--build-arg NEXT_PUBLIC_API_URL=...` e inicie um contêiner a partir dela.                                                                             |

## Contribuição e releases

1. Crie uma branch para a alteração.
2. Execute `npm run lint` e as verificações relevantes à mudança. Para testes E2E, use os dados isolados descritos acima.
3. Escreva a mensagem de commit e o título do pull request no formato Conventional Commits, por exemplo, `docs: documenta a configuração local`.
4. Abra um pull request com a descrição da mudança e as verificações realizadas.

O Husky executa o lint-staged no pre-commit e o Commitlint na validação da mensagem. O GitHub Actions verifica lint e segredos nos pull requests, valida títulos e roda a suíte E2E em pushes e pull requests nas branches `main` e `stage`.

Quando há commits que geram novas versões, o semantic-release publica releases estáveis na `main` e pré-releases `rc` na `stage`. O histórico de mudanças está no [CHANGELOG.md](CHANGELOG.md).

## Licença

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE).
