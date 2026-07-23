/**
 * menu.js - Trang Thực Đơn (menu.html)
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 *
 * - Lọc món ăn theo danh mục khi bấm tab.
 * - Bấm ♥ để thêm/bớt món khỏi "Yêu Thích" 
 *
 */
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "vingon_favorites"; // phải trùng khoá với favorite.js/shared.js

  const tabs = document.querySelectorAll(".tab-btn");
  const items = document.querySelectorAll(".menu-item");

  // Đọc danh sách yêu thích -> JSON.parse trả về NGAY 1 mảng OBJECT thô,
  // toàn bộ code phía dưới chỉ thao tác trên object này (item.id, item.name...),
  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (err) {
      console.error("Lỗi đọc dữ liệu yêu thích:", err);
      return [];
    }
  }

  // Ghi lại -> JSON.stringify chỉ dùng ĐÚNG lúc lưu vào localStorage
  // (bắt buộc, vì localStorage chỉ lưu được chuỗi, không lưu được object).
  function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    if (typeof window.updateFavoriteBadge === "function") window.updateFavoriteBadge();
  }

  // ===== Lọc theo danh mục =====
  function applyFilter(category) {
    items.forEach((item) => {
      const show = category === "all" || item.dataset.category === category;
      item.classList.toggle("hidden", !show);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      applyFilter(tab.dataset.category);
    });
  });

  // ===== Xử lý nút ♥ =====
  // Đọc trực tiếp thông tin món từ DOM (h3, img, data-price, mô tả),
  // trả về 1 OBJECT THÔ 
  function readItemDataFromDOM(menuItemEl) {
    return {
      id: menuItemEl.dataset.id,
      name: menuItemEl.querySelector("h3").textContent.trim(),
      price: Number(menuItemEl.dataset.price),
      image: menuItemEl.querySelector("img").getAttribute("src"),
      description: menuItemEl.querySelector(".menu-info p").textContent.trim(),
    };
  }

  // Đặt lại icon (♥/♡) trong nút bằng DOM API thuần
  function setButtonIcon(btn, icon) {
    while (btn.firstChild) btn.removeChild(btn.firstChild);
    btn.appendChild(document.createTextNode(icon));
  }

  function setFavoriteButtonState(btn, isFavorite) {
    btn.classList.toggle("active", isFavorite);
    setButtonIcon(btn, isFavorite ? "♥" : "♡");
    btn.setAttribute("aria-pressed", isFavorite ? "true" : "false");
  }

  // Tô đỏ sẵn các nút ♥ của món đã thích từ trước khi vừa tải trang
  const savedFavorites = getFavorites();
  document.querySelectorAll(".btn-favorite").forEach((btn) => {
    setFavoriteButtonState(btn, savedFavorites.some((f) => f.id === btn.dataset.id));
  });

  document.querySelectorAll(".btn-favorite").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();

      const menuItemEl = btn.closest(".menu-item");
      const favorites = getFavorites(); // mảng object thô
      const index = favorites.findIndex((f) => f.id === btn.dataset.id);

      if (index === -1) {
        favorites.push(readItemDataFromDOM(menuItemEl)); // thêm 1 object
      } else {
        favorites.splice(index, 1); // bớt 1 object
      }

      saveFavorites(favorites);
      setFavoriteButtonState(btn, index === -1);
    });
  });

  applyFilter("all");
});