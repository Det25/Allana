(() => {
  "use strict";

  const intro = document.getElementById("intro");
  const app = document.getElementById("app");
  const enterButton = document.getElementById("enterButton");
  const mainStage = document.getElementById("mainStage");
  const navItems = document.querySelectorAll(".nav-item");
  const panels = document.querySelectorAll("[data-view-panel]");
  const openLetterButton = document.getElementById("openLetter");
  const letterModal = document.getElementById("letterModal");
  const modalCloseButtons = document.querySelectorAll("[data-close-modal]");
  const proposalActions = document.getElementById("proposalActions");
  const acceptButton = document.getElementById("acceptButton");
  const talkButton = document.getElementById("talkButton");
  const acceptAnswer = document.getElementById("acceptAnswer");
  const talkAnswer = document.getElementById("talkAnswer");
  const backToChoices = document.getElementById("backToChoices");
  const cakeToggle = document.getElementById("cakeToggle");
  const cakeReveal = document.getElementById("cakeReveal");
  const muralHint = document.getElementById("muralHint");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function enterSite() {
    intro.classList.add("is-hidden");
    app.classList.remove("is-locked");
    setActiveView("home");
  }

  function setActiveView(viewName) {
    if (!document.getElementById(viewName)) return;
    app.dataset.view = viewName;
    navItems.forEach((item) => {
      const isActive = item.dataset.view === viewName;
      item.classList.toggle("active", isActive);
      if (isActive) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    panels.forEach((panel) => panel.classList.toggle("active", panel.id === viewName));
    if (mainStage) mainStage.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    revealVisibleElements();
  }

  function revealVisibleElements() {
    const current = document.querySelector(".view.active");
    if (!current) return;
    current.querySelectorAll(".reveal-on-view").forEach((el, index) => {
      el.style.setProperty("--delay", `${Math.min(index * 70, 280)}ms`);
      requestAnimationFrame(() => el.classList.add("is-visible"));
    });
  }

  function openModal() {
    letterModal.classList.add("is-open");
    letterModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    window.setTimeout(() => letterModal.querySelector(".close-button")?.focus(), 80);
  }

  function closeModal() {
    letterModal.classList.remove("is-open");
    letterModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    openLetterButton?.focus();
  }

  function resetProposal() {
    proposalActions.hidden = false;
    acceptAnswer.hidden = true;
    talkAnswer.hidden = true;
  }

  enterButton?.addEventListener("click", enterSite);
  navItems.forEach((item) => item.addEventListener("click", () => setActiveView(item.dataset.view)));
  document.querySelectorAll("[data-go-view]").forEach((button) => {
    button.addEventListener("click", () => setActiveView(button.dataset.goView));
  });
  document.querySelector(".rail-mark")?.addEventListener("click", (event) => {
    event.preventDefault();
    setActiveView("home");
  });

  document.querySelectorAll(".polaroid").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".polaroid").forEach((item) => item.classList.remove("is-peeked"));
      card.classList.add("is-peeked");
      if (muralHint) muralHint.textContent = card.dataset.caption || "Recorte selecionado.";
    });
  });

  cakeToggle?.addEventListener("click", () => {
    const expanded = cakeToggle.getAttribute("aria-expanded") === "true";
    cakeToggle.setAttribute("aria-expanded", String(!expanded));
    cakeReveal.hidden = expanded;
    cakeToggle.innerHTML = expanded ? 'Ver protocolo <span aria-hidden="true">↗</span>' : 'Ocultar protocolo <span aria-hidden="true">↘</span>';
  });

  openLetterButton?.addEventListener("click", openModal);
  modalCloseButtons.forEach((button) => button.addEventListener("click", closeModal));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && letterModal.classList.contains("is-open")) closeModal();
  });

  acceptButton?.addEventListener("click", () => {
    proposalActions.hidden = true;
    talkAnswer.hidden = true;
    acceptAnswer.hidden = false;
    acceptAnswer.querySelector("h3")?.focus();
  });
  talkButton?.addEventListener("click", () => {
    proposalActions.hidden = true;
    acceptAnswer.hidden = true;
    talkAnswer.hidden = false;
  });
  backToChoices?.addEventListener("click", resetProposal);

  // Pequenos símbolos flutuantes: decorativos, sem bloquear cliques.
  const ambientLayer = document.getElementById("ambientDoodles");
  if (ambientLayer && !reducedMotion) {
    const marks = [
      { text: "♪", x: "17%", y: "19%", size: "1.7rem", duration: "7s", delay: "0s" },
      { text: "✎", x: "88%", y: "31%", size: "1.7rem", duration: "8s", delay: ".6s" },
      { text: "✳", x: "73%", y: "78%", size: "1.2rem", duration: "6.5s", delay: "1s" }
    ];
    marks.forEach((mark) => {
      const el = document.createElement("span");
      el.className = "ambient-mark";
      el.textContent = mark.text;
      el.style.setProperty("--x", mark.x);
      el.style.setProperty("--y", mark.y);
      el.style.setProperty("--size", mark.size);
      el.style.setProperty("--duration", mark.duration);
      el.style.setProperty("--delay", mark.delay);
      ambientLayer.appendChild(el);
    });
  }

  revealVisibleElements();
})();
