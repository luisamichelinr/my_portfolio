const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const fixedNavbar = document.querySelector(".navbar.fixed-top");

function updateNavbarHeight() {
  if (!fixedNavbar) return;
  document.documentElement.style.setProperty("--navbar-height", `${fixedNavbar.getBoundingClientRect().height}px`);
}

if (fixedNavbar) {
  updateNavbarHeight();
  window.addEventListener("resize", updateNavbarHeight);
  if ("ResizeObserver" in window) {
    new ResizeObserver(updateNavbarHeight).observe(fixedNavbar);
  }
}

const elHello = document.getElementById("hello-world");
const cursorHello = document.getElementById("cursor-hello");
const elTexto = document.getElementById("texto");
const cursorTexto = document.getElementById("cursor-texto");
const name = document.getElementById("name");
const buttonPurple = document.getElementById("buttonPurple");

const txtHello = "Hello world!";
const frases = [
  "Developer, researcher, and passionate about education",
  "Using technology to create solutions for people",
  "Always finding something new to learn"
];

let iHello = 0;
let indiceFrase = 0;
let indiceLetra = 0;
let apagando = false;

function mostrarIntroducaoEstatica() {
  if (elHello) {
    elHello.textContent = txtHello;
    elHello.style.fontSize = "1.5rem";
  }
  if (cursorHello) cursorHello.classList.add("d-none");
  if (name) name.classList.remove("d-none");
  if (buttonPurple) buttonPurple.classList.remove("d-none");
  if (elTexto) elTexto.textContent = frases[0];
  if (cursorTexto) cursorTexto.classList.add("d-none");
}

function digitarHello() {
  if (!elHello || !cursorHello || !name || !buttonPurple || !elTexto || !cursorTexto) return;

  if (reducedMotion.matches) {
    mostrarIntroducaoEstatica();
    return;
  }

  if (iHello < txtHello.length) {
    elHello.textContent += txtHello.charAt(iHello);
    iHello++;
    setTimeout(digitarHello, 100);
  } else {
    setTimeout(() => {
      cursorHello.classList.add("d-none");
      elHello.style.fontSize = "1.5rem";
      name.classList.remove("d-none");
    }, 1000);

    setTimeout(() => {
      buttonPurple.classList.remove("d-none");
      cursorTexto.classList.remove("d-none");
      efeitoDigitarFrases();
    }, 2500);
  }
}

function efeitoDigitarFrases() {
  if (!elTexto || reducedMotion.matches) return;

  const fraseAtual = frases[indiceFrase];

  if (!apagando) {
    elTexto.textContent = fraseAtual.substring(0, indiceLetra + 1);
    indiceLetra++;

    if (indiceLetra === fraseAtual.length) {
      if (frases.length === 1) {
        if (cursorTexto) cursorTexto.classList.add("d-none");
        return;
      }
      apagando = true;
      setTimeout(efeitoDigitarFrases, 2500);
      return;
    }
  } else {
    elTexto.textContent = fraseAtual.substring(0, indiceLetra - 1);
    indiceLetra--;

    if (indiceLetra === 0) {
      apagando = false;
      indiceFrase = (indiceFrase + 1) % frases.length;
    }
  }

  setTimeout(efeitoDigitarFrases, apagando ? 30 : 60);
}

function initializeIntroduction() {
  clearTimeout(window.introFallback);
  if (!reducedMotion.matches && elHello && elTexto && name && buttonPurple) {
    elHello.textContent = "";
    elTexto.textContent = "";
    name.classList.add("d-none");
    buttonPurple.classList.add("d-none");
  }
  document.documentElement.classList.add("intro-ready");
  document.documentElement.classList.remove("intro-pending");
  digitarHello();
}
document.addEventListener("DOMContentLoaded", initializeIntroduction);

if (fixedNavbar) {
  fixedNavbar.addEventListener("click", (event) => {
    const link = event.target.closest(".nav-link");
    const menu = fixedNavbar.querySelector(".navbar-collapse.show");
    if (link && menu && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
  });
}

const avatar = document.getElementById("avatar");
const avatarParts = {
  leftNormalEye: document.getElementById("left-eye-normal"),
  rightNormalEye: document.getElementById("right-eye-normal"),
  leftCuriousEye: document.getElementById("left-eye-curious"),
  rightCuriousEye: document.getElementById("right-eye-curious"),
  leftWinkingEye: document.getElementById("left-eye-winking"),
  rightWinkingEye: document.getElementById("right-eye-winking"),
  leftNormalBrow: document.getElementById("left-eyebrow-normal"),
  rightNormalBrow: document.getElementById("right-eyebrow-normal"),
  leftCuriousBrow: document.getElementById("left-eyebrow-curious"),
  rightCuriousBrow: document.getElementById("right-eyebrow-curious")
};

let avatarExpression = "normal";
let avatarIsBlinking = false;

function setVisible(element, visible) {
  if (element) element.style.display = visible ? "inline" : "none";
}

function setAvatarExpression(expression) {
  avatarExpression = expression;
  const curious = expression === "curious";

  setVisible(avatarParts.leftWinkingEye, false);
  setVisible(avatarParts.rightWinkingEye, false);
  setVisible(avatarParts.leftNormalEye, !curious);
  setVisible(avatarParts.rightNormalEye, !curious);
  setVisible(avatarParts.leftCuriousEye, curious);
  setVisible(avatarParts.rightCuriousEye, curious);
  setVisible(avatarParts.leftNormalBrow, !curious);
  setVisible(avatarParts.rightNormalBrow, !curious);
  setVisible(avatarParts.leftCuriousBrow, curious);
  setVisible(avatarParts.rightCuriousBrow, curious);
}

function resetNormalFacePosition() {
  [avatarParts.leftNormalEye, avatarParts.rightNormalEye, avatarParts.leftNormalBrow, avatarParts.rightNormalBrow]
    .forEach((element) => {
      if (element) element.style.transform = "translate(0px, 0px)";
    });
}

function trackAvatarPointer(event) {
  if (!avatar || avatarIsBlinking || reducedMotion.matches) return;

  const rect = avatar.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const deltaX = event.clientX - centerX;
  const deltaY = event.clientY - centerY;
  const lookingLeft = deltaX < 0;
  const curious = Math.abs(deltaX) > 300;

  avatar.style.transform = lookingLeft ? "rotateY(180deg)" : "rotateY(0deg)";
  setAvatarExpression(curious ? "curious" : "normal");

  if (curious) {
    resetNormalFacePosition();
    return;
  }

  const moveX = Math.max(-8, Math.min(8, deltaX * 0.03)) * (lookingLeft ? -1 : 1);
  const moveY = Math.max(-8, Math.min(8, deltaY * 0.03));
  const browX = Math.max(-20, Math.min(20, deltaX * 0.07)) * (lookingLeft ? -1 : 1);
  const browY = Math.max(-20, Math.min(20, deltaY * 0.07));

  if (avatarParts.leftNormalEye) avatarParts.leftNormalEye.style.transform = `translate(${moveX}px, ${moveY}px)`;
  if (avatarParts.rightNormalEye) avatarParts.rightNormalEye.style.transform = `translate(${moveX}px, ${moveY}px)`;
  if (avatarParts.leftNormalBrow) avatarParts.leftNormalBrow.style.transform = `translate(${browX}px, ${browY}px)`;
  if (avatarParts.rightNormalBrow) avatarParts.rightNormalBrow.style.transform = `translate(${browX}px, ${browY}px)`;
}

let avatarBlinkInterval = null;
let avatarBlinkTimeout = null;

function blinkAvatar() {
  if (avatarIsBlinking || reducedMotion.matches) return;
  avatarIsBlinking = true;
  setVisible(avatarParts.leftNormalEye, false);
  setVisible(avatarParts.rightNormalEye, false);
  setVisible(avatarParts.leftCuriousEye, false);
  setVisible(avatarParts.rightCuriousEye, false);
  setVisible(avatarParts.leftWinkingEye, true);
  setVisible(avatarParts.rightWinkingEye, true);
  avatarBlinkTimeout = window.setTimeout(() => {
    avatarIsBlinking = false;
    avatarBlinkTimeout = null;
    setAvatarExpression(avatarExpression);
  }, 150);
}

function syncAvatarMotionPreference() {
  if (!avatar) return;
  document.removeEventListener("mousemove", trackAvatarPointer);
  window.clearInterval(avatarBlinkInterval);
  window.clearTimeout(avatarBlinkTimeout);
  avatarBlinkInterval = null;
  avatarBlinkTimeout = null;
  avatarIsBlinking = false;
  if (reducedMotion.matches) {
    avatar.style.removeProperty("transform");
    resetNormalFacePosition();
    setAvatarExpression("normal");
    return;
  }
  setAvatarExpression(avatarExpression);
  document.addEventListener("mousemove", trackAvatarPointer);
  avatarBlinkInterval = window.setInterval(blinkAvatar, 30000);
}

if (avatar) {
  setAvatarExpression("normal");
  syncAvatarMotionPreference();
  reducedMotion.addEventListener("change", syncAvatarMotionPreference);
}
// Floating Lanterns: one scroll scheduler, five reading chapters, one color boundary.
const lanternStory = document.querySelector(".lantern-story");
const lanternOpening = document.querySelector(".lantern-opening");
const openingStage = lanternOpening?.querySelector(".lantern-opening-stage");
const openingContent = lanternOpening?.querySelector(".opening-content");
const lanternOrigin = lanternOpening?.querySelector(".lantern-origin");
const openingScrollLayout = window.matchMedia("(min-width: 992px) and (min-height: 741px)");
const journeyScene = document.getElementById("home-kept-moving");
const journeyStage = journeyScene?.querySelector(".journey-stage");
const journeyRoute = journeyScene?.querySelector(".journey-route");
const journeyStops = Array.from(journeyScene?.querySelectorAll(".childhood-stop") || []);
const journeyNarrowLayout = window.matchMedia("(max-width: 767.98px)");
const journeyPaths = journeyScene ? [".journey-trail-wide", ".journey-trail-narrow"].map((selector) => {
  const path = journeyScene.querySelector(selector + " .journey-trail-light");
  return { path, length: path.getTotalLength() };
}) : [];
const familyScene = document.getElementById("people-who-made-it-home");
const familyStage = familyScene?.querySelector(".family-stage");
const familyEntries = Array.from(familyScene?.querySelectorAll("[data-family-memory]") || []);
const familyPinLayout = window.matchMedia("(min-width: 992px) and (min-height: 900px)");
const readingChapters = Array.from(document.querySelectorAll(".lantern-reading-scene")).map((scene) => ({
  scene, stage: scene.querySelector(".lantern-reading-stage"),
  content: scene.querySelector(".lantern-reading-content"),
  final: scene.classList.contains("stayed-scene")
}));
const stayedChapter = readingChapters.find((chapter) => chapter.final);
let lanternFramePending = false;
let lanternLayoutDirty = true;
let lanternNavbarHeight = 72;
let lanternDawnProgress = 0;

const clampLantern = (value) => Math.max(0, Math.min(1, value));

function markLanternLayoutDirty() {
  lanternLayoutDirty = true;
  solicitarAtualizacaoLanternas();
}

function updateLanternLayouts() {
  lanternNavbarHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--navbar-height")) || 72;
  const canPin = openingScrollLayout.matches && !reducedMotion.matches;
  const fits = (stage, content) => {
    const style = getComputedStyle(stage);
    return content.getBoundingClientRect().height + Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom) <= window.innerHeight + 1;
  };
  if (openingStage && openingContent) {
    lanternOpening.classList.toggle("is-flow-layout", !canPin || Boolean(lanternOrigin?.open) || !fits(openingStage, openingContent));
  }
  if (journeyStage) journeyScene.classList.toggle("is-flow-layout", !canPin || journeyStage.scrollHeight > window.innerHeight + 1);
  if (familyStage) familyScene.classList.toggle("is-pinned", familyPinLayout.matches && !reducedMotion.matches && familyStage.scrollHeight <= window.innerHeight + 1);
  readingChapters.forEach(({ scene, stage, content }) => scene.classList.toggle("is-pinned", canPin && fits(stage, content)));
  lanternLayoutDirty = false;
}

function lanternChapterProgress(rect, pinned) {
  return pinned
    ? clampLantern(-rect.top / Math.max(1, rect.height - window.innerHeight))
    : clampLantern((window.innerHeight - rect.top) / (rect.height + window.innerHeight));
}

function setLanternExit(scene, progress, pinned) {
  scene.style.setProperty("--chapter-opacity", pinned ? (1 - clampLantern((progress - 0.88) / 0.12)).toFixed(3) : "1");
}

function updateLanternOpening() {
  if (!lanternOpening) return;
  const rect = lanternOpening.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) return;
  const pinned = openingScrollLayout.matches && !lanternOpening.classList.contains("is-flow-layout") && !reducedMotion.matches;
  const progress = reducedMotion.matches ? 0 : lanternChapterProgress(rect, pinned);
  lanternOpening.style.setProperty("--opening-progress", progress.toFixed(4));
  lanternOpening.style.setProperty("--opening-opacity", pinned ? (1 - clampLantern((progress - 0.85) / 0.15)).toFixed(3) : "1");
  lanternOpening.style.setProperty("--opening-offset", pinned ? `${((1 - clampLantern(progress / 0.14)) * 24 - clampLantern((progress - 0.85) / 0.15) * 16).toFixed(2)}px` : "0px");
}

function updateChildhoodJourney() {
  if (!journeyScene || !journeyRoute) return;
  const rect = journeyScene.getBoundingClientRect();
  if (!reducedMotion.matches && (rect.bottom < 0 || rect.top > window.innerHeight)) return;
  const pinned = openingScrollLayout.matches && !journeyScene.classList.contains("is-flow-layout") && !reducedMotion.matches;
  const routeRect = journeyRoute.getBoundingClientRect();
  const progress = reducedMotion.matches ? 1 : (pinned ? lanternChapterProgress(rect, true)
    : clampLantern((window.innerHeight * 0.65 - routeRect.top) / Math.max(1, routeRect.height - window.innerHeight * 0.1)));
  journeyScene.style.setProperty("--journey-progress", progress.toFixed(4));
  const narrow = journeyNarrowLayout.matches;
  const { path, length } = journeyPaths[narrow ? 1 : 0];
  const point = path.getPointAtLength(length * progress);
  journeyScene.style.setProperty("--journey-x", (point.x / (narrow ? 100 : 1000) * routeRect.width).toFixed(3) + "px");
  journeyScene.style.setProperty("--journey-y", (point.y / (narrow ? 1000 : 600) * routeRect.height).toFixed(3) + "px");
  journeyStops.forEach((stop, index) => stop.classList.toggle("is-visited", progress >= index / (journeyStops.length - 1)));
  setLanternExit(journeyScene, progress, pinned);
}

function updateFamilyAlbum() {
  if (!familyScene) return;
  const rect = familyScene.getBoundingClientRect();
  if (!reducedMotion.matches && (rect.bottom < 0 || rect.top > window.innerHeight)) return;
  const pinned = familyScene.classList.contains("is-pinned");
  const progress = lanternChapterProgress(rect, pinned);
  familyScene.style.setProperty("--family-progress", reducedMotion.matches ? "0" : progress.toFixed(4));
  familyEntries.forEach((entry, index) => {
    const reveal = reducedMotion.matches ? 1 : (pinned ? (progress - index * 0.08) / 0.18
      : (window.innerHeight * 0.92 - entry.getBoundingClientRect().top) / (window.innerHeight * 0.22));
    entry.style.setProperty("--family-reveal", clampLantern(reveal).toFixed(3));
  });
  setLanternExit(familyScene, progress, pinned);
}

function mixLanternColor(from, to, progress) {
  return "rgb(" + from.map((channel, index) => Math.round(channel + (to[index] - channel) * progress)).join(", ") + ")";
}

function dawnLanternColor(progress) {
  // Muted violet and rose: the final stop matches the Robotics surface.
  const stops = [
    [0, [46, 17, 73]], [0.5, [70, 47, 87]],
    [0.78, [157, 133, 148]], [1, [251, 250, 246]]
  ];
  const eased = clampLantern(progress) ** 2 * (3 - 2 * clampLantern(progress));
  const index = stops.findIndex((stop, i) => i < stops.length - 1 && eased <= stops[i + 1][0]);
  const [fromAt, from] = stops[Math.max(0, index)];
  const [toAt, to] = stops[Math.max(0, index) + 1];
  return mixLanternColor(from, to, (eased - fromAt) / (toAt - fromAt));
}

function readableDawnInk(background, light, dark) {
  const luminance = (rgb) => rgb.reduce((sum, value, index) => {
    const channel = value / 255;
    return sum + (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4) * [0.2126, 0.7152, 0.0722][index];
  }, 0);
  const base = luminance(background.match(/[\d.]+/g).map(Number));
  const ratio = (rgb) => (Math.max(base, luminance(rgb)) + 0.05) / (Math.min(base, luminance(rgb)) + 0.05);
  let ink = ratio(light) >= ratio(dark) ? light : dark;
  if (ratio(ink) < 4.5) ink = ratio([255, 255, 255]) >= ratio([0, 0, 0]) ? [255, 255, 255] : [0, 0, 0];
  return "rgb(" + ink.join(", ") + ")";
}
function updateReadingChapters() {
  lanternDawnProgress = 0;
  readingChapters.forEach(({ scene, content, final }) => {
    const rect = scene.getBoundingClientRect();
    const pinned = scene.classList.contains("is-pinned");
    const progress = lanternChapterProgress(rect, pinned);
    if (final) {
      // The sky changes while the composition leaves; there is no extra gradient strip.
      const flowDistance = Math.max(1, window.innerHeight * 0.85 - lanternNavbarHeight);
      lanternDawnProgress = pinned ? clampLantern((progress - 0.5) / 0.5)
        : clampLantern((window.innerHeight * 0.85 - rect.bottom) / flowDistance);
      if (pinned && content.contains(document.activeElement)) lanternDawnProgress = 0;
      const surface = dawnLanternColor(lanternDawnProgress);
      scene.style.setProperty("--dawn-progress", lanternDawnProgress.toFixed(4));
      scene.style.setProperty("--stayed-ink", readableDawnInk(surface, [255, 243, 245], [46, 29, 52]));
      scene.style.setProperty("--stayed-accent", readableDawnInk(surface, [255, 216, 237], [88, 39, 76]));
    }
    if (!reducedMotion.matches && (rect.bottom < 0 || rect.top > window.innerHeight)) return;
    const opacity = pinned ? clampLantern(progress / 0.14) * (1 - clampLantern((progress - (final ? 0.66 : 0.88)) / 0.12)) : 1;
    scene.style.setProperty("--chapter-opacity", opacity.toFixed(3));
    scene.style.setProperty("--reading-progress", reducedMotion.matches ? "0" : progress.toFixed(4));
    scene.style.setProperty("--lesson-line-progress", reducedMotion.matches || !pinned ? "1" : clampLantern((progress - 0.08) / 0.35).toFixed(4));
  });
}

function updateLanternTheme() {
  const rect = lanternStory.getBoundingClientRect();
  // One boundary controls both the section surfaces and the navbar, forward and backward.
  const chapterIsActive = rect.top <= lanternNavbarHeight + 1 && rect.bottom > lanternNavbarHeight;
  document.body.classList.toggle("lantern-theme", chapterIsActive);
  const dawnIsActive = chapterIsActive && lanternDawnProgress > 0;
  lanternStory.classList.toggle("is-dawning", dawnIsActive);
  fixedNavbar?.classList.toggle("is-dawning", dawnIsActive);
  if (dawnIsActive) {
    lanternStory.style.setProperty("--lantern-surface", dawnLanternColor(lanternDawnProgress));
    document.body.style.setProperty("--lantern-header", mixLanternColor([212, 162, 253], [253, 162, 249], lanternDawnProgress));
  } else {
    lanternStory.style.removeProperty("--lantern-surface");
    document.body.style.removeProperty("--lantern-header");
  }
  lanternStory.style.setProperty("--dawn-progress", lanternDawnProgress.toFixed(4));
}

function atualizarLanternas() {
  lanternFramePending = false;
  if (!lanternStory) return;
  if (lanternLayoutDirty) updateLanternLayouts();
  updateLanternOpening();
  updateChildhoodJourney();
  updateFamilyAlbum();
  updateReadingChapters();
  updateLanternTheme();
}

function solicitarAtualizacaoLanternas() {
  if (lanternFramePending) return;
  lanternFramePending = true;
  window.requestAnimationFrame(atualizarLanternas);
}

if (lanternStory) {
  [lanternOpening, journeyScene, familyScene].forEach((scene) => scene?.classList.add("is-enhanced"));
  window.addEventListener("scroll", solicitarAtualizacaoLanternas, { passive: true });
  lanternStory.addEventListener("focusin", solicitarAtualizacaoLanternas);
  lanternStory.addEventListener("focusout", solicitarAtualizacaoLanternas);
  window.addEventListener("resize", markLanternLayoutDirty);
  reducedMotion.addEventListener("change", markLanternLayoutDirty);
  lanternOrigin?.addEventListener("toggle", markLanternLayoutDirty);
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(markLanternLayoutDirty);
    [openingStage, openingContent, journeyStage, familyStage, fixedNavbar,
      ...readingChapters.flatMap(({ stage, content }) => [stage, content])].filter(Boolean).forEach((element) => observer.observe(element));
  }
  document.fonts?.ready.then(markLanternLayoutDirty);
  window.addEventListener("load", markLanternLayoutDirty, { once: true });
  solicitarAtualizacaoLanternas();
}
document.querySelectorAll(".robotics-memory").forEach((memory) => {
  memory.addEventListener("click", () => {
    const willOpen = memory.getAttribute("aria-expanded") !== "true";
    document.querySelectorAll(".robotics-memory[aria-expanded='true']").forEach((openMemory) => {
      openMemory.setAttribute("aria-expanded", "false");
    });
    memory.setAttribute("aria-expanded", String(willOpen));
  });
});

// Photo and video sources live only in index.html templates.
const portfolioMediaTemplates = new Map(
  [...document.querySelectorAll("template[data-media-for]")].map(template => [template.dataset.mediaFor, template])
);
function portfolioMediaSlug(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function syncPortfolioMediaKind(media) {
  const content = portfolioMediaTemplates.get(media.mediaKey)?.content;
  const previousType = media.type;
  if (content?.querySelector("video")) media.type = "video";
  else if (content?.querySelector("img")) media.type = "image";
  // Keep generated evidence labels consistent when a video slot receives a document.
  if (previousType === "video" && media.type === "image" && media.shortCaption?.endsWith(" video")) {
    media.shortCaption = media.shortCaption.replace(/ video$/, " photo / document");
  }
}
function bindPortfolioMedia(items, group) {
  items.forEach(item => item.media.forEach((media, index) => {
    media.mediaKey = group + "-" + portfolioMediaSlug(item.id || item.title || item.role) + "-" + (index + 1);
    syncPortfolioMediaKind(media);
  }));
}
function hasPortfolioMedia(media) {
  return Boolean(portfolioMediaTemplates.get(media?.mediaKey)?.content.querySelector("img, video"));
}
function clonePortfolioMedia(media, thumbnail = false) {
  const template = portfolioMediaTemplates.get(media?.mediaKey);
  const fragment = template ? template.content.cloneNode(true) : document.createDocumentFragment();
  if (!template) {
    const placeholder = document.createElement("span");
    placeholder.textContent = media?.label || media?.alt || "Media to add";
    fragment.append(placeholder);
  }
  if (!fragment.querySelector("img, video")) {
    fragment.querySelectorAll("*").forEach(element => {
      if (!element.children.length && /to (?:be )?add(?:ed)?|placeholder|^logo$/i.test(element.textContent)) {
        element.setAttribute("aria-label", (element.getAttribute("aria-label") || element.textContent).replace(/\s*to (?:be )?add(?:ed)?\.?/gi, "") + " — media unavailable");
        element.textContent = "";
      }
    });
  }
  const video = fragment.querySelector("video");
  if (thumbnail && video) {
    const poster = video.getAttribute("poster");
    if (poster) {
      const image = document.createElement("img");
      image.src = poster;
      image.alt = "";
      video.replaceWith(image);
    } else {
      const label = document.createElement("span");
      label.textContent = "Video";
      video.replaceWith(label);
    }
  }
  fragment.querySelectorAll("img").forEach(image => {
    if (!image.hasAttribute("loading")) image.loading = "lazy";
    if (thumbnail) image.alt = "";
  });
  fragment.querySelectorAll("video").forEach(video => {
    video.controls = true;
    if (!video.hasAttribute("preload")) video.preload = "metadata";
  });
  return fragment;
}
function mountPortfolioMedia(container, media) {
  const fragment = clonePortfolioMedia(media);
  const hasAsset = Boolean(fragment.querySelector("img, video"));
  container.replaceChildren(fragment);
  container.classList.toggle("has-media", hasAsset);
  if (hasAsset) {
    container.removeAttribute("role");
    container.removeAttribute("aria-label");
  }
}

const roboticsStates = [
  {
    "role": "Researcher",
    "characterTitle": "Lu Researcher",
    "characterSeason": "2021 to 2022",
    "characterCopy": "My first season introduced me to researching problems and developing solutions. While working on SIRV, I also created the Comet Method, an eight-step process that helped our team organize our research, develop ideas, and improve our projects.",
    "characterProof": "",
    "projectSeason": "Research project",
    "projectTitle": "SIRV",
    "defaultPreview": {
      "label": "SIRV",
      "caption": "Main SIRV project visual to add.",
      "type": "image"
    },
    "projectLabels": [
      "Vaccine transportation"
        ],
    "problemLabel": "Problem",
    "problem": "A systematic review found that between 75% and 100% of vaccine shipments were exposed to freezing temperatures in studies examining the entire distribution chain. Without proper temperature control, vaccines can lose their effectiveness before reaching the people who need them.",
    "solutionLabel": "OUR SOLUTION",
    "solution": "We developed SIRV, an intelligent vaccine refrigeration prototype using temperature sensors, an ESP32, and a Peltier module to automatically regulate cooling. We improved the system through testing and feedback from researchers and healthcare professionals.",
    "evidence": [
      {
        "label": "Comet Method",
        "caption": "Research method.",
        "preview": "Comet Method",
        "type": "image"
      },
      {
        "label": "State University of Maringá",
        "caption": "Conversation with UEM.",
        "preview": "UEM meeting",
        "type": "image"
      },
      {
        "label": "Doctors Without Borders",
        "caption": "Feedback from Doctors Without Borders.",
        "preview": "Doctors Without Borders meeting",
        "type": "image"
      }
    ],
    "links": [
    ]
  },
  {
    "role": "Robot Operator",
    "characterTitle": "Lu Operator",
    "characterSeason": "2022 to 2023 · Super Powered",
    "characterCopy": "During the Super Powered season, I became our team's robot operator. I spent hours practicing missions, adjusting movements, and working with my teammates to improve our robot's performance, while continuing to participate in the research and development of our innovation project.",
    "characterProof": "",
    "projectSeason": "Super Powered · 2022 to 2023",
    "projectTitle": "SHOWVE",
    "defaultPreview": {
      "label": "SHOWVE",
      "caption": "Main SHOWVE project visual",
      "type": "image"
    },
    "projectLabels": [
      "Energy efficiency",
      "Smart control"
    ],
    "problemLabel": "Problem",
    "problem": "According to a Brazilian government energy-efficiency guide, electric showers account for approximately 25% of household electricity consumption. With many conventional models relying on manual temperature settings, unnecessary energy use remains a challenge.",
    "solutionLabel": "OUR SOLUTION",
    "solution": "We developed SHOWVE, a smart shower-control prototype that uses ambient temperature measurements to automatically adjust the heating element's power. Our team built an ESP32-based circuit, tested the system at SENAI, and refined it using feedback from professionals.",
    "evidence": [
      {
        "label": "Energy testing",
        "caption": "Energy testing.",
        "preview": "Energy result or test media to add.",
        "type": "image"
      },
      {
        "label": "SENAI testing",
        "caption": "Testing at SENAI.",
        "preview": "SENAI testing photo to add.",
        "type": "image"
      },
      {
        "label": "Interface / testing",
        "caption": "System demonstration.",
        "preview": "SHOWVE interface or testing video to add.",
        "type": "video"
      }
    ],
    "links": [
    ]
  },
  {
    "role": "Programmer",
    "characterTitle": "Lu Programmer",
    "characterSeason": "2023 to 2024 · Masterpiece",
    "characterCopy": "In the Masterpiece season, I focused more on programming our competition robot. Alongside that, we worked on DRAWSE, a project that brought together drawing, an app, and electronics. It was an opportunity to explore different ways of connecting software and hardware.",
    "characterProof": "",
    "projectSeason": "Masterpiece · 2023 to 2024",
    "projectTitle": "DRAWSE",
    "defaultPreview": {
      "label": "DRAWSE",
      "caption": "Main DRAWSE project visual",
      "type": "image"
    },
    "projectLabels": [
      "Art",
      "Young people"
    ],
    "problemLabel": "Problem",
    "problem": "In 2024, 24% of Brazilian Internet users aged 11 to 17 reported trying unsuccessfully to reduce their time online. Our team wanted to explore how smartphones could encourage creative activities, such as drawing, instead of becoming another source of passive screen time.",
    "solutionLabel": "OUR SOLUTION",
    "solution": "We developed DRAWSE, an app connected through Bluetooth to a phone case equipped with an ESP32 and an LED display. Users could create drawings in the app and display them on the case. The project went through eight versions and several types of testing.",
    "evidence": [
      {
        "label": "Sharing with our art teacher",
        "caption": "Sharing with our art teacher",
        "preview": "Sharing with our art teacher",
        "type": "image"
      },
      {
        "label": "Circuit",
        "caption": "Circuit",
        "preview": "Circuit",
        "type": "image"
      }
    ],
    "links": [
    ]
  },
  {
    "role": "Mentor",
    "characterTitle": "Lu Mentor",
    "characterSeason": "2024 · OBR N1",
    "characterCopy": "In 2024, I had the opportunity to mentor the INOVA team as they prepared for OBR N1. I helped the students understand robot structures, gearboxes, and code using LEGO SPIKE, sharing the experience I had gained during my own competitions.",
    "characterProof": "",
    "projectSeason": "Mentorship · 2024",
    "projectTitle": "INOVA Team · OBR N1",
    "defaultPreview": {
      "label": "INOVA Team · OBR N1",
      "caption": "Main team or robot visual to add.",
      "type": "image"
    },
    "projectLabels": [
      "Robot structure",
      "Gearboxes",
      "LEGO SPIKE"
    ],
    "problemLabel": "What I passed forward",
    "problem": "Helping a new team learn about robotics and prepare for the Brazilian Robotics Olympiad.",
    "solutionLabel": "",
    "solution": "I supported the students (including my own younger brother) as they worked on their robot, explored different mechanisms, and prepared for their competition.",
    "evidence": [
      {
        "label": "Team photo",
        "caption": "INOVA team.",
        "preview": "INOVA Team photo to add.",
        "type": "image"
      },
      {
        "label": "Robot photo",
        "caption": "Robot.",
        "preview": "OBR robot photo to add.",
        "type": "image"
      },
      {
        "label": "Testing",
        "caption": "Testing.",
        "preview": "OBR robot video and poster to add.",
        "type": "video"
      },
      {
        "label": "Me and my brother",
        "caption": "Me and my brother",
        "preview": "Me and my brother",
        "type": "image"
      },
    ],
    "links": [
    ]
  }
];

roboticsStates.forEach(state => {
  const key = "robotics-" + portfolioMediaSlug(state.role);
  state.characterMedia = { mediaKey: key + "-character" };
  state.defaultPreview.mediaKey = key + "-main";
  state.evidence.forEach((media, index) => {
    media.mediaKey = key + "-evidence-" + (index + 1);
    syncPortfolioMediaKind(media);
  });
});

document.querySelectorAll("[data-robotics-selector]").forEach((selector) => {
  const previous = selector.querySelector("[data-selector-previous]");
  const next = selector.querySelector("[data-selector-next]");
  const fields = {
    position: selector.querySelector("[data-character-position]"),
    characterPhoto: selector.querySelector("[data-character-photo]"),
    characterSeason: selector.querySelector("[data-character-season]"),
    characterTitle: selector.querySelector("[data-character-title]"),
    characterCopy: selector.querySelector("[data-character-copy]"),
    characterProof: selector.querySelector("[data-character-proof]"),
    projectPhoto: selector.querySelector("[data-project-photo]"),
    projectSeason: selector.querySelector("[data-project-season]"),
    projectTitle: selector.querySelector("[data-project-title]"),
    projectLabels: selector.querySelector("[data-project-labels]"),
    problem: selector.querySelector("[data-project-problem]"),
    problemLabel: selector.querySelector("[data-project-problem-label]"),
    solution: selector.querySelector("[data-project-solution]"),
    solutionLabel: selector.querySelector("[data-project-solution-label]"),
    evidence: selector.querySelector("[data-project-evidence]"),
    links: selector.querySelector("[data-project-links]")
  };
  if (!previous || !next || Object.values(fields).some((field) => !field)) return;

  let activeIndex = 0;

  function renderProjectPreview(preview, activeTrigger = null) {
    mountPortfolioMedia(fields.projectPhoto, preview);
    fields.projectPhoto.classList.toggle("is-video-preview", preview.type === "video");
    fields.evidence.querySelectorAll(".project-evidence-card").forEach((card) => {
      const selected = card === activeTrigger;
      card.setAttribute("aria-pressed", String(selected));
      card.setAttribute("aria-expanded", String(selected));
    });
  }

  function renderRoboticsState() {
    const state = roboticsStates[activeIndex];
    fields.position.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(roboticsStates.length).padStart(2, "0")}`;
    mountPortfolioMedia(fields.characterPhoto, state.characterMedia);
    fields.characterSeason.textContent = state.characterSeason;
    fields.characterTitle.textContent = state.characterTitle;
    fields.characterCopy.textContent = state.characterCopy;
    fields.characterProof.textContent = state.characterProof;
    fields.characterProof.hidden = !state.characterProof;
    fields.projectSeason.textContent = state.projectSeason;
    fields.projectTitle.textContent = state.projectTitle;
    fields.projectLabels.replaceChildren(...state.projectLabels.map((label) => {
      const item = document.createElement("li");
      item.textContent = label;
      return item;
    }));
    fields.problem.textContent = state.problem;
    fields.problemLabel.textContent = state.problemLabel;
    fields.solution.textContent = state.solution;
    fields.solutionLabel.textContent = state.solutionLabel;
    fields.evidence.replaceChildren(...state.evidence.map((evidence) => {
      const card = document.createElement("button");
      const label = document.createElement("strong");
      card.type = "button";
      card.className = "project-evidence-card";
      card.setAttribute("aria-pressed", "false");
      card.setAttribute("aria-expanded", "false");
      card.setAttribute("aria-label", `${evidence.label}: ${evidence.caption}`);
      label.textContent = evidence.label;
      if (evidence.type === "video") card.classList.add("is-video");
      card.append(label);
      const showEvidence = () => renderProjectPreview(evidence, card);
      card.addEventListener("mouseenter", showEvidence);
      card.addEventListener("focus", showEvidence);
      card.addEventListener("click", showEvidence);
      return card;
    }));
    renderProjectPreview(state.defaultPreview);
    fields.links.replaceChildren(...state.links.map((link) => {
      if (link.url) {
        const anchor = document.createElement("a");
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.textContent = `${link.label} ↗`;
        anchor.setAttribute("aria-label", `${link.label} for ${state.projectTitle} in a new tab`);
        return anchor;
      }
      const placeholder = document.createElement("span");
      placeholder.hidden = true;
      return placeholder;
    }));
  }

  previous.addEventListener("click", () => {
    activeIndex = (activeIndex - 1 + roboticsStates.length) % roboticsStates.length;
    renderRoboticsState();
  });
  next.addEventListener("click", () => {
    activeIndex = (activeIndex + 1) % roboticsStates.length;
    renderRoboticsState();
  });
  renderRoboticsState();
});

document.querySelectorAll("[data-robotics-timeline]").forEach((timeline) => {
  const stops = Array.from(timeline.querySelectorAll(".journey-stop"));
  const photo = timeline.querySelector("[data-timeline-photo]");
  const date = timeline.querySelector("[data-timeline-date]");
  const title = timeline.querySelector("[data-timeline-title]");
  const caption = timeline.querySelector("[data-timeline-caption]");
  if (stops.length === 0 || !photo || !date || !title || !caption) return;

  function selectMilestone(stop) {
    stops.forEach((item) => {
      const active = item === stop;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    date.textContent = stop.dataset.date;
    title.textContent = stop.dataset.title;
    caption.textContent = stop.dataset.caption || "";
    caption.hidden = !stop.dataset.caption;
    mountPortfolioMedia(photo, { mediaKey: stop.dataset.mediaFor });
  }

  stops.forEach((stop) => {
    stop.addEventListener("click", () => selectMilestone(stop));
    stop.addEventListener("focus", () => selectMilestone(stop));
    stop.addEventListener("mouseenter", () => selectMilestone(stop));
  });
  selectMilestone(stops.find(stop => stop.classList.contains("is-active")) || stops[0]);
});

/*
 * TOCANDO EM FRENTE · EDITABLE CONTENT
 * Edit verified wording and URLs here. Photo/video sources are in index.html templates.
 * Empty URLs remain hidden in the page; do not add fake destinations.
 */
const tocandoData = {
  "links": [
    {
      "id": "website",
      "label": "Website",
      "url": "https://tocandoemfrente.org/"
    },
    {
      "id": "instagram",
      "label": "Instagram",
      "url": "https://www.instagram.com/tocandoemfrenteorg/"
    },
    {
      "id": "linkedin",
      "label": "LinkedIn",
      "url": "https://www.linkedin.com/company/tocando-em-frente"
    }
  ],
  "metrics": [
    {
      "value": "14,000+",
      "label": "students impacted"
    }
  ],
  "roles": [
    {
      "year": "2022",
      "title": "Rotational Trainee"
    },
    {
      "year": "2023",
      "title": "Rotational Trainees Lead"
    },
    {
      "year": "2024",
      "title": "Internal Management Lead"
    },
    {
      "year": "2025",
      "title": "Institutional Team"
    }
  ],
  "recognitions": [
    {
      "year": "",
      "title": "Global Forum for Children and Youth",
      "organization": "UNICEF",
      "context": "Organizational participation at an international forum. Exact details to confirm.",
      "link": ""
    },
    {
      "year": "",
      "title": "Changes for Humanity",
      "organization": "Changes for Humanity",
      "context": "Organizational grant or recognition. Official details to confirm.",
      "link": ""
    },
    {
      "year": "2023",
      "title": "SESI ODS 2023",
      "organization": "SESI ODS",
      "context": "Sustainability-related organizational recognition.",
      "link": "https://www.sesipr.org.br/premioods/uploadAddress/Boas-Praticas-Inovacao%5B108512%5D.pdf"
    },
    {
      "year": "2024",
      "title": "Prêmio LED, Luz na Educação",
      "organization": "Prêmio LED",
      "context": "Educational award received by Tocando em Frente.",
      "link": "https://somos.globo.com/movimento-led/premio-led/noticia/premio-led-2024-conheca-os-vencedores-e-saiba-como-eles-potencializam-a-educacao.ghtml"
    }
  ],
  "projects": [
    {
      "title": "HackaTocando",
      "type": "External event",
      "summary": "HackaTocando brought students and specialists together to develop ideas addressing school dropout. I was involved in organizing the event, from planning activities to coordinating the details needed to bring everyone together.",
      "proofs": [
        "Event logistics",
        "300+ participants",
        "5+ specialists"
      ],
      "links": [
        {
          "label": "Event post",
          "url": "https://pt.linkedin.com/posts/tocando-em-frente_educa%C3%A7%C3%A3o-hackathon-desafio-activity-7311452124905693185-8WV7"
        }
      ],
      "media": [
        {
          "type": "image",
          "alt": "HackaTocando 2025 invitation with colorful stars on a blue background",
          "title": "HackaTocando · 2025",
          "shortCaption": "HackaTocando · 2025"
        },
        {
          "type": "image",
          "alt": "HackaTocando poster: Cecília Cruz, Monitoramento e prevenção",
          "title": "Cecília Cruz",
          "shortCaption": "Cecília Cruz"
        },
        {
          "type": "image",
          "alt": "HackaTocando poster: Renan Ferreirinha, Monitoramento e prevenção",
          "title": "Renan Ferreirinha",
          "shortCaption": "Renan Ferreirinha"
        },
        {
          "type": "image",
          "alt": "HackaTocando poster: Felipe Soares, Engajamento juvenil",
          "title": "Felipe Soares",
          "shortCaption": "Felipe Soares"
        },
        {
          "type": "image",
          "alt": "HackaTocando poster: Arthur Potratz, Engajamento juvenil",
          "title": "Arthur Potratz",
          "shortCaption": "Arthur Potratz"
        }
      ]
    },
    {
      "title": "CineTocando",
      "type": "External event",
      "summary": "CineTocando was an event that brought together over 55 participants to explore Brazilian culture through short films and discussions. I was responsible for planning and hosting the sessions, as well as organizing the registration and feedback forms.",
      "proofs": [
        "Event logistics",
        "Short-film showcase",
        "55+ participants"
      ],
      "links": [
        {
          "label": "Event post",
          "url": ""
        }
      ],
      "media": [
        {
          "type": "image",
          "alt": "CineTocando event cover with blue silhouettes and yellow lettering",
          "title": "CineTocando",
          "shortCaption": "CineTocando"
        },
        {
          "type": "image",
          "alt": "CineTocando poster: Janialécia Lopes, Cinema de gambiarra",
          "title": "Janialécia Lopes",
          "shortCaption": "Janialécia Lopes"
        },
        {
          "type": "image",
          "alt": "CineTocando poster: Flávia Marcelino, Fazendo meu filme em casa",
          "title": "Flávia Marcelino",
          "shortCaption": "Flávia Marcelino"
        }
      ]
    },
    {
      "title": "Prêmio Sonho",
      "type": "Internal initiative",
      "summary": "Prêmio Sonho (Dream Award) is an internal initiative created to recognize the contributions of Tocando em Frente volunteers. Through categories and voting, we celebrate different ways people contribute to the organization, including work that doesn't always receive much attention. Across two editions, the initiative has included more than fifteen award categories.",
      "proofs": [
        "2 editions",
        "15+ categories",
        "Volunteer voting"
      ],
      "links": [
        {
          "label": "Award post",
          "url": ""
        }
      ],
      "media": [
        {
          "type": "image",
          "alt": "Prêmio Sonho award photograph",
          "title": "Prêmio Sonho",
          "shortCaption": "Award ceremony photo"
        },
        {
          "type": "image",
          "alt": "Prêmio Sonho nomination or category graphic",
          "title": "Nominations",
          "shortCaption": "Nomination or category graphic"
        },
        {
          "type": "video",
          "alt": "Prêmio Sonho video",
          "title": "Celebration",
          "shortCaption": "Video and poster"
        }
      ]
    }
  ]
};

bindPortfolioMedia(tocandoData.projects, "tocando");

function configureOptionalLink(link, url) {
  if (!link) return;
  const available = typeof url === "string" && url.trim() !== "";
  link.hidden = !available;
  if (available) link.href = url;
  else link.removeAttribute("href");
}

const tocandoMetrics = document.querySelector("[data-tocando-metrics]");
if (tocandoMetrics) {
  tocandoMetrics.replaceChildren(...tocandoData.metrics.map((metric) => {
    const group = document.createElement("div");
    const value = document.createElement("dd");
    const label = document.createElement("dt");
    value.textContent = metric.value;
    label.textContent = metric.label;
    group.append(label, value);
    return group;
  }));
}

const tocandoRoles = document.querySelector("[data-tocando-roles]");
if (tocandoRoles) {
  tocandoRoles.replaceChildren(...tocandoData.roles.map((role) => {
    const item = document.createElement("li");
    const year = document.createElement("time");
    const title = document.createElement("span");
    year.textContent = role.year;
    year.dateTime = role.year;
    title.textContent = role.title;
    item.append(year, title);
    return item;
  }));
}

const tocandoLinks = document.querySelector("[data-tocando-links]");
if (tocandoLinks) {
  tocandoLinks.replaceChildren(...tocandoData.links.map((item) => {
    if (item.url.trim()) {
      const link = document.createElement("a");
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `${item.label} ↗`;
      return link;
    }
    const placeholder = document.createElement("span");
    placeholder.className = "tocando-link-placeholder";
    placeholder.textContent = `${item.label} ↗`;
    placeholder.title = `Add the official ${item.label} URL in tocandoData`;
    return placeholder;
  }));
}

const recognitionArchive = document.querySelector("[data-recognition-archive]");
const tocandoLinkedIn = tocandoData.links.find((item) => item.id === "linkedin");
configureOptionalLink(recognitionArchive, tocandoLinkedIn?.url || "");

document.querySelectorAll(".tocando-memory").forEach((memory) => {
  memory.addEventListener("click", () => {
    const willOpen = memory.getAttribute("aria-expanded") !== "true";
    document.querySelectorAll(".tocando-memory[aria-expanded='true']").forEach((openMemory) => {
      openMemory.setAttribute("aria-expanded", "false");
    });
    memory.setAttribute("aria-expanded", String(willOpen));
  });
});

document.querySelectorAll("[data-recognition-timeline]").forEach((timeline) => {
  const track = timeline.querySelector("[data-recognition-track]");
  const preview = timeline.querySelector("[data-recognition-preview]");
  const fields = {
    logo: timeline.querySelector("[data-recognition-logo]"),
    title: timeline.querySelector("[data-recognition-title]"),
    context: timeline.querySelector("[data-recognition-context]"),
    link: timeline.querySelector("[data-recognition-link]")
  };
  if (!track || !preview || Object.values(fields).some((field) => !field)) return;

  function selectRecognition(index) {
    const recognition = tocandoData.recognitions[index];
    const stops = track.querySelectorAll(".recognition-stop");
    stops.forEach((stop, stopIndex) => {
      const active = stopIndex === index;
      stop.classList.toggle("is-active", active);
      stop.setAttribute("aria-pressed", String(active));
    });
    fields.logo.replaceChildren();
    mountPortfolioMedia(fields.logo, { mediaKey: "tocando-recognition-" + (index + 1) });
    fields.title.textContent = recognition.title;
    fields.context.textContent = recognition.context;
    configureOptionalLink(fields.link, recognition.link);
    preview.classList.remove("recognition-position-0", "recognition-position-1", "recognition-position-2", "recognition-position-3", "is-revealing");
    preview.classList.add(`recognition-position-${index}`);
    if (!reducedMotion.matches) {
      window.requestAnimationFrame(() => preview.classList.add("is-revealing"));
    }
  }

  const stops = tocandoData.recognitions.map((recognition, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    const mark = document.createElement("span");
    const year = document.createElement("span");
    const organization = document.createElement("strong");
    button.type = "button";
    button.className = `recognition-stop${index === 0 ? " is-active" : ""}`;
    button.setAttribute("aria-pressed", String(index === 0));
    button.setAttribute("aria-label", `Show ${recognition.organization} recognition details`);
    mark.className = "recognition-stop-mark";
    mark.setAttribute("aria-hidden", "true");
    const logo = clonePortfolioMedia({ mediaKey: "tocando-recognition-" + (index + 1) }, true).querySelector("img");
    if (logo) mark.append(logo);
    year.textContent = recognition.year;
    organization.textContent = recognition.organization;
    button.append(mark, year, organization);
    button.addEventListener("click", () => selectRecognition(index));
    button.addEventListener("focus", () => selectRecognition(index));
    button.addEventListener("mouseenter", () => selectRecognition(index));
    item.append(button);
    return item;
  });
  track.replaceChildren(...stops);
  selectRecognition(0);
});

const tefProjectCarousel = document.querySelector("[data-tef-project-carousel]");
if (tefProjectCarousel) {
  const counter = tefProjectCarousel.querySelector("[data-tef-project-counter]");
  const mainMedia = tefProjectCarousel.querySelector("[data-tef-project-main-media]");
  const thumbnails = tefProjectCarousel.querySelector("[data-tef-project-thumbnails]");
  const title = tefProjectCarousel.querySelector("[data-tef-project-title]");
  const type = tefProjectCarousel.querySelector("[data-tef-project-type]");
  const summary = tefProjectCarousel.querySelector("[data-tef-project-summary]");
  const proofs = tefProjectCarousel.querySelector("[data-tef-project-proofs]");
  const links = tefProjectCarousel.querySelector("[data-tef-project-links]");
  const status = tefProjectCarousel.querySelector("[data-tef-project-status]");
  const previous = tefProjectCarousel.querySelector("[data-tef-project-previous]");
  const next = tefProjectCarousel.querySelector("[data-tef-project-next]");
  let projectIndex = 0;
  let mediaIndex = 0;

  function createTefMedia(media, isThumbnail = false) {
    return clonePortfolioMedia(media, isThumbnail);
  }

  function renderMedia() {
    const project = tocandoData.projects[projectIndex];
    const media = project.media[mediaIndex];
    mainMedia.replaceChildren(createTefMedia(media));
    const caption = document.createElement("figcaption");
    caption.textContent = media.shortCaption;
    mainMedia.append(caption);
    thumbnails.replaceChildren(...project.media.map((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = index === mediaIndex ? "is-active" : "";
      button.dataset.mediaAvailable = String(hasPortfolioMedia(item));
      button.setAttribute("aria-pressed", String(index === mediaIndex));
      button.setAttribute("aria-label", `Show ${item.title}`);
      button.append(createTefMedia(item, true));
      button.addEventListener("click", () => {
        const restoreFocus = document.activeElement === button;
        mediaIndex = index;
        renderMedia();
        if (restoreFocus) thumbnails.children[index]?.focus({ preventScroll: true });
      });
      return button;
    }));
  }

  function renderProject(announce = false) {
    const project = tocandoData.projects[projectIndex];
    mediaIndex = 0;
    counter.textContent = `${String(projectIndex + 1).padStart(2, "0")} / ${String(tocandoData.projects.length).padStart(2, "0")}`;
    type.textContent = project.type;
    title.textContent = project.title;
    summary.textContent = project.summary;
    proofs.replaceChildren(...project.proofs.map((proof) => {
      const item = document.createElement("li");
      item.textContent = proof;
      return item;
    }));
    links.replaceChildren(...project.links.map((item) => {
      if (item.url.trim()) {
        const link = document.createElement("a");
        link.href = item.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = `${item.label} ↗`;
        return link;
      }
      const placeholder = document.createElement("span");
      placeholder.className = "tocando-link-placeholder";
      placeholder.textContent = "";
      placeholder.hidden = true;
      return placeholder;
    }));
    renderMedia();
    if (announce) status.textContent = `${project.title}, project ${projectIndex + 1} of ${tocandoData.projects.length}`;
  }

  previous.addEventListener("click", () => {
    projectIndex = (projectIndex - 1 + tocandoData.projects.length) % tocandoData.projects.length;
    renderProject(true);
  });
  next.addEventListener("click", () => {
    projectIndex = (projectIndex + 1) % tocandoData.projects.length;
    renderProject(true);
  });
  renderProject();
}

/*
 * SCHOOL VOICE / STUDENT-LED SPACES · EDITABLE CONTENT
 * Edit verified impact figures, final copy, and URLs here; media is in index.html.
 * Photo/video sources are in index.html templates; empty URLs keep CTAs hidden.
 */
const schoolVoiceData = {
  "question": {
    "messages": [
      "Can I ask you a question?",
      "You just did :)",
      "Okay, fair. So here's the real one: how do students make room for questions at school?"
    ],
    "duration": 4100,
    "reducedMotionDuration": 1400
  },
  "projects": [
    {
      "title": "ACOLHIDA SENAI",
      "eyebrow": "Student-to-student",
      "subtitle": "When I had to choose my technical course, I wished I could talk to students who were already taking it.",
      "impactPills": [
        "2 editions",
        "240+ students",
        "130+ parents"
      ],
      "shortCaption": "That's why I created SENAI Talks, an opportunity for students and their families to hear directly from those experiencing the courses. I organized the event, invited student representatives, and prepared presentations about our classes, routines, and opportunities.",
      "media": [
        {
          "type": "image",
          "alt": "Students participating in Acolhida SENAI",
          "title": "STUDENTS TALKING TO STUDENTS.",
          "shortCaption": "Students talking to students."
        },
        {
          "type": "image",
          "alt": "Acolhida SENAI open question and answer moment",
          "title": "ASK US ANYTHING.",
          "shortCaption": "Questions from future students."
        },
        {
          "type": "video",
          "alt": "Acolhida SENAI event video",
          "title": "ACOLHIDA IN MOTION.",
          "shortCaption": "A look at the event."
        }
      ],
      "links": []
    },
    {
      "title": "WORKSHOP ESCOLA ATIVA",
      "eyebrow": "School opportunities",
      "subtitle": "Showing the opportunities already inside our school.",
      "impactPills": [
        "Student representatives",
        "Mini MUN",
        "Presented to superintendent"
      ],
      "shortCaption": "There are so many things happening at school that sometimes students don't even know about them. With Escola Ativa, we wanted to show them! I contributed to organize the workshop, bringing together representatives from different projects to share their experiences. We also prepared a mini Model United Nations simulation so participants could experience one of the activities themselves.",
      "media": [
        {
          "type": "image",
          "alt": "Workshop Escola Ativa presentation",
          "title": "OPPORTUNITIES, SIDE BY SIDE.",
          "shortCaption": "Project presentations."
        },
        {
          "type": "image",
          "alt": "Workshop presentation during the superintendent's visit",
          "title": "SUPERINTENDENT VISIT.",
          "shortCaption": "Visit from the superintendent."
        },
        {
          "type": "video",
          "alt": "Mini MUN simulation during Workshop Escola Ativa",
          "title": "SHOWING, NOT EXPLAINING.",
          "shortCaption": "Mini MUN simulation."
        }
      ],
      "links": []
    },
    {
      "title": "SESI MUN",
      "eyebrow": "Model United Nations",
      "subtitle": "From taking part in debates to helping organize the club.",
      "impactPills": [
        "Club restructuring",
        "Interested grew from 16 to 32"
      ],
      "shortCaption": "I joined SESI MUN in 2024 as a member, became vice-president in 2025, and president in 2026. When my friends and I started reorganizing the club, we wanted to make it easier for new students to participate and for the club to continue even after we graduated.",
      "media": [
        {
          "type": "image",
          "alt": "SESI MUN simulation or club photograph",
          "title": "IN THE ROOM.",
          "shortCaption": "In a simulation."
        },
        {
          "type": "image",
          "alt": "SESI MUN restructuring work",
          "title": "RESTRUCTURING.",
          "shortCaption": "Working on the club."
        },
        {
          "type": "video",
          "alt": "SESI MUN debate video",
          "title": "THE DEBATE.",
          "shortCaption": "Debate in progress."
        }
      ],
      "links": []
    },
    {
      "title": "STUDENT COUNCIL",
      "eyebrow": "Student representation",
      "subtitle": "Representing students means listening to them.",
      "impactPills": [
        "3× president",
        "1× vice-president",
        "Autism awareness",
        "Down syndrome awareness"
      ],
      "shortCaption": "As president and vice-president, I helped organize school-wide awareness campaigns about Down syndrome and autism. For Down Syndrome Awareness Day, we invited students to wear mismatched socks. For autism awareness, we visited classrooms and created posters with handprints and messages from students. I also participated in academic council meetings, bringing students' suggestions and concerns to the school administration.",
      "media": [
        {
          "type": "image",
          "alt": "Student Council leadership photograph",
          "title": "STUDENT REPRESENTATION.",
          "shortCaption": "Student representation."
        },
        {
          "type": "image",
          "alt": "Autism awareness campaign at school",
          "title": "AUTISM AWARENESS.",
          "shortCaption": "Autism awareness."
        },
        {
          "type": "image",
          "alt": "Down syndrome awareness campaign at school",
          "title": "DOWN SYNDROME AWARENESS.",
          "shortCaption": "Down syndrome awareness."
        }
      ],
      "links": []
    },
    {
      "title": "SCHOOL RADIO",
      "eyebrow": "Student communication",
      "subtitle": "News from our own school community.",
      "impactPills": [
        "4 editions",
        "Academic opportunities",
        "Culture",
        "Medalists"
      ],
      "shortCaption": "I co-wrote scripts for four school-radio editions, covering academic opportunities, culture, and students' achievements. I liked taking information that could easily go unnoticed and making it accessible to more people at school.",
      "media": [
        {
          "type": "image",
          "alt": "School Radio script screenshot",
          "title": "WRITING THE SCHOOL'S VOICE.",
          "shortCaption": "Writing the script."
        },
        {
          "type": "image",
          "alt": "School Radio recording or broadcast visual",
          "title": "ON AIR.",
          "shortCaption": "The broadcast."
        },
        {
          "type": "video",
          "alt": "School Radio audio or video excerpt",
          "title": "FOUR EDITIONS.",
          "shortCaption": "Four editions."
        }
      ],
      "links": []
    }
  ]
};

bindPortfolioMedia(schoolVoiceData.projects, "school");

const questionChat = document.querySelector("[data-question-chat]");
const questionMessages = document.querySelector("[data-question-messages]");
const schoolVoiceOpening = document.getElementById("school-voice");
let questionChatPlayed = false;

if (questionMessages) {
  questionMessages.replaceChildren(...schoolVoiceData.question.messages.map((message) => {
    const bubble = document.createElement("p");
    bubble.textContent = message;
    return bubble;
  }));
}

function playQuestionChat() {
  if (!questionChat || questionChatPlayed) return;
  questionChatPlayed = true;
  questionChat.setAttribute("aria-hidden", "false");
  questionChat.classList.add("is-active");

  const visibleDuration = reducedMotion.matches ? schoolVoiceData.question.reducedMotionDuration : schoolVoiceData.question.duration;
  window.setTimeout(() => {
    questionChat.classList.remove("is-active");
    questionChat.setAttribute("aria-hidden", "true");

  }, visibleDuration);
}

if (questionChat && schoolVoiceOpening) {
  if ("IntersectionObserver" in window) {
    const questionObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      playQuestionChat();
      observer.disconnect();
    }, { threshold: 0.2 });
    questionObserver.observe(schoolVoiceOpening);
  } else {
    playQuestionChat();
  }
}

function createSchoolMediaItem(media, index) {
  const item = document.createElement("figure");
  const visual = document.createElement("div");
  const caption = document.createElement("figcaption");
  const title = document.createElement("strong");
  const copy = document.createElement("span");
  item.className = `school-media-item school-media-${media.type}${index === 0 ? " is-primary" : ""}`;
  item.tabIndex = 0;
  item.setAttribute("role", "group");
  item.setAttribute("aria-label", `${media.title} ${media.shortCaption}`);
  item.setAttribute("aria-expanded", "false");
  visual.className = "school-media-visual";

  const fragment = clonePortfolioMedia(media);
  visual.classList.toggle("is-placeholder", !fragment.querySelector("img, video"));
  visual.append(fragment);

  if (media.type === "video") {
    const playIndicator = document.createElement("span");
    playIndicator.className = "school-media-play";
    playIndicator.setAttribute("aria-hidden", "true");
    playIndicator.textContent = "▶";
    visual.append(playIndicator);
  }

  title.textContent = media.title;
  copy.textContent = media.shortCaption;
  caption.append(title, copy);
  item.append(caption, visual);

  function toggleCaption() {
    const open = item.getAttribute("aria-expanded") === "true";
    item.setAttribute("aria-expanded", String(!open));
  }
  item.addEventListener("click", (event) => {
    if (event.target.closest("video, a")) {
      item.setAttribute("aria-expanded", "true");
      return;
    }
    toggleCaption();
  });
  item.addEventListener("keydown", (event) => {
    if (event.target !== item || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    toggleCaption();
  });
  return item;
}

const schoolCarousel = document.querySelector("[data-school-carousel]");
if (schoolCarousel) {
  const slide = schoolCarousel.querySelector(".school-carousel-slide");
  const counter = schoolCarousel.querySelector("[data-school-counter]");
  const eyebrow = schoolCarousel.querySelector("[data-school-eyebrow]");
  const title = schoolCarousel.querySelector("[data-school-title]");
  const subtitle = schoolCarousel.querySelector("[data-school-subtitle]");
  const mediaGrid = schoolCarousel.querySelector("[data-school-media]");
  const impactPills = schoolCarousel.querySelector("[data-school-impact-pills]");
  const caption = schoolCarousel.querySelector("[data-school-caption]");
  const links = schoolCarousel.querySelector("[data-school-links]");
  const status = schoolCarousel.querySelector("[data-school-status]");
  const previous = schoolCarousel.querySelector("[data-school-previous]");
  const next = schoolCarousel.querySelector("[data-school-next]");
  let schoolProjectIndex = 0;

  function renderSchoolProject(announce = false) {
    const project = schoolVoiceData.projects[schoolProjectIndex];
    counter.textContent = `${String(schoolProjectIndex + 1).padStart(2, "0")} / ${String(schoolVoiceData.projects.length).padStart(2, "0")}`;
    eyebrow.textContent = project.eyebrow;
    title.textContent = project.title;
    subtitle.textContent = project.subtitle;
    mediaGrid.setAttribute("aria-label", `${project.title} media`);
    mediaGrid.replaceChildren(...project.media.map(createSchoolMediaItem));
    impactPills.replaceChildren(...project.impactPills.map((pill) => {
      const item = document.createElement("li");
      item.textContent = pill;
      return item;
    }));
    caption.textContent = project.shortCaption;
    links.replaceChildren(...project.links.filter((link) => link.url.trim()).map((item) => {
      const link = document.createElement("a");
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `${item.label} ↗`;
      return link;
    }));
    if (!reducedMotion.matches) {
      slide.classList.remove("is-changing");
      window.requestAnimationFrame(() => slide.classList.add("is-changing"));
    }
    if (announce) status.textContent = `${project.title}, project ${schoolProjectIndex + 1} of ${schoolVoiceData.projects.length}`;
  }

  previous.addEventListener("click", () => {
    schoolProjectIndex = (schoolProjectIndex - 1 + schoolVoiceData.projects.length) % schoolVoiceData.projects.length;
    renderSchoolProject(true);
  });
  next.addEventListener("click", () => {
    schoolProjectIndex = (schoolProjectIndex + 1) % schoolVoiceData.projects.length;
    renderSchoolProject(true);
  });
  renderSchoolProject();
}

const systemsProjects = [
  {
    "id": "petcarinho",
    "title": "PetCarinho",
    "descriptor": "My first team software project.",
    "context": "Technical course",
    "problem": "Veterinary clinics need to keep track of information about animals, consultations, and treatments. Our challenge was to organize these records in a system that could support veterinarians in their daily work.",
    "solution": "We developed a veterinary medical record system where users could register pets, record consultations, and prepare prescriptions, including calculations for medication and fluid therapy.",
    "roles": [
    ],
    "result": "",
    "technologies": [
      "Python",
      "Flask",
      "HTML",
      "CSS"
    ],
    "media": [
      {
        "type": "image",
        "alt": "PetCarinho project image",
        "label": "PetCarinho interface or team photo"
      },
      {
        "type": "video",
        "alt": "PetCarinho project video",
        "label": "PetCarinho demo video"
      }
    ],
    "awardBadge": "",
    "links": [
    ]
  },
  {
    "id": "doar-mais",
    "title": "Doar+",
    "descriptor": "Connecting donors and NGOs.",
    "context": "Technical course",
    "problem": "NGOs depend on support to continue their work, while people interested in helping may not know which organizations need donations or how to reach them.",
    "solution": "We worked on Doar+, a social network designed to connect NGOs and potential donors in one platform, making it easier for them to find each other..",
    "roles": [
    ],
    "result": "",
    "technologies": [
      "Python",
      "Flask",
      "React",
      "Firebird",
      "APIs"
    ],
    "media": [
      {
        "type": "image",
        "alt": "Doar+ project image",
        "label": "Doar+ platform visual"
      },
      {
        "type": "video",
        "alt": "Doar+ project video",
        "label": "Doar+ demo video"
      }
    ],
    "awardBadge": "",
    "links": [
    ]
  },
  {
    "id": "maia",
    "title": "MAIA: Vaga Certa",
    "descriptor": "Braskem - Brazilian multinational petrochemical company and the largest producer of thermoplastic resins in the Americas",
    "context": "SENAI Ideas Challenge ON",
    "problem": "Completing professional training doesn't always mean finding a job. So, we explored how technology could help graduates find opportunities that matched their skills, especially those who might struggle with traditional job-search platforms.",
    "solution": "Our team proposed Vaga Certa, a platform with MAIA, an AI assistant accessible through WhatsApp or an app. MAIA would get to know each user, help create personalized résumés, and recommend job opportunities based on their profile.",
    "roles": [
    ],
    "result": "1st Place, SENAI Ideas Challenge ON",
    "awardBadge": "1st Place · SENAI Ideas Challenge ON",
    "technologies": [
      "AI assistant concept",
      "WhatsApp",
      "Career matching"
    ],
    "media": [
      {
        "type": "image",
        "alt": "MAIA project image",
        "label": "MAIA prototype or pitch photo"
      },
      {
        "type": "video",
        "alt": "MAIA pitch video",
        "label": "MAIA pitch video"
      },
      {"type":"image","alt":"MAIA pitch photograph","label":"Pitch photograph"}
    ],
    "links": [
    ]
  },
  {
    "id": "pe-no-estoque",
    "title": "Pé no Estoque",
    "descriptor": "Pé com Pé ",
    "context": "In-Person Ideas Challenge",
    "problem": "Pé com Pé needed information about retailers' sales to improve its production planning. But we had another question to consider: what would make retailers want to share their data with the company?",
    "solution": "We proposed Pé no Estoque, a system where retailers could share their sales information and receive personalized analyses in return. We also designed Pedro, an AI assistant on WhatsApp, as one of the ways retailers could interact with the system.",
    "roles": [

    ],
    "result": "1st Place, In-Person Ideas Challenge",
    "awardBadge": "1st Place · In-Person Ideas Challenge",
    "technologies": [
      "AI assistant concept",
      "WhatsApp",
      "Sales analytics"
    ],
    "media": [
      {
        "type": "image",
        "alt": "Pé no Estoque project image",
        "label": "Pé no Estoque prototype or team photo"
      },
      {
        "type": "video",
        "alt": "Pé no Estoque pitch video",
        "label": "Pé no Estoque pitch video"
      }
    ],
    "links": [
    ]
  },
  {
    "id": "constituere",
    "title": "Constituere",
    "descriptor": "A management system for law offices.",
    "context": "Technical course · Capstone project",
    "problem": "When we were planning our final project, I thought about how my mom had to manage clients, legal cases, appointments, and payments. I wanted to create something that could make those tasks easier for her, and that's how we started developing a system for law offices.",
    "solution": "For our final SENAI project, we developed Constituere, a management system for law offices. Our system connects client and case management with scheduling and payment features, including integrations with Google Calendar and payment APIs.",
    "roles": [

    ],
    "result": "",
    "technologies": [
      "Python",
      "Flask",
      "React",
      "Firebird",
      "APIs"
    ],
    "media": [
      {
        "type": "image",
        "alt": "Constituere product screens",
        "label": "Constituere Figma or product screens"
      },
      {
        "type": "video",
        "alt": "Constituere product demo",
        "label": "Constituere prototype or demo video"
      }
    ],
    "awardBadge": "",
    "links": [
    ]
  }
];

bindPortfolioMedia(systemsProjects, "systems");

const systemsCarousel = document.querySelector("[data-systems-carousel]");
if (systemsCarousel) {
  const mediaArea = systemsCarousel.querySelector("[data-system-media]");
  const counter = systemsCarousel.querySelector("[data-system-counter]");
  const company = systemsCarousel.querySelector("[data-system-company]");
  const title = systemsCarousel.querySelector("[data-system-title]");
  const descriptor = systemsCarousel.querySelector("[data-system-descriptor]");
  const problem = systemsCarousel.querySelector("[data-system-problem]");
  const solution = systemsCarousel.querySelector("[data-system-solution]");
  const role = systemsCarousel.querySelector("[data-system-role]");
  const result = systemsCarousel.querySelector("[data-system-result]");
  const resultRow = systemsCarousel.querySelector("[data-system-result-row]");
  const technologies = systemsCarousel.querySelector("[data-system-technologies]");
  const links = systemsCarousel.querySelector("[data-system-links]");
  const dots = systemsCarousel.querySelector("[data-system-dots]");
  const status = systemsCarousel.querySelector("[data-system-status]");
  const previous = systemsCarousel.querySelector("[data-system-previous]");
  const next = systemsCarousel.querySelector("[data-system-next]");
  const touchAutoplay = window.matchMedia("(hover: none)");
  const autoplayDuration = 7000;
  const pauseReasons = new Set();
  let activeIndex = 0;
  let activeMediaIndex = 0;
  let timerId = 0;
  let timerStartedAt = 0;
  let remainingTime = autoplayDuration;

  function autoplayDisabled() {
    return reducedMotion.matches || touchAutoplay.matches;
  }

  function createSystemMedia(media, index, awardBadge) {
    const item = document.createElement("div");
    item.className = "systems-media-item";
    const fragment = clonePortfolioMedia(media);
    const hasAsset = Boolean(fragment.querySelector("img, video"));
    if (!hasAsset) {
      item.classList.add("is-placeholder");
      item.setAttribute("role", "img");
      item.setAttribute("aria-label", media.label + " to add");
    }
    const video = fragment.querySelector("video");
    if (video) {
      video.addEventListener("play", () => pauseAutoplay("video"));
      video.addEventListener("pause", () => { if (video.isConnected) resumeAutoplay("video"); });
      video.addEventListener("ended", () => resumeAutoplay("video"));
    }
    item.append(fragment);
    if (index === 0 && awardBadge) {
      const badge = document.createElement("span");
      badge.className = "systems-award-badge";
      if (item.getAttribute("role") === "img") {
        item.setAttribute("aria-label", `${media.label} to add. Award: ${awardBadge}`);
        badge.setAttribute("aria-hidden", "true");
      } else {
        badge.setAttribute("role", "img");
        badge.setAttribute("aria-label", `Award: ${awardBadge}`);
      }
      badge.textContent = awardBadge;
      item.append(badge);
    }
    return item;
  }


  function renderSystemGallery() {
    mediaArea.querySelectorAll("video").forEach(video => video.pause());
    pauseReasons.delete("video");
    const project = systemsProjects[activeIndex];
    const main = document.createElement("div");
    main.className = "systems-main-media";
    const available = project.media.map((media, index) => ({ media, index })).filter(({ media }) => hasPortfolioMedia(media));
    const thumbnails = document.createElement("div");
    thumbnails.className = "systems-thumbnails";
    thumbnails.setAttribute("role", "group");
    thumbnails.setAttribute("aria-label", project.title + " media");
    function selectMedia(index) {
      main.querySelectorAll("video").forEach(video => video.pause());
      pauseReasons.delete("video");
      activeMediaIndex = index;
      main.replaceChildren(createSystemMedia(project.media[index], index, project.awardBadge));
      thumbnails.querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed", String(Number(button.dataset.mediaIndex) === index)));
      resumeAutoplay("video");
    }
    if (available.length > 1) {
      available.forEach(({ media, index }) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.mediaIndex = index;
        button.setAttribute("aria-label", "Show " + media.label);
        button.append(clonePortfolioMedia(media, true));
        button.addEventListener("click", () => selectMedia(index));
        thumbnails.append(button);
      });
    }
    mediaArea.replaceChildren(main, thumbnails);
    selectMedia(activeMediaIndex);
  }

  function restartProgress() {
    systemsCarousel.classList.remove("is-counting", "is-paused");
    systemsCarousel.classList.toggle("is-autoplay-disabled", autoplayDisabled());
    void systemsCarousel.offsetWidth;
    remainingTime = autoplayDuration;
    if (!autoplayDisabled()) systemsCarousel.classList.add("is-counting");
  }

  function scheduleAutoplay() {
    window.clearTimeout(timerId);
    if (autoplayDisabled() || pauseReasons.size) return;
    timerStartedAt = performance.now();
    timerId = window.setTimeout(() => showProject(activeIndex + 1, false), remainingTime);
  }

  function pauseAutoplay(reason) {
    const wasRunning = pauseReasons.size === 0;
    pauseReasons.add(reason);
    if (wasRunning && timerId) {
      remainingTime = Math.max(0, remainingTime - (performance.now() - timerStartedAt));
      window.clearTimeout(timerId);
      timerId = 0;
    }
    systemsCarousel.classList.add("is-paused");
  }

  function resumeAutoplay(reason) {
    pauseReasons.delete(reason);
    if (pauseReasons.size || autoplayDisabled()) return;
    systemsCarousel.classList.remove("is-paused");
    scheduleAutoplay();
  }

  function showProject(index, announce = true) {
    pauseReasons.delete("video");
    activeIndex = (index + systemsProjects.length) % systemsProjects.length;
    const project = systemsProjects[activeIndex];
    systemsCarousel.classList.add("is-changing");
    window.setTimeout(() => systemsCarousel.classList.remove("is-changing"), reducedMotion.matches ? 0 : 220);
    counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(systemsProjects.length).padStart(2, "0")}`;
    company.textContent = project.context;
    title.textContent = project.title;
    descriptor.textContent = project.descriptor;
    problem.textContent = project.problem;
    solution.textContent = project.solution;
    role.textContent = project.roles.join(" · ");
    result.textContent = project.result;
    resultRow.hidden = !project.result || Boolean(project.awardBadge);
    activeMediaIndex = Math.max(0, project.media.findIndex(hasPortfolioMedia));
    renderSystemGallery();
    technologies.replaceChildren(...project.technologies.map((technology) => {
      const item = document.createElement("li");
      item.textContent = technology;
      return item;
    }));
    const visibleLinks = project.links.filter((link) => link.url);
    links.hidden = visibleLinks.length === 0;
    links.replaceChildren(...visibleLinks.map((link) => {
      const anchor = document.createElement("a");
      anchor.href = link.url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = `${link.label} ↗`;
      anchor.setAttribute("aria-label", `${link.label} for ${project.title} (opens in a new tab)`);
      return anchor;
    }));
    dots.querySelectorAll("button").forEach((dot, dotIndex) => dot.setAttribute("aria-current", String(dotIndex === activeIndex)));
    if (announce) status.textContent = `Project ${activeIndex + 1} of ${systemsProjects.length}: ${project.title}`;
    restartProgress();
    if (pauseReasons.size) systemsCarousel.classList.add("is-paused");
    scheduleAutoplay();
  }

  systemsProjects.forEach((project, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "systems-dot";
    dot.setAttribute("aria-label", `Show ${project.title}`);
    dot.addEventListener("click", () => showProject(index));
    dots.append(dot);
  });
  previous.addEventListener("click", () => showProject(activeIndex - 1));
  next.addEventListener("click", () => showProject(activeIndex + 1));
  systemsCarousel.addEventListener("mouseenter", () => pauseAutoplay("hover"));
  systemsCarousel.addEventListener("mouseleave", () => resumeAutoplay("hover"));
  systemsCarousel.addEventListener("focusin", () => pauseAutoplay("focus"));
  systemsCarousel.addEventListener("focusout", (event) => {
    if (!systemsCarousel.contains(event.relatedTarget)) resumeAutoplay("focus");
  });
  document.addEventListener("visibilitychange", () => document.hidden ? pauseAutoplay("hidden") : resumeAutoplay("hidden"));
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => entry.isIntersecting ? resumeAutoplay("offscreen") : pauseAutoplay("offscreen"), { threshold: 0.35 }).observe(systemsCarousel);
    pauseAutoplay("offscreen");
  }
  const updateAutoplayPreference = () => {
    window.clearTimeout(timerId);
    timerId = 0;
    restartProgress();
    scheduleAutoplay();
  };
  reducedMotion.addEventListener?.("change", updateAutoplayPreference);
  touchAutoplay.addEventListener?.("change", updateAutoplayPreference);
  showProject(0, false);
}

// Theater text is edited here; photo/video sources are in index.html templates.
const theaterProductions = [
  {
    "id": "shakespeare",
    "title": "Amar dá drama",
    "subtitle": "Theater production · The Queen",
    "year": "",
    "role": "I played the Queen.",
    "involvement": [
      "Acting"
    ],
    "audience": "",
    "shortContext": "In Amar dá drama, I played a queen trying to convince her sons to take their royal responsibilities seriously. The youngest wants to pursue a relationship, but she has conditions: he needs to learn French, and his older brother must find a relationship first. The story begins with family rules and romantic complications, then moves in a very different direction by the end.",
    "media": [
      {
        "type": "image",
        "alt": "Amar dá drama dressing-room selfie",
        "title": "Dressing room.",
        "caption": ""
      },
      {
        "type": "image",
        "alt": "Luísa on the theater stage",
        "title": "On stage.",
        "caption": ""
      },
      {
        "type": "image",
        "alt": "Amar dá drama rehearsal media",
        "title": "Rehearsal.",
        "caption": "Rehearsal photo to add."
      },
      {
        "type": "image",
        "alt": "Amar dá drama scenography media",
        "title": "Scenography.",
        "caption": "Scenography photo to add."
      },
      {
        "type": "image",
        "alt": "Amar dá drama characterization media",
        "title": "Characterization.",
        "caption": "Characterization photo to add."
      },
      {
        "type": "image",
        "alt": "Amar dá drama script work",
        "title": "Script.",
        "caption": "Script process photo or material to add."
      },
      {
        "type": "video",
        "alt": "Amar dá drama video",
        "title": "On stage.",
        "caption": "Optional performance video to add."
      },
      {
        "type": "image",
        "alt": "Amar dá drama with my teacher",
        "title": "With my teacher",
        "caption": ""
      }
    ]
  },
  {
    "id": "belas-artes-senai",
    "title": "As Pérolas de Dona Maria",
    "subtitle": "Belas Artes do SENAI · Comedy sketch",
    "year": "",
    "role": "I played Dona Maria.",
    "involvement": [
      "Acting"
    ],
    "audience": "",
    "shortContext": "Dona Maria arrives late to a show, carrying an umbrella, an old vinyl record, and a gift for the presenter. She confuses a Pocket Show with a Croquete Show, and nearly every conversation leads to another misunderstanding. I played Dona Maria, and students from other SENAI courses still recognize me by that name today.",
    "media": [
      {
        "type": "image",
        "alt": "Belas Artes do SENAI performance media",
        "title": "On stage.",
        "caption": "Main performance photo or video to add."
      },
      {
        "type": "image",
        "alt": "Belas Artes do SENAI backstage media",
        "title": "Backstage.",
        "caption": "Backstage photo to add."
      },
      {
        "type": "image",
        "alt": "Belas Artes do SENAI rehearsal media",
        "title": "Rehearsal.",
        "caption": "Rehearsal photo to add."
      },
      {
        "type": "image",
        "alt": "Belas Artes do SENAI cast media",
        "title": "Cast.",
        "caption": "Cast or team photo to add."
      },
      {
        "type": "image",
        "alt": "Additional Belas Artes do SENAI media",
        "title": "The process.",
        "caption": "Additional photo to add."
      },
      {
        "type": "video",
        "alt": "As Pérolas de Dona Maria video",
        "title": "On stage.",
        "caption": "Optional video to add."
      }
    ]
  }
];

bindPortfolioMedia(theaterProductions, "theater");

const theaterCarousel = document.querySelector("[data-theater-carousel]");
if (theaterCarousel) {
  const counter = theaterCarousel.querySelector("[data-theater-counter]");
  const mainMedia = theaterCarousel.querySelector("[data-theater-main-media]");
  const thumbnails = theaterCarousel.querySelector("[data-theater-thumbnails]");
  const title = theaterCarousel.querySelector("[data-theater-production-title]");
  const subtitle = theaterCarousel.querySelector("[data-theater-subtitle]");
  const year = theaterCarousel.querySelector("[data-theater-year]");
  const role = theaterCarousel.querySelector("[data-theater-role]");
  const involvement = theaterCarousel.querySelector("[data-theater-involvement]");
  const audience = theaterCarousel.querySelector("[data-theater-audience]");
  const shortContext = theaterCarousel.querySelector("[data-theater-short-context]");
  const status = theaterCarousel.querySelector("[data-theater-status]");
  const previous = theaterCarousel.querySelector("[data-theater-previous]");
  const next = theaterCarousel.querySelector("[data-theater-next]");
  let productionIndex = 0;
  let mediaIndex = 0;

  function buildTheaterVisual(media, isMain = false) {
    const fragment = clonePortfolioMedia(media, !isMain);
    const asset = fragment.querySelector("img, video");
    if (asset && isMain) return asset;
    if (asset?.tagName === "IMG") {
      asset.style.removeProperty("object-fit");
      asset.style.removeProperty("object-position");
    }
    const wrapper = document.createElement("div");
    wrapper.className = isMain ? "theater-main-placeholder" : "theater-thumbnail-visual";
    wrapper.append(fragment);
    return wrapper;
  }

  function renderMainMedia() {
    const production = theaterProductions[productionIndex];
    const media = production.media[mediaIndex];
    const visual = buildTheaterVisual(media, true);
    const caption = document.createElement("figcaption");
    const captionTitle = document.createElement("strong");
    const captionCopy = document.createElement("span");
    captionTitle.textContent = media.title;
    captionCopy.textContent = media.caption;
    captionCopy.hidden = /\bto add\.?$/i.test(media.caption);
    caption.append(captionTitle, captionCopy);
    mainMedia.replaceChildren(visual, caption);
    thumbnails.querySelectorAll("button").forEach((button, index) => button.setAttribute("aria-current", String(index === mediaIndex)));
  }

  function renderProduction(announce = true) {
    const production = theaterProductions[productionIndex];
    mediaIndex = 0;
    counter.textContent = `${String(productionIndex + 1).padStart(2, "0")} / ${String(theaterProductions.length).padStart(2, "0")}`;
    title.textContent = production.title;
    subtitle.textContent = production.subtitle;
    year.textContent = production.year;
    role.textContent = production.role;
    shortContext.textContent = production.shortContext;
    shortContext.hidden = !production.shortContext;
    audience.textContent = production.audience;
    audience.hidden = !production.audience;
    involvement.replaceChildren(...production.involvement.map((itemText) => {
      const item = document.createElement("li");
      item.textContent = itemText;
      return item;
    }));
    thumbnails.style.setProperty("--theater-thumbnail-count", production.media.length);
    thumbnails.replaceChildren(...production.media.map((media, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "theater-thumbnail";
      button.dataset.mediaAvailable = String(hasPortfolioMedia(media));
      button.setAttribute("aria-label", `Show ${media.title} ${media.caption}`);
      const caption = document.createElement("span");
      caption.className = "theater-thumbnail-caption";
      caption.textContent = media.title;
      button.append(caption, buildTheaterVisual(media));
      if (media.type === "video") {
        const play = document.createElement("span");
        play.className = "theater-play-indicator";
        play.setAttribute("aria-hidden", "true");
        play.textContent = "▶";
        button.append(play);
      }
      button.addEventListener("click", () => {
        mediaIndex = index;
        renderMainMedia();
        status.textContent = `${media.title} selected for ${production.title}`;
      });
      return button;
    }));
    renderMainMedia();
    if (announce) status.textContent = `Production ${productionIndex + 1} of ${theaterProductions.length}: ${production.title}`;
  }

  function changeProduction(direction) {
    productionIndex = (productionIndex + direction + theaterProductions.length) % theaterProductions.length;
    renderProduction();
  }
  previous.addEventListener("click", () => changeProduction(-1));
  next.addEventListener("click", () => changeProduction(1));
  renderProduction(false);
}

// Awards evidence links and concise metadata are maintained here.
// Edit photos, videos, and certificates in index.html templates; keep evidence URLs below.
function awardMediaSlots(label) {
  return [
    { type: "image", alt: label + " evidence image", shortCaption: label + " photo / document" },
    { type: "video", alt: label + " video", shortCaption: label + " video" }
  ];
}

function awardLinkSlots(labels) {
  return labels.map((label) => ({ label, url: "" }));
}

const recognitionMilestones = [
  {
    id: "fll-national-2022", year: "2022", category: "Robotics",
    shortTitle: "FIRST LEGO League", fullTitle: "FIRST LEGO League", result: "National Champion",
    ranking: "", scope: "National",
    media: awardMediaSlots("FLL National Championship"),
    links: awardLinkSlots(["Official result", "News article"])
  },
  {
    id: "fll-alliance-2022", year: "2022", category: "Robotics",
    shortTitle: "FIRST LEGO League", fullTitle: "FIRST LEGO League", result: "Alliance Challenge World Champion",
    ranking: "", scope: "International",
    media: awardMediaSlots("FLL Alliance Challenge"),
    links: awardLinkSlots(["Official result", "Competition page", "Watch video"])
  },
  {
    id: "fll-international-2022", year: "2022", category: "Robotics",
    shortTitle: "FIRST LEGO League", fullTitle: "FIRST LEGO League", result: "International Champion",
    ranking: "", scope: "International",
    media: awardMediaSlots("FLL International Championship"),
    links: awardLinkSlots(["Official result", "News article", "Watch video"])
  },
  {
    id: "robot-performance-2023", year: "2023", category: "Robotics",
    shortTitle: "Robot Performance", fullTitle: "Robot Performance Champion · SESI FLL Robotics Tournament", result: "Champion",
    ranking: "", scope: "Tournament",
    media: awardMediaSlots("Robot Performance Championship"),
    links: awardLinkSlots(["Official result", "School article", "Watch video"])
  },
  {
    id: "oba-2023", year: "2023", category: "Science",
    shortTitle: "OBA", fullTitle: "Brazilian Astronomy and Astronautics Olympiad (OBA)", result: "Gold Medal",
    ranking: "", scope: "National",
    media: awardMediaSlots("OBA Gold Medal"),
    links: awardLinkSlots(["Official result", "Competition page"])
  },
  {
    id: "ijb-2023", year: "2023", category: "Writing",
    shortTitle: "IJB Essay Contest", fullTitle: "IJB Essay Contest", result: "Champion",
    ranking: "Essay published in a nationwide MUN newsletter", scope: "National",
    media: awardMediaSlots("IJB Essay Contest"),
    links: awardLinkSlots(["Published essay", "Organization post"])
  },
  {
    id: "kangaroo-2024", year: "2024", category: "Math",
    shortTitle: "Kangaroo Mathematics", fullTitle: "International Kangaroo Mathematics Contest", result: "Bronze Medal",
    expandedResult: "2× Bronze Medalist", ranking: "", scope: "2024 + 2025",
    connectionId: "kangaroo",
    media: awardMediaSlots("Kangaroo Mathematics Bronze Medals"),
    links: awardLinkSlots(["Official result", "Competition page"])
  },
  {
    id: "kangaroo-2025", year: "2025", category: "Math",
    shortTitle: "Kangaroo Mathematics", fullTitle: "International Kangaroo Mathematics Contest", result: "Bronze Medal",
    expandedResult: "2× Bronze Medalist", ranking: "", scope: "2024 + 2025",
    connectionId: "kangaroo",
    media: awardMediaSlots("Kangaroo Mathematics Bronze Medals"),
    links: awardLinkSlots(["Official result", "Competition page"])
  },
  {
    id: "msf-2025", year: "2025", category: "Math",
    shortTitle: "Mathématiques Sans Frontières", fullTitle: "International Olympiad Mathématiques Sans Frontières · Brazilian Selection", result: "Silver Medal",
    ranking: "", scope: "National",
    media: awardMediaSlots("Mathématiques Sans Frontières Silver Medal"),
    links: awardLinkSlots(["Official result", "Competition page"])
  },
  {
    id: "ideas-on-2025", year: "2025", category: "Tech",
    shortTitle: "Ideas Challenge ON", fullTitle: "SENAI Ideas Challenge ON", result: "1st Place",
    ranking: "", scope: "State / Regional",
    media: awardMediaSlots("Ideas Challenge ON"),
    links: awardLinkSlots(["Official result", "News article", "Related project"])
  },
  {
    id: "ideas-presencial-2025", year: "2025", category: "Tech",
    shortTitle: "Desafio de Ideias Presencial", fullTitle: "Desafio de Ideias Presencial", result: "1st Place",
    ranking: "", scope: "",
    media: awardMediaSlots("Desafio de Ideias Presencial"),
    links: awardLinkSlots(["Official result", "News article", "Related project"])
  },
  {
    id: "olitef-2025", year: "2025", category: "Math / Financial Education",
    shortTitle: "OLITEF", fullTitle: "OLITEF · National Treasury Olympiad", result: "Recognition",
    ranking: "", scope: "National",
    media: awardMediaSlots("OLITEF recognition"),
    links: awardLinkSlots(["Official result", "Competition page", "News article"])
  }
];

bindPortfolioMedia(recognitionMilestones, "milestones");

const awardsTimeline = document.querySelector("[data-awards-timeline]");
if (awardsTimeline) {
  const timelineYears = ["2022", "2023", "2024", "2025"];
  let expandedEntry = null;

  function createAwardMediaVisual(media, main) {
    const visual = document.createElement("div");
    visual.className = main ? "award-evidence-main-visual" : "award-evidence-thumb-visual";
    const fragment = clonePortfolioMedia(media, !main);
    visual.classList.toggle("is-placeholder", !fragment.querySelector("img, video"));
    visual.append(fragment);
    if (media.type === "video" && !visual.querySelector("video")) {
      const play = document.createElement("span");
      play.className = "award-evidence-play";
      play.setAttribute("aria-hidden", "true");
      play.textContent = "▶";
      visual.append(play);
    }
    return visual;
  }

  function renderAwardMainMedia(panel, milestone, mediaIndex) {
    const media = milestone.media[mediaIndex];
    const main = panel.querySelector("[data-award-main-media]");
    const caption = document.createElement("figcaption");
    caption.textContent = media.shortCaption;
    main.replaceChildren(createAwardMediaVisual(media, true), caption);
    panel.querySelectorAll("[data-award-media-index]").forEach((button) => {
      button.setAttribute("aria-current", String(Number(button.dataset.awardMediaIndex) === mediaIndex));
    });
  }

  function closeAwardEntry(entry) {
    if (!entry) return;
    entry.classList.remove("is-expanded");
    const button = entry.querySelector("[data-award-toggle]");
    const panel = entry.querySelector("[data-award-panel]");
    button.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
    panel.inert = true;
    panel.querySelectorAll("video").forEach((video) => video.pause());
    if (expandedEntry === entry) expandedEntry = null;
  }

  function openAwardEntry(entry, milestone) {
    if (expandedEntry && expandedEntry !== entry) closeAwardEntry(expandedEntry);
    entry.classList.add("is-expanded");
    const button = entry.querySelector("[data-award-toggle]");
    const panel = entry.querySelector("[data-award-panel]");
    button.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
    panel.inert = false;
    expandedEntry = entry;
    renderAwardMainMedia(panel, milestone, Math.max(0, milestone.media.findIndex(hasPortfolioMedia)));
  }

  timelineYears.forEach((year) => {
    const yearGroup = document.createElement("section");
    const yearLabel = document.createElement("h3");
    const journey = document.createElement("div");
    const milestones = recognitionMilestones.filter((milestone) => milestone.year === year);
    yearGroup.className = "award-year-group";
    yearLabel.className = "award-year-label";
    yearLabel.textContent = year;
    journey.className = "award-year-journey";

    milestones.forEach((milestone) => {
      const entry = document.createElement("article");
      const toggle = document.createElement("button");
      const marker = document.createElement("span");
      const category = document.createElement("span");
      const title = document.createElement("span");
      const result = document.createElement("span");
      const panel = document.createElement("div");
      const panelInner = document.createElement("div");
      const gallery = document.createElement("div");
      const main = document.createElement("figure");
      const thumbnails = document.createElement("div");
      const evidence = document.createElement("div");
      const evidenceTitle = document.createElement("p");
      const metadata = document.createElement("p");
      const links = document.createElement("div");
      let expandedBeforePointer = false;

      entry.className = "award-entry" + (milestone.connectionId ? " is-connected-award" : "");
      if (milestone.connectionId) entry.dataset.connection = milestone.connectionId;
      toggle.type = "button";
      toggle.className = "award-pin";
      toggle.dataset.awardToggle = "";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", "award-panel-" + milestone.id);
      toggle.setAttribute("aria-label", milestone.shortTitle + ": " + milestone.result + ", " + milestone.year);
      marker.className = "award-marker-dot";
      marker.setAttribute("aria-hidden", "true");
      category.className = "award-pin-category";
      category.textContent = milestone.category;
      title.className = "award-pin-title";
      title.textContent = milestone.shortTitle;
      result.className = "award-pin-result";
      result.textContent = milestone.result;
      toggle.append(marker, category, title, result);

      panel.id = "award-panel-" + milestone.id;
      panel.className = "award-media-panel";
      panel.dataset.awardPanel = "";
      panel.setAttribute("aria-hidden", "true");
      panel.inert = true;
      panelInner.className = "award-media-panel-inner";
      gallery.className = "award-evidence-gallery";
      main.className = "award-evidence-main";
      main.dataset.awardMainMedia = "";
      thumbnails.className = "award-evidence-thumbnails";
      thumbnails.setAttribute("aria-label", "Choose evidence media for " + milestone.shortTitle);

      milestone.media.slice(0, 4).forEach((media, mediaIndex) => {
        const thumbnail = document.createElement("button");
        thumbnail.type = "button";
        thumbnail.className = "award-evidence-thumb";
        thumbnail.dataset.mediaAvailable = String(hasPortfolioMedia(media));
        thumbnail.dataset.awardMediaIndex = String(mediaIndex);
        thumbnail.setAttribute("aria-label", "Show " + media.shortCaption);
        thumbnail.append(createAwardMediaVisual(media, false));
        thumbnail.addEventListener("click", () => renderAwardMainMedia(panel, milestone, mediaIndex));
        thumbnails.append(thumbnail);
      });
      gallery.append(main, thumbnails);

      evidence.className = "award-evidence-copy";
      evidenceTitle.className = "award-evidence-title";
      evidenceTitle.textContent = milestone.fullTitle + " · " + (milestone.expandedResult || milestone.result);
      metadata.className = "award-evidence-metadata";
      metadata.textContent = [milestone.ranking, milestone.scope].filter(Boolean).join(" · ");
      links.className = "award-evidence-links";
      milestone.links.forEach((link) => {
        if (link.url) {
          const anchor = document.createElement("a");
          anchor.href = link.url;
          anchor.target = "_blank";
          anchor.rel = "noopener noreferrer";
          anchor.textContent = link.label + " ↗";
          anchor.setAttribute("aria-label", link.label + " for " + milestone.shortTitle + " in a new tab");
          links.append(anchor);
        } else {
          const placeholder = document.createElement("span");
          placeholder.className = "award-evidence-link-placeholder";
          placeholder.textContent = link.label + " ↗";
          placeholder.title = "Add this URL in recognitionMilestones";
          links.append(placeholder);
        }
      });
      evidence.append(evidenceTitle, metadata, links);
      panelInner.append(gallery, evidence);
      panel.append(panelInner);

      entry.append(toggle, panel);
      toggle.addEventListener("pointerdown", () => {
        expandedBeforePointer = toggle.getAttribute("aria-expanded") === "true";
      });
      toggle.addEventListener("click", (event) => {
        const isExpanded = toggle.getAttribute("aria-expanded") === "true";
        const shouldCollapse = event.detail === 0 ? isExpanded : expandedBeforePointer;
        if (shouldCollapse) closeAwardEntry(entry);
        else openAwardEntry(entry, milestone);
      });
      toggle.addEventListener("focus", () => openAwardEntry(entry, milestone));
      journey.append(entry);
    });
    yearGroup.append(yearLabel, journey);
    awardsTimeline.append(yearGroup);
  });
}

const currentlyCurious = [
  {
    "id": "data-patterns",
    "question": "How much can data tell us about the way people live?",
    "secondaryQuestion": "And what might we miss if we look only at the numbers?"
  },
  {
    "id": "automation-human",
    "question": "Why is a system simple for one person and difficult for another?",
    "secondaryQuestion": "How much do we need to understand about the people using it?"
  },
  {
    "id": "human-choices",
    "question": "Why can two people see the same situation so differently?",
    "secondaryQuestion": "What would I notice if I started from the other person's point of view?"
  },
  {
    "id": "opportunity-place",
    "question": "How do students find opportunities they don't even know exist?",
    "secondaryQuestion": "What makes it easier for someone to take the first step?"
  },
  {
    "id": "human-ai",
    "question": "What should we leave to people, even when technology could do it?",
    "secondaryQuestion": "And what could we automate to give them more time for other things?"
  }
];

const curiousQuestions = document.querySelector("[data-curious-questions]");

if (curiousQuestions) {
  currentlyCurious.forEach((item, index) => {
    const thought = document.createElement("article");
    const toggle = document.createElement("button");
    const number = document.createElement("span");
    const question = document.createElement("span");
    const secondaryQuestion = document.createElement("span");

    thought.className = `curious-thought curious-thought-${index + 1}`;
    toggle.type = "button";
    toggle.className = "curious-question-toggle";
    toggle.setAttribute("aria-pressed", "false");
    toggle.setAttribute("aria-controls", `curious-detail-${item.id}`);
    number.className = "curious-question-number";
    number.setAttribute("aria-hidden", "true");
    number.textContent = String(index + 1).padStart(2, "0");
    question.className = "curious-question-text";
    question.textContent = item.question;
    secondaryQuestion.id = `curious-detail-${item.id}`;
    secondaryQuestion.className = "curious-secondary-question";
    secondaryQuestion.textContent = item.secondaryQuestion;
    toggle.append(number, question, secondaryQuestion);

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-pressed") === "true";
      toggle.setAttribute("aria-pressed", String(!isOpen));
    });

    thought.append(toggle);
    curiousQuestions.append(thought);
  });
}

const portfolioFooter = {
  github: "",
  linkedin: "",
  email: "",
  year: "2026"
};

const portfolioClosingPhotos = [
  { alt: "Personal photo 01", label: "Photo 01" },
  { alt: "Personal photo 02", label: "Photo 02" },
  { alt: "Personal photo 03", label: "Photo 03" },
  { alt: "Personal photo 04", label: "Photo 04" },
  { alt: "Personal photo 05", label: "Photo 05" }
];

portfolioClosingPhotos.forEach((photo, index) => { photo.mediaKey = "closing-" + (index + 1); });

const closingTrigger = document.querySelector("[data-closing-trigger]");
const finalQuestion = document.querySelector("[data-final-question]");
const finalQuestionText = document.querySelector("[data-final-question-text]");
const finalQuestionAnnouncement = document.querySelector("[data-final-question-announcement]");
const closingPhotoBubbles = document.querySelector("[data-closing-photo-bubbles]");
const portfolioFooterLinks = document.querySelector("[data-portfolio-footer-links]");
const portfolioFooterIdentity = document.querySelector("[data-portfolio-footer-identity]");
const closingQuestionCopy = "What have you been curious about lately?";

function typeFinalQuestion() {
  if (!finalQuestionText || !finalQuestionAnnouncement) return;
  finalQuestionText.textContent = "";
  finalQuestionAnnouncement.textContent = "";
  if (reducedMotion.matches) {
    finalQuestionText.textContent = closingQuestionCopy;
    finalQuestionAnnouncement.textContent = closingQuestionCopy;
    finalQuestion?.classList.add("is-complete");
    return;
  }

  finalQuestion?.classList.add("is-typing");
  let characterIndex = 0;
  const typeNextCharacter = () => {
    characterIndex += 1;
    finalQuestionText.textContent = closingQuestionCopy.slice(0, characterIndex);
    if (characterIndex < closingQuestionCopy.length) {
      window.setTimeout(typeNextCharacter, 68);
      return;
    }
    finalQuestion?.classList.remove("is-typing");
    finalQuestion?.classList.add("is-complete");
    finalQuestionAnnouncement.textContent = closingQuestionCopy;
  };
  window.setTimeout(typeNextCharacter, 280);
}

if (closingTrigger && finalQuestion) {
  closingTrigger.addEventListener("click", () => {
    if (closingTrigger.getAttribute("aria-expanded") === "true") return;
    closingTrigger.setAttribute("aria-expanded", "true");
    finalQuestion.removeAttribute("inert");
    finalQuestion.setAttribute("aria-hidden", "false");
    typeFinalQuestion();
  });
}

if (closingPhotoBubbles) {
  portfolioClosingPhotos.forEach((photo, index) => {
    const bubble = document.createElement("figure");
    bubble.className = `closing-photo-bubble closing-photo-bubble-${index + 1}`;
    bubble.append(clonePortfolioMedia(photo));
    closingPhotoBubbles.append(bubble);
  });
}

if (portfolioFooterLinks) {
  const footerLinks = [
    { label: "LinkedIn ↗", value: portfolioFooter.linkedin },
    { label: "GitHub ↗", value: portfolioFooter.github },
    { label: "Email ↗", value: portfolioFooter.email, email: true }
  ];

  footerLinks.forEach((item) => {
    if (!item.value) {
      const placeholder = document.createElement("span");
      placeholder.className = "portfolio-footer-link-placeholder";
      placeholder.textContent = item.label;
      placeholder.setAttribute("aria-label", `${item.label.replace(" ↗", "")} link to configure`);
      portfolioFooterLinks.append(placeholder);
      return;
    }
    const link = document.createElement("a");
    link.href = item.email && !item.value.startsWith("mailto:") ? `mailto:${item.value}` : item.value;
    link.textContent = item.label;
    if (!item.email) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    portfolioFooterLinks.append(link);
  });
}

if (portfolioFooterIdentity) {
  portfolioFooterIdentity.textContent = `Luísa Michelin Riqueti · ${portfolioFooter.year}`;
}

// Luli's Shelf text. Photos and videos are edited in the shelf templates in index.html.
const luliDrawerItems = [
  {
    "id": "tracinha",
    "title": "Tracinha",
    "objectType": "book",
    "shortMemory": "My mom taught me to read and write, and she still calls me tracinha. It's a nickname that has stayed with me for years.",
    "media": [
      {
        "type": "image",
        "alt": "Handwritten note or childhood reading photograph"
      }
    ],
    "link": ""
  },
  {
    "id": "grandpa-puzzle",
    "title": "Grandpa & me",
    "objectType": "puzzle",
    "shortMemory": "When I was around six, I used to assemble princess puzzles with my grandfather at the dining table.",
    "media": [
      {
        "type": "image",
        "alt": "Luísa and her grandfather assembling a princess puzzle"
      }
    ],
    "link": ""
  },
  {
    "id": "crostoli",
    "title": "Crostoli",
    "objectType": "recipe",
    "shortMemory": "",
    "media": [
      {
        "type": "image",
        "alt": "Crostoli family tradition photograph"
      }
    ],
    "link": "",
    "published": false
  },
  {
    "id": "copacabana-jeans",
    "title": "Copacabana. In jeans.",
    "objectType": "postcard",
    "shortMemory": "I went to Copacabana in jeans during a robotics trip. I still have the photo.",
    "media": [
      {
        "type": "image",
        "alt": "Luísa visiting Copacabana during a robotics trip"
      }
    ],
    "link": ""
  },
  {
    "id": "languages",
    "title": "Languages",
    "objectType": "notebook",
    "shortMemory": "Italian, French, Spanish, and Mandarin are all languages I want to learn. I keep finding more that interest me.",
    "media": [
      {
        "type": "image",
        "alt": "Language notebook or vocabulary cards"
      }
    ],
    "link": ""
  },
  {
    "id": "why-pink",
    "title": "Why pink?",
    "objectType": "pink",
    "shortMemory": "My godmother filled my childhood with pink. I never really stopped liking it.",
    "media": [
      {
        "type": "image",
        "alt": "Luísa's mother and godmother at her third birthday"
      }
    ],
    "link": ""
  },
  {
    "id": "golden-trio",
    "title": "The Golden Trio",
    "objectType": "trio",
    "shortMemory": "Raquel, Sarah, and me. Robotics is where our Golden Trio began.",
    "media": [
      {
        "type": "image",
        "alt": "Luísa, Raquel, and Sarah together at robotics"
      }
    ],
    "link": ""
  }
];

bindPortfolioMedia(luliDrawerItems.filter(item => item.published !== false), "shelf");

const luliDrawerOverlay = document.querySelector("[data-luli-drawer]");
const luliDrawer = luliDrawerOverlay?.querySelector(".luli-drawer");
const luliDrawerClose = document.querySelector("[data-luli-drawer-close]");
const luliDrawerItemsContainer = document.querySelector("[data-luli-drawer-items]");
const luliDrawerDetail = document.querySelector("[data-luli-drawer-detail]");
const luliDrawerMedia = document.querySelector("[data-luli-drawer-media]");
const luliDrawerDetailTitle = document.querySelector("[data-luli-drawer-detail-title]");
const luliDrawerDetailMemory = document.querySelector("[data-luli-drawer-detail-memory]");
const luliDrawerDetailLink = document.querySelector("[data-luli-drawer-detail-link]");
const luliTouchTrigger = document.querySelector("[data-luli-touch-trigger]");
const luliShelfNavButton = document.querySelector("[data-open-luli-shelf]");
const luliPageRegions = [document.querySelector("header"), document.querySelector("main")].filter(Boolean);
let luliDrawerOpen = false;
let luliDrawerPreviousFocus = null;
let luliSequenceIndex = 0;
let luliSequenceTimer = 0;
let luliTapCount = 0;
let luliTapTimer = 0;
let luliSuppressTriggerClick = false;

function createLuliObjectVisual(type) {
  const visual = document.createElement("span");
  visual.className = `luli-object-visual luli-object-${type}`;
  visual.setAttribute("aria-hidden", "true");
  if (type === "trio") {
    visual.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));
  }
  return visual;
}

function renderLuliDrawerDetail(item) {
  if (!luliDrawerMedia || !luliDrawerDetailTitle || !luliDrawerDetailMemory || !luliDrawerDetailLink) return;
  luliDrawerMedia.replaceChildren();
  const media = item.media.find(entry => portfolioMediaTemplates.get(entry.mediaKey)?.content.querySelector("img, video")) || item.media[0];
  luliDrawerMedia.append(clonePortfolioMedia(media));
  luliDrawerDetailTitle.textContent = item.title;
  luliDrawerDetailMemory.textContent = item.shortMemory;
  luliDrawerDetailLink.hidden = !item.link;
  if (item.link) {
    luliDrawerDetailLink.href = item.link;
    luliDrawerDetailLink.textContent = "Open related memory ↗";
  } else {
    luliDrawerDetailLink.removeAttribute("href");
  }
  luliDrawerItemsContainer?.querySelectorAll(".luli-drawer-object").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.drawerItem === item.id));
  });
}

if (luliDrawerItemsContainer) {
  luliDrawerItems.filter(item => item && item.published !== false).forEach((item) => {
    const button = document.createElement("button");
    const label = document.createElement("span");
    button.type = "button";
    button.className = "luli-drawer-object";
    button.dataset.drawerItem = item.id;
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `Open memory: ${item.title}`);
    label.className = "luli-object-label";
    label.textContent = item.title;
    button.append(createLuliObjectVisual(item.objectType), label);
    button.addEventListener("click", () => renderLuliDrawerDetail(item));
    luliDrawerItemsContainer.append(button);
  });
  if (luliDrawerItems[0]) renderLuliDrawerDetail(luliDrawerItems[0]);
}

function setLuliDrawerScrollLock(locked) {
  const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
  document.documentElement.style.setProperty("--drawer-scrollbar-width", `${locked ? scrollbarWidth : 0}px`);
  document.body.classList.toggle("luli-drawer-open", locked);
}

function openLuliDrawer() {
  if (!luliDrawerOverlay || luliDrawerOpen) return;
  luliDrawerOpen = true;
  luliDrawerPreviousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  luliDrawerOverlay.hidden = false;
  luliPageRegions.forEach((region) => { region.inert = true; });
  setLuliDrawerScrollLock(true);
  window.requestAnimationFrame(() => luliDrawerOverlay.classList.add("is-open"));
  luliDrawerClose?.focus({ preventScroll: true });
}

function closeLuliDrawer() {
  if (!luliDrawerOverlay || !luliDrawerOpen) return;
  luliDrawerOpen = false;
  luliDrawerOverlay.classList.remove("is-open");
  setLuliDrawerScrollLock(false);
  luliPageRegions.forEach((region) => { region.inert = false; });
  const finishClose = () => {
    if (!luliDrawerOpen) luliDrawerOverlay.hidden = true;
  };
  if (reducedMotion.matches) finishClose();
  else window.setTimeout(finishClose, 360);
  if (luliDrawerPreviousFocus && luliDrawerPreviousFocus.isConnected && luliDrawerPreviousFocus !== document.body) {
    luliDrawerPreviousFocus.focus({ preventScroll: true });
  }
  luliDrawerPreviousFocus = null;
}

function toggleLuliDrawer() {
  if (luliDrawerOpen) closeLuliDrawer();
  else openLuliDrawer();
}

function isEditableTarget(target) {
  return target instanceof Element && Boolean(target.closest("input, textarea, select, [contenteditable='true'], [contenteditable=''], [role='textbox']"));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && luliDrawerOpen) {
    event.preventDefault();
    closeLuliDrawer();
    return;
  }

  if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing || isEditableTarget(event.target)) return;

  if (luliDrawerOpen && event.key === "Tab" && luliDrawer) {
    const focusable = Array.from(luliDrawer.querySelectorAll("button:not([disabled]), a[href], video[controls], [tabindex]:not([tabindex='-1'])"));
    if (focusable.length) {
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    return;
  }

  if (!/^[a-z]$/i.test(event.key)) return;
  const sequence = "luli";
  const key = event.key.toLowerCase();
  window.clearTimeout(luliSequenceTimer);
  luliSequenceIndex = key === sequence[luliSequenceIndex] ? luliSequenceIndex + 1 : (key === sequence[0] ? 1 : 0);
  if (luliSequenceIndex === sequence.length) {
    luliSequenceIndex = 0;
    toggleLuliDrawer();
  } else if (luliSequenceIndex > 0) {
    luliSequenceTimer = window.setTimeout(() => { luliSequenceIndex = 0; }, 1400);
  }
});

// Unlike page chapters, Luli's Shelf is a dialog, so its navbar entry opens it.
luliShelfNavButton?.addEventListener("click", openLuliDrawer);
luliDrawerClose?.addEventListener("click", closeLuliDrawer);
luliDrawerOverlay?.addEventListener("pointerdown", (event) => {
  if (event.target === luliDrawerOverlay) closeLuliDrawer();
});

luliTouchTrigger?.addEventListener("pointerup", (event) => {
  if (event.pointerType === "mouse") return;
  window.clearTimeout(luliTapTimer);
  luliTapCount += 1;
  if (luliTapCount >= 5) {
    luliTapCount = 0;
    luliSuppressTriggerClick = true;
    toggleLuliDrawer();
    return;
  }
  luliTapTimer = window.setTimeout(() => { luliTapCount = 0; }, 2200);
});

luliTouchTrigger?.addEventListener("click", (event) => {
  if (!luliSuppressTriggerClick) return;
  event.preventDefault();
  luliSuppressTriggerClick = false;
});

