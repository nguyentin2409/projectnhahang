/**
 * ==========================================================================
 * favorite.js - Trang Món Yêu Thích (favorite.html)
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 * ==========================================================================
 *
 * CHỨC NĂNG CỦA FILE NÀY:
 *  1) Đọc lại danh sách món yêu thích từ localStorage 
 *  2) RENDER danh sách đó ra giao diện, có nút "Bỏ thích".
 *  3) Tính tổng tiền dự kiến.
 *  4) Nút "Đặt Bàn Với Các Món Này": chuyển sang reservation.html, mang
 *     theo TÊN CÁC MÓN đã chọn qua query-string (?dishes=...).
 */
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "vingon_favorites"; // PHẢI trùng khoá với menu.js/shared.js

  const grid = document.getElementById("favorite-grid");
  const emptyState = document.getElementById("empty-state");
  const checkoutBar = document.getElementById("favorite-checkout");
  const countText = document.getElementById("favorite-count-text");
  const totalText = document.getElementById("favorite-total-text");
  const goReserveBtn = document.getElementById("btn-go-reserve");

  function getFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      // Lọc bỏ các mục KHÔNG ĐÚNG ĐỊNH DẠNG object đầy đủ (vd:
      // dữ liệu rác/cũ còn sót lại từ bản code trước, khi đó localStorage
      // lưu mảng CHUỖI id thô thay vì object {id, name, price, image}).
      // Nếu không lọc, chỉ 1 phần tử "hỏng" cũng làm crash toàn bộ hàm
      // render() bên dưới (lỗi thật đã gặp: bấm thích nhưng trang trắng
      // xoá không hiện gì, vì item.price bị undefined giữa chừng vòng lặp).
      const cleaned = parsed.filter(
        (item) =>
          item &&
          typeof item === "object" &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          typeof item.price === "number",
      );
      // Nếu phát hiện có dữ liệu rác, tự động lưu lại bản đã lọc sạch
      // luôn, để lần sau không phải lọc lại nữa (tự "chữa lành").
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    } catch (err) {
      console.error("Lỗi đọc dữ liệu yêu thích từ localStorage:", err);
      return [];
    }
  }

  function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    if (typeof window.updateFavoriteBadge === "function") {
      window.updateFavoriteBadge();
    }
  }

  function formatCurrency(amount) {
    return amount.toLocaleString("vi-VN") + "₫";
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
   * Vẽ lại TOÀN BỘ giao diện trang, dựa trên danh sách object đang lưu
   * trong localStorage TẠI THỜI ĐIỂM GỌI HÀM. Được gọi khi tải trang, và
   * gọi lại mỗi khi khách bấm "Bỏ thích" 1 món (để món đó biến mất ngay).
   */
  function render() {
    const favoriteItems = getFavorites();

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

    const dishNames = favoriteItems.map((item) => item.name).join(", ");
    goReserveBtn.href = `/pages/reservation.html?dishes=${encodeURIComponent(dishNames)}`;

    // Gắn sự kiện "Bỏ thích" cho từng nút ♥ VỪA render ra
    grid.querySelectorAll(".btn-favorite").forEach((btn) => {
      btn.addEventListener("click", () => {
        const remaining = getFavorites().filter((f) => f.id !== btn.dataset.id);
        saveFavorites(remaining);
        render(); // vẽ lại toàn bộ trang với danh sách đã bớt 1 món
      });
    });
  }

  render();
});