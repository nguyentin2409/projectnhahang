/**
 * menu.js - Trang Thực Đơn (menu.html)
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 *
 * - Lọc món ăn theo danh mục khi bấm tab.
 * - Bấm ♥ để thêm/bớt món khỏi "Yêu Thích" (lưu localStorage), đọc trực
 *   tiếp tên/giá/ảnh/mô tả từ chính thẻ HTML của món đó (không có mảng
 *   dữ liệu JS riêng - danh sách món ăn viết cứng trong menu.html).
 */
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "vingon_favorites"; // phải trùng khoá với favorite.js/shared.js

  const tabs = document.querySelectorAll(".tab-btn");
  const items = document.querySelectorAll(".menu-item");

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
  // Đọc trực tiếp thông tin món từ DOM (h3, img, data-price, mô tả)
  function readItemDataFromDOM(menuItemEl) {
    return {
      id: menuItemEl.dataset.id,
      name: menuItemEl.querySelector("h3").textContent.trim(),
      price: Number(menuItemEl.dataset.price),
      image: menuItemEl.querySelector("img").getAttribute("src"),
      description: menuItemEl.querySelector(".menu-info p").textContent.trim(),
    };
  }

  function setFavoriteButtonState(btn, isFavorite) {
    btn.classList.toggle("active", isFavorite);
    btn.textContent = isFavorite ? "♥" : "♡";
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
      const favorites = getFavorites();
      const index = favorites.findIndex((f) => f.id === btn.dataset.id);

      if (index === -1) {
        favorites.push(readItemDataFromDOM(menuItemEl));
      } else {
        favorites.splice(index, 1);
      }

      saveFavorites(favorites);
      setFavoriteButtonState(btn, index === -1);
    });
  });

  applyFilter("all");
});