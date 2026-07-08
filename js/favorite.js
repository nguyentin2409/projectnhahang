/**
 * ==========================================================================
 * favorite.js - Trang Món Yêu Thích (favorite.html)
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 * ==========================================================================
 *
 * CHỨC NĂNG CỦA FILE NÀY:
 *  1) Đọc danh sách id món yêu thích từ localStorage (khách đã bấm ♥ ở
 *     trang Thực Đơn), rồi TRA CỨU thông tin đầy đủ (tên, giá, ảnh, mô
 *     tả) của từng id đó trong MENU_ITEMS (menu-data.js) — vì
 *     localStorage CHỈ lưu id (chuỗi ngắn), không lưu toàn bộ thông tin
 *     món ăn (tránh trùng lặp dữ liệu ở 2 nơi).
 *  2) RENDER danh sách món đã thích ra giao diện, có nút "Bỏ thích".
 *  3) Tính tổng tiền dự kiến của các món đã thích.
 *  4) Nút "Đặt Bàn Với Các Món Này": CHUYỂN SANG reservation.html, mang
 *     theo TÊN CÁC MÓN đã chọn qua QUERY-STRING (?dishes=...) — đây là
 *     bước "checkout" tương đương Project 3 (BGR): trang giỏ hàng
 *     chuyển sang bước tiếp theo, TRUYỀN DỮ LIỆU THẬT (không chỉ tên
 *     tab) sang trang khác qua URL.
 */
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "vingon_favorites"; // PHẢI trùng khoá với menu.js/shared.js

  const grid = document.getElementById("favorite-grid");
  const emptyState = document.getElementById("empty-state");
  const checkoutBar = document.getElementById("favorite-checkout");
  const countText = document.getElementById("favorite-count-text");
  const totalText = document.getElementById("favorite-total-text");
  const goReserveBtn = document.getElementById("btn-go-reserve");

  function getFavoriteIds() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Lỗi đọc dữ liệu yêu thích từ localStorage:", err);
      return [];
    }
  }

  function saveFavoriteIds(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    if (typeof window.updateFavoriteBadge === "function") {
      window.updateFavoriteBadge();
    }
  }

  function formatCurrency(amount) {
    return amount.toLocaleString("vi-VN") + "₫";
  }

  /**
   * TRA CỨU (lookup) trong MENU_ITEMS để tìm object đầy đủ của 1 id.
   * MENU_ITEMS.find(): duyệt mảng, trả về PHẦN TỬ ĐẦU TIÊN thoả điều
   * kiện, hoặc undefined nếu không tìm thấy (vd id trong localStorage
   * đã cũ, món đó không còn trong menu-data.js nữa).
   */
  function findMenuItem(id) {
    return MENU_ITEMS.find((item) => item.id === id);
  }

  function renderFavoriteCard(item) {
    return `
      <div class="menu-item" data-id="${item.id}">
        <div class="menu-img-wrap">
          <img src="${item.image}" alt="${item.name}" />
          <button class="btn-favorite active" data-id="${item.id}" aria-label="Bỏ khỏi món yêu thích" aria-pressed="true">♥</button>
        </div>
        <div class="menu-info">
          <div class="menu-info-top">
            <h3>${item.name}</h3>
            <span class="menu-price">${formatCurrency(item.price)}</span>
          </div>
          <p>${item.description}</p>
        </div>
      </div>`;
  }

  /**
   * Vẽ lại TOÀN BỘ giao diện trang, dựa trên danh sách id đang lưu trong
   * localStorage tại THỜI ĐIỂM GỌI HÀM. Được gọi khi tải trang, và gọi
   * lại mỗi khi khách bấm "Bỏ thích" 1 món (để món đó biến mất ngay).
   */
  function render() {
    const ids = getFavoriteIds();
    // .map(findMenuItem): đổi mảng ID (chuỗi) thành mảng OBJECT món ăn
    // đầy đủ. .filter(Boolean): loại bỏ các phần tử "undefined" (phòng
    // trường hợp id cũ không còn tồn tại trong MENU_ITEMS nữa).
    const favoriteItems = ids.map(findMenuItem).filter(Boolean);

    if (favoriteItems.length === 0) {
      grid.innerHTML = "";
      checkoutBar.classList.add("hidden");
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");
    grid.innerHTML = favoriteItems.map(renderFavoriteCard).join("");
    checkoutBar.classList.remove("hidden");

    const total = favoriteItems.reduce((sum, item) => sum + item.price, 0);
    countText.textContent = `${favoriteItems.length} món`;
    totalText.textContent = `Tổng dự kiến: ${formatCurrency(total)}`;

    // Chuẩn bị sẵn đường dẫn cho nút "Đặt Bàn Với Các Món Này": nối tên
    // các món bằng dấu phẩy, rồi encodeURIComponent() để mã hoá an toàn
    // cho URL (dấu cách, dấu tiếng Việt có dấu... đều được mã hoá đúng
    // chuẩn, tránh URL bị lỗi/link gãy).
    const dishNames = favoriteItems.map((item) => item.name).join(", ");
    goReserveBtn.href = `/pages/reservation.html?dishes=${encodeURIComponent(dishNames)}`;

    // Gắn sự kiện "Bỏ thích" cho từng nút ♥ VỪA render ra (giống lý do
    // đã giải thích trong menu.js: nút mới tạo lại từ đầu mỗi lần render).
    grid.querySelectorAll(".btn-favorite").forEach((btn) => {
      btn.addEventListener("click", () => {
        const remainingIds = getFavoriteIds().filter((id) => id !== btn.dataset.id);
        saveFavoriteIds(remainingIds);
        render(); // vẽ lại toàn bộ trang với danh sách đã bớt 1 món
      });
    });
  }

  render();
});