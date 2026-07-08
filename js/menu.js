/**
 * ==========================================================================
 * menu.js - Trang Thực Đơn (menu.html)
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín
 * ==========================================================================
 *
 * CHỨC NĂNG CỦA FILE NÀY:
 *  1) RENDER (vẽ) danh sách món ăn ra HTML từ mảng dữ liệu MENU_ITEMS
 *     (khai báo sẵn trong js/menu-data.js, nạp TRƯỚC file này)
 *  2) Lọc món ăn theo danh mục khi bấm tab (Khai vị, Món chính...)
 *  3) Bấm ♥ trên món ăn để thêm/bớt khỏi danh sách "Yêu Thích"
 *     (lưu trong localStorage) — xem chi tiết + tổng tiền ở trang riêng
 *     pages/favorite.html, KHÔNG xử lý ở trang này nữa.
 *
 * TẠI SAO RENDER ĐỘNG THAY VÌ VIẾT CỨNG HTML NHƯ TRƯỚC?
 *  - Trang favorite.html (Yêu Thích) cần hiển thị LẠI thông tin đầy đủ
 *    (tên, giá, ảnh, mô tả) của các món khách đã thích, nhưng nó KHÔNG
 *    THỂ đọc HTML của menu.html (2 trang độc lập).
 *  - Giải pháp: menu-data.js giữ dữ liệu DUY NHẤT, cả menu.js (trang này)
 *    và favorite.js (trang Yêu Thích) đều gọi lại rồi tự vẽ giao diện
 *    riêng của mình — không lặp lại dữ liệu ở 2 nơi.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Khoá localStorage lưu danh sách id món yêu thích. PHẢI TRÙNG KHỚP
  // TUYỆT ĐỐI với khoá dùng trong js/favorite.js và js/shared.js.
  const STORAGE_KEY = "vingon_favorites";

  const grid = document.getElementById("menu-grid");
  const tabs = document.querySelectorAll(".tab-btn");

  // ==========================================================================
  // NHÓM HÀM 1: ĐỌC / GHI danh sách yêu thích vào localStorage
  // ==========================================================================
  function getFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Lỗi đọc dữ liệu yêu thích từ localStorage:", err);
      return [];
    }
  }

  function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    // Báo cho shared.js vẽ lại badge số lượng trên icon header ngay lập
    // tức (xem giải thích kỹ thuật này trong shared.js, khối số 6).
    if (typeof window.updateFavoriteBadge === "function") {
      window.updateFavoriteBadge();
    }
  }

  function formatCurrency(amount) {
    return amount.toLocaleString("vi-VN") + "₫";
  }

  // ==========================================================================
  // NHÓM HÀM 2: RENDER (vẽ) danh sách món ăn từ MENU_ITEMS ra HTML
  // ==========================================================================
  /**
   * Tạo ra đúng 1 chuỗi HTML cho 1 món ăn, dùng template string (`...`)
   * và toạ các thuộc tính data-* (category, id) để menu.js sau đó lọc/
   * nhận diện lại được — giống hệt cấu trúc HTML viết cứng trước đây,
   * chỉ khác là được TẠO RA bằng code thay vì gõ tay từng món.
   */
  function renderItemCard(item, isFavorite) {
    return `
      <div class="menu-item" data-category="${item.category}" data-id="${item.id}">
        <div class="menu-img-wrap">
          <img src="${item.image}" alt="${item.name}" />
          <button
            class="btn-favorite${isFavorite ? " active" : ""}"
            data-id="${item.id}"
            aria-label="${isFavorite ? "Bỏ khỏi món yêu thích" : "Thích món " + item.name}"
            aria-pressed="${isFavorite ? "true" : "false"}"
          >${isFavorite ? "♥" : "♡"}</button>
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
   * Vẽ TOÀN BỘ danh sách món ăn vào #menu-grid, dựa trên MENU_ITEMS
   * (biến toàn cục khai báo trong menu-data.js, nạp trước file này).
   * Được gọi 1 LẦN DUY NHẤT khi trang vừa tải xong.
   */
  function renderAllItems() {
    const favorites = getFavorites();
    grid.innerHTML = MENU_ITEMS.map((item) =>
      renderItemCard(item, favorites.includes(item.id)),
    ).join("");
  }

  // ==========================================================================
  // NHÓM HÀM 3: LỌC món ăn theo danh mục + GẮN sự kiện cho nút ♥
  // ==========================================================================
  /**
   * Lọc món ăn theo category của tab đang chọn. Được gọi lại sau MỖI lần
   * renderAllItems() (vì DOM vừa bị vẽ lại từ đầu, phải lọc lại từ đầu
   * theo đúng tab đang active).
   */
  function applyFilter(category) {
    const items = document.querySelectorAll(".menu-item");
    items.forEach((item) => {
      const show = category === "all" || item.dataset.category === category;
      item.classList.toggle("hidden", !show);
    });
  }

  /**
   * Gắn sự kiện click cho TỪNG nút ♥ hiện có trong #menu-grid. Vì các
   * nút này được TẠO MỚI mỗi lần renderAllItems() chạy (không phải HTML
   * có sẵn từ đầu), nên phải gọi lại hàm này SAU MỖI LẦN render xong,
   * chứ không gắn 1 lần duy nhất như các phần tử tĩnh khác (vd .tab-btn).
   */
  function attachFavoriteButtonEvents() {
    document.querySelectorAll(".btn-favorite").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();

        const id = btn.dataset.id;
        const favorites = getFavorites();
        const index = favorites.indexOf(id);

        if (index === -1) {
          favorites.push(id);
        } else {
          favorites.splice(index, 1);
        }
        saveFavorites(favorites);

        // Không cần render lại TOÀN BỘ danh sách chỉ để đổi 1 nút ♥ —
        // chỉ cập nhật riêng nút vừa bấm cho nhẹ, mượt hơn.
        const isFavorite = index === -1;
        btn.classList.toggle("active", isFavorite);
        btn.textContent = isFavorite ? "♥" : "♡";
        btn.setAttribute("aria-pressed", isFavorite ? "true" : "false");
      });
    });
  }

  // ==========================================================================
  // NHÓM 4: GẮN SỰ KIỆN CHO TAB LỌC DANH MỤC
  // ==========================================================================
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      applyFilter(tab.dataset.category);
    });
  });

  // ==========================================================================
  // KHỞI TẠO TRANG NGAY KHI VỪA TẢI XONG
  // ==========================================================================
  renderAllItems(); // 1. Vẽ toàn bộ 9 món ăn từ MENU_ITEMS
  attachFavoriteButtonEvents(); // 2. Gắn sự kiện ♥ cho các nút VỪA được tạo ra
  applyFilter("all"); // 3. Mặc định hiện tất cả (khớp với tab "Tất Cả" đang active)
});
