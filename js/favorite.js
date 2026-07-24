/**
 * favorite.js - Trang Món Yêu Thích (favorite.html)
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 */
document.addEventListener("DOMContentLoaded", () => {
 const username = localStorage.getItem("vingon_username");
const STORAGE_KEY = username
    ? `vingon_favorites_${username}`
    : "vingon_favorites_guest";
  const grid = document.getElementById("favorite-grid");
  const emptyState = document.getElementById("empty-state");
  const checkoutBar = document.getElementById("favorite-checkout");
  const countText = document.getElementById("favorite-count-text");
  const totalText = document.getElementById("favorite-total-text");
  const goReserveBtn = document.getElementById("btn-go-reserve");

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

  // Xoá nội dung chữ cũ và gán nội dung chữ mới cho 1 phần tử 
  function setText(el, text) {
    while (el.firstChild) el.removeChild(el.firstChild);
    el.appendChild(document.createTextNode(text));
  }

  const ATTR_NAME_MAP = {
    dataId: "data-id",
    ariaLabel: "aria-label",
    ariaPressed: "aria-pressed",
  };

  // Tạo 1 phần tử DOM: gán các thuộc tính trong "attrs" (key camelCase tự đổi
  // sang kebab-case) và thêm chữ bằng createTextNode 
  function createEl(tag, attrs = {}, text = "") {
    const el = document.createElement(tag);
    Object.keys(attrs).forEach((key) => {
      const attrName = key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
      el.setAttribute(attrName, attrs[key]);
    });
    if (text) el.appendChild(document.createTextNode(text));
    return el;
  }

  // Dựng 1 thẻ món yêu thích hoàn chỉnh (ảnh, nút ♥ bỏ thích, tên, giá, mô tả)
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
    infoTop.appendChild(createEl("span", { class: "menu-price" }, item.price.toLocaleString("vi-VN") + " ₫"));

    const info = createEl("div", { class: "menu-info" });
    info.appendChild(infoTop);
    info.appendChild(createEl("p", {}, item.description));

    card.appendChild(imgWrap);
    card.appendChild(info);
    return card;
  }

  // Vẽ lại toàn bộ trang: xoá grid cũ, hiện trạng thái rỗng hoặc danh sách
  // món yêu thích, tính tổng tiền, và cập nhật link "Đặt Bàn"
  function render() {
    const favoriteItems = getFavorites();

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
    setText(totalText, `Tổng dự kiến: ${total.toLocaleString("vi-VN")} ₫`);

    const dishNames = favoriteItems.map((item) => item.name).join(", ");
    goReserveBtn.href = `/pages/reservation.html?dishes=${encodeURIComponent(dishNames)}`;
  }

  render();
});
