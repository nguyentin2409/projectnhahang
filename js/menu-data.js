/**
 * ==========================================================================
 * menu-data.js - Nguồn dữ liệu DUY NHẤT của toàn bộ món ăn trong thực đơn
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 * ==========================================================================
 *
 * TẠI SAO CẦN FILE NÀY?
 *  - Thay vì danh sách 9 món ăn được viết CỨNG trực tiếp trong
 *    menu.html (mỗi món là 1 khối <div class="menu-item">...</div>).
 *  - Vấn đề: khi tách thêm trang "Món Yêu Thích" (favorite.html) riêng,
 *    trang đó KHÔNG THỂ đọc lại HTML của menu.html (2 trang độc lập,
 *    không cùng tồn tại trên 1 DOM tại cùng thời điểm).
 *  - Giải pháp: tách dữ liệu món ăn ra thành 1 MẢNG JavaScript dùng
 *    chung, để CẢ menu.js (trang Thực Đơn) VÀ favorite.js (trang Yêu
 *    Thích) đều gọi lại được cùng 1 nguồn, rồi mỗi trang tự RENDER
 *    (vẽ) ra HTML theo cách của mình.
 *  - Đúng kỹ thuật "tách dữ liệu khỏi giao diện, render động bằng
 *    JS" mà slide CT188-BGR dạy ngay sau Project 3 (Ví dụ 4.6).
 *
 * File này phải được nạp (<script>) TRƯỚC menu.js và favorite.js trong
 * HTML, vì 2 file đó cần biến MENU_ITEMS đã tồn tại sẵn khi chúng chạy.
 */
const MENU_ITEMS = [
  {
    id: "goi-cuon-tom-thit",
    category: "appetizer",
    name: "Gỏi Cuốn Tôm Thịt",
    price: 65000,
    image: "../images/menu-1.jpg",
    description:
      "Cuốn tươi với tôm, thịt heo, bún, rau sống và tương hoisin đậm vị.",
  },
  {
    id: "bun-cha-ha-noi",
    category: "main",
    name: "Bún chả Hà Nội",
    price: 100000,
    image: "../images/bun-cha.jpg",
    description: "Sợi bún dai và ngon, nước đậm đà hương vị",
  },
  {
    id: "bun-bo-hue",
    category: "main",
    name: "Bún Bò Huế",
    price: 120000,
    image: "../images/menu-2.jpg",
    description:
      "Nước dùng hầm 12 giờ, thịt bò tươi mỏng, bánh phở dai mềm.",
  },
  {
    id: "com-tam-suon-bi-cha",
    category: "main",
    name: "Cơm Tấm Sườn Bì Chả",
    price: 95000,
    image: "../images/menu-3.jpg",
    description:
      "Sườn nướng than hoa, bì sợi dai, chả hấp mịn, cơm tấm dẻo.",
  },
  {
    id: "pho-bo-dac-biet",
    category: "main",
    name: "Phở Bò Đặc Biệt",
    price: 130000,
    image: "../images/pho-bo.jpg",
    description: "Sợi phở thơm, nước dùng đậm chất hương vị truyền thống",
  },
  {
    id: "canh-chua-ca-loc",
    category: "soup",
    name: "Canh Chua Cá Lóc",
    price: 80000,
    image: "../images/menu-4.jpg",
    description:
      "Vị chua thanh từ me, ngọt cá, thơm cà chua và giá đỗ tươi.",
  },
  {
    id: "che-ba-mau",
    category: "dessert",
    name: "Chè Ba Màu",
    price: 45000,
    image: "../images/menu-5.jpg",
    description:
      "Đậu xanh, đậu đỏ, thạch pandan mướt mát trên đá bào kem cốt dừa.",
  },
  {
    id: "ca-loc-kho-to",
    category: "main",
    name: "Cá Lóc Kho Tộ",
    price: 159000,
    image: "../images/ca-loc-kho-to.jpg",
    description: "Vị cá mặn mà đậm chất quê hương",
  },
  {
    id: "nuoc-ep-trai-cay-tuoi",
    category: "drink",
    name: "Nước Ép Trái Cây Tươi",
    price: 55000,
    image: "../images/menu-6.jpg",
    description:
      "Ép từ trái cây tươi mỗi ngày — cam, dưa hấu, thơm, dâu tây.",
  },
];