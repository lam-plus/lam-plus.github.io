---
layout: page
lang: en
title: People
permalink: /en/laboratory/people/
alt_lang: /pt/laboratorio/pessoas/
---

<section class="page-shell team-page">
	<header class="team-page-header">
		<h1>LAM+ Team</h1>
		<p class="team-intro">The LAM+ team brings together researchers, technical staff, students, and collaborators dedicated to multispectral analyses, high-resolution imaging, and artificial intelligence applied to the study of sediments and sedimentary sequences.</p>
	</header>

	<div id="team-groups" class="team-groups" aria-live="polite">
		<p class="team-loading">Loading team data...</p>
	</div>
</section>

<script src="https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js"></script>
<script>
(function () {
	var teamRoot = document.getElementById("team-groups");
	var siteBaseUrl = "{{ site.baseurl }}";
	if (!teamRoot) {
		return;
	}

	function resolveAssetUrl(path) {
		if (!path || typeof path !== "string") {
			return "";
		}
		var trimmed = path.trim();
		if (!trimmed) {
			return "";
		}
		if (/^(https?:)?\/\//i.test(trimmed) || /^(data|blob):/i.test(trimmed)) {
			return trimmed;
		}
		if (trimmed.charAt(0) === "/") {
			return (siteBaseUrl || "") + trimmed;
		}
		return (siteBaseUrl || "") + "/" + trimmed;
	}

	function toNumber(value, fallback) {
		var number = Number(value);
		return Number.isFinite(number) ? number : fallback;
	}

	function getInitials(name) {
		if (!name || typeof name !== "string") {
			return "??";
		}
		var parts = name.trim().split(/\s+/).filter(Boolean);
		if (!parts.length) {
			return "??";
		}
		return parts.slice(0, 2).map(function (part) {
			return part.charAt(0).toUpperCase();
		}).join("");
	}

	function buildLink(label, href) {
		if (!href || typeof href !== "string" || !href.trim()) {
			return null;
		}
		var link = document.createElement("a");
		link.className = "team-link";
		link.href = href.trim();
		link.target = "_blank";
		link.rel = "noopener noreferrer";
		link.textContent = label;
		return link;
	}

	function createMemberCard(person) {
		var card = document.createElement("article");
		card.className = "team-card";

		var media = document.createElement("div");
		media.className = "team-card-media";

		var fallback = document.createElement("div");
		fallback.className = "team-avatar-fallback";
		fallback.textContent = getInitials(person.name);
		fallback.hidden = true;

		if (person.photo && String(person.photo).trim()) {
			var img = document.createElement("img");
			img.src = resolveAssetUrl(String(person.photo));
			img.alt = person.name ? "Photo of " + person.name : "Team member photo";
			img.loading = "lazy";
			img.decoding = "async";
			img.addEventListener("error", function () {
				img.style.display = "none";
				fallback.hidden = false;
			});
			media.appendChild(img);
			media.appendChild(fallback);
		} else {
			fallback.hidden = false;
			media.appendChild(fallback);
		}

		var body = document.createElement("div");
		body.className = "team-card-body";

		if (person.name) {
			var name = document.createElement("h3");
			name.className = "team-card-name";
			name.textContent = person.name;
			body.appendChild(name);
		}

		if (person.role) {
			var role = document.createElement("p");
			role.className = "team-card-role";
			role.textContent = person.role;
			body.appendChild(role);
		}

		if (person.affiliation) {
			var affiliation = document.createElement("p");
			affiliation.className = "team-card-affiliation";
			affiliation.textContent = person.affiliation;
			body.appendChild(affiliation);
		}

		if (person.description) {
			var description = document.createElement("p");
			description.className = "team-card-description";
			description.textContent = person.description;
			body.appendChild(description);
		}

		var links = person.links && typeof person.links === "object" ? person.links : {};
		var linksRow = document.createElement("div");
		linksRow.className = "team-links";

		var linkItems = [
			buildLink("Lattes", links.lattes),
			buildLink("ORCID", links.orcid),
			buildLink("GitHub", links.github),
			buildLink("LinkedIn", links.linkedin)
		].filter(Boolean);

		if (linkItems.length) {
			linkItems.forEach(function (linkEl) {
				linksRow.appendChild(linkEl);
			});
			body.appendChild(linksRow);
		}

		card.appendChild(media);
		card.appendChild(body);
		return card;
	}

	function renderTeam(data) {
		var groups = Array.isArray(data.groups) ? data.groups.slice() : [];
		var people = Array.isArray(data.people) ? data.people.slice() : [];

		var activePeople = people.filter(function (person) {
			return person && person.active === true;
		});

		groups.sort(function (a, b) {
			return toNumber(a && a.order, 9999) - toNumber(b && b.order, 9999);
		});

		var fragment = document.createDocumentFragment();
		var renderedGroups = 0;

		groups.forEach(function (group) {
			if (!group || !group.id) {
				return;
			}

			var members = activePeople.filter(function (person) {
				return person && person.group === group.id;
			}).sort(function (a, b) {
				return toNumber(a && a.order, 9999) - toNumber(b && b.order, 9999);
			});

			if (!members.length) {
				return;
			}

			renderedGroups += 1;
			var groupSection = document.createElement("section");
			groupSection.className = "team-group";

			var heading = document.createElement("h2");
			heading.className = "team-group-title";
			heading.textContent = group.title || group.id;
			groupSection.appendChild(heading);

			var list = document.createElement("div");
			list.className = "team-list";

			members.forEach(function (person) {
				list.appendChild(createMemberCard(person));
			});

			groupSection.appendChild(list);
			fragment.appendChild(groupSection);
		});

		teamRoot.innerHTML = "";

		if (!renderedGroups) {
			teamRoot.innerHTML = "<p class=\"team-empty\">No active team members found at this time.</p>";
			return;
		}

		teamRoot.appendChild(fragment);
	}

	function showError() {
		teamRoot.innerHTML = "<p class=\"team-empty\">Unable to load team data right now.</p>";
	}

	if (!window.jsyaml || typeof window.jsyaml.load !== "function") {
		showError();
		return;
	}

	fetch("{{ site.baseurl }}/assets/data/team-en.yml", { cache: "no-store" })
		.then(function (response) {
			if (!response.ok) {
				throw new Error("Failed to load team-en.yml");
			}
			return response.text();
		})
		.then(function (yamlText) {
			var parsed = window.jsyaml.load(yamlText);
			renderTeam(parsed || {});
		})
		.catch(showError);
})();
</script>
