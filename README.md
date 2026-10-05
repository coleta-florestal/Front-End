# Coleta Florestal

Frontend da aplicação de Coleta Florestal, desenvolvida para digitalizar o processo de inventário florestal, desde o cadastro das amostras e coleta de dados em campo até a visualização dos resultados e geração de relatórios.

## Sobre o projeto

O sistema tem como objetivo centralizar e organizar as informações de inventários florestais, permitindo o registro dos dados coletados em campo e o acompanhamento das etapas de processamento e análise.

A aplicação foi planejada para utilização em desktop, tablet e dispositivos mobile, considerando principalmente o contexto de coleta em campo.

O fluxo principal da aplicação é:

```text
Login
  ↓
Amostras
  ↓
Parcelas
  ↓
Coleta de árvores
  ↓
Configuração do processamento
  ↓
Resultados
  ↓
Relatório
```

A estrutura da aplicação considera três objetos principais:

| Objeto    | Função                                  |
| --------- | --------------------------------------- |
| Amostra   | Inventário que está sendo trabalhado    |
| Parcela   | Unidade central da coleta               |
| Resultado | Dados processados utilizados na análise |

## Funcionalidades

### Acesso e usuários

* Login
* Primeiro acesso
* Recuperação de acesso
* Visualização e edição do perfil
* Controle de acesso conforme o perfil do usuário

### Amostras e parcelas

* Listagem de amostras
* Criação de amostras
* Edição de amostras
* Visualização dos detalhes da amostra
* Criação de parcelas
* Acompanhamento do status da amostra e da parcela
* Encerramento de parcelas
* Finalização da amostra

### Coleta de árvores

A coleta é realizada dentro de uma parcela. O usuário pode cadastrar e editar árvores enquanto a parcela estiver aberta.

As funcionalidades incluem:

* Cadastro de árvores
* Listagem de árvores
* Edição de árvores
* Validação dos dados coletados
* Classificação qualitativa

As classificações previstas são:

* Normal
* Danificada
* Doente
* Bifurcada
* Outros

### Processamento

Após a finalização da coleta, o usuário pode configurar o processamento do inventário.

A configuração contempla:

* Seleção da equação volumétrica
* Definição dos coeficientes
* Seleção do método de amostragem

O método previsto para o MVP é a amostragem inteiramente aleatória.

O frontend realiza a entrada e apresentação dessas informações. Os cálculos e regras de processamento são executados pelo backend.

### Resultados e análise

A tela de resultados apresenta os principais indicadores calculados para o inventário:

* Volume em m³/ha
* Volume médio
* Número de árvores
* Variância
* Desvio padrão
* Erro amostral
* Intervalo de confiança

Também estão previstas visualizações de:

* Volume por parcela
* Distribuição das classificações qualitativas

### Relatórios

A aplicação deve permitir a visualização e geração do relatório do inventário.

O formato definitivo do relatório ainda depende da especificação do projeto.

### Administração

A área administrativa possui as seguintes funcionalidades:

* Gestão de usuários
* Gestão de equações
* Configuração dos limites de validação
* Visualização dos registros de auditoria

## Perfis de acesso

### Coletor

O coletor pode:

* Criar e visualizar amostras
* Criar parcelas
* Registrar árvores
* Editar árvores enquanto a parcela estiver aberta
* Classificar árvores
* Encerrar parcelas
* Finalizar amostras
* Configurar o processamento
* Visualizar resultados
* Gerar relatórios

### Administrador

Além das funcionalidades disponíveis para o coletor, o administrador possui acesso a:

* Gerenciamento de usuários
* Visualização e correção de dados
* Configuração de equações
* Configuração de coeficientes
* Configuração de limites de validação
* Visualização da auditoria
* Administração de parâmetros do sistema

As permissões definitivas devem seguir as regras implementadas pelo backend.

## Arquitetura

O frontend é organizado em camadas para separar a interface da comunicação com a API.

```text
Pages
  ↓
Components
  ↓
Services / API Client
  ↓
Backend API
```

As páginas são responsáveis pela composição das telas, os componentes concentram elementos reutilizáveis e os services centralizam a comunicação com o backend.

As regras de negócio, persistência, cálculos, processamento, autorização e auditoria são responsabilidades do backend.

## Estrutura do projeto

A estrutura sugerida para o projeto é:

```text
src/
├── assets/
├── components/
│   ├── common/
│   ├── forms/
│   ├── tables/
│   ├── charts/
│   └── feedback/
├── pages/
│   ├── auth/
│   ├── samples/
│   ├── collection/
│   ├── processing/
│   ├── results/
│   ├── reports/
│   └── administration/
├── services/
│   ├── auth/
│   ├── samples/
│   ├── parcels/
│   ├── trees/
│   ├── processing/
│   ├── results/
│   └── administration/
├── hooks/
├── contexts/
├── routes/
├── types/
├── utils/
└── styles/
```

A estrutura pode ser adaptada de acordo com a stack e as decisões arquiteturais do projeto.

## Integração com o backend

A comunicação entre frontend e backend é realizada por meio de APIs.

O fluxo esperado para uma funcionalidade é:

```text
Interface
   ↓
Service / API Client
   ↓
Endpoint
   ↓
Regra de negócio
   ↓
Banco de dados
```

O frontend deve tratar os estados de:

* Carregamento
* Sucesso
* Erro
* Dados vazios

As validações realizadas no frontend têm como objetivo melhorar a experiência do usuário. As validações relacionadas às regras de negócio devem ser realizadas também pelo backend.

## Responsividade

A aplicação deve funcionar em:

* Desktop
* Tablet
* Mobile

A experiência mobile deve considerar principalmente o uso durante a coleta de dados em campo.

A interface deve priorizar campos de fácil preenchimento, botões acessíveis, informações essenciais e feedback imediato após as ações do usuário.

## Stack

A stack definitiva deve ser registrada nesta seção conforme as tecnologias adotadas no projeto.

Exemplo:

```text
Framework:
Linguagem:
Gerenciamento de estado:
Estilização:
Biblioteca de componentes:
Testes:
Gerenciador de pacotes:
```

## Instalação

### Pré-requisitos

* Node.js
* npm, yarn ou pnpm
* Git

### Clone do repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_REPOSITORIO>
```

### Instalação das dependências

Com npm:

```bash
npm install
```

Com yarn:

```bash
yarn
```

Com pnpm:

```bash
pnpm install
```

## Variáveis de ambiente

As configurações de ambiente devem ser definidas em um arquivo `.env`.

Exemplo:

```env
VITE_API_URL=http://localhost:3000
```

O nome da variável deve ser ajustado conforme a configuração da aplicação.

Arquivos contendo credenciais ou informações sensíveis não devem ser versionados.

## Execução

Para executar o projeto em ambiente de desenvolvimento:

```bash
npm run dev
```

Os demais comandos disponíveis podem ser consultados no `package.json`.

## Testes

As principais funcionalidades devem possuir testes, principalmente:

* Autenticação
* Criação e edição de amostras
* Criação e encerramento de parcelas
* Cadastro e edição de árvores
* Validação de formulários
* Classificação qualitativa
* Configuração do processamento
* Exibição dos resultados
* Controle de acesso administrativo

Os comandos de execução dos testes devem seguir a ferramenta adotada no projeto.

## Escopo do MVP

### Incluído

* Login
* Usuários
* Amostras
* Parcelas
* Árvores
* Validação de dados
* Classificação qualitativa
* Equações volumétricas
* Coeficientes
* Processamento
* Volume por árvore
* Volume por parcela
* Volume por hectare
* Estatísticas
* Dashboard
* Relatório
* Auditoria básica
* Responsividade para mobile e tablet

### Fora do escopo

Não fazem parte do MVP:

* GPS
* Mapas
* Inteligência Artificial
* Integrações externas
* Múltiplos métodos de amostragem

O funcionamento offline foi considerado como uma possibilidade no escopo, mas sua implementação depende de uma definição específica dos requisitos.

## Pontos pendentes

Alguns requisitos ainda precisam ser definidos antes da implementação definitiva:

* Equações volumétricas
* Formato dos coeficientes
* Limites de diâmetro
* Limites de altura
* Indicadores e gráficos obrigatórios
* Formato final do relatório
* Cálculo do erro amostral
* Cálculo do intervalo de confiança
* Permissões definitivas
* Requisitos de funcionamento offline

Esses parâmetros devem ser definidos pelo projeto e utilizados pelo frontend conforme os contratos estabelecidos com o backend.

## Status

| Item       | Status             |
| ---------- | ------------------ |
| Projeto    | Em desenvolvimento |
| Escopo     | MVP                |
| Plataforma | Web responsiva     |
| Frontend   | Em desenvolvimento |

## Repositório

Este repositório contém exclusivamente a aplicação frontend do Coleta Florestal.

Alterações relacionadas a banco de dados, regras de negócio, processamento, cálculos ou APIs devem ser realizadas no repositório correspondente ao backend.
