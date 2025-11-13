document.addEventListener("DOMContentLoaded", () => {
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  const overlay = document.getElementById("menuOverlay");
  const openMenu = document.getElementById("openMenu");
  const closeMenu = document.getElementById("closeMenu");
  const panels = document.querySelectorAll(".tab-panel");

  // ---------------------------
  // 🎬 Função: extrair ID do YouTube
  // ---------------------------
  function extractYouTubeID(url) {
    if (!url) return null;
    try {
      const u = new URL(url, location.href);
      if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split(/[/?#]/)[0];
      if (u.hostname.includes("youtube.com")) {
        if (u.pathname.includes("/embed/")) return u.pathname.split("/embed/").pop().split(/[/?#]/)[0];
        if (u.searchParams.get("v")) return u.searchParams.get("v").split("&")[0];
      }
    } catch {}
    const m = url.match(/(?:youtu\.be\/|\/embed\/|v=)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  // ---------------------------
  // 📺 Carregar vídeos em um painel
  // ---------------------------
  function loadVideosInPanel(panel) {
    panel.querySelectorAll(".video-wrap").forEach(wrap => {
      const src = wrap.dataset.videoSrc;
      const type = wrap.dataset.videoType;
      if (!src) return;
      if (type === "youtube" && src.includes("youtu")) {
        const id = extractYouTubeID(src);
        if (!id) return;
        wrap.querySelectorAll("iframe").forEach(f => f.remove());
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${id}`;
        iframe.title = "Vídeo tutorial";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.loading = "lazy";
        wrap.appendChild(iframe);
      }
    });
  }

  // ---------------------------
  // ⏹️ Parar todos os vídeos
  // ---------------------------
  function stopAllVideos() {
    document.querySelectorAll(".video-wrap iframe").forEach(ifr => ifr.remove());
  }

  // ---------------------------
  // 🌙 Abrir e fechar a central
  // ---------------------------
  function toggleOverlay(show) {
    if (show) {
      overlay.classList.add("open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      // 🔁 Reabrir dropdown da aba ativa
      const ultimaAba = localStorage.getItem("ultimaAba");
      if (ultimaAba) {
        const ativoBtn = document.querySelector(`[data-tab="${ultimaAba}"]`);
        const ativoDrop = ativoBtn?.closest(".menu-section.dropdown");
        if (ativoDrop) ativoDrop.classList.add("open");
      }

    } else {
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  openMenu.addEventListener("click", () => toggleOverlay(true));
  closeMenu.addEventListener("click", () => toggleOverlay(false));
  overlay.addEventListener("click", e => {
    if (e.target === overlay) toggleOverlay(false);
  });

  // ---------------------------
  // 📱 & 💻 Dropdowns — mesmo comportamento
  // ---------------------------
  document.querySelectorAll(".dropdown .dropdown-header").forEach(h => {
    h.addEventListener("click", () => {
      const parent = h.parentElement;
      const isOpen = parent.classList.contains("open");

      // Fecha todos
      document.querySelectorAll(".menu-section.dropdown").forEach(sec => sec.classList.remove("open"));

      // Reabre somente o clicado
      if (!isOpen) parent.classList.add("open");
    });
  });

  // ---------------------------
  // 🔁 Troca de abas / painéis
  // ---------------------------
  document.querySelectorAll("[data-tab]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = btn.dataset.tab;
      if (!tab) return;

      // Fechar central
      toggleOverlay(false);

      // Parar vídeos anteriores
      stopAllVideos();

      // Trocar painel
      panels.forEach(p => p.classList.remove("active", "fade-in"));
      const target = document.getElementById(tab);
      if (target) {
        target.classList.add("active");
        setTimeout(() => target.classList.add("fade-in"), 20);
        loadVideosInPanel(target);
      }

      // Marcar ativo
      document.querySelectorAll(".menu-section .dropdown-content button").forEach(b => b.classList.remove("active"));
      if (btn.matches(".menu-section .dropdown-content button")) btn.classList.add("active");

      // Abrir o dropdown da aba ativa
      const parentDropdown = btn.closest(".menu-section.dropdown");
      if (parentDropdown) {
        document.querySelectorAll(".menu-section.dropdown").forEach(sec => sec.classList.remove("open"));
        parentDropdown.classList.add("open");
      }

      // Salvar aba no localStorage
      localStorage.setItem("ultimaAba", tab);
    });
  });

  // ---------------------------
  // 🔁 Restaurar última aba ao carregar
  // ---------------------------
  const ultimaAba = localStorage.getItem("ultimaAba");
  if (ultimaAba && document.getElementById(ultimaAba)) {
    panels.forEach(p => p.classList.remove("active"));
    const alvo = document.getElementById(ultimaAba);
    alvo.classList.add("active", "fade-in");
    loadVideosInPanel(alvo);

    // 🔹 Abre o dropdown correspondente
    const ativoBtn = document.querySelector(`[data-tab="${ultimaAba}"]`);
    const ativoDrop = ativoBtn?.closest(".menu-section.dropdown");
    if (ativoDrop) ativoDrop.classList.add("open");
  } else {
    const inicial = document.querySelector(".tab-panel.active");
    if (inicial) loadVideosInPanel(inicial);
  }
});
