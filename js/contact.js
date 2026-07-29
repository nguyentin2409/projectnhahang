/** 
 * ===========================================================================
 * contact.js - Trang Liên Hệ (contact.html)
 * MSSV: B2404886 - Họ tên: Võ Quỳnh Trân 
 * ==========================================================================
 *
 * CHỨC NĂNG CỦA FILE NÀY:
 * Khi khách hàng nhập các thông tin trong biểu mẫu (họ tên, email, chủ đề, nôi dung phản hồi) 
 * và bấm gửi thì giao diện sẽ hiện lên bảng thông báo "Đã gửi góp ý thành công. Cảm ơn Thực Khách." giúp khách hàng 
 * xác nhận thông tin của mình đã được gửi.
  */

 // Dùng biến const để lưu trữ thông tin phần tử DOM,
//Dùng hàm querySelector để tìm phần tử html có class được định nghĩa sẳn bên contact.html 
//Lưu thông tin tìm được vào biến contactForm để sử dụng cho phần dưới.
const contactForm = document.querySelector(".contact-form"); 

//Thông tin vừa tìm kiếm trong biến contactForm gọi hàm addEventListener
/**  Hàm addEventListener (hàm lắng nghe sự kiện) :có 2 tham số (tên sự kiện, hàm xử lí) với sự kiện là "submit",
 * khi người dùng bấm gửi thông tin hàm xử lí sẽ được kích hoạt và chạy các lệnh bên trong hàm*/
contactForm.addEventListener("submit", (event) => {
  event.preventDefault(); // dùng event object để gọi hàm ngăn chặn chế độ chuyển trang hay tải trang web sau khi nhấn submit.
  alert("Đã gửi góp ý thành công. Cảm ơn Thực Khách."); //hàm alert() hiển thị bảng thông báo khi khách hàng nhấn Gửi.
  contactForm.reset(); //Sau khi bảng thông báo hiện thông tin và khách hàng nhấn ok đã xác nhận thì hàm reset() sẽ làm mới các ô nhập thông tin như ban đầu.
});
