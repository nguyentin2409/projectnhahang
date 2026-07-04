// Chọn form đặt bàn và nút xác nhận dựa trên ID và Class trong file HTML
const reservationForm = document.querySelector("#reservationForm");
const submitBtn = reservationForm.querySelector(".btn-primary");

reservationForm.addEventListener("submit", (e) => {
  // Ngăn chặn trang bị tải lại khi gửi form
  e.preventDefault();

  // Lưu lại nội dung text ban đầu của nút bấm
  const originalText = submitBtn.innerHTML;

  // Thay đổi trạng thái nút bấm khi đặt bàn thành công
  submitBtn.innerHTML = " Đặt Bàn Thành Công ✓";
  submitBtn.style.backgroundColor = "var(--color-muted)"; // Sử dụng biến màu phụ của nhóm
  submitBtn.style.color = "var(--color-surface)";
  submitBtn.style.pointerEvents = "none"; // Khóa nút để tránh bấm liên tục

  // Reset toàn bộ dữ liệu đã nhập trong form
  reservationForm.reset();

  // Trả nút bấm về trạng thái ban đầu sau 4 giây
  setTimeout(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.style.backgroundColor = "";
    submitBtn.style.color = "";
    submitBtn.style.pointerEvents = "auto";
  }, 4000);
});
