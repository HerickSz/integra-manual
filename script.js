document.addEventListener("DOMContentLoaded", () => {
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const dropdowns = document.querySelectorAll(".dropdown");
  const panels = document.querySelectorAll(".tab-panel");
  const links = document.querySelectorAll("[data-tab]");

  // Toggle do menu mobile
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  // Dropdowns (abre/fecha e fecha ao clicar fora)
  dropdowns.forEach(drop => {
    const btn = drop.querySelector(".tab-btn");

    btn.addEventListener("click", e => {
      e.stopPropagation();
      dropdowns.forEach(d => {
        if (d !== drop) d.classList.remove("open");
      });
      drop.classList.toggle("open");
    });
  });

  // Fecha dropdown ao clicar fora
  document.addEventListener("click", e => {
    if (![...dropdowns].some(d => d.contains(e.target))) {
      dropdowns.forEach(d => d.classList.remove("open"));
    }
  });

  // Alterna painéis (abas)
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const tab = link.dataset.tab;

      // 🔇 Para qualquer vídeo em execução (remove todos os iframes)
      document.querySelectorAll(".video-wrap").forEach(v => (v.innerHTML = ""));

      // Fecha todos os painéis e abre o selecionado
      panels.forEach(p => p.classList.remove("active"));
      const activePanel = document.getElementById(tab);
      activePanel?.classList.add("active");

      // Fecha dropdowns e menu mobile
      dropdowns.forEach(d => d.classList.remove("open"));
      nav.classList.remove("open");

      // ▶️ Recarrega o vídeo do painel ativo
      const videoWraps = activePanel?.querySelectorAll(".video-wrap") || [];
      videoWraps.forEach(wrap => {
        const type = wrap.dataset.videoType;
        const src = wrap.dataset.videoSrc;

        if (type === "youtube" && src.includes("youtu")) {
          // Extrai ID de qualquer formato de link (youtu.be, youtube.com, etc)
          let videoId = "";
          if (src.includes("v=")) videoId = src.split("v=")[1].split("&")[0];
          else videoId = src.split("/").pop().split("?")[0];

          const iframe = document.createElement("iframe");
          iframe.src = `https://www.youtube.com/embed/${videoId}`;
          iframe.title = "Vídeo tutorial";
          iframe.allowFullscreen = true;
          wrap.appendChild(iframe);
        }
      });
    });
  });

  
  // Inicializa vídeos apenas na aba ativa no carregamento
  const initialPanel = document.querySelector(".tab-panel.active");
  if (initialPanel) {
    initialPanel.querySelectorAll(".video-wrap").forEach(wrap => {
      const type = wrap.dataset.videoType;
      const src = wrap.dataset.videoSrc;

      if (type === "youtube" && src.includes("youtu")) {
        let videoId = "";
        if (src.includes("v=")) videoId = src.split("v=")[1].split("&")[0];
        else videoId = src.split("/").pop().split("?")[0];

        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.title = "Vídeo tutorial";
        iframe.allowFullscreen = true;
        wrap.appendChild(iframe);
      }
    });
  }
});

// Dropdown → item ativo
document.querySelectorAll(".dropdown-content a").forEach(link => {
  link.addEventListener("click", e => {
    document.querySelectorAll(".dropdown-content a").forEach(a => a.classList.remove("active"));
    link.classList.add("active");

    // Destaca o dropdown principal
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    link.closest(".dropdown")?.querySelector(".tab-btn")?.classList.add("active");
  });
});
