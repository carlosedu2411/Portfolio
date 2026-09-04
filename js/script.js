// ── DOWNLOAD CV ──────────────────────────────────────────
function baixarCV() {
  const link = document.createElement("a");
  link.href = "curriculo.pdf";
  link.download = "curriculo.pdf";
  link.click();
}

// ── SCROLL TO SECTION ─────────────────────────────────────
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ── AOS + NAVBAR + CARDS ─────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {

  // Desenha rastros curvos orbitando o centro da foto.
  const blackHoleCanvas = document.getElementById("blackHoleCanvas");
  const heroSection = document.querySelector(".hero-section");
  const heroImageWrapper = document.querySelector(".hero-img-wrapper");
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (blackHoleCanvas && heroSection && heroImageWrapper) {
    const context = blackHoleCanvas.getContext("2d");
    const trails = Array.from({ length: 115 }, (_, index) => ({
      radius: 36 + Math.random() * 430,
      length: 35 + Math.random() * 190,
      angle: Math.random() * Math.PI * 2,
      width: 0.35 + Math.random() * 1.25,
      alpha: 0.16 + Math.random() * 0.65,
      speed: 0.000015 + Math.random() * 0.000035,
      seed: index * 17.31,
    }));
    let animationFrame;
    let lastTime = 0;

    function resizeBlackHoleCanvas() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      blackHoleCanvas.width = heroSection.clientWidth * pixelRatio;
      blackHoleCanvas.height = heroSection.clientHeight * pixelRatio;
      blackHoleCanvas.style.width = `${heroSection.clientWidth}px`;
      blackHoleCanvas.style.height = `${heroSection.clientHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function drawBlackHole(time) {
      const width = heroSection.clientWidth;
      const height = heroSection.clientHeight;
      const imageBounds = heroImageWrapper.getBoundingClientRect();
      const sectionBounds = heroSection.getBoundingClientRect();
      const centerX = imageBounds.left - sectionBounds.left + imageBounds.width / 2;
      const centerY = imageBounds.top - sectionBounds.top + imageBounds.height / 2;
      const verticalScale = window.innerWidth < 768 ? 0.48 : 0.38;

      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = "lighter";
      trails.forEach((trail) => {
        const phase = trail.angle + time * trail.speed;
        const startRadius = trail.radius;
        const endRadius = startRadius + trail.length;
        const points = 12;

        context.beginPath();
        for (let point = 0; point <= points; point += 1) {
          const progress = point / points;
          const radius = startRadius + (endRadius - startRadius) * progress;
          const curve = phase + radius * 0.0065 + Math.sin(trail.seed + radius * 0.018) * 0.035;
          const x = centerX + Math.cos(curve) * radius * 1.45;
          const y = centerY + Math.sin(curve) * radius * verticalScale;
          if (point === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        const fade = 1 - startRadius / 540;
        context.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.04, trail.alpha * fade)})`;
        context.lineWidth = trail.width;
        context.stroke();
      });
      context.restore();

      if (!motionQuery.matches) animationFrame = requestAnimationFrame(drawBlackHole);
    }

    resizeBlackHoleCanvas();
    window.addEventListener("resize", resizeBlackHoleCanvas);
    drawBlackHole(lastTime);
    motionQuery.addEventListener("change", () => {
      cancelAnimationFrame(animationFrame);
      drawBlackHole(lastTime);
    });
  }

  // Inicializar AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  // Navbar: adiciona classe ao rolar
  const nav = document.getElementById("mainNav");
  if (nav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        nav.classList.add("scrolled", "has-shadow");
      } else {
        nav.classList.remove("scrolled", "has-shadow");
      }
    });
  }

  // Marcar link ativo na navbar conforme seção visível
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-pill");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove("active"));
        const active = document.querySelector(`.nav-pill[href="#${entry.target.id}"]`);
        if (active) active.classList.add("active");
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));

  // Navegação para páginas de projetos ao clicar no card
  const projectCards = document.querySelectorAll(".project-card[data-projeto], .project-card[data-link]");
  projectCards.forEach(card => {
    card.addEventListener("click", function () {
      const link = this.getAttribute("data-link");
      if (link) {
        window.open(link, "_blank", "noopener");
        return;
      }
      const projeto = this.getAttribute("data-projeto");
      window.location.href = `html/projeto-${projeto}.html`;
    });
  });

  // Abrir/fechar painel de certificações
  const certButton = document.getElementById("certButton");
  const certPanel = document.getElementById("certificationsPanel");
  const certOverlay = document.getElementById("certificationsOverlay");
  const closeCertButton = document.getElementById("closeCertifications");

  function toggleCertPanel(forceOpen) {
    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !certPanel.classList.contains("open");
    certPanel.classList.toggle("open", shouldOpen);
    certOverlay.classList.toggle("open", shouldOpen);
    document.body.classList.toggle("overflow-hidden", shouldOpen);
    certButton.setAttribute("aria-expanded", shouldOpen);
    certPanel.setAttribute("aria-hidden", String(!shouldOpen));
  }

  if (certButton && certPanel && certOverlay && closeCertButton) {
    certButton.addEventListener("click", () => toggleCertPanel(true));
    closeCertButton.addEventListener("click", () => toggleCertPanel(false));
    certOverlay.addEventListener("click", () => toggleCertPanel(false));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        toggleCertPanel(false);
      }
    });
  }

});
