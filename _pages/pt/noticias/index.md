---
layout: page
lang: pt
title: Notícias
permalink: /pt/noticias/
alt_lang: /en/news/
---

<section class="page-shell">
	<h1>Notícias</h1>
	<p>Acompanhe atualizações sobre atividades, infraestrutura e avanços técnicos do LAM+.</p>

	{% assign news_posts_pt = site.posts | where: 'lang', 'pt' | where: 'category', 'noticias' | sort: 'date' | reverse %}

	{% if news_posts_pt and news_posts_pt.size > 0 %}
		<div class="card-grid">
			{% for post in news_posts_pt %}
				<article class="card news-card">
					<div class="news-card-header">
						{% if post.image %}
							<a class="news-card-thumb" href="{{ post.url | relative_url }}" aria-label="Abrir notícia: {{ post.title }}">
								<img class="news-card-image" src="{{ post.image | relative_url }}" alt="{{ post.title }}" />
							</a>
						{% endif %}
						<div class="news-card-meta">
							<h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
							<p class="news-card-date"><strong>{{ post.date | date: '%d/%m/%Y' }}</strong></p>
						</div>
					</div>
					{% if post.excerpt %}
						<p>{{ post.excerpt }}</p>
					{% endif %}
					<p><a href="{{ post.url | relative_url }}">Ler notícia</a></p>
				</article>
			{% endfor %}
		</div>
	{% else %}
		<p>Em breve, novas atualizações serão publicadas.</p>
	{% endif %}
</section>
