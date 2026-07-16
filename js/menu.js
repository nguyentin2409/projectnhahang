/**
 * ==========================================================================
 * menu.js - Trang Thực Đơn (menu.html)
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 * ==========================================================================
 *
 * CHỨC NĂNG CỦA FILE NÀY:
 *  1) Lọc món ăn theo danh mục khi bấm tab (Khai vị, Món chính...)
 *  2) Bấm ♥ trên món ăn để thêm/bớt khỏi danh sách "Yêu Thích" (lưu
 *     trong localStorage) — xem chi tiết + tổng tiền ở trang riêng
 *     pages/favorite.html.
 *
 */
document.addEventListener("DOMContentLoaded", () => {
  // Khoá localStorage lưu danh sách món yêu thích.
  // TRÙNG KHỚP TUYỆT ĐỐI với khoá dùng trong js/favorite.js và js/shared.js.
  const STORAGE_KEY = "vingon_favorites";

  const tabs = document.querySelectorAll(".tab-btn");
  const items = document.querySelectorAll(".menu-item");

  // ==========================================================================
  // NHÓM HÀM 1: ĐỌC / GHI danh sách yêu thích vào localStorage
  // ==========================================================================
  /**
   * localStorage giờ lưu MẢNG CÁC OBJECT ĐẦY ĐỦ THÔNG TIN món ăn
   * (vd: [{id, name, price, image, description}, ...])
   */
  function getFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      // Lọc bỏ mục KHÔNG ĐÚNG ĐỊNH DẠNG (dữ liệu rác/cũ còn sót
      // từ bản lưu id dạng chuỗi thô thay vì object đầy đủ) -
      // tránh crash khi bấm ♥ hoặc khi tô lại trạng thái tim lúc tải trang.
      const cleaned = parsed.filter(
        (item) =>
          item &&
          typeof item === "object" &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          typeof item.price === "number",
      );
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
    // Báo cho shared.js vẽ lại badge số lượng trên icon header ngay lập tức
    if (typeof window.updateFavoriteBadge === "function") {
      window.updateFavoriteBadge();
    }
  }

  // ==========================================================================
  // NHÓM HÀM 2: LỌC món ăn theo danh mục
  // ==========================================================================
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

  // ==========================================================================
  // NHÓM HÀM 3: XỬ LÝ NÚT ♥ - đọc trực tiếp thông tin món từ DOM
  // ==========================================================================
  /**
   * Từ 1 nút ♥ vừa bấm, TÌM NGƯỢC LÊN thẻ cha ".menu-item" chứa nó
   * (closest()), rồi ĐỌC ra tên/ảnh/mô tả từ chính các thẻ con bên trong
   * (h3, img, p) và giá từ thuộc tính data-price viết sẵn trong HTML.
   */
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

  // Khởi tạo: tô đỏ sẵn các nút ♥ của những món ĐÃ được thích từ trước
  // (đọc localStorage lúc tải trang, khớp theo id đã lưu)
  const savedFavorites = getFavorites();
  document.querySelectorAll(".btn-favorite").forEach((btn) => {
    const isFavorite = savedFavorites.some((f) => f.id === btn.dataset.id);
    setFavoriteButtonState(btn, isFavorite);
  });

  // Gắn sự kiện click cho từng nút ♥ có sẵn trong HTML
  document.querySelectorAll(".btn-favorite").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();

      const menuItemEl = btn.closest(".menu-item");
      const favorites = getFavorites();
      const index = favorites.findIndex((f) => f.id === btn.dataset.id);

      if (index === -1) {
        // Chưa thích -> đọc đầy đủ thông tin từ DOM rồi thêm vào mảng
        favorites.push(readItemDataFromDOM(menuItemEl));
      } else {
        // Đã thích rồi -> bấm lại để BỎ thích
        favorites.splice(index, 1);
      }

      saveFavorites(favorites);
      setFavoriteButtonState(btn, index === -1);
    });
  });

  // Mặc định hiện tất cả món khi vừa vào trang (khớp tab "Tất Cả" đang active)
  applyFilter("all");
});