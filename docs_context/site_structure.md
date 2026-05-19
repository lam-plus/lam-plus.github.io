# Site Structure — LAM+

Este documento define a estrutura de diretórios, coleções, páginas e rotas do site institucional bilíngue do LAM+.

O site será desenvolvido em Jekyll e publicado via GitHub Pages.

## Estrutura geral

```text
lam-plus2.github.io/
├── .github/
│   └── copilot-instructions.md
├── docs_context/
│   ├── model_context.md
│   ├── site_structure.md
│   ├── visual_reference.md
│   ├── content_pt.md
│   └── content_en.md
├── assets/
│   ├── css/
│   │   └── main.css
│   ├── img/
│   │   ├── hero/
│   │   ├── logo/
│   │   ├── people/
│   │   ├── infraestrutura/
│   │   ├── equipamentos/
│   │   ├── projetos/
│   │   └── noticias/
│   ├── js/
│   │   └── menu.js
│   └── video/
├── _includes/
│   ├── analytics.html
│   ├── footer.html
│   ├── head.html
│   ├── institutional-bar.html
│   ├── navigation.html
│   └── video-background.html
├── _layouts/
│   ├── default.html
│   ├── page.html
│   ├── academic_profile.html
│   └── project_profile.html
├── _pages/
│   ├── pt/
│   │   ├── laboratorio/
│   │   ├── submissao-de-amostras/
│   │   ├── protocolos/
│   │   ├── projetos/
│   │   ├── noticias/
│   │   ├── publicacoes/
│   │   └── contato/
│   └── en/
│       ├── laboratory/
│       ├── sample-submission/
│       ├── protocols/
│       ├── projects/
│       ├── news/
│       ├── publications/
│       └── contact/
├── _people/
│   ├── pt/
│   └── en/
├── _projects/
│   ├── pt/
│   └── en/
├── _protocols/
│   ├── pt/
│   └── en/
├── _publications/
│   ├── pt/
│   └── en/
├── _posts/
│   ├── pt/
│   └── en/
├── _templates/
├── _config.yml
├── index.html
└── README.md
```

## Páginas principais em português

```text
_pages/pt/laboratorio/index.md
_pages/pt/laboratorio/pessoas.md
_pages/pt/submissao-de-amostras/index.md
_pages/pt/protocolos/index.md
_pages/pt/projetos/index.md
_pages/pt/noticias/index.md
_pages/pt/publicacoes/index.md
_pages/pt/contato/index.md
```

## Páginas principais em inglês

```text
_pages/en/laboratory/index.md
_pages/en/laboratory/people.md
_pages/en/sample-submission/index.md
_pages/en/protocols/index.md
_pages/en/projects/index.md
_pages/en/news/index.md
_pages/en/publications/index.md
_pages/en/contact/index.md
```

## Rotas públicas em português

```text
/pt/
/pt/laboratorio/
/pt/laboratorio/pessoas/
/pt/submissao-de-amostras/
/pt/protocolos/
/pt/projetos/
/pt/noticias/
/pt/publicacoes/
/pt/contato/
```

## Rotas públicas em inglês

```text
/en/
/en/laboratory/
/en/laboratory/people/
/en/sample-submission/
/en/protocols/
/en/projects/
/en/news/
/en/publications/
/en/contact/
```

## Repositório e deploy

Repositório de desenvolvimento:

```text
https://github.com/lam-plus/lam-plus2.github.io
```

URL de teste no GitHub Pages:

```text
https://lam-plus.github.io/lam-plus2.github.io/
```

Configurações obrigatórias em `_config.yml`:

```yaml
url: "https://lam-plus.github.io"
baseurl: "/lam-plus2.github.io"
```

Não usar `baseurl: ""` em produção; essa configuração quebra todos os caminhos de assets e links.

## Assets principais

| Finalidade | Caminho |
|---|---|
| Logo principal | `assets/img/logo/lamplus-logo.png` |
| Vídeo hero | `assets/video/lamplus-hero.mp4` |
| Poster / fallback do hero | `assets/img/hero/hero-poster.jpg` |

Não usar nomes legados como `o2-bg.mp4`, `o2-bg.png`, `o2-logo-transp.png` ou `hero-poster.png`.

## Página inicial

A raiz `/` redireciona automaticamente para `/pt/` ou `/en/` com base no idioma do navegador.

A lógica de idioma usa `navigator.language`, mas permite escolha manual pelo usuário.

Chave de idioma em `localStorage`:

```javascript
lamplus-lang
```

Não usar chaves antigas como:

```javascript
o2-lang
```

### Estrutura da home

A página `/pt/` e `/en/` deve ter:

1. Hero com vídeo de fundo e texto sobreposto, usando a classe `hero-content`.
2. Conteúdo abaixo do hero usando `.page-shell` e cards das seções principais.

Estrutura HTML mínima do hero:

```html
<section class="hero-section">
  <!-- vídeo montado via _includes/video-background.html -->
  <div class="hero-content">
    <h1>LAM+</h1>
    <p><!-- tagline --></p>
  </div>
</section>

<section class="page-shell">
  <!-- cards das seções -->
</section>
```

Não usar `.hero-poster.png` como poster, salvo se explicitamente solicitado.

## Coleção `_people`

Separar por idioma, não por função:

```text
_people/
  pt/
  en/
```

A função da pessoa deve ser determinada por front matter:

```yaml
role: Comitê Gestor
role_key: management
```

Campos recomendados:

```yaml
---
layout: academic_profile
lang: pt
title: Nome da Pessoa
role: Comitê Gestor
role_key: management
affiliation: Universidade Federal Fluminense
affiliation_url:
location: Niterói, RJ, Brasil
avatar: /assets/img/people/nome-da-pessoa.jpg
email:
orcid:
lattes:
scholar:
github:
scopus:
order: 10
permalink: /pt/laboratorio/pessoas/nome-da-pessoa/
alt_lang: /en/laboratory/people/person-name/
---
```

## Coleção `_projects`

Separar por idioma:

```text
_projects/
  pt/
  en/
```

Campos recomendados:

```yaml
---
layout: project_profile
lang: pt
title: Nome do Projeto
categories:
  - Categoria
tags:
  - Tema
status: Em andamento
period: 2026–
contact_email:
header:
  overlay_image: /assets/img/projects/nome-do-projeto/hero.jpg
  overlay_filter: 0.4
order: 10
permalink: /pt/projetos/nome-do-projeto/
alt_lang: /en/projects/project-name/
---
```

## Coleção `_protocols`

Separar por idioma:

```text
_protocols/
  pt/
  en/
```

Campos recomendados:

```yaml
---
layout: page
lang: pt
title: Nome do Protocolo
category: Categoria do protocolo
status: Em desenvolvimento
order: 10
permalink: /pt/protocolos/nome-do-protocolo/
alt_lang: /en/protocols/protocol-name/
---
```

## Coleção `_publications`

Separar por idioma:

```text
_publications/
  pt/
  en/
```

Campos recomendados:

```yaml
---
layout: page
lang: pt
title: Título da publicação
authors: Autor A; Autor B; Autor C
year: 2026
journal:
doi:
url:
order: 10
permalink: /pt/publicacoes/titulo-da-publicacao/
alt_lang: /en/publications/publication-title/
---
```

## Coleção `_posts`

Separar notícias por idioma:

```text
_posts/
  pt/
  en/
```

Formato de arquivo:

```text
YYYY-MM-DD-slug-da-noticia.md
```

Campos recomendados:

```yaml
---
layout: page
lang: pt
title: Título da notícia
date: 2026-04-28
category: noticias
permalink: /pt/noticias/2026/04/28/titulo-da-noticia/
alt_lang: /en/news/2026/04/28/news-title/
---
```

## Includes esperados

O site deve usar includes reutilizáveis:

```text
head.html
institutional-bar.html
navigation.html
video-background.html
footer.html
analytics.html
```

Esses includes devem ser adaptados do Observatório para o LAM+.

## Layouts esperados

O site deve usar layouts reutilizáveis:

```text
default.html
page.html
academic_profile.html
project_profile.html
```

Layouts adicionais podem ser criados apenas se necessário:

```text
protocol_profile.html
publication_profile.html
```

No início, `page.html` pode ser suficiente para protocolos e publicações.

## Menu

O menu deve ser controlado por `page.lang`.

Português:

```text
Laboratório
  Pessoas
Submissão de Amostras
Protocolos
Projetos
Notícias
Publicações
Contato
```

Inglês:

```text
Laboratory
  People
Sample Submission
Protocols
Projects
News
Publications
Contact
```

## Alternância de idioma

Usar `page.alt_lang` para alternância PT/EN.

Quando `page.alt_lang` existir, o link deve apontar para a versão equivalente.

Quando não existir, usar fallback:

- português → `/en/`
- inglês → `/pt/` ou `/`

## Arquivos que não devem ser copiados

Não copiar a pasta `_site`.

A pasta `_site` é saída gerada pelo Jekyll e não deve ser editada diretamente.

## Nomenclatura

Usar nomes de arquivos e URLs:

- sem acentos;
- em minúsculas;
- com hífens;
- claros e curtos.

Exemplos:

```text
submissao-de-amostras
sample-submission
comite-gestor
management-committee
imageamento-hiperespectral
hyperspectral-imaging
```

## Configuração Jekyll recomendada

O `_config.yml` deve declarar as coleções principais do LAM+:

```yaml
collections:
  pages:
    output: true
  people:
    output: true
  projects:
    output: true
  protocols:
    output: true
  publications:
    output: true
```

Defaults recomendados:

```yaml
defaults:
  - scope:
      path: ""
    values:
      layout: default

  - scope:
      type: pages
    values:
      layout: page

  - scope:
      type: people
    values:
      layout: academic_profile

  - scope:
      type: projects
    values:
      layout: project_profile

  - scope:
      type: protocols
    values:
      layout: page

  - scope:
      type: publications
    values:
      layout: page
```

Plugins recomendados:

```yaml
plugins:
  - jekyll-feed
  - jekyll-sitemap
```

## Observações de migração a partir do Observatório

Arquivos conceitualmente reaproveitáveis:

```text
_layouts/default.html
_layouts/page.html
_layouts/academic_profile.html
_layouts/project_profile.html

_includes/head.html
_includes/institutional-bar.html
_includes/navigation.html
_includes/footer.html
_includes/video-background.html
```

Arquivos a adaptar fortemente:

```text
_includes/navigation.html
_includes/head.html
_includes/footer.html
_includes/analytics.html
_includes/video-background.html
```

Substituições importantes:

```text
Observatório Oceanográfico → LAM+
o2-lang            → lamplus-lang
o2-logo-transp.png → assets/img/logo/lamplus-logo.png
o2-bg.mp4          → assets/video/lamplus-hero.mp4
o2-bg.png          → assets/img/hero/hero-poster.jpg
hero-poster.png    → NÃO USAR (usar hero-poster.jpg)
Portfólio          → Submissão de Amostras + Protocolos
Recursos           → Projetos
Sobre              → Laboratório
```

## Configuração Jekyll recomendada

O `_config.yml` deve usar:

```yaml
url: "https://lam-plus.github.io"
baseurl: "/lam-plus2.github.io"
```

## Primeiro ciclo de implementação

Ordem recomendada:

1. Configurar `_config.yml` com `url` e `baseurl` corretos.
2. Criar `_includes/head.html`.
3. Criar `_includes/navigation.html`.
4. Criar `_includes/footer.html`.
5. Criar `_layouts/default.html`.
6. Criar `_layouts/page.html`.
7. Criar página inicial com hero + cards.
8. Criar páginas principais em português.
9. Criar páginas principais em inglês.
10. Criar coleção `_people`.
11. Criar coleção `_projects`.
12. Criar coleção `_protocols`.
13. Criar coleção `_publications`.
14. Ajustar CSS.
15. Testar na URL: https://lam-plus.github.io/lam-plus2.github.io/
