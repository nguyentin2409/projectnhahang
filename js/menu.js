/**
 * menu.js - Trang Thực Đơn (menu.html)
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 *
 * - Lọc món ăn theo danh mục khi bấm tab.
 * - Bấm ♥ để thêm/bớt món khỏi "Yêu Thích"
 */
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "vingon_favorites"; // phải trùng khoá với favorite.js/shared.js

  const tabs = document.querySelectorAll(".tab-btn");
  const items = document.querySelectorAll(".menu-item");

  // Đọc mảng món yêu thích từ localStorage (JSON -> object), lỗi thì trả về []
  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (err) {
      console.error("Lỗi đọc dữ liệu yêu thích:", err);
      return [];
    }
  }

  // Ghi mảng món yêu thích xuống localStorage (object -> JSON) và cập nhật badge header
  function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    if (typeof window.updateFavoriteBadge === "function") window.updateFavoriteBadge();
  }

  // Ẩn/hiện các món theo danh mục được chọn (category = "all" thì hiện hết)
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

  // Đọc chữ bên trong 1 phần tử bằng DOM API thuần (duyệt childNodes)
  function getText(el) {
    let result = "";
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) result += node.nodeValue;
    });
    return result.trim();
  }

  // Lấy thông tin 1 món (id, tên, giá, ảnh, mô tả) từ chính thẻ HTML của món đó
  function readItemDataFromDOM(menuItemEl) {
    return {
      id: menuItemEl.dataset.id,
      name: getText(menuItemEl.querySelector("h3")),
      price: Number(menuItemEl.dataset.price),
      image: menuItemEl.querySelector("img").getAttribute("src"),
      description: getText(menuItemEl.querySelector(".menu-info p")),
    };
  }

  // Đặt lại icon (♥/♡) trong nút bằng DOM API thuần
  function setButtonIcon(btn, icon) {
    while (btn.firstChild) btn.removeChild(btn.firstChild);
    btn.appendChild(document.createTextNode(icon));
  }

  // Đổi trạng thái nút yêu thích: class active, icon, và aria-pressed
  function setFavoriteButtonState(btn, isFavorite) {
    btn.classList.toggle("active", isFavorite);
    setButtonIcon(btn, isFavorite ? "♥" : "♡");
    btn.setAttribute("aria-pressed", isFavorite ? "true" : "false");
  }

  // Vừa tải trang: tô sẵn trạng thái ♥ cho các món đã có trong yêu thích
  const savedFavorites = getFavorites();
  document.querySelectorAll(".btn-favorite").forEach((btn) => {
    setFavoriteButtonState(btn, savedFavorites.some((f) => f.id === btn.dataset.id));
  });

  // Gắn sự kiện bấm ♥: thêm/bớt món khỏi danh sách yêu thích rồi lưu lại
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