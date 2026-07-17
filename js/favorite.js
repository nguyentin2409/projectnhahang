/**
 * favorite.js - Trang Món Yêu Thích (favorite.html)
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 *
 * - Đọc danh sách món yêu thích (mảng object đầy đủ) từ localStorage,
 *   do menu.js lưu sẵn lúc bấm ♥ ở trang Thực Đơn.
 * - Dựng lại từng thẻ món bằng DOM API , tính tổng
 *   tiền, và tạo link "Đặt Bàn" kèm tên món qua query-string (?dishes=...).
 */
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "vingon_favorites"; // phải trùng khoá với menu.js/shared.js

  const grid = document.getElementById("favorite-grid");
  const emptyState = document.getElementById("empty-state");
  const checkoutBar = document.getElementById("favorite-checkout");
  const countText = document.getElementById("favorite-count-text");
  const totalText = document.getElementById("favorite-total-text");
  const goReserveBtn = document.getElementById("btn-go-reserve");

  function getFavorites() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      // Lọc bỏ mục sai định dạng (dữ liệu cũ/hỏng), tự lưu lại bản sạch
      const cleaned = parsed.filter(
        (item) =>
          item && typeof item === "object" &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          typeof item.price === "number",
      );
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    } catch (err) {
      console.error("Lỗi đọc dữ liệu yêu thích:", err);
      return [];
    }
  }

  function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    if (typeof window.updateFavoriteBadge === "function") window.updateFavoriteBadge();
  }

  function formatCurrency(amount) {
    // Dùng ngôn ngữ trình duyệt của khách (navigator.language)
    const locale = navigator.language || "vi-VN";
    return amount.toLocaleString(locale) + " ₫";
  }

  // Tạo 1 phần tử bằng DOM API (giống hàm createEl trong shared.js)
  function createEl(tag, attrs = {}, text = "") {
    const el = document.createElement(tag);
    Object.keys(attrs).forEach((key) => el.setAttribute(key, attrs[key]));
    if (text) el.textContent = text;
    return el;
  }

  // Dựng 1 thẻ món yêu thích bằng DOM API, gắn sẵn sự kiện "Bỏ thích"
  function createFavoriteCard(item) {
    const card = createEl("div", { class: "menu-item", "data-id": item.id });

    const imgWrap = createEl("div", { class: "menu-img-wrap" });
    imgWrap.appendChild(createEl("img", { src: item.image, alt: item.name }));

    const btn = createEl("button", {
      class: "btn-favorite active",
      "data-id": item.id,
      "aria-label": "Bỏ khỏi món yêu thích",
      "aria-pressed": "true",
    }, "♥");
    btn.addEventListener("click", () => {
      const remaining = getFavorites().filter((f) => f.id !== item.id);
      saveFavorites(remaining);
      render();
    });
    imgWrap.appendChild(btn);

    const infoTop = createEl("div", { class: "menu-info-top" });
    infoTop.appendChild(createEl("h3", {}, item.name));
    infoTop.appendChild(createEl("span", { class: "menu-price" }, formatCurrency(item.price)));

    const info = createEl("div", { class: "menu-info" });
    info.appendChild(infoTop);
    info.appendChild(createEl("p", {}, item.description));

    card.appendChild(imgWrap);
    card.appendChild(info);
    return card;
  }

  function render() {
    const favoriteItems = getFavorites();

    // Xoá nội dung cũ trong grid bằng DOM API (không dùng innerHTML = "")
    while (grid.firstChild) grid.removeChild(grid.firstChild);

    if (favoriteItems.length === 0) {
      checkoutBar.classList.add("hidden");
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");
    favoriteItems.forEach((item) => grid.appendChild(createFavoriteCard(item)));
    checkoutBar.classList.remove("hidden");

    const total = favoriteItems.reduce((sum, item) => sum + item.price, 0);
    countText.textContent = `${favoriteItems.length} món`;
    totalText.textContent = `Tổng dự kiến: ${formatCurrency(total)}`;

    const dishNames = favoriteItems.map((item) => item.name).join(", ");
    goReserveBtn.href = `/pages/reservation.html?dishes=${encodeURIComponent(dishNames)}`;
  }

  render();
});