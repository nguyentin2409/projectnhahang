/** 
 * ===========================================================================
 * contact.js - Trang Liên Hệ (contact.html)
 * MSSV: B2404886 - Họ tên: Võ Quỳnh Trân 
 * ==========================================================================
 *
 * CHỨC NĂNG CỦA FILE NÀY:
 * Xử lí thao tác cho khách hàng gửi các thông tin cần liên hệ.
 * Khi khách hàng nhập các thông tin trong biểu mẫu (họ tên, email, chủ đề, nôi dung phản hồi) 
 * và bấm gửi thì dao diện nút gửi sẽ chuyển thành "Đã gửi thành công ✓"  
 * và đổi màu giúp khách hàng nhận biết thông tin mình gửi đã được hệ thống ghi nhận thành công.
  */

 // Dùng biến const để lưu trữ thông tin phần tử DOM,
/** Vì sao k dùng biến let => Dùng const để lưu trữ các giá trị 
 * cố định không thay đổi trong suốt quá trình chạy, giúp code an toàn không bị ghi đè dữ liệu */
//Dùng hàm querySelector để tìm tên class được định nghĩa sẳn bên contact.html 
//Lưu thông tin tìm được vào biến contactForm, submitBnt để sử dụng cho phần dưới.
const contactForm = document.querySelector(".contact-form"); 
const submitBtn = document.querySelector(".btn-submit");

//Thông tin vừa tìm kiếm trong biến contactForm gọi hàm addEventListener
/**  Hàm addEventListener có 2 tham số *(tên sự kiện, hàm xử lí) có chức năng lắng nghe sự kiện "submit",
 * khi người dùng bấm gửi thông tin hàm xử lí sẽ được kích hoạt và chạy các lệnh bên trong hàm*/
contactForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Gọi hàm ngăn chặn chế độ chuyển trang hay tải trang web sau khi nhấn submit
  const originalText = submitBtn.innerHTML; //Dùng thuộc tính innerHTML lấy dòng chữ bên trong nút submit vào biến originalText

  submitBtn.innerHTML = " Đã gửi thành công ✓"; //Thay đổi phần dòng chữ bên trong nút submit -> Đã gửi thành công ✓
  // Dùng thuộc tính style để trực tiếp thao tác vào phần contact.css
  submitBtn.style.backgroundColor = "var(--color-gold-dim)"; //Đổi màu nền ô submit thành màu nhạt hơn
  submitBtn.style.color = "var(--color-white)"; //Đổi màu chữ sang màu trắng
  submitBtn.style.pointerEvents = "none"; // Thuộc tính pointerEvents = "none" khóa nút submit lại không cho người dùng nhấn vào khi đã bấm gửi

  // Sau khi bấm gửi tạo 1 hàm đếm thời gian (4s) quay lại trang thái nút ban đầu
  setTimeout(() => {
    //Thay đổi giao diện nút submit gồm (dòng chữ bên trong, màu nền, màu chữ) và mở khóa nút về lại ban đầu
    submitBtn.innerHTML = originalText; 
    submitBtn.style.backgroundColor = "";
    submitBtn.style.color = "";
    submitBtn.style.pointerEvents = "auto";
    contactForm.reset(); //Xóa toàn bộ dữ liệu đã nhập trong biểu mãu
  }, 4000);
});
