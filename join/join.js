/* ==========================================================================
   LAM+ Team Portal — join prototype logic
   Vanilla JS, no dependencies. Split into small, self-contained modules so
   pieces (photo handling, validation, data shaping) can be lifted as-is into
   lam-plus.github.io once a backend exists.

   Still no backend / Cloudflare / GitHub API in this step. The final button
   still downloads local files, but the code is organized so the handlers can
   later be swapped:
     downloadPayload(payload)      -> submitProfile(payload, photoBlob)
     downloadPhoto(blob, filename) -> (folded into submitProfile)
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */

  function $(id) {
    return document.getElementById(id);
  }

  function splitList(value) {
    return (value || "")
      .split(",")
      .map(function (item) { return item.trim(); })
      .filter(function (item) { return item.length > 0; });
  }

  function slugify(value) {
    return (value || "profile")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "profile";
  }

  function formatBytes(bytes) {
    return Math.round(bytes / 1024) + " KB";
  }

  /* ------------------------------------------------------------------ */
  /* Element references                                                  */
  /* ------------------------------------------------------------------ */

  var form = $("profile-form");

  var els = {
    photo: $("photo"),
    fullName: $("fullName"),
    email: $("email"),
    lattes: $("lattes"),
    orcid: $("orcid"),
    github: $("github"),
    linkedin: $("linkedin"),
    rolePt: $("rolePt"),
    affiliationPt: $("affiliationPt"),
    descriptionPt: $("descriptionPt"),
    areasPt: $("areasPt"),
    keywordsPt: $("keywordsPt"),
    roleEn: $("roleEn"),
    affiliationEn: $("affiliationEn"),
    descriptionEn: $("descriptionEn"),
    areasEn: $("areasEn"),
    keywordsEn: $("keywordsEn")
  };

  var preview = {
    langPtBtn: $("preview-lang-pt"),
    langEnBtn: $("preview-lang-en"),
    photo: $("preview-photo"),
    photoFallback: $("preview-photo-fallback"),
    initials: $("preview-initials"),
    name: $("preview-name"),
    role: $("preview-role"),
    affiliation: $("preview-affiliation"),
    description: $("preview-description"),
    areas: $("preview-areas"),
    email: $("preview-email"),
    links: {
      lattes: $("link-lattes"),
      orcid: $("link-orcid"),
      github: $("link-github"),
      linkedin: $("link-linkedin")
    }
  };

  var photoErrorEl = $("photo-error");
  var photoCropPanel = $("photo-crop-panel");
  var cropStageEl = $("crop-stage");
  var cropImageEl = $("crop-image");
  var cropZoomEl = $("crop-zoom");
  var photoMetaEl = $("photo-meta");

  var resultPanel = $("result-panel");
  var resultJson = $("result-json");
  var downloadJsonBtn = $("download-json");
  var downloadPhotoBtn = $("download-photo");
  var errorSummary = $("error-summary");
  var errorSummaryList = $("error-summary-list");
  var submitWorkerBtn = $("submit-worker");
  var submitStatusEl = $("submit-status");

  var state = {
    previewLang: "pt",
    processedPhoto: null, // { blob, width, height, size, previewUrl }
    lastPayload: null,
    isSubmitting: false
  };

  /* ------------------------------------------------------------------ */
  /* Photo processing — read → square crop → resize 800×800 → PNG blob   */
  /* Entirely local (canvas). No upload of any kind.                     */
  /* ------------------------------------------------------------------ */

  var ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
  var MAX_SOURCE_IMAGE_SIZE = 8 * 1024 * 1024; // 8 MB, original file selected by the user
  var OUTPUT_SIZE = 800;
  var MIN_OUTPUT_SIZE = 400;
  var MAX_PNG_BYTES = 1024 * 1024; // 1 MB, final PNG
  var CROP_DEBOUNCE_MS = 120;

  // Interactive crop state. Kept separate from the photo processing
  // pipeline itself so a fancier crop editor can replace only this part
  // later without touching processProfileImage()/renderSquarePng().
  var cropState = {
    img: null,
    naturalWidth: 0,
    naturalHeight: 0,
    baseScale: 1,
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
    updateTimer: null,
    generation: 0,
    imageObjectUrl: null
  };

  function initPhotoUpload() {
    els.photo.addEventListener("change", function () {
      photoErrorEl.textContent = "";
      els.photo.setAttribute("aria-invalid", "false");

      var file = els.photo.files && els.photo.files[0];
      if (!file) {
        resetPhotoState();
        return;
      }

      if (ALLOWED_PHOTO_TYPES.indexOf(file.type) === -1) {
        photoErrorEl.textContent = "Escolha uma imagem em JPG, PNG ou WEBP.";
        els.photo.setAttribute("aria-invalid", "true");
        els.photo.value = "";
        resetPhotoState();
        return;
      }

      if (file.size > MAX_SOURCE_IMAGE_SIZE) {
        photoErrorEl.textContent = "A imagem selecionada é muito grande. Utilize uma imagem de até 8 MB.";
        els.photo.setAttribute("aria-invalid", "true");
        els.photo.value = "";
        resetPhotoState();
        return;
      }

      loadImageForCrop(file);
    });
  }

  function resetPhotoState() {
    cropState.img = null;
    cropState.generation++;
    if (cropState.imageObjectUrl) {
      URL.revokeObjectURL(cropState.imageObjectUrl);
      cropState.imageObjectUrl = null;
    }
    if (state.processedPhoto && state.processedPhoto.previewUrl) {
      URL.revokeObjectURL(state.processedPhoto.previewUrl);
    }
    state.processedPhoto = null;
    photoCropPanel.hidden = true;
    photoMetaEl.hidden = true;
    renderPreview();
  }

  function loadImageForCrop(file) {
    var objectUrl = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      if (cropState.imageObjectUrl) {
        URL.revokeObjectURL(cropState.imageObjectUrl);
      }
      cropState.imageObjectUrl = objectUrl;
      initCropForImage(img);
    };
    img.onerror = function () {
      URL.revokeObjectURL(objectUrl);
      photoErrorEl.textContent = "Não foi possível ler esta imagem. Tente outro arquivo.";
    };
    img.src = objectUrl;
  }

  function stageSize() {
    return cropStageEl.clientWidth || 220;
  }

  function displayedSize() {
    var scale = cropState.baseScale * cropState.zoom;
    return {
      width: cropState.naturalWidth * scale,
      height: cropState.naturalHeight * scale,
      scale: scale
    };
  }

  // Cover-fit crop centered on the image is the default/fallback: it is
  // applied automatically as soon as an image loads, before any dragging.
  function initCropForImage(img) {
    photoCropPanel.hidden = false;
    var stage = stageSize();

    cropState.img = img;
    cropState.naturalWidth = img.naturalWidth;
    cropState.naturalHeight = img.naturalHeight;
    cropState.baseScale = Math.max(stage / img.naturalWidth, stage / img.naturalHeight);
    cropState.zoom = 1;
    cropZoomEl.value = "1";

    var d = displayedSize();
    cropState.offsetX = (stage - d.width) / 2;
    cropState.offsetY = (stage - d.height) / 2;

    cropImageEl.src = img.src;
    applyImageTransform();
    scheduleCropUpdate(true);
  }

  function clampOffset() {
    var d = displayedSize();
    var stage = stageSize();
    cropState.offsetX = Math.min(0, Math.max(stage - d.width, cropState.offsetX));
    cropState.offsetY = Math.min(0, Math.max(stage - d.height, cropState.offsetY));
  }

  function applyImageTransform() {
    var d = displayedSize();
    cropImageEl.style.width = d.width + "px";
    cropImageEl.style.height = d.height + "px";
    cropImageEl.style.left = cropState.offsetX + "px";
    cropImageEl.style.top = cropState.offsetY + "px";
  }

  function scheduleCropUpdate(immediate) {
    if (cropState.updateTimer) {
      window.clearTimeout(cropState.updateTimer);
      cropState.updateTimer = null;
    }
    if (immediate) {
      generateProcessedPhoto();
    } else {
      cropState.updateTimer = window.setTimeout(generateProcessedPhoto, CROP_DEBOUNCE_MS);
    }
  }

  function initCropInteractions() {
    cropStageEl.addEventListener("pointerdown", function (e) {
      if (!cropState.img) return;
      cropState.dragging = true;
      cropState.dragStartX = e.clientX;
      cropState.dragStartY = e.clientY;
      cropState.startOffsetX = cropState.offsetX;
      cropState.startOffsetY = cropState.offsetY;
      cropStageEl.setPointerCapture(e.pointerId);
      cropStageEl.classList.add("is-dragging");
    });

    cropStageEl.addEventListener("pointermove", function (e) {
      if (!cropState.dragging) return;
      cropState.offsetX = cropState.startOffsetX + (e.clientX - cropState.dragStartX);
      cropState.offsetY = cropState.startOffsetY + (e.clientY - cropState.dragStartY);
      clampOffset();
      applyImageTransform();
      scheduleCropUpdate(false);
    });

    function endDrag() {
      if (!cropState.dragging) return;
      cropState.dragging = false;
      cropStageEl.classList.remove("is-dragging");
      scheduleCropUpdate(true);
    }
    cropStageEl.addEventListener("pointerup", endDrag);
    cropStageEl.addEventListener("pointercancel", endDrag);
    cropStageEl.addEventListener("pointerleave", function () {
      if (cropState.dragging) endDrag();
    });

    cropZoomEl.addEventListener("input", function () {
      if (!cropState.img) return;
      var stage = stageSize();
      var oldD = displayedSize();
      // Keep the same visual center while zooming in/out.
      var centerFracX = (-cropState.offsetX + stage / 2) / oldD.width;
      var centerFracY = (-cropState.offsetY + stage / 2) / oldD.height;

      cropState.zoom = parseFloat(cropZoomEl.value) || 1;
      var newD = displayedSize();
      cropState.offsetX = -(centerFracX * newD.width - stage / 2);
      cropState.offsetY = -(centerFracY * newD.height - stage / 2);

      clampOffset();
      applyImageTransform();
      scheduleCropUpdate(false);
    });
  }

  // Reads the current crop viewport back into natural-pixel source
  // coordinates and hands off to renderSquarePng() for the actual
  // resize + PNG encode + size-budget pass.
  function generateProcessedPhoto() {
    if (!cropState.img) return;

    var stage = stageSize();
    var d = displayedSize();
    var sourceSize = stage / d.scale;
    var sourceX = -cropState.offsetX / d.scale;
    var sourceY = -cropState.offsetY / d.scale;

    sourceX = Math.max(0, Math.min(sourceX, cropState.naturalWidth - sourceSize));
    sourceY = Math.max(0, Math.min(sourceY, cropState.naturalHeight - sourceSize));

    var generation = ++cropState.generation;
    var img = cropState.img;

    renderSquarePng(img, sourceX, sourceY, sourceSize, OUTPUT_SIZE)
      .then(function (result) {
        if (!result || generation !== cropState.generation) return;
        setProcessedPhoto(result);
      })
      .catch(function () {
        photoErrorEl.textContent = "Não foi possível processar esta imagem.";
      });
  }

  // Draws the given square source region onto a canvas at `outSize`,
  // encodes it as PNG, and — if the result is over the 1 MB budget —
  // progressively shrinks the output dimension (staying 1:1, staying PNG)
  // until it fits or the minimum size is reached. Never falls back to
  // JPEG/WebP.
  function renderSquarePng(img, sx, sy, ssize, outSize) {
    return new Promise(function (resolve, reject) {
      function draw(size) {
        var canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        var ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("2d context unavailable"));
          return;
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, sx, sy, ssize, ssize, 0, 0, size, size);

        canvas.toBlob(function (blob) {
          if (!blob) {
            reject(new Error("PNG encode failed"));
            return;
          }
          if (blob.size > MAX_PNG_BYTES && size > MIN_OUTPUT_SIZE) {
            draw(Math.max(MIN_OUTPUT_SIZE, Math.round(size * 0.85)));
          } else {
            resolve({ blob: blob, width: size, height: size, size: blob.size });
          }
        }, "image/png");
      }
      draw(outSize);
    });
  }

  function setProcessedPhoto(result) {
    if (state.processedPhoto && state.processedPhoto.previewUrl) {
      URL.revokeObjectURL(state.processedPhoto.previewUrl);
    }
    state.processedPhoto = {
      blob: result.blob,
      width: result.width,
      height: result.height,
      size: result.size,
      previewUrl: URL.createObjectURL(result.blob)
    };
    refreshPhotoMeta();
    renderPreview();
  }

  function computePhotoFilename() {
    var name = els.fullName.value.trim();
    return name ? slugify(name) + ".png" : null;
  }

  function refreshPhotoMeta() {
    if (!state.processedPhoto) {
      photoMetaEl.hidden = true;
      return;
    }
    var filename = computePhotoFilename();
    var lines = [
      "<strong>Imagem preparada:</strong>",
      filename || "(defina o nome completo para gerar o nome do arquivo)",
      state.processedPhoto.width + " × " + state.processedPhoto.height + " px",
      "PNG",
      formatBytes(state.processedPhoto.size)
    ];
    photoMetaEl.innerHTML = lines.join("<br>");
    photoMetaEl.hidden = false;
  }

  /* ------------------------------------------------------------------ */
  /* Live preview                                                        */
  /* ------------------------------------------------------------------ */

  function initials(name) {
    var parts = (name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function renderLinkPill(anchor, url) {
    if (url) {
      anchor.href = url;
      anchor.hidden = false;
      anchor.classList.remove("team-card__link--muted");
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    } else {
      anchor.removeAttribute("href");
      anchor.hidden = true;
    }
  }

  function renderPreview() {
    var lang = state.previewLang;
    var name = els.fullName.value.trim();
    var role = (lang === "pt" ? els.rolePt.value : els.roleEn.value).trim();
    var affiliation = (lang === "pt" ? els.affiliationPt.value : els.affiliationEn.value).trim();
    var description = (lang === "pt" ? els.descriptionPt.value : els.descriptionEn.value).trim();
    var areas = splitList(lang === "pt" ? els.areasPt.value : els.areasEn.value);
    var email = els.email.value.trim();

    preview.name.textContent = name || "Seu nome";
    preview.role.textContent = role || (lang === "pt" ? "Função / cargo" : "Role / position");
    preview.affiliation.textContent = affiliation || (lang === "pt" ? "Afiliação" : "Affiliation");
    preview.description.textContent = description ||
      (lang === "pt"
        ? "Sua descrição breve aparecerá aqui."
        : "Your short description will appear here.");

    preview.areas.innerHTML = "";
    areas.forEach(function (area) {
      var tag = document.createElement("span");
      tag.className = "team-card__tag";
      tag.textContent = area;
      preview.areas.appendChild(tag);
    });

    // Once processing finishes, the preview always uses the final PNG —
    // never the raw original file.
    if (state.processedPhoto) {
      preview.photo.src = state.processedPhoto.previewUrl;
      preview.photo.hidden = false;
      preview.photo.alt = name ? "Foto de " + name : "Foto de perfil";
      preview.photoFallback.hidden = true;
    } else {
      preview.photo.hidden = true;
      preview.photo.removeAttribute("src");
      preview.photoFallback.hidden = false;
      preview.initials.textContent = initials(name);
    }

    renderLinkPill(preview.links.lattes, els.lattes.value.trim());
    renderLinkPill(preview.links.orcid, els.orcid.value.trim());
    renderLinkPill(preview.links.github, els.github.value.trim());
    renderLinkPill(preview.links.linkedin, els.linkedin.value.trim());

    if (email) {
      preview.email.textContent = email;
      preview.email.hidden = false;
    } else {
      preview.email.hidden = true;
    }
  }

  function initLivePreviewBindings() {
    var watched = [
      els.fullName, els.email, els.lattes, els.orcid, els.github, els.linkedin,
      els.rolePt, els.affiliationPt, els.descriptionPt, els.areasPt, els.keywordsPt,
      els.roleEn, els.affiliationEn, els.descriptionEn, els.areasEn, els.keywordsEn
    ];
    watched.forEach(function (el) {
      el.addEventListener("input", renderPreview);
    });
    // The generated photo filename is derived from the name, so keep the
    // discrete "imagem preparada" note in sync as the person types it.
    els.fullName.addEventListener("input", refreshPhotoMeta);
  }

  function initLanguageToggle() {
    function setLang(lang) {
      state.previewLang = lang;
      preview.langPtBtn.classList.toggle("is-active", lang === "pt");
      preview.langPtBtn.setAttribute("aria-pressed", String(lang === "pt"));
      preview.langEnBtn.classList.toggle("is-active", lang === "en");
      preview.langEnBtn.setAttribute("aria-pressed", String(lang === "en"));
      renderPreview();
    }
    preview.langPtBtn.addEventListener("click", function () { setLang("pt"); });
    preview.langEnBtn.addEventListener("click", function () { setLang("en"); });
  }

  /* ------------------------------------------------------------------ */
  /* Validation                                                          */
  /* ------------------------------------------------------------------ */

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function isValidUrl(value) {
    try {
      var url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (err) {
      return false;
    }
  }

  // Declarative field rules: id -> { label, required, kind }
  var FIELD_RULES = [
    { id: "fullName", label: "Nome completo", required: true, kind: "text" },
    { id: "email", label: "E-mail institucional / profissional", required: true, kind: "email" },
    { id: "lattes", label: "Currículo Lattes", required: false, kind: "url" },
    { id: "orcid", label: "ORCID", required: false, kind: "url" },
    { id: "github", label: "GitHub", required: false, kind: "url" },
    { id: "linkedin", label: "LinkedIn", required: false, kind: "url" },
    { id: "rolePt", label: "Função / cargo (PT)", required: true, kind: "text" },
    { id: "affiliationPt", label: "Afiliação (PT)", required: true, kind: "text" },
    { id: "descriptionPt", label: "Descrição breve (PT)", required: true, kind: "text" },
    { id: "areasPt", label: "Áreas de atuação (PT)", required: true, kind: "list" },
    { id: "keywordsPt", label: "Palavras-chave (PT)", required: true, kind: "list" },
    { id: "roleEn", label: "Role / position (EN)", required: true, kind: "text" },
    { id: "affiliationEn", label: "Affiliation (EN)", required: true, kind: "text" },
    { id: "descriptionEn", label: "Short description (EN)", required: true, kind: "text" },
    { id: "areasEn", label: "Areas of activity (EN)", required: true, kind: "list" },
    { id: "keywordsEn", label: "Keywords (EN)", required: true, kind: "list" }
  ];

  function validateField(rule) {
    var el = els[rule.id];
    var value = el.value.trim();
    var message = "";

    if (rule.required && value.length === 0) {
      message = "O campo " + rule.label + " é obrigatório.";
    } else if (value.length > 0 && rule.kind === "email" && !EMAIL_PATTERN.test(value)) {
      message = "Informe um endereço de e-mail válido.";
    } else if (value.length > 0 && rule.kind === "url" && !isValidUrl(value)) {
      message = "Informe uma URL completa começando com https://";
    } else if (rule.required && rule.kind === "list" && splitList(value).length === 0) {
      message = "O campo " + rule.label + " é obrigatório.";
    }

    var errorEl = $(rule.id + "-error");
    if (message) {
      errorEl.textContent = message;
      el.setAttribute("aria-invalid", "true");
    } else {
      errorEl.textContent = "";
      el.setAttribute("aria-invalid", "false");
    }
    return message;
  }

  // Photo is optional, but if a file was chosen it must have finished
  // processing into a final PNG before the form can be submitted.
  function validatePhoto() {
    var hasFile = els.photo.files && els.photo.files.length > 0;
    if (hasFile && !state.processedPhoto) {
      var message = "Aguarde o processamento da imagem antes de continuar.";
      photoErrorEl.textContent = message;
      els.photo.setAttribute("aria-invalid", "true");
      return message;
    }
    return "";
  }

  function validateForm() {
    var errors = [];
    FIELD_RULES.forEach(function (rule) {
      var message = validateField(rule);
      if (message) {
        errors.push({ id: rule.id, message: rule.label + ": " + message });
      }
    });

    var photoMessage = validatePhoto();
    if (photoMessage) {
      errors.push({ id: "photo", message: "Foto: " + photoMessage });
    }

    if (errors.length > 0) {
      errorSummaryList.innerHTML = "";
      errors.forEach(function (err) {
        var li = document.createElement("li");
        var link = document.createElement("a");
        link.href = "#" + err.id;
        link.textContent = err.message;
        link.addEventListener("click", function (e) {
          e.preventDefault();
          var target = $(err.id);
          target.focus();
        });
        li.appendChild(link);
        errorSummaryList.appendChild(li);
      });
      errorSummary.hidden = false;
      errorSummary.scrollIntoView({ block: "start" });
    } else {
      errorSummary.hidden = true;
      errorSummaryList.innerHTML = "";
    }

    return errors.length === 0;
  }

  function initInlineValidation() {
    FIELD_RULES.forEach(function (rule) {
      els[rule.id].addEventListener("blur", function () { validateField(rule); });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Data collection & payload construction                              */
  /* ------------------------------------------------------------------ */

  // Raw form values, no shaping. Kept separate from buildSubmissionPayload()
  // so validation/collection/shaping stay independently testable.
  function collectFormData() {
    return {
      fullName: els.fullName.value.trim(),
      email: els.email.value.trim(),
      lattes: els.lattes.value.trim(),
      orcid: els.orcid.value.trim(),
      github: els.github.value.trim(),
      linkedin: els.linkedin.value.trim(),
      rolePt: els.rolePt.value.trim(),
      affiliationPt: els.affiliationPt.value.trim(),
      descriptionPt: els.descriptionPt.value.trim(),
      areasPt: els.areasPt.value,
      keywordsPt: els.keywordsPt.value,
      roleEn: els.roleEn.value.trim(),
      affiliationEn: els.affiliationEn.value.trim(),
      descriptionEn: els.descriptionEn.value.trim(),
      areasEn: els.areasEn.value,
      keywordsEn: els.keywordsEn.value
    };
  }

  // Shapes the final public submission payload. Deliberately excludes
  // id / group / order / active — those are assigned later in the admin
  // flow and are never collected here.
  function buildSubmissionPayload(formData) {
    var photo = null;
    if (state.processedPhoto) {
      photo = {
        filename: slugify(formData.fullName) + ".png",
        mime_type: "image/png",
        width: state.processedPhoto.width,
        height: state.processedPhoto.height,
        size_bytes: state.processedPhoto.size
      };
    }

    return {
      name: formData.fullName,
      role: { pt: formData.rolePt, en: formData.roleEn },
      affiliation: { pt: formData.affiliationPt, en: formData.affiliationEn },
      description: { pt: formData.descriptionPt, en: formData.descriptionEn },
      areas: { pt: splitList(formData.areasPt), en: splitList(formData.areasEn) },
      keywords: { pt: splitList(formData.keywordsPt), en: splitList(formData.keywordsEn) },
      links: {
        lattes: formData.lattes,
        orcid: formData.orcid,
        github: formData.github,
        linkedin: formData.linkedin,
        email: formData.email
      },
      photo: photo
    };
  }

  /* ------------------------------------------------------------------ */
  /* Local downloads (stand-ins for the future submit action)            */
  /* ------------------------------------------------------------------ */

  function triggerDownload(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function downloadPayload(payload) {
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    triggerDownload(blob, slugify(payload.name) + ".json");
  }

  function downloadPhoto(blob, filename) {
    triggerDownload(blob, filename);
  }

  /* ------------------------------------------------------------------ */
  /* Submit to Cloudflare Worker                                         */
  /* This step only sends the submission to the Worker's /team-profile   */
  /* endpoint and shows its response. The Worker itself does not store   */
  /* anything yet — no GitHub API, no database. That comes later.        */
  /* ------------------------------------------------------------------ */

  // URL of the Cloudflare Worker that receives submissions. Hardcoded for
  // now; could later be made configurable from outside the bundle (e.g. a
  // build-time env var or a small config file) without touching the rest
  // of this module.
  var WORKER_URL = "https://lam-plus-team-api.andrebelem.workers.dev";
  var TEAM_PROFILE_ENDPOINT = WORKER_URL + "/team-profile";

  // `prUrl`, when given, appends a discreet "Ver Pull Request" link that
  // opens in a new tab. No other GitHub/administrative details (branch,
  // repo, PR number) are ever surfaced to the frontend.
  function setSubmitStatus(message, kind, prUrl) {
    if (!submitStatusEl) return;
    submitStatusEl.innerHTML = "";
    submitStatusEl.className = "submit-status" + (kind ? " submit-status--" + kind : "");

    if (!message && !prUrl) return; // leave truly empty so .submit-status:empty hides it

    var text = document.createElement("span");
    text.textContent = message || "";
    submitStatusEl.appendChild(text);

    if (prUrl) {
      var note = document.createElement("span");
      note.className = "submit-status__note";
      note.textContent = " Submissão registrada para revisão. ";
      submitStatusEl.appendChild(note);

      var link = document.createElement("a");
      link.href = prUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "submit-status__link";
      link.textContent = "Ver Pull Request";
      submitStatusEl.appendChild(link);
    }
  }

  // Validates the form, builds the payload, and POSTs it plus the
  // processed PNG to the Worker as multipart/form-data. Self-contained: it
  // does not depend on a prior "Revisar envio" click, so it can be wired to
  // its own button. Local JSON/photo downloads remain a separate action.
  function submitProfile() {
    if (state.isSubmitting) return;

    var isValid = validateForm();
    if (!isValid) {
      resultPanel.hidden = true;
      return;
    }

    if (!state.processedPhoto) {
      setSubmitStatus("Selecione uma foto e aguarde o processamento antes de enviar.", "error");
      return;
    }

    var formValues = collectFormData();
    var payload = buildSubmissionPayload(formValues);
    state.lastPayload = payload;

    // Show the same review panel used by "Revisar envio" so the user sees
    // exactly what was sent.
    resultJson.textContent = JSON.stringify(payload, null, 2);
    resultPanel.hidden = false;
    downloadPhotoBtn.hidden = !state.processedPhoto;

    var formData = new FormData();
    formData.append(
      "profile",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    formData.append(
      "photo",
      state.processedPhoto.blob,
      payload.photo.filename
    );

    state.isSubmitting = true;
    submitWorkerBtn.disabled = true;
    setSubmitStatus("Enviando perfil...", "pending");

    // No manual Content-Type header: the browser must generate the
    // multipart boundary itself.
    fetch(TEAM_PROFILE_ENDPOINT, {
      method: "POST",
      body: formData
    })
      .then(function (response) {
        return response.json()
          .catch(function () { return null; })
          .then(function (body) {
            return { ok: response.ok, status: response.status, body: body };
          });
      })
      .then(function (result) {
        if (result.ok && result.body && result.body.ok) {
          var prUrl = result.body.github && result.body.github.pull_request_url;
          setSubmitStatus(result.body.message || "Perfil recebido com sucesso.", "success", prUrl);
        } else {
          var message = (result.body && result.body.message) ||
            "Não foi possível enviar o perfil (HTTP " + result.status + ").";
          setSubmitStatus(message, "error");
        }
      })
      .catch(function () {
        setSubmitStatus("Não foi possível conectar ao servidor. Tente novamente mais tarde.", "error");
      })
      .then(function () {
        state.isSubmitting = false;
        submitWorkerBtn.disabled = false;
      });
  }

  /* ------------------------------------------------------------------ */
  /* Submit / reset                                                      */
  /* ------------------------------------------------------------------ */

  function initSubmit() {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var isValid = validateForm();
      if (!isValid) {
        resultPanel.hidden = true;
        return;
      }

      var formData = collectFormData();
      var payload = buildSubmissionPayload(formData);
      state.lastPayload = payload;

      resultJson.textContent = JSON.stringify(payload, null, 2);
      resultPanel.hidden = false;
      downloadPhotoBtn.hidden = !state.processedPhoto;
      resultPanel.scrollIntoView({ block: "start", behavior: "auto" });
    });

    downloadJsonBtn.addEventListener("click", function () {
      if (!state.lastPayload) return;
      downloadPayload(state.lastPayload);
    });

    downloadPhotoBtn.addEventListener("click", function () {
      if (!state.lastPayload || !state.processedPhoto) return;
      downloadPhoto(state.processedPhoto.blob, state.lastPayload.photo.filename);
    });

    submitWorkerBtn.addEventListener("click", submitProfile);

    form.addEventListener("reset", function () {
      window.setTimeout(function () {
        resetPhotoState();
        state.lastPayload = null;
        state.isSubmitting = false;
        errorSummary.hidden = true;
        resultPanel.hidden = true;
        downloadPhotoBtn.hidden = true;
        submitWorkerBtn.disabled = false;
        setSubmitStatus("", null);
        FIELD_RULES.forEach(function (rule) {
          $(rule.id + "-error").textContent = "";
          els[rule.id].setAttribute("aria-invalid", "false");
        });
        photoErrorEl.textContent = "";
        els.photo.setAttribute("aria-invalid", "false");
        renderPreview();
      }, 0);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                */
  /* ------------------------------------------------------------------ */

  function init() {
    initPhotoUpload();
    initCropInteractions();
    initLivePreviewBindings();
    initLanguageToggle();
    initInlineValidation();
    initSubmit();
    renderPreview();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
