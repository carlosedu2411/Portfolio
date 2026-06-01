// ── DOWNLOAD CV ──────────────────────────────────────────
function baixarCV() {
  const link = document.createElement("a");
  link.href = "curriculo.pdf";
  link.download = "curriculo.pdf";
  link.click();
}

// ── AOS + NAVBAR + CARDS ─────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {

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
  const projectCards = document.querySelectorAll(".project-card[data-projeto]");
  projectCards.forEach(card => {
    card.addEventListener("click", function () {
      const projeto = this.getAttribute("data-projeto");
      window.location.href = `html/projeto-${projeto}.html`;
    });
  });

});
