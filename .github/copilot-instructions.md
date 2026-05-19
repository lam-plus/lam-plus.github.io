# Copilot Instructions — LAM+ Website

Este repositório contém o site institucional bilíngue do LAM+ — Laboratório de Análise Multiespectral e Inteligência Artificial para Sedimentos, vinculado à Universidade Federal Fluminense.

O site deve ser desenvolvido com Jekyll e GitHub Pages, usando como referência estrutural o site do Observatório Oceanográfico, mas com identidade, conteúdo, organização e navegação próprios do LAM+.

## Objetivo geral

Construir um site institucional bilíngue, limpo, responsivo e fácil de manter para o LAM+, servindo como porta de entrada pública para:

- apresentação do laboratório;
- pessoas e comitês;
- submissão de amostras;
- protocolos;
- projetos;
- notícias;
- publicações;
- contato institucional.

## Base técnica

O site deve usar:

- Jekyll;
- GitHub Pages;
- HTML;
- CSS;
- JavaScript simples;
- Liquid;
- Markdown;
- coleções Jekyll;
- layouts reutilizáveis;
- includes reutilizáveis.

Evitar frameworks pesados, dependências complexas ou soluções que dificultem a manutenção por estudantes e equipe técnica.

## Repositório e deploy

- Repositório de desenvolvimento: `lam-plus/lam-plus2.github.io`
- URL de teste no GitHub Pages: `https://lam-plus.github.io/lam-plus2.github.io/`
- O `_config.yml` deve usar:

```yaml
url: "https://lam-plus.github.io"
baseurl: "/lam-plus2.github.io"
```

Não usar `baseurl: ""` em produção.

## Assets principais

| Elemento | Caminho |
|---|---|
| Logo principal | `assets/img/logo/lamplus-logo.png` |
| Vídeo hero | `assets/video/lamplus-hero.mp4` |
| Poster / fallback do hero | `assets/img/hero/hero-poster.jpg` |

Não usar nomes legados: `o2-bg.mp4`, `o2-bg.png`, `o2-logo-transp.png`, `hero-poster.png`.

Não usar `o2-lang`. A chave de idioma em `localStorage` é `lamplus-lang`.

## Relação com o site do Observatório

O site do LAM+ deve se inspirar na estrutura geral do site do Observatório Oceanográfico, especialmente em:

- uso de `_layouts/`;
- uso de `_includes/`;
- uso de coleções como `_people`, `_projects` e `_posts`;
- separação de conteúdo por idioma;
- menu bilíngue baseado em `page.lang`;
- alternância de idioma usando `page.alt_lang`;
- barra institucional;
- navegação superior;
- rodapé;
- vídeo ou imagem de fundo na página inicial;
- páginas internas com layout limpo.

No entanto, não copiar conteúdo textual específico do Observatório.

Substituir a lógica institucional do Observatório pela lógica própria do LAM+.

## Idiomas

O site deve ser bilíngue:

- Português: conteúdo em `/pt/` ou, quando aplicável, rotas principais em português.
- Inglês: conteúdo em `/en/`.

Todos os arquivos de conteúdo devem declarar o idioma no front matter:

```yaml
lang: pt
```

ou:

```yaml
lang: en
```

Sempre que houver página correspondente em outro idioma, usar:

```yaml
alt_lang: /en/caminho-equivalente/
```

ou:

```yaml
alt_lang: /pt/caminho-equivalente/
```

## Menu principal

O menu principal em português deve conter:

- Laboratório
- Submissão de Amostras
- Protocolos
- Projetos
- Notícias
- Publicações
- Contato

O menu principal em inglês deve conter:

- Laboratory
- Sample Submission
- Protocols
- Projects
- News
- Publications
- Contact

## Mudanças conceituais em relação ao Observatório

No site do Observatório existiam seções como “Sobre”, “Portfólio” e “Recursos”.

No LAM+, a lógica deve ser:

- “Sobre” passa a ser “Laboratório”.
- “Portfólio” é substituído por “Submissão de Amostras” e “Protocolos”.
- “Recursos” é substituído por “Projetos”.
- “Notícias” será mantido.
- “Publicações” será adicionado.
- “Contato” será mantido como contato institucional geral.

## Laboratório / Laboratory

A seção `Laboratório` deve apresentar:

- visão geral do LAM+;
- missão;
- escopo institucional;
- infraestrutura analítica;
- relação com a UFF;
- estrutura de governança;
- pessoas vinculadas ao laboratório.

A subseção `Pessoas` deve organizar a coleção `_people` por `role_key`, não por subpastas.

Não criar subpastas por categoria dentro de `_people`. Separar apenas por idioma:

```text
_people/
  pt/
  en/
```

Cada pessoa deve ter `role`, `role_key`, `order` e `lang`.

Exemplo em português:

```yaml
---
layout: academic_profile
lang: pt
title: Nome da Pessoa
role: Comitê Gestor
role_key: management
affiliation: Universidade Federal Fluminense
location: Niterói, RJ, Brasil
avatar: /assets/img/people/nome-da-pessoa.jpg
order: 10
permalink: /pt/laboratorio/pessoas/nome-da-pessoa/
alt_lang: /en/laboratory/people/person-name/
---
```

Exemplo em inglês:

```yaml
---
layout: academic_profile
lang: en
title: Person Name
role: Management Committee
role_key: management
affiliation: Universidade Federal Fluminense
location: Niterói, RJ, Brazil
avatar: /assets/img/people/person-name.jpg
order: 10
permalink: /en/laboratory/people/person-name/
alt_lang: /pt/laboratorio/pessoas/nome-da-pessoa/
---
```

## Role keys para pessoas

Usar os seguintes `role_key`:

```yaml
role_key: management
role_key: infrastructure
role_key: technical_staff
role_key: postdoc
role_key: phd
role_key: msc
role_key: undergraduate
role_key: collaborator
```

Rótulos em português:

- Comitê Gestor
- Comitê de Infraestrutura
- Técnicos
- Pós-docs
- Doutorandos
- Mestrandos
- Iniciação Científica
- Colaboradores

Rótulos em inglês:

- Management Committee
- Infrastructure Committee
- Technical Staff
- Postdoctoral Researchers
- PhD Students
- MSc Students
- Undergraduate Researchers
- Collaborators

## Submissão de Amostras / Sample Submission

A seção `Submissão de Amostras` deve explicar o fluxo público de submissão de amostras ao LAM+.

Deve incluir:

- quem pode submeter amostras;
- tipos de amostras aceitas;
- informações necessárias para cadastro;
- triagem técnica;
- etapas gerais do fluxo;
- preparação e recebimento;
- análise;
- processamento;
- entrega de dados;
- contato para dúvidas.

Não criar formulário funcional complexo sem solicitação explícita.

Não inventar regras definitivas, prazos, preços ou políticas operacionais ainda não validadas.

Usar placeholders quando necessário:

```text
[Inserir link do formulário]
[Inserir e-mail institucional]
[Inserir política de submissão]
```

## Protocolos / Protocols

A seção `Protocolos` deve reunir protocolos técnicos e operacionais.

Usar coleção:

```text
_protocols/
  pt/
  en/
```

Exemplo de front matter:

```yaml
---
layout: page
lang: pt
title: Protocolo de Recepção e Catalogação de Amostras
category: Recepção e catalogação
status: Em desenvolvimento
order: 10
permalink: /pt/protocolos/recepcao-e-catalogacao/
alt_lang: /en/protocols/sample-reception-and-cataloging/
---
```

Categorias recomendadas:

- Recepção e catalogação
- Preparação de amostras
- Imageamento hiperespectral
- XRF core scanning
- RGB e CIELab
- Radiografia sedimentar
- MSCL
- MEV-EDS
- Processamento de dados
- Controle de qualidade
- Inteligência artificial
- Segurança operacional

Em inglês:

- Sample reception and cataloging
- Sample preparation
- Hyperspectral imaging
- XRF core scanning
- RGB and CIELab
- Sedimentary radiography
- MSCL
- SEM-EDS
- Data processing
- Quality control
- Artificial intelligence
- Operational safety

## Projetos / Projects

A seção `Projetos` deve usar a coleção:

```text
_projects/
  pt/
  en/
```

Projetos devem usar preferencialmente o layout `project_profile`.

O projeto de criação e implantação do LAM+ deve permanecer sempre no topo da página de projetos, como projeto estruturante.

Quando houver novos projetos, eles devem ser inseridos abaixo desse bloco principal em uma seção intitulada `Outros projetos` em português e `Other projects` em inglês.

Essa seção deve manter o mesmo padrão visual dos cards/blocos do projeto principal, com texto curto, título claro, imagem quando houver, e sem inventar projetos, valores, prazos, resultados ou financiamentos.

Os novos projetos devem usar o mesmo padrão de front matter já adotado no repositório, com `layout: project_profile`, `lang`, `title`, `categories`, `tags`, `status`, `period`, `contact_email`, `header.overlay_image`, `order`, `permalink` e `alt_lang`, sempre respeitando a estrutura bilíngue existente.

Exemplo em português:

```yaml
---
layout: project_profile
lang: pt
title: Nome do Projeto
categories:
  - Paleoclima
  - Inteligência Artificial
tags:
  - XRF
  - HSI
  - Sedimentos
status: Em andamento
period: 2026–
contact_email: [Inserir e-mail]
header:
  overlay_image: /assets/img/projects/nome-do-projeto/hero.jpg
  overlay_filter: 0.4
order: 10
permalink: /pt/projetos/nome-do-projeto/
alt_lang: /en/projects/project-name/
---
```

Exemplo em inglês:

```yaml
---
layout: project_profile
lang: en
title: Project Name
categories:
  - Paleoclimate
  - Artificial Intelligence
tags:
  - XRF
  - HSI
  - Sediments
status: Ongoing
period: 2026–
contact_email: [Insert email]
header:
  overlay_image: /assets/img/projects/project-name/hero.jpg
  overlay_filter: 0.4
order: 10
permalink: /en/projects/project-name/
alt_lang: /pt/projetos/nome-do-projeto/
---
```

## Notícias / News

Manter seção de notícias usando `_posts`.

Separar por idioma:

```text
_posts/
  pt/
  en/
```

Exemplo:

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

## Publicações / Publications

Criar coleção:

```text
_publications/
  pt/
  en/
```

Exemplo:

```yaml
---
layout: page
lang: pt
title: Título da publicação
authors: Autor A; Autor B; Autor C
year: 2026
journal: Nome do periódico
doi: 10.xxxx/xxxxx
order: 10
permalink: /pt/publicacoes/titulo-da-publicacao/
alt_lang: /en/publications/publication-title/
---
```

Não inventar publicações. Usar placeholders quando necessário.

## Contato / Contact

A página `Contato` deve ser simples e institucional.

Deve conter:

- nome do laboratório;
- vínculo institucional;
- endereço/campus, se informado;
- e-mail institucional, se informado;
- links oficiais;
- orientação para submissão de amostras;
- orientação para contato técnico ou institucional.

Não inventar e-mails, telefones ou endereços.

## Identidade textual

Usar tom:

- institucional;
- acadêmico;
- claro;
- objetivo;
- técnico quando necessário;
- acessível para usuários externos.

Evitar:

- linguagem publicitária exagerada;
- excesso de adjetivos;
- promessas operacionais não validadas;
- frases genéricas;
- emojis;
- informações sem fonte.

## Identidade conceitual

LAM+ significa:

```text
Laboratório de Análise Multiespectral e Inteligência Artificial para Sedimentos
```

Em inglês:

```text
Laboratory for Multispectral Analysis and Artificial Intelligence for Sediments
```

O LAM+ deve ser apresentado como uma plataforma multiusuária dedicada à análise de alta resolução de sequências sedimentares, integrando técnicas ópticas, espectrais, geoquímicas, físicas e ferramentas de inteligência artificial.

Temas centrais:

- sequências sedimentares;
- análise não destrutiva;
- alta resolução;
- imageamento hiperespectral;
- XRF core scanning;
- RGB e CIELab;
- radiografia sedimentar;
- MSCL;
- MEV-EDS;
- banco de dados;
- protocolos operacionais;
- inteligência artificial;
- machine learning;
- deep learning;
- análise multiproxy;
- paleoclima;
- mudanças climáticas;
- eventos extremos;
- colaboração interinstitucional;
- capacitação de recursos humanos.

## Arquitetura visual

Usar como inspiração:

- barra institucional superior;
- cabeçalho limpo;
- menu principal;
- seletor PT/EN;
- hero section na página inicial com vídeo de fundo e texto sobreposto;
- cards para seções principais abaixo do hero;
- páginas internas claras;
- rodapé institucional;
- responsividade para celular.

### Hero da página inicial

O hero deve ter:

- Vídeo de fundo via `_includes/video-background.html` (arquivo: `assets/video/lamplus-hero.mp4`).
- Poster/fallback: `assets/img/hero/hero-poster.jpg`.
- Texto sobreposto ao vídeo dentro da classe `.hero-content`.

Não usar `hero-poster.png`, salvo se explicitamente solicitado.

### Conteúdo abaixo do hero

Usar `.page-shell` como contêiner de conteúdo principal e cards para as seções principais do site.

A estrutura atual do site usa includes como:

```text
head.html
institutional-bar.html
navigation.html
video-background.html
footer.html
analytics.html
```

Adaptar esses arquivos para o LAM+.

Substituir referências do Observatório por LAM+.

Substituir:

```text
Observatório Oceanográfico
```

por:

```text
LAM+
```

ou:

```text
Laboratório de Análise Multiespectral e Inteligência Artificial para Sedimentos
```

conforme o contexto.

Nomes legados que não devem aparecer no código:

```text
o2-lang          → lamplus-lang
o2-logo-transp.png → assets/img/logo/lamplus-logo.png
o2-bg.mp4        → assets/video/lamplus-hero.mp4
o2-bg.png        → assets/img/hero/hero-poster.jpg
hero-poster.png  → NÃO USAR (usar hero-poster.jpg)
```

## Regra de conteúdo institucional

Não alterar conteúdo institucional (missão, visão, descrição do laboratório, nomes de seções, textos de cards) sem consultar:

```text
docs_context/content_pt.md
docs_context/content_en.md
```

## Arquivos de contexto

Consultar os arquivos em `docs_context/` antes de criar ou alterar conteúdo:

```text
docs_context/model_context.md
docs_context/site_structure.md
docs_context/visual_reference.md
docs_context/content_pt.md
docs_context/content_en.md
```

Esses arquivos devem ser tratados como fonte preferencial de contexto do projeto.

## Estrutura esperada

```text
assets/
  css/
  img/
    hero/
    logo/
    people/
    infraestrutura/
    equipamentos/
    projetos/
    noticias/
  js/
  video/

_includes/
_layouts/
_pages/
  pt/
  en/

_people/
  pt/
  en/

_projects/
  pt/
  en/

_protocols/
  pt/
  en/

_publications/
  pt/
  en/

_posts/
  pt/
  en/

_templates/
docs_context/
.github/
```

## Boas práticas Jekyll

- Usar front matter YAML em todas as páginas.
- Usar `lang`.
- Usar `alt_lang` quando houver versão equivalente.
- Usar `permalink` explícito.
- Usar `order` para ordenação.
- Usar `role_key`, `category` e `status` para filtragem.
- Evitar URLs com acentos.
- Usar slugs em minúsculas e com hífens.
- Criar includes reutilizáveis.
- Criar layouts específicos apenas quando necessário.
- Evitar duplicação de HTML.
- Manter CSS centralizado em `assets/css/main.css` ou arquivo equivalente.
- Manter JavaScript simples em `assets/js/`.

## Segurança e privacidade

Nunca adicionar:

- senhas;
- tokens;
- chaves de API;
- dados administrativos internos;
- dados sensíveis de amostras;
- informações pessoais não públicas;
- documentos privados;
- dados embargados;
- contratos;
- processos internos.

Quando necessário, usar placeholders claros:

```text
[Inserir e-mail institucional]
[Inserir endereço]
[Inserir nome do projeto]
[Inserir responsável]
[Inserir link]
```

## Desenvolvimento incremental

Ao modificar o site:

1. Ajustar `_config.yml`.
2. Ajustar `_includes`.
3. Ajustar `_layouts`.
4. Criar páginas principais.
5. Criar coleções.
6. Criar exemplos mínimos de conteúdo.
7. Ajustar CSS.
8. Testar localmente.
9. Publicar no GitHub Pages.

Evitar reescrever todo o site em uma única alteração.
