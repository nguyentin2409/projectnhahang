/**
 * favorite.js - Trang Món Yêu Thích (favorite.html)
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 *
 * - Đọc danh sách món yêu thích (mảng OBJECT THÔ) từ localStorage, do
 *   menu.js lưu sẵn lúc bấm ♥ ở trang Thực Đơn.
 * - Dựng lại từng thẻ món bằng DOM API, tính tổng tiền, và tạo link
 *   "Đặt Bàn" kèm tên món qua query-string (?dishes=...).
 */
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "vingon_favorites"; // phải trùng khoá với menu.js/shared.js

  const grid = document.getElementById("favorite-grid");
  const emptyState = document.getElementById("empty-state");
  const checkoutBar = document.getElementById("favorite-checkout");
  const countText = document.getElementById("favorite-count-text");
  const totalText = document.getElementById("favorite-total-text");
  const goReserveBtn = document.getElementById("btn-go-reserve");

  // JSON.parse trả về NGAY mảng object thô - toàn bộ hàm bên dưới chỉ
  // thao tác trên object (item.name, item.price...)
  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (err) {
      console.error("Lỗi đọc dữ liệu yêu thích:", err);
      return [];
    }
  }

  // JSON.stringify chỉ dùng ĐÚNG lúc ghi vào localStorage
  function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    if (typeof window.updateFavoriteBadge === "function") window.updateFavoriteBadge();
  }

  function formatCurrency(amount) {
    // Dùng ngôn ngữ trình duyệt của khách (navigator.language)
    const locale = navigator.language || "vi-VN";
    return amount.toLocaleString(locale) + " ₫";
  }

  // Tạo 1 phần tử bằng DOM API thuần (giống hàm createEl trong shared.js):
  function createEl(tag, attrs = {}, text = "") {
    const el = document.createElement(tag);
    Object.keys(attrs).forEach((key) => {
      const attrName = key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
      el.setAttribute(attrName, attrs[key]);
    });
    if (text) el.appendChild(document.createTextNode(text));
    return el;
  }

  // Dựng 1 thẻ món yêu thích bằng DOM API, gắn sẵn sự kiện "Bỏ thích".
  function createFavoriteCard(item) {
    const card = createEl("div", { class: "menu-item", dataId: item.id });

    const imgWrap = createEl("div", { class: "menu-img-wrap" });
    imgWrap.appendChild(createEl("img", { src: item.image, alt: item.name }));

    const btn = createEl("button", {
      class: "btn-favorite active",
      dataId: item.id,
      ariaLabel: "Bỏ khỏi món yêu thích",
      ariaPressed: "true",
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

  // Đặt lại text hiển thị của 1 phần tử bằng DOM API
  function setText(el, text) {
    while (el.firstChild) el.removeChild(el.firstChild);
    el.appendChild(document.createTextNode(text));
  }

  function render() {
    const favoriteItems = getFavorites(); // mảng object thô

    // Xoá nội dung cũ trong grid bằng DOM API 
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
    setText(countText, `${favoriteItems.length} món`);
    setText(totalText, `Tổng dự kiến: ${formatCurrency(total)}`);

    const dishNames = favoriteItems.map((item) => item.name).join(", ");
    goReserveBtn.href = `/pages/reservation.html?dishes=${encodeURIComponent(dishNames)}`;
  }

  render();
});