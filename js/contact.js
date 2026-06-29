const cf = document.querySelector(".contact-form");
const s = document.querySelector(".btn-submit");

cf.addEventListener("submit", (e) => {
  e.preventDefault();

  const os = s.innerHTML;

  s.innerHTML = " Đã gửi thành công ✓";
  s.style.backgroundColor = "var(--color-gold-dim)";
  s.style.color = "var(--color-white)";
  s.style.pointerEvents = "none";
  cf.reset();

  setTimeout(() => {
    s.innerHTML = os;
    s.style.backgroundColor = "";
    s.style.color = "";
    s.style.pointerEvents = "auto";
  }, 4000);
});
