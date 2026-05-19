---
layout: page
lang: en
title: News
permalink: /en/news/
alt_lang: /pt/noticias/
---

<section class="page-shell">
	<h1>News</h1>
	<p>Follow updates on LAM+ activities, infrastructure, and technical progress.</p>

	{% assign news_posts_en = site.posts | where: 'lang', 'en' | where: 'category', 'news' | sort: 'date' | reverse %}

	{% if news_posts_en and news_posts_en.size > 0 %}
		<div class="card-grid">
			{% for post in news_posts_en %}
				<article class="card news-card">
					<div class="news-card-header">
						{% if post.image %}
							<a class="news-card-thumb" href="{{ post.url | relative_url }}" aria-label="Open news post: {{ post.title }}">
								<img class="news-card-image" src="{{ post.image | relative_url }}" alt="{{ post.title }}" />
							</a>
						{% endif %}
						<div class="news-card-meta">
							<h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
							<p class="news-card-date"><strong>{{ post.date | date: '%Y-%m-%d' }}</strong></p>
						</div>
					</div>
					{% if post.excerpt %}
						<p>{{ post.excerpt }}</p>
					{% endif %}
					<p><a href="{{ post.url | relative_url }}">Read post</a></p>
				</article>
			{% endfor %}
		</div>
	{% else %}
		<p>New updates will be published soon.</p>
	{% endif %}
</section>
