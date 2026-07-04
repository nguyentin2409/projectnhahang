/* ------ XỬ LÝ LOGIC ĐẶT BÀN ------ */

document.addEventListener("DOMContentLoaded", function () {
  const dateInput = document.getElementById("Reserve_Date");
  const timeInput = document.getElementById("appointment");
  const form = document.getElementById("reservationForm");

  // 1. Giới hạn không cho chọn ngày trong quá khứ
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  // Set thuộc tính min cho ô Input Date
  dateInput.min = `${yyyy}-${mm}-${dd}`;

  // 2. Hàm kiểm tra tính hợp lệ của Giờ Đặt Bàn dựa trên Ngày được chọn
  function validateTime() {
    const selectedDateStr = dateInput.value;
    const selectedTimeStr = timeInput.value;

    if (!selectedDateStr || !selectedTimeStr) return true;

    const selectedDate = new Date(selectedDateStr);
    const dayOfWeek = selectedDate.getDay(); // 0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7

    // Tách chuỗi lấy giờ và phút
    const [hours, minutes] = selectedTimeStr.split(":").map(Number);
    const timeInMinutes = hours * 60 + minutes;

    let isValid = true;
    let errorMessage = "";

    // Kiểm tra Thứ 7 (6) & Chủ Nhật (0) -> Phục vụ: 10:00 - 23:00 (600 phút - 1380 phút)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      if (timeInMinutes < 10 * 60 || timeInMinutes > 23 * 60) {
        isValid = false;
        errorMessage =
          "Cuối tuần nhà hàng mở cửa từ 10:00 đến 23:00. Vui lòng chọn lại giờ!";
      }
    } else {
      // Thứ 2 đến Thứ 6 -> Phục vụ: 10:00 - 22:00 (600 phút - 1320 phút)
      if (timeInMinutes < 10 * 60 || timeInMinutes > 22 * 60) {
        isValid = false;
        errorMessage =
          "Ngày trong tuần nhà hàng mở cửa từ 10:00 đến 22:00. Vui lòng chọn lại giờ!";
      }
    }

    if (!isValid) {
      timeInput.setCustomValidity(errorMessage);
      timeInput.reportValidity();
      return false;
    } else {
      timeInput.setCustomValidity(""); // Reset trạng thái lỗi nếu hợp lệ
      return true;
    }
  }

  // Lắng nghe sự thay đổi của ngày hoặc giờ để kích hoạt kiểm tra hợp lệ
  timeInput.addEventListener("change", validateTime);
  dateInput.addEventListener("change", validateTime);

  // 3. Xử lý khi nhấn nút Submit gửi form
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn trang bị reload lại

    // Kiểm tra giờ một lần nữa trước khi gửi
    if (!validateTime()) {
      return;
    }

    // Lấy thông tin khách hàng nhập vào
    const customerName = document.getElementById("fullName").value;
    const customerDate = dateInput.value;
    const customerTime = timeInput.value;
    const partySize = document.getElementById("partySize").value;

    // Hiển thị thông báo thành công
    alert(
      `🎉 Đặt bàn thành công!\nXin chào ${customerName},\nNhà hàng Vị Ngon đã ghi nhận lịch hẹn của bạn vào lúc ${customerTime} ngày ${customerDate} dành cho ${partySize} người.`,
    );

    // Reset lại form sạch sẽ sau khi đặt thành công
    form.reset();
    dateInput.min = `${yyyy}-${mm}-${dd}`; // Khôi phục lại min date sau khi reset
  });
});
