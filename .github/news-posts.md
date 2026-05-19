# Instruções para criação de notícias/posts do LAM+

## Objetivo

Criar ou atualizar notícias/posts do site do LAM+ com um estilo limpo, simples, profissional e visualmente consistente com o restante do site.

As notícias devem servir para registrar atividades, atualizações, treinamentos, chegada de equipamentos, submissão de amostras, reuniões, eventos, publicações, parcerias e avanços técnicos do LAM+.

## Estilo geral

- Usar linguagem institucional, clara e direta.
- Evitar textos longos demais.
- Priorizar informação objetiva.
- Não usar tom exageradamente publicitário.
- Não usar excesso de adjetivos.
- Não transformar notícias curtas em artigos longos.
- Manter o visual limpo e arejado.
- Sempre que possível, usar apenas uma imagem principal.
- Posts podem ter mais imagens no corpo do Markdown quando fizer sentido, mas o card da notícia deve usar apenas uma imagem destacada.

## Estrutura recomendada para cada notícia

Cada post deve conter:

1. Título claro.
2. Data.
3. Imagem principal.
4. Resumo curto para aparecer no card.
5. Texto principal com 2 a 5 parágrafos curtos.
6. Quando necessário, links internos ou externos.
7. Versão em português e versão em inglês, respeitando a estrutura bilíngue do site.

## Template obrigatório

Ao criar uma nova notícia, usar como base o arquivo:

```text
.github/templates/news-post-template.md
```

O Copilot deve adaptar o front matter ao padrão real dos posts existentes no site.

Se o projeto usar campos diferentes de `layout`, `title`, `date`, `lang`, `ref`, `excerpt` ou `image`, seguir o padrão existente e não inventar novos campos.

Antes de criar novos posts, o Copilot deve verificar a estrutura atual do projeto e identificar:

- onde os posts existentes estão armazenados;
- qual é o padrão de nome dos arquivos;
- quais campos de front matter são usados;
- como o card de notícia lê imagem, título, data e resumo;
- como o site conecta versões em português e inglês, se houver conexão por `ref`, `translation_key`, `lang`, `permalink` ou outro campo.

## Imagem principal

Cada notícia deve ter uma imagem principal associada.

Regras:

- Usar preferencialmente uma imagem horizontal ou quadrada.
- Evitar imagens muito pesadas.
- Usar nomes de arquivos simples, sem espaços e sem acentos.
- Usar nomes em minúsculas, com hífens.
- Exemplo:

```text
assets/img/news/2026-05-lamplus-sample-submission.jpg
```

A imagem principal deve ser usada no front matter do post, conforme o padrão já existente no site.

Se o site usa `image`, `thumbnail`, `cover` ou outro campo no front matter, seguir exatamente o padrão existente nos posts anteriores.

Não inventar um novo padrão de front matter se já houver um padrão no projeto.

## Cards de notícia

Os cards de notícia devem ser simples.

Cada card deve mostrar preferencialmente:

- imagem principal;
- título;
- data;
- resumo curto;
- botão ou link discreto para leitura completa.

O card não deve ficar carregado de texto.

O resumo deve ter no máximo 1 ou 2 frases.

## Texto do post

A estrutura sugerida para o corpo da notícia é:

```md
## Resumo

Parágrafo curto explicando o acontecimento principal.

## Contexto

Parágrafo explicando por que isso é relevante para o LAM+.

## Próximos passos

Parágrafo opcional indicando continuidade, próximos desenvolvimentos ou relação com outras atividades do laboratório.
```

Nem todos os posts precisam ter esses subtítulos. Para notícias muito curtas, usar apenas parágrafos simples.

## Tamanho recomendado

Posts curtos:

- 150 a 300 palavras.

Posts médios:

- 300 a 600 palavras.

Evitar posts acima de 800 palavras, exceto quando forem comunicados técnicos, relatórios ou notícias especiais.

## Versão em português

A versão em português deve ser natural, clara e institucional.

Evitar traduções literais do inglês.

Exemplo de tom:

> O LAM+ iniciou uma nova etapa de organização do fluxo de submissão de amostras, com a criação de uma página dedicada às orientações gerais para cadastro, triagem técnica e definição dos fluxos analíticos.

## Versão em inglês

A versão em inglês deve ser equivalente à versão em português, mas não precisa ser tradução literal.

Usar linguagem profissional e objetiva.

Termos recomendados:

- sample submission;
- sample registration;
- technical screening;
- analytical workflow;
- hyperspectral imaging;
- XRF core scanning;
- sediment imaging;
- laboratory workflow;
- data integration;
- artificial intelligence.

## Front matter

Antes de criar ou editar posts, verificar o padrão dos posts existentes.

Não inventar novos campos se o site já usa um padrão.

Exemplo genérico, apenas se for compatível com o projeto:

```yaml
---
layout: post
title: "Título da notícia"
date: 2026-05-18
lang: pt
ref: sample-submission
excerpt: "Resumo curto da notícia para o card."
image: "/assets/img/news/2026-05-sample-submission.jpg"
---
```

Para a versão em inglês:

```yaml
---
layout: post
title: "News title"
date: 2026-05-18
lang: en
ref: sample-submission
excerpt: "Short summary for the news card."
image: "/assets/img/news/2026-05-sample-submission.jpg"
---
```

A chave `ref` deve ser igual nas versões em português e inglês quando o site usar esse padrão para conectar idiomas.

## Organização de arquivos

Seguir a estrutura existente do site.

Antes de criar novos arquivos, verificar se os posts ficam em uma destas estruturas:

```text
_posts/
pt/_posts/
en/_posts/
collections/_posts/
```

Ou outra estrutura já usada pelo projeto.

Não mover posts existentes sem necessidade.

## Nome dos arquivos

Usar o padrão Jekyll, se aplicável:

```text
YYYY-MM-DD-titulo-curto.md
```

Exemplo em português:

```text
2026-05-18-submissao-de-amostras-lamplus.md
```

Exemplo em inglês:

```text
2026-05-18-sample-submission-lamplus.md
```

## Uso de imagens dentro do post

A regra geral é usar uma imagem principal.

Imagens adicionais podem ser usadas no corpo do Markdown somente quando agregarem informação real, por exemplo:

- sequência de montagem de equipamento;
- foto de treinamento;
- exemplo de amostra;
- fluxo de trabalho;
- detalhe técnico relevante.

Não inserir galerias grandes em posts simples.

Quando houver imagens adicionais, usar Markdown simples:

```md
![Descrição curta da imagem](/assets/img/news/nome-da-imagem.jpg)
```

Sempre usar texto alternativo descritivo.

## Links

Quando houver link para formulário, página técnica, publicação, notícia externa ou repositório, usar links claros.

Exemplo:

```md
[Formulário de cadastro de amostras](https://forms.gle/87G18ALxJ6aqz6Fq8)
```

Evitar colar URLs longas diretamente no texto.

## Conteúdo que deve ser evitado

Não incluir:

- promessas de prazo;
- preços;
- garantias de aceite de amostra;
- informações sensíveis;
- dados pessoais sem autorização;
- fotos de pessoas sem necessidade;
- logos de instituições sem contexto;
- texto excessivamente promocional;
- linguagem informal demais.

## Notícias sobre equipamentos

Quando a notícia for sobre equipamento, mencionar:

- nome do equipamento;
- função geral;
- relevância para o LAM+;
- tipo de dado ou análise que será possível;
- estado atual: instalação, treinamento, calibração, operação assistida ou operação regular.

Evitar criar especificações técnicas extensas no post. Detalhes técnicos devem ir em páginas de equipamentos ou protocolos.

## Notícias sobre amostras

Quando a notícia for sobre submissão ou fluxo de amostras, deixar claro que:

- o cadastro é uma etapa inicial;
- o envio do formulário não implica aceite automático;
- a equipe fará triagem técnica;
- o fluxo analítico depende do tipo de amostra, equipamento e viabilidade.

## Notícias sobre parcerias

Quando a notícia envolver parceiros, mencionar:

- instituição parceira;
- natureza da colaboração;
- objetivo geral;
- relação com as linhas de atuação do LAM+.

Não atribuir compromissos formais sem confirmação.

## Resultado esperado

Ao criar ou atualizar uma notícia, o Copilot deve:

1. Seguir o padrão de posts já existente no projeto.
2. Usar como base o template `.github/templates/news-post-template.md`.
3. Criar versão em português e inglês quando o site exigir.
4. Usar apenas uma imagem principal no card.
5. Manter o texto curto, limpo e institucional.
6. Usar resumo curto no front matter.
7. Não alterar a estrutura global do site sem solicitação explícita.
8. Ao final, listar os arquivos criados ou modificados.
