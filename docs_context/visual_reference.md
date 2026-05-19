# Visual Reference — LAM+

Este documento registra decisões visuais e de estrutura de interface do site do LAM+.

Serve como referência para implementação de layouts, includes e CSS.

## Repositório e URL de teste

- Repositório: `lam-plus/lam-plus2.github.io`
- URL de teste: `https://lam-plus.github.io/lam-plus2.github.io/`

## Assets de identidade visual

| Elemento | Caminho |
|---|---|
| Logo principal | `assets/img/logo/lamplus-logo.png` |
| Vídeo hero | `assets/video/lamplus-hero.mp4` |
| Poster / fallback do vídeo | `assets/img/hero/hero-poster.jpg` |

Não usar `hero-poster.png`, `o2-bg.mp4`, `o2-bg.png` ou `o2-logo-transp.png`.

## Estrutura visual da página inicial

A página inicial (`/pt/` e `/en/`) é composta por duas regiões principais:

### 1. Hero section

- Vídeo de fundo montado via `_includes/video-background.html`.
- Overlay escuro sobre o vídeo para garantir legibilidade.
- Texto sobreposto ao vídeo, dentro da classe `.hero-content`.
- Fallback: imagem `assets/img/hero/hero-poster.jpg` para dispositivos que bloqueiam autoplay ou que usam `prefers-reduced-motion`.
- O hero não deve ser tratado como background fixo da página inteira. Ele deve ser uma seção de banner no topo, com vídeo limitado à área do hero e texto sobreposto.

Estrutura HTML mínima:

```html
<section class="hero-section">
  {% include video-background.html %}
  <div class="hero-content">
    <h1>LAM+</h1>
    <p><!-- tagline --></p>
  </div>
</section>
```

### 2. Conteúdo abaixo do hero

- Usar `.page-shell` como contêiner de conteúdo principal.
- Cards das seções do site (Laboratório, Submissão de Amostras, Protocolos, Projetos, Notícias, Publicações, Contato).

```html
<section class="page-shell">
  <div class="cards-grid">
    <!-- cards das seções -->
  </div>
</section>
```

## Páginas internas

Páginas internas não usam hero com vídeo.

O layout padrão para páginas internas é `page.html`, que herda de `default.html`.

O conteúdo fica dentro de `.page-shell`.

## Includes de estrutura

| Include | Função |
|---|---|
| `head.html` | Meta tags, CSS, redirecionamento de idioma |
| `institutional-bar.html` | Faixa superior com vínculo UFF |
| `navigation.html` | Menu bilíngue PT/EN |
| `video-background.html` | Vídeo de fundo do hero |
| `footer.html` | Rodapé institucional |
| `analytics.html` | Analytics (desativado no scaffold inicial) |

## Redirecionamento de idioma

Chave em `localStorage`:

```javascript
lamplus-lang
```

Valores válidos: `'pt'` ou `'en'`.

Não usar `o2-lang` ou qualquer outro nome legado.

## Nomenclatura de classes CSS

Usar prefixo ou identidade semântica LAM+, sem prefixos legados do Observatório.

Classes principais esperadas:

| Classe | Uso |
|---|---|
| `.institutional-bar` | Faixa institucional superior |
| `.main-nav` | Barra de navegação |
| `.nav-brand` | Logo/nome do laboratório no menu |
| `.nav-menu` | Lista de itens do menu |
| `.nav-lang` | Alternador PT/EN |
| `.hero-section` | Região do hero com vídeo |
| `.hero-content` | Texto sobreposto ao vídeo |
| `.bg-video` | Elemento `<video>` de fundo |
| `.bg-overlay` | Overlay escuro sobre o vídeo |
| `.page-shell` | Contêiner de conteúdo principal |
| `.cards-grid` | Grade de cards das seções |
| `.site-footer` | Rodapé |

## Responsividade

O layout deve ser responsivo para celular.

O menu hamburger é ativado abaixo de `960px` via `.nav-toggle` e `.nav-menu.open`.

## Referência estrutural

O site usa como referência de estrutura o Observatório Oceanográfico (`_reference/observatorio/`), mas não reproduz conteúdo, identidade ou nomenclatura do Observatório.

Toda identidade visual, textual e de nomenclatura é própria do LAM+.
