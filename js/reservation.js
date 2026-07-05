const reservationForm = document.querySelector("#reservationForm");
const submitBtn = reservationForm.querySelector(".btn-primary");

reservationForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = " Đặt Bàn Thành Công ✓";
  submitBtn.style.backgroundColor = "var(--color-muted)";
  submitBtn.style.color = "var(--color-surface)";
  submitBtn.style.pointerEvents = "none";

  reservationForm.reset();
  setTimeout(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.style.backgroundColor = "";
    submitBtn.style.color = "";
    submitBtn.style.pointerEvents = "auto";
  }, 4000);
});
