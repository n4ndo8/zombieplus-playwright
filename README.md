<div align="center">

# 🧟 Zombie+ | Automação de Testes

**Testes end-to-end para uma aplicação de catálogo de filmes com temática zumbi.**

![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Projeto de estudos em automação de testes, desenvolvido durante o curso da QAx.

[Cenários](#-cenários-implementados) • [Instalação](#-instalação) • [Execução](#-executando-os-testes) • [Estrutura](#-estrutura-do-projeto)

</div>

---

## 🎯 Sobre o projeto

Este repositório reúne os testes automatizados do **Zombie+**, contemplando a fila de espera, a autenticação administrativa e o cadastro de filmes. O objetivo é praticar validações de interface, preparação de dados por API e acesso ao banco de dados em testes end-to-end.

A organização utiliza **Page Object Model (POM)** para separar as ações de interface dos cenários, além de fixtures personalizadas do Playwright para disponibilizar páginas e componentes aos testes.

> **Em desenvolvimento:** os cenários estão sendo construídos e ajustados durante o curso. A presença de um cenário no repositório não significa que ele esteja passando.

## 🛠️ Tecnologias

| Tecnologia | Uso no projeto |
| --- | --- |
| JavaScript e Node.js | Linguagem e ambiente de execução |
| Playwright Test | Automação de navegador, asserções e requisições HTTP |
| Chromium | Navegador habilitado na configuração atual |
| Faker | Geração de nomes e e-mails para os testes de leads |
| PostgreSQL e `pg` | Execução de SQL para preparação dos dados |
| Docker Compose | Inicialização do banco e do pgAdmin no ambiente local da aplicação |
| Relatório HTML | Consulta dos resultados das execuções |

## 🧪 Cenários implementados

| Funcionalidade | Cenários presentes |
| --- | --- |
| Fila de espera | Cadastro válido, e-mail duplicado, e-mail inválido, nome vazio, e-mail vazio e ambos os campos vazios |
| Login administrativo | Login válido, senha incorreta, e-mail inválido, e-mail vazio, senha vazia e ambos os campos vazios |
| Filmes | Cadastro de um novo filme com preparação prévia no banco |

No cenário de e-mail duplicado, uma requisição à API cria o lead antes da tentativa pela interface. No cadastro de filmes, uma instrução SQL remove o registro com o título da fixture antes da execução.

O arquivo de dados contém outros filmes para expansão dos testes; atualmente, o cenário de cadastro utiliza a entrada `create`.

## 📁 Estrutura do projeto

```text
zombieplus/
├── tests/
│   ├── e2e/
│   │   ├── leads.spec.js          # Fila de espera
│   │   ├── login.spec.js          # Autenticação administrativa
│   │   └── movies.spec.js         # Cadastro de filmes
│   ├── pages/
│   │   ├── Components.js         # Componente de notificações toast
│   │   ├── LandingPage.js        # Página inicial e formulário de leads
│   │   ├── LoginPage.js          # Formulário de login
│   │   └── MoviesPage.js         # Área administrativa de filmes
│   └── support/
│       ├── fixtures/
│       │   └── movies.json       # Dados dos filmes
│       ├── database.js           # Conexão PostgreSQL e execução de SQL
│       └── index.js              # Fixtures personalizadas do Playwright
├── .gitignore
├── package-lock.json
├── package.json
├── playwright.config.js
└── README.md
```

## 📦 Instalação

Pré-requisitos:

- Node.js e npm compatíveis com as dependências do projeto. O ambiente consultado utiliza Node.js 24.
- Git para clonar o repositório.
- Aplicação Zombie+ disponibilizada pelo curso: frontend, API e banco preparado.
- Docker Desktop iniciado, caso utilize o PostgreSQL via Docker.

Após clonar este repositório, entre na pasta e instale as dependências e o navegador:

```bash
cd zombieplus
npm ci
npx playwright install chromium
```

> Este repositório contém a automação. O frontend, a API e o `docker-compose.yml` da aplicação são mantidos separadamente e precisam estar disponíveis para executar os testes.

## 🚀 Iniciando a aplicação local

Os exemplos abaixo usam **Git Bash no Windows** e a aplicação instalada em `C:\QAx\apps\zombieplus`. Ajuste os caminhos conforme seu ambiente.

### 1. Banco de dados

Com o Docker Desktop em execução:

```bash
cd /c/QAx/apps/zombieplus
docker compose up -d
```

O Compose local inicia PostgreSQL e pgAdmin. O banco `zombieplus`, suas tabelas e os dados iniciais devem estar preparados conforme as instruções da aplicação fornecida no curso. Subir os contêineres, por si só, não garante essa preparação.

### 2. API

Em outro terminal:

```bash
cd /c/QAx/apps/zombieplus/api
npm run dev
```

### 3. Frontend

Em mais um terminal:

```bash
cd /c/QAx/apps/zombieplus/web
npm run dev
```

Mantenha os terminais da API e do frontend abertos durante os testes.

| Serviço | Endereço local |
| --- | --- |
| Aplicação | http://localhost:3000 |
| Login administrativo | http://localhost:3000/admin/login |
| API | http://localhost:3333 |
| PostgreSQL | `localhost:5432` |
| pgAdmin | http://localhost:16543 |

### Conexão com o banco

A configuração atual está em [`tests/support/database.js`](tests/support/database.js):

```js
const DbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'zombieplus',
    password: 'pwd123',
    port: 5432
}
```

Esses valores correspondem ao ambiente local de estudos. Os testes utilizam o administrador `admin@zombieplus.com`, com a senha `pwd123`, que deve existir na aplicação.

Quando os testes rodam diretamente no Windows, o host do banco é `localhost`. Para acessar o PostgreSQL pelo pgAdmin na mesma rede do Compose, o host é `database`, nome do serviço.

O ambiente utiliza PostgreSQL local e não depende do ElephantSQL. Atualmente, a conexão é definida no código; o projeto de testes não carrega essas configurações de um arquivo `.env`.

## ▶️ Executando os testes

Execute os comandos a partir da raiz **deste repositório de testes**, com a aplicação e o banco disponíveis.

```bash
# Executar todos os cenários
npx playwright test

# Executar com o navegador visível
npx playwright test --headed

# Abrir o modo interativo
npx playwright test --ui

# Depurar um cenário de teste
npx playwright test tests/e2e/leads.spec.js --debug
```

Para executar por funcionalidade:

```bash
npx playwright test tests/e2e/leads.spec.js
npx playwright test tests/e2e/login.spec.js
npx playwright test tests/e2e/movies.spec.js
```

Para filtrar pelo nome de um teste:

```bash
npx playwright test -g "deve cadastrar um lead na fila de espera"
```

## 📊 Relatórios e configuração

Depois de uma execução, abra o relatório HTML:

```bash
npx playwright show-report
```

A configuração em [`playwright.config.js`](playwright.config.js) utiliza:

- **Chromium** com o perfil Desktop Chrome.
- **Relatório HTML** dos resultados.
- **Duas novas tentativas em CI** e nenhuma nova tentativa automática localmente.
- **Trace na primeira nova tentativa**, quando ela ocorrer.
- **Um worker em CI**; localmente, a quantidade segue o padrão do Playwright.

O servidor da aplicação deve ser iniciado manualmente: a opção `webServer` está comentada. As URLs locais estão definidas nos Page Objects e no teste que prepara dados pela API.

Os diretórios `playwright-report/`, `test-results/` e `node_modules/` são ignorados pelo Git.

## 🚧 Estado atual

Há ajustes pendentes no fluxo de login e de filmes:

- Alinhar as chamadas de verificação de login com os métodos disponíveis nos Page Objects (`isLoggedin` e `isLoggedIn`).
- Alinhar a chamada `create(movie)` com os parâmetros atualmente recebidos por `MoviesPage.create`.
- Revisar seletores e mensagens esperadas conforme a interface da aplicação.

Esses pontos podem impedir a conclusão dos cenários correspondentes e fazem parte da evolução da automação.

## 💡 Problemas comuns

| Sintoma | O que verificar |
| --- | --- |
| Git Bash não encontra `C:\QAx\...` | Use o formato `/c/QAx/...` nos comandos `cd`. |
| `no configuration file provided` | Execute o Compose na pasta da aplicação que contém `docker-compose.yml`. |
| PowerShell bloqueia `npm.ps1` | Use `npm.cmd` e `npx.cmd` no lugar de `npm` e `npx`. |
| Navegador não abre a aplicação | Confira se o frontend está iniciado na porta 3000. |
| Requisições à API falham | Confira se a API está iniciada na porta 3333 e consegue acessar o banco. |
| Conexão PostgreSQL recusada | Verifique o Docker, o contêiner e o mapeamento da porta 5432. |
| Banco ou tabela inexistente | Prepare a estrutura e os dados iniciais seguindo as instruções da aplicação. |

---

<div align="center">

🧟 **Zombie+ — praticando qualidade de software, um cenário por vez.**

</div>
