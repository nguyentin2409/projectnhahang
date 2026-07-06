/**
 * menu.js - Xử lý chức năng lọc món ăn theo danh mục + chức năng "Yêu Thích"
 * cho trang Thực Đơn (menu.html)
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 *
 * Vì đây là website nhà hàng ăn tại chỗ (khách xem menu để chọn món rồi
 * gọi món trực tiếp với nhân viên), trang này KHÔNG dùng giỏ hàng/thanh toán
 * online. Thay vào đó, khách có thể bấm ♥ để đánh dấu "món yêu thích" —
 * giúp lưu lại nhanh những món muốn gọi, có thể xem lại bằng tab "Yêu Thích".
 *
 * Cách hoạt động (đúng nhóm kỹ thuật DOM + Events của Project 3 BGR):
 *  - Mỗi nút tab (.tab-btn) có thuộc tính data-category (vd: "main", "soup", "all"...)
 *    Tab đặc biệt data-category="favorite" lọc theo trạng thái yêu thích thay vì danh mục món.
 *  - Mỗi món ăn (.menu-item) có data-category (để lọc theo danh mục),
 *    data-id (khoá định danh duy nhất, dùng để lưu/đọc localStorage) và
 *    data-price (giá món, dùng để tính tổng tiền các món yêu thích).
 *  - Danh sách món đã thích được lưu trong localStorage (key: "vingon_favorites")
 *    dưới dạng mảng các data-id, để khi khách quay lại trang vẫn còn nguyên trạng thái.
 */
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "vingon_favorites";

  const tabs = document.querySelectorAll(".tab-btn");
  const items = document.querySelectorAll(".menu-item");
  const summaryBox = document.getElementById("favorite-summary");
  const summaryText = document.getElementById("favorite-summary-text");
  const summaryTotal = document.getElementById("favorite-summary-total");
  const emptyFavoriteMsg = document.getElementById("empty-favorite-msg");

  // ===== ĐỌC / LƯU danh sách yêu thích trong localStorage =====
  function getFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      // Nếu dữ liệu lưu bị lỗi (hỏng JSON) thì coi như chưa có món nào được thích
      return [];
    }
  }

  function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    // Báo cho shared.js (đang quản lý header dùng chung) biết để cập nhật
    // số lượng yêu thích hiển thị trên icon header ở mọi trang
    if (typeof window.updateFavoriteBadge === "function") {
      window.updateFavoriteBadge();
    }
  }

  // Định dạng số tiền theo kiểu Việt Nam: 1.000.000₫
  function formatCurrency(amount) {
    return amount.toLocaleString("vi-VN") + "₫";
  }

  // ===== Cập nhật giao diện nút ♥ theo trạng thái đã thích/chưa thích =====
  function renderFavoriteButtons() {
    const favorites = getFavorites();
    items.forEach((item) => {
      const btn = item.querySelector(".btn-favorite");
      const isFavorite = favorites.includes(item.dataset.id);
      btn.classList.toggle("active", isFavorite);
      btn.setAttribute("aria-pressed", isFavorite ? "true" : "false");
    });
  }

  // ===== Cập nhật thanh tổng hợp: số món đã thích + tổng giá trị dự kiến =====
  function renderFavoriteSummary() {
    const favorites = getFavorites();
    const favoriteItems = Array.from(items).filter((item) =>
      favorites.includes(item.dataset.id),
    );

    if (favoriteItems.length === 0) {
      summaryBox.classList.add("hidden");
      return;
    }

    const total = favoriteItems.reduce(
      (sum, item) => sum + Number(item.dataset.price),
      0,
    );

    summaryBox.classList.remove("hidden");
    summaryText.textContent = `Bạn đã thích ${favoriteItems.length} món`;
    summaryTotal.textContent = `Tổng giá trị dự kiến: ${formatCurrency(total)}`;
  }

  // ===== Lọc danh sách món hiển thị theo tab đang chọn =====
  function applyFilter(category) {
    const favorites = getFavorites();

    items.forEach((item) => {
      let shouldShow;
      if (category === "all") {
        shouldShow = true;
      } else if (category === "favorite") {
        // Tab "Yêu Thích": chỉ hiện món có data-id nằm trong danh sách đã thích
        shouldShow = favorites.includes(item.dataset.id);
      } else {
        shouldShow = item.dataset.category === category;
      }
      item.classList.toggle("hidden", !shouldShow);
    });

    // Khi đang ở tab "Yêu Thích" mà chưa thích món nào -> hiện thông báo nhắc nhở
    const isFavoriteTabEmpty = category === "favorite" && favorites.length === 0;
    emptyFavoriteMsg.classList.toggle("hidden", !isFavoriteTabEmpty);
  }

  // Lấy danh mục của tab đang active hiện tại (để lọc lại sau khi bấm ♥)
  function getActiveCategory() {
    const activeTab = document.querySelector(".tab-btn.active");
    return activeTab ? activeTab.dataset.category : "all";
  }

  // ===== Gắn sự kiện click cho từng tab (lọc theo danh mục / yêu thích) =====
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      applyFilter(tab.dataset.category);
    });
  });

  // ===== Gắn sự kiện click cho từng nút ♥ (thêm/bỏ món yêu thích) =====
  items.forEach((item) => {
    const btn = item.querySelector(".btn-favorite");
    btn.addEventListener("click", (event) => {
      // Ngăn sự kiện click nổi lên .menu-item (phòng trường hợp sau này
      // thêm sự kiện click mở chi tiết món trên toàn thẻ .menu-item)
      event.stopPropagation();

      const favorites = getFavorites();
      const id = item.dataset.id;
      const index = favorites.indexOf(id);

      if (index === -1) {
        favorites.push(id); // Chưa thích -> thêm vào danh sách
      } else {
        favorites.splice(index, 1); // Đã thích -> bấm lại để bỏ thích
      }

      saveFavorites(favorites);
      renderFavoriteButtons();
      renderFavoriteSummary();

      // Nếu khách đang xem tab "Yêu Thích" và vừa bỏ thích 1 món,
      // món đó cần biến mất ngay khỏi danh sách hiển thị
      applyFilter(getActiveCategory());
    });
  });

  // ===== Nếu người dùng bấm vào icon ♥ trên header (mọi trang) để đi tới
  // tab "Yêu Thích" của trang Menu, URL sẽ có dạng menu.html#favorite =====
  if (window.location.hash === "#favorite") {
    const favoriteTab = document.querySelector('[data-category="favorite"]');
    if (favoriteTab) {
      favoriteTab.click();
    }
  }

  // ===== Khởi tạo giao diện khi tải trang =====
  renderFavoriteButtons();
  renderFavoriteSummary();
});
