document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const body = document.body;
  const navLinks = document.querySelectorAll(".nav-links a");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("open");
      body.classList.toggle("nav-mobile-open");
    });
  }
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (body.classList.contains("nav-mobile-open")) {
        menuToggle.classList.remove("open");
        body.classList.remove("nav-mobile-open");
      }
    });
  });

  const backToTopBtn = document.querySelector(".back-to-top");

  if (backToTopBtn) {
    backToTopBtn.style.opacity = "0";
    backToTopBtn.style.visibility = "hidden";
    backToTopBtn.style.transition = "opacity 0.3s, visibility 0.3s";

    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.opacity = "1";
        backToTopBtn.style.visibility = "visible";
      } else {
        backToTopBtn.style.opacity = "0";
        backToTopBtn.style.visibility = "hidden";
      }
    });
  }
});
