<div align="center">

# 🧟 ZOMBIE+

### Automação de testes · Playwright · JavaScript

**Os zumbis ficam no catálogo. Os bugs entram na mira dos testes.**

Testes end-to-end para a fila de espera, autenticação e gestão de filmes e séries de TV do Zombie+.

![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Projeto de estudos desenvolvido durante o curso da **QAx**.

**22 cenários em 4 frentes de teste** &nbsp; · &nbsp; **Page Object Model** &nbsp; · &nbsp; **Dados via API e SQL**

[Cenários](#cenarios) · [Novidades](#novidades) · [Arquitetura](#arquitetura) · [Massa de teste](#massa-de-teste) · [Instalação](#instalacao) · [Execução](#execucao) · [Relatórios](#relatorios)

</div>

---

## 🎯 Sobre o projeto

Este repositório reúne os testes automatizados do **Zombie+**, contemplando a fila de espera, a autenticação administrativa e o gerenciamento de filmes e séries de TV. O objetivo é praticar validações de interface, preparação de dados por API e acesso ao banco de dados em testes end-to-end.

A organização utiliza **Page Object Model (POM)** para separar as ações de interface dos cenários, além de fixtures personalizadas do Playwright para disponibilizar páginas e componentes aos testes.

> [!NOTE]
> **Projeto em evolução.** Os cenários acompanham o aprendizado do curso. Consulte o [estado atual](#estado-atual) para conhecer a última validação registrada e os limites da cobertura.

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

<a id="cenarios"></a>

## 🧪 Cenários implementados

| Funcionalidade | Quantidade | Cenários presentes |
| --- | --- | --- |
| [Fila de espera](tests/e2e/leads.spec.js) | 6 | Cadastro válido, e-mail duplicado, e-mail inválido, nome vazio, e-mail vazio e ambos os campos vazios |
| [Login administrativo](tests/e2e/login.spec.js) | 6 | Login válido, senha incorreta, e-mail inválido, e-mail vazio, senha vazia e ambos os campos vazios |
| [Filmes](tests/e2e/movies.spec.js) | 5 | Cadastro, remoção, título duplicado, campos obrigatórios e busca pelo termo “zumbi” |
| [Séries de TV](tests/e2e/tvshows.spec.js) | 5 | Cadastro, remoção, título duplicado, campos obrigatórios e busca pelo termo “zumbi” |

No cenário de e-mail duplicado, uma requisição à API cria o lead antes da tentativa pela interface. Nos testes de filmes e séries, a API prepara os registros necessários para os cenários de remoção, duplicidade e busca.

As séries incluem o campo **Temporadas**. O teste de campos vazios verifica os cinco alertas, incluindo `Campo obrigatório (apenas números)`. Após cadastrar ou remover uma série, os testes fecham o popup e verificam sua presença ou ausência na listagem.

A busca de séries começa com três registros: dois com “zumbi” no título e um sem o termo. O teste confere a lista inicial e depois exige exatamente os dois resultados esperados, verificando também a exclusão do registro que não corresponde à busca.

<a id="novidades"></a>

## ✨ Novidades desde a última edição

- **Filmes:** ampliação de um cenário de cadastro para cinco cenários de gerenciamento e busca.
- **Séries de TV:** nova suíte com cinco cenários, actions próprias, massa JSON e preparação via `postTvShow()`.
- **Autenticação da API:** chamada explícita a `request.api.setToken()` antes de preparar filmes e séries.
- **Diagnóstico de falhas:** status HTTP e corpo da resposta nas asserções de consulta de empresas e cadastro; mensagem específica quando a empresa não é encontrada.
- **Massa consistente:** campo `release_year` padronizado e nome `Sony Pictures` alinhado ao cadastro usado pela API no cenário de duplicidade.
- **Preparação assíncrona:** uso de `for...of` com `await` para aguardar todos os cadastros antes de navegar e buscar.
- **Limpeza por cenário:** `beforeEach` nas suítes de filmes e séries para evitar conflitos de títulos entre testes.
- **Conexões SQL:** `executeSQL()` retorna as linhas consultadas, encerra o pool em `finally` e propaga erros para o teste.
- **Componentes compartilhados:** `page.popup.haveText()` valida mensagens e `page.popup.close()` fecha o popup antes de verificar a listagem.

<a id="arquitetura"></a>

## 🧩 Como a automação se conecta

```mermaid
flowchart LR
    Specs["Cenários E2E"] --> Fixtures["Fixtures do Playwright"]
    Fixtures --> Pages["Actions e Popup"]
    Pages --> Web["Zombie+ · Interface"]
    Web --> API["Zombie+ · API"]
    Specs -->|"Prepara lead por HTTP"| API
    Fixtures --> Client["request.api"]
    Client -->|"Autentica e prepara filmes e séries"| API
    Specs --> SQL["executeSQL"]
    SQL -->|"Limpa filmes ou séries antes de cada teste"| DB[(PostgreSQL)]
    API --> DB
```

| Camada | Responsabilidade | Onde encontrar |
| --- | --- | --- |
| Cenários | Descrever ações e resultados esperados de cada fluxo | [`tests/e2e`](tests/e2e) |
| Actions / Page Objects | Centralizar seletores, interações e validações de página | [`tests/actions`](tests/actions) |
| Popup | Validar mensagens e fechar o diálogo | [`Components.js`](tests/actions/Components.js) |
| Fixtures do Playwright | Disponibilizar `page.leads`, `page.login`, `page.movies`, `page.tvshows`, `page.popup` e `request.api` | [`tests/support/index.js`](tests/support/index.js) |
| Cliente da API | Obter token, consultar empresas e cadastrar filmes e séries para os testes | [`tests/support/api/index.js`](tests/support/api/index.js) |
| Dados de teste | Definir os registros, o termo de busca e os resultados esperados | [`movies.json`](tests/support/fixtures/movies.json) e [`tvshows.json`](tests/support/fixtures/tvshows.json) |
| Banco de dados | Executar SQL e encerrar a conexão após cada chamada | [`database.js`](tests/support/database.js) |

Essa separação permite ajustar uma interação de tela no Page Object e reutilizá-la nos cenários que dependem dela.

## 📁 Estrutura do projeto

```text
zombieplus/
├── tests/
│   ├── e2e/
│   │   ├── leads.spec.js          # Fila de espera
│   │   ├── login.spec.js          # Autenticação administrativa
│   │   ├── movies.spec.js         # Cadastro, remoção, validações e busca de filmes
│   │   └── tvshows.spec.js        # Cadastro, remoção, validações e busca de séries
│   ├── actions/
│   │   ├── Components.js         # Validação e fechamento do popup
│   │   ├── Leads.js              # Página inicial e formulário de leads
│   │   ├── Login.js              # Login e validação do usuário autenticado
│   │   ├── Movies.js             # Área administrativa de filmes
│   │   └── TvShows.js            # Área administrativa de séries
│   └── support/
│       ├── api/
│       │   └── index.js          # Autenticação, empresas, filmes e séries
│       ├── fixtures/
│       │   ├── covers/movies/    # Imagens usadas nos formulários
│       │   ├── movies.json       # Massa de filmes
│       │   └── tvshows.json      # Massa de séries
│       ├── database.js           # Conexão PostgreSQL e execução de SQL
│       └── index.js              # Fixtures personalizadas do Playwright
├── .gitignore
├── package-lock.json
├── package.json
├── playwright.config.js
└── README.md
```

<a id="massa-de-teste"></a>

## 🗂️ Massa de teste e preparação

Os arquivos JSON seguem a mesma organização:

| Entrada | Uso |
| --- | --- |
| `create` | Cadastro pela interface |
| `to_remove` | Registro criado pela API para remover pela interface |
| `duplicate` | Registro criado pela API antes de tentar cadastrar o mesmo título |
| `search.input` | Termo usado na busca |
| `search.data` | Registros cadastrados pela API antes da busca |
| `search.outputs` | Títulos esperados após filtrar |

Filmes e séries usam `title`, `overview`, `company`, `release_year` e `featured`. Séries também exigem `seasons`. Nos cadastros pela interface, `cover` indica o arquivo a partir de `tests/support/fixtures`; os helpers de cadastro pela API preparam os registros sem enviar capa.

A massa de séries contém títulos fictícios e reutiliza `covers/movies/wwz.png` para testar o upload. Não é necessário baixar capas adicionais para os cenários atuais. As empresas indicadas nos JSONs precisam existir no banco; a massa de séries utiliza `Netflix`.

Exemplo de preparação usado nos testes:

```js
const tvshows = data.search

await request.api.setToken()

for (const tvshow of tvshows.data) {
    await request.api.postTvShow(tvshow)
}
```

`setToken()` autentica em `/sessions` e armazena o Bearer token na instância de `Api` daquele teste. O login pela interface é uma etapa separada. `getCompanyByName()` resolve o nome da empresa para seu ID antes de enviar os dados em `multipart`; o Playwright monta o cabeçalho desse envio.

Antes de cada cenário, `movies.spec.js` executa `DELETE FROM movies` e `tvshows.spec.js` executa `DELETE FROM tvshows`. Essa limpeza remove **todos os registros da respectiva tabela** e deve ser usada em um banco dedicado aos testes. Cada teste prepara os dados de que precisa.

A configuração mantém os testes de cada arquivo em sequência (`fullyParallel: false`). Evite executar a mesma suíte simultaneamente contra o mesmo banco: a limpeza de um teste pode remover a massa de outro. Adicionar projetos de navegador ou paralelismo dentro do arquivo exige rever essa estratégia de isolamento.

<a id="instalacao"></a>

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

> [!IMPORTANT]
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

<a id="execucao"></a>

## ▶️ Executando os testes

Execute os comandos a partir da raiz **deste repositório de testes**, com a aplicação e o banco disponíveis.

**Primeira execução?** Confira os quatro pontos abaixo:

- [ ] PostgreSQL iniciado e banco `zombieplus` preparado.
- [ ] API disponível em `localhost:3333`.
- [ ] Frontend disponível em `localhost:3000`.
- [ ] Dependências e Chromium instalados no projeto de testes.

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
npx playwright test tests/e2e/tvshows.spec.js
```

Para executar os dois catálogos em sequência:

```bash
npx playwright test tests/e2e/movies.spec.js tests/e2e/tvshows.spec.js --workers=1
```

Para conferir os cenários descobertos sem executá-los:

```bash
npx playwright test --list
```

Para filtrar pelo nome de um teste:

```bash
npx playwright test -g "deve cadastrar um lead na fila de espera"
```

<a id="relatorios"></a>

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
- **`fullyParallel: false`**: testes de um mesmo arquivo em sequência; arquivos diferentes ainda podem usar workers distintos.

O servidor da aplicação deve ser iniciado manualmente: a opção `webServer` está comentada. As URLs locais estão definidas nas actions, no cliente da API e no teste de preparação de leads. `baseURL` também permanece comentado.

Para exibir apenas o progresso e o resultado no terminal, use `--reporter=line`. Essa opção substitui o relatório HTML naquela execução.

Os diretórios `playwright-report/`, `test-results/` e `node_modules/` são ignorados pelo Git.

<a id="estado-atual"></a>

## ✅ Estado atual

O projeto contém **22 testes em 4 arquivos**, confirmados com `npx playwright test --list` em **28/09/2026**.

Na validação local da implementação de séries, em **28/09/2026**, os **10 testes de filmes e séries passaram** no Chromium, com um worker:

```bash
npx playwright test tests/e2e/movies.spec.js tests/e2e/tvshows.spec.js --workers=1 --reporter=line
```

Esse resultado se refere aos dois catálogos; os testes de leads e login não fizeram parte dessa execução. A listagem de 22 testes confirma sua descoberta, não a aprovação da suíte inteira.

As pendências anteriores de nomenclatura foram resolvidas: o login utiliza `isLoggedIn()` e o cadastro de filmes recebe `create(movie)`. A estrutura atual de Page Objects está em `tests/actions`.

A cobertura atual utiliza apenas Chromium. Firefox, WebKit e perfis móveis continuam comentados na configuração. A aplicação, os dados iniciais de empresas e o administrador precisam estar disponíveis no ambiente local.

## 💡 Problemas comuns

<details>
<summary><strong>Comandos, caminhos e terminais no Windows</strong></summary>

| Sintoma | O que verificar |
| --- | --- |
| Git Bash não encontra `C:\QAx\...` | Use o formato `/c/QAx/...` nos comandos `cd`. |
| `no configuration file provided` | Execute o Compose na pasta da aplicação que contém `docker-compose.yml`. |
| PowerShell bloqueia `npm.ps1` | Use `npm.cmd` e `npx.cmd` no lugar de `npm` e `npx`. |

</details>

<details>
<summary><strong>Aplicação, API e conexão com o banco</strong></summary>

| Sintoma | O que verificar |
| --- | --- |
| Navegador não abre a aplicação | Confira se o frontend está iniciado na porta 3000. |
| Requisições à API falham | Confira se a API está iniciada na porta 3333 e consegue acessar o banco. |
| Conexão PostgreSQL recusada | Verifique o Docker, o contêiner e o mapeamento da porta 5432. |
| Banco ou tabela inexistente | Prepare a estrutura e os dados iniciais seguindo as instruções da aplicação. |
| `401 — Token not provided` | Chame `await request.api.setToken()` antes de usar `postMovie()` ou `postTvShow()`. |
| Empresa não encontrada | Confira o campo `company` da massa e os nomes cadastrados em `/companies`. |
| `409 — This content is already registered` | Verifique títulos repetidos na própria massa, a limpeza do `beforeEach` e execuções simultâneas no mesmo banco. |
| Erro ao montar o `multipart` | Confira se os campos estão definidos; o ano usa `release_year` e séries também exigem `seasons`. |
| Teste termina durante o preparo da massa | Aguarde as requisições com `for...of` e `await`; `forEach(async ...)` não aguarda os cadastros. |
| Tabela não encontrada após mensagem de sucesso | Feche o diálogo com `await page.popup.close()` antes de validar a listagem por papel. |

</details>

---

<div align="center">

**Do primeiro clique à preparação do banco.**

Um projeto para praticar automação e tornar o comportamento da aplicação verificável.

🧟 &nbsp; JavaScript · Playwright · PostgreSQL

</div>
