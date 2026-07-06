/**
 * ==========================================================================
 * menu.js - Trang Thực Đơn (menu.html)
 * MSSV: B2405536 - Họ tên: Nguyễn Bảo Tín 
 * ==========================================================================
 *
 * CHỨC NĂNG CỦA FILE NÀY:
 *  1) Lọc món ăn theo danh mục khi bấm tab (Khai vị, Món chính, Súp & Canh...)
 *  2) Chức năng "Yêu Thích": khách bấm ♥ trên món ăn để đánh dấu thích,
 *     xem lại toàn bộ món đã thích qua tab riêng, và xem tổng tiền dự kiến.
 *
 * TẠI SAO LÀM "YÊU THÍCH" MÀ KHÔNG LÀM "GIỎ HÀNG" (cart)?
 *  - Đây là website cho nhà hàng ĂN TẠI CHỖ (dine-in), không phải bán hàng
 *    online: khách đến bàn ngồi, xem menu trên web/tại quầy rồi gọi món
 *    trực tiếp với nhân viên phục vụ — không có bước "thanh toán online",
 *    không cần giỏ hàng theo đúng nghĩa thương mại điện tử.
 *  - "Món yêu thích" mô phỏng đúng nhu cầu thật: khách lướt menu, đánh dấu
 *    lại vài món mình thích để dễ nhớ, dễ so sánh trước khi gọi món.
 *  - Về mặt kỹ thuật, "Yêu Thích" vẫn dùng ĐÚNG các khái niệm mà đề bài yêu
 *    cầu (Chương 5 - DOM, Chương 6 - Events của giáo trình, và Project 3 BGR):
 *      + DOM traversal/selection: querySelectorAll, querySelector, dataset
 *      + Event handling: addEventListener("click", ...)
 *      + Thay đổi trạng thái hiển thị qua classList (thêm/xoá class)
 *      + Lưu trạng thái "persistent" (tồn tại sau khi tải lại trang) —
 *        giống hệt vai trò của giỏ hàng trong Project 3, chỉ khác là lưu
 *        "món đã thích" thay vì "món đã thêm vào giỏ".
 *
 * DỮ LIỆU GẮN TRÊN HTML (xem thêm chú thích trong menu.html):
 *  - Mỗi .tab-btn có data-category (vd: "main", "soup", "all", "favorite")
 *  - Mỗi .menu-item có:
 *      data-category  -> để lọc theo danh mục món ăn
 *      data-id        -> mã định danh DUY NHẤT của món (vd: "pho-bo-dac-biet"),
 *                        dùng làm "khoá" để lưu vào localStorage. Phải dùng
 *                        id dạng chữ (slug) thay vì số thứ tự (index) vì nếu
 *                        sau này thêm/xoá/đổi thứ tự món trong HTML, index
 *                        sẽ bị lệch còn slug thì luôn cố định, không bị sai.
 *      data-price     -> giá món (chỉ là số, không có "." hay "₫") để cộng
 *                        tổng tiền các món yêu thích bằng phép toán số học.
 *
 * LƯU TRỮ Ở ĐÂU? TẠI SAO DÙNG localStorage?
 *  - Dự án không có backend/server, không có tài khoản đăng nhập (đúng yêu
 *    cầu đề bài "web tĩnh"), nên không thể lưu trên database.
 *  - localStorage là bộ nhớ có sẵn của trình duyệt, lưu dữ liệu dạng
 *    chuỗi (string) theo cặp key-value, KHÔNG mất khi tắt trình duyệt hay
 *    tải lại trang (khác với biến JS thường hoặc sessionStorage).
 */
document.addEventListener("DOMContentLoaded", () => {
  // Khoá (key) dùng để lưu/đọc mảng món yêu thích trong localStorage.
  // Đặt tiền tố "vingon_" để tránh trùng key với các dự án/website khác
  // cùng chạy trên localhost khi test (localStorage chia theo domain).
  const STORAGE_KEY = "vingon_favorites";

  // Lấy toàn bộ nút tab và toàn bộ thẻ món ăn NGAY KHI TRANG TẢI XONG.
  // Dùng querySelectorAll vì cần lấy NHIỀU phần tử cùng lúc (khác với
  // getElementById chỉ lấy 1 phần tử theo id duy nhất).
  const tabs = document.querySelectorAll(".tab-btn");
  const items = document.querySelectorAll(".menu-item");

  // Các phần tử của "thanh tổng hợp yêu thích" (số món + tổng tiền),
  // lấy 1 lần ra biến để khỏi phải querySelector lại nhiều lần (tối ưu).
  const summaryBox = document.getElementById("favorite-summary");
  const summaryText = document.getElementById("favorite-summary-text");
  const summaryTotal = document.getElementById("favorite-summary-total");
  const emptyFavoriteMsg = document.getElementById("empty-favorite-msg");

  // ==========================================================================
  // NHÓM HÀM 1: ĐỌC / GHI danh sách yêu thích vào localStorage
  // ==========================================================================

  /**
   * Đọc danh sách món yêu thích đã lưu, trả về MẢNG các data-id.
   * Ví dụ trả về: ["pho-bo-dac-biet", "che-ba-mau"]
   *
   * localStorage CHỈ lưu được kiểu chuỗi (string), nên khi lưu một mảng,
   * ta phải chuyển mảng -> chuỗi JSON (JSON.stringify) trước khi lưu, và
   * khi đọc ra phải chuyển ngược lại chuỗi JSON -> mảng (JSON.parse).
   */
  function getFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // Nếu chưa từng lưu gì (raw = null, khách vào trang lần đầu) thì
      // trả về mảng rỗng, không thì parse chuỗi JSON thành mảng thật.
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      // Phòng trường hợp dữ liệu trong localStorage bị hỏng/không đúng
      // định dạng JSON (vd: khách tự sửa tay trong DevTools) — nếu không
      // try/catch thì JSON.parse sẽ ném lỗi làm toàn bộ trang bị đứng.
      console.error("Lỗi đọc dữ liệu yêu thích từ localStorage:", err);
      return [];
    }
  }

  /**
   * Lưu lại mảng món yêu thích mới vào localStorage.
   * Sau khi lưu, gọi luôn window.updateFavoriteBadge() (hàm này được
   * shared.js định nghĩa và gắn vào window) để icon ♥ trên header cập
   * nhật số lượng NGAY LẬP TỨC, không cần tải lại trang.
   *
   * Đây là ví dụ cụ thể của "giao tiếp giữa 2 file JS độc lập": menu.js
   * không được viết trực tiếp vào HTML của header (vì header do shared.js
   * tạo ra bằng chuỗi HTML), nên phải gọi qua 1 hàm dùng chung gắn trên
   * đối tượng window — đây là kỹ thuật hay bị thầy hỏi "2 file JS này
   * liên kết với nhau bằng cách nào?".
   */
  function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));

    if (typeof window.updateFavoriteBadge === "function") {
      window.updateFavoriteBadge();
    }
  }

  /**
   * Định dạng số tiền theo kiểu Việt Nam (chấm ngăn cách hàng nghìn).
   * Ví dụ: formatCurrency(130000) -> "130.000₫"
   * toLocaleString("vi-VN") là hàm có sẵn của JavaScript, tự động thêm
   * dấu chấm ngăn cách theo đúng chuẩn hiển thị số của Việt Nam.
   */
  function formatCurrency(amount) {
    return amount.toLocaleString("vi-VN") + "₫";
  }

  // ==========================================================================
  // NHÓM HÀM 2: CẬP NHẬT GIAO DIỆN (render) dựa trên dữ liệu đã lưu
  // ==========================================================================
  // Nguyên tắc chung: dữ liệu thật (nguồn sự thật) luôn là localStorage,
  // các hàm "render..." bên dưới chỉ có nhiệm vụ ĐỌC dữ liệu đó rồi vẽ lại
  // giao diện cho khớp — không tự lưu trạng thái riêng ở đâu khác. Nhờ vậy
  // dù gọi render nhiều lần ở nhiều chỗ, giao diện luôn luôn đúng với dữ
  // liệu đã lưu, không bị lệch.

  /**
   * Cập nhật toàn bộ nút ♥ trên các món ăn: món nào đã thích thì nút ♥
   * được thêm class "active" (menu.css sẽ tô màu đỏ hồng dựa vào class
   * này), món chưa thích thì bỏ class "active".
   *
   * Được gọi ở 2 thời điểm:
   *  1) Ngay khi tải trang xong (để hiện lại đúng trạng thái đã lưu từ
   *     lần truy cập trước, không bị mất khi refresh trang)
   *  2) Ngay sau khi khách bấm ♥ (để phản hồi tức thì, không cần tải lại)
   */
  function renderFavoriteButtons() {
    const favorites = getFavorites();
    items.forEach((item) => {
      const btn = item.querySelector(".btn-favorite");
      // Array.prototype.includes(): kiểm tra 1 giá trị có nằm trong mảng
      // hay không, trả về true/false — dùng để biết món này đã thích chưa.
      const isFavorite = favorites.includes(item.dataset.id);

      // classList.toggle(class, điều_kiện): nếu điều_kiện là true thì THÊM
      // class, nếu false thì XOÁ class. Gọn hơn viết if/else add/remove.
      btn.classList.toggle("active", isFavorite);

      // aria-pressed: thuộc tính hỗ trợ trợ năng (accessibility), báo cho
      // trình đọc màn hình biết nút này đang ở trạng thái "được bấm/chọn"
      // hay chưa — không ảnh hưởng giao diện nhìn thấy bằng mắt.
      btn.setAttribute("aria-pressed", isFavorite ? "true" : "false");
    });
  }

  /**
   * Cập nhật "thanh tổng hợp yêu thích": hiện số món đã thích + tổng tiền.
   * Đây chính là phần "tính tổng" tương đương nghiệp vụ tính tổng tiền
   * giỏ hàng trong Project 3 — chỉ khác là cộng dồn các món ĐÃ THÍCH thay
   * vì các món ĐÃ THÊM VÀO GIỎ.
   */
  function renderFavoriteSummary() {
    const favorites = getFavorites();

    // Array.from(items): chuyển NodeList (kết quả của querySelectorAll,
    // không có đầy đủ hàm như mảng thật) thành Array thật để dùng được
    // .filter()/.reduce() — 2 hàm này KHÔNG tồn tại trên NodeList.
    const favoriteItems = Array.from(items).filter((item) =>
      favorites.includes(item.dataset.id),
    );

    // Chưa thích món nào -> ẩn luôn thanh tổng hợp, không hiện "0 món, 0₫"
    // cho gọn giao diện.
    if (favoriteItems.length === 0) {
      summaryBox.classList.add("hidden");
      return;
    }

    // reduce(): duyệt qua từng món yêu thích, cộng dồn data-price của
    // từng món vào biến "sum", giá trị khởi đầu là 0.
    // Number(item.dataset.price): dataset luôn trả về CHUỖI (string),
    // vd "130000" (chữ), phải đổi qua số (Number) mới cộng được, nếu
    // không JS sẽ nối chuỗi ("100000" + "50000" = "10000050000" — SAI).
    const total = favoriteItems.reduce(
      (sum, item) => sum + Number(item.dataset.price),
      0,
    );

    summaryBox.classList.remove("hidden");
    summaryText.textContent = `Bạn đã thích ${favoriteItems.length} món`;
    summaryTotal.textContent = `Tổng giá trị dự kiến: ${formatCurrency(total)}`;
  }

  /**
   * Lọc danh sách món hiển thị theo "category" của tab đang được chọn.
   * category có 3 khả năng:
   *  - "all"      : hiện tất cả món, không lọc gì
   *  - "favorite" : hiện món có data-id nằm trong danh sách đã thích
   *                 (KHÔNG liên quan gì đến data-category của món)
   *  - còn lại (vd "main", "soup"...) : hiện món có data-category TRÙNG
   *                 với category của tab
   */
  function applyFilter(category) {
    const favorites = getFavorites();

    items.forEach((item) => {
      let shouldShow;

      if (category === "all") {
        shouldShow = true;
      } else if (category === "favorite") {
        shouldShow = favorites.includes(item.dataset.id);
      } else {
        shouldShow = item.dataset.category === category;
      }

      // classList.toggle("hidden", !shouldShow): nếu KHÔNG nên hiện
      // (shouldShow = false) thì thêm class "hidden" (CSS: display:none),
      // ngược lại thì xoá class "hidden" đi để món hiện ra bình thường.
      item.classList.toggle("hidden", !shouldShow);
    });

    // Trường hợp riêng: khách bấm vào tab "Yêu Thích" nhưng chưa từng
    // thích món nào -> hiện dòng thông báo nhắc nhở "Bạn chưa thích món
    // nào..." (phần tử #empty-favorite-msg khai báo sẵn trong menu.html).
    const isFavoriteTabEmpty =
      category === "favorite" && favorites.length === 0;
    emptyFavoriteMsg.classList.toggle("hidden", !isFavoriteTabEmpty);
  }

  /**
   * Trả về category của tab đang có class "active" tại thời điểm gọi hàm.
   * Dùng khi cần LỌC LẠI danh sách món ngay sau khi khách bấm ♥ (thêm/bỏ
   * yêu thích), mà không biết trước khách đang xem tab nào — ví dụ khách
   * đang ở tab "Yêu Thích" và bấm bỏ thích 1 món, món đó phải biến mất
   * NGAY khỏi màn hình mà không cần bấm lại tab.
   */
  function getActiveCategory() {
    const activeTab = document.querySelector(".tab-btn.active");
    return activeTab ? activeTab.dataset.category : "all";
  }

  // ==========================================================================
  // NHÓM 3: GẮN SỰ KIỆN (Event Listeners) — đây là phần "Chương 6 - Events"
  // ==========================================================================

  /**
   * Sự kiện click cho từng TAB lọc danh mục (bao gồm cả tab "Yêu Thích").
   * Dùng forEach để gắn addEventListener cho TỪNG tab một (không có cách
   * nào gắn 1 sự kiện chung cho nhiều phần tử cùng lúc bằng querySelectorAll
   * trực tiếp — phải lặp qua từng phần tử).
   */
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Bước 1: bỏ class "active" của TẤT CẢ tab, rồi chỉ thêm lại cho
      // đúng tab vừa bấm -> đảm bảo luôn chỉ có DUY NHẤT 1 tab active.
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Bước 2: lọc lại danh sách món theo category của tab vừa bấm.
      applyFilter(tab.dataset.category);
    });
  });

  /**
   * Sự kiện click cho từng nút ♥ trên từng món ăn (thêm/bỏ yêu thích).
   * Đây là kỹ thuật "toggle" kinh điển: bấm lần 1 để thêm, bấm lần 2 (cùng
   * nút đó) để bỏ — không cần 2 nút riêng cho "thêm" và "bỏ".
   */
  items.forEach((item) => {
    const btn = item.querySelector(".btn-favorite");

    btn.addEventListener("click", (event) => {
      // stopPropagation(): chặn sự kiện click KHÔNG "nổi bong bóng" (bubble)
      // lên các phần tử cha (.menu-item, rồi .menu-grid...). Hiện tại
      // .menu-item chưa gắn sự kiện click nào khác, nhưng để sẵn dòng này
      // để phòng trường hợp SAU NÀY có bạn thêm sự kiện "bấm vào món để
      // xem chi tiết" trên toàn thẻ .menu-item — khi đó bấm ♥ sẽ không bị
      // vô tình kích hoạt luôn sự kiện xem chi tiết đó.
      event.stopPropagation();

      const favorites = getFavorites();
      const id = item.dataset.id;

      // indexOf trả về vị trí (index) của id trong mảng, hoặc -1 nếu
      // không tìm thấy -> dùng -1 để biết món này ĐÃ thích hay CHƯA.
      const index = favorites.indexOf(id);

      if (index === -1) {
        // Chưa có trong danh sách -> thêm vào cuối mảng (đã thích).
        favorites.push(id);
      } else {
        // Đã có trong danh sách -> xoá đúng 1 phần tử tại vị trí index
        // (splice(vị_trí, số_lượng_xoá)) -> coi như bỏ thích.
        favorites.splice(index, 1);
      }

      // Lưu lại mảng mới, rồi vẽ lại TOÀN BỘ giao diện liên quan:
      saveFavorites(favorites); // 1. Ghi vào localStorage + báo header
      renderFavoriteButtons(); // 2. Tô lại đúng màu nút ♥ vừa bấm
      renderFavoriteSummary(); // 3. Cập nhật số món + tổng tiền

      // 4. Nếu khách đang xem tab "Yêu Thích", lọc lại ngay để món vừa
      //    bỏ thích biến mất khỏi màn hình (không cần bấm lại tab).
      applyFilter(getActiveCategory());
    });
  });

  // ==========================================================================
  // NHÓM 4: XỬ LÝ KHI TRUY CẬP TỪ ICON ♥ TRÊN HEADER (liên trang)
  // ==========================================================================
  /**
   * Icon ♥ trên header (do shared.js tạo, hiện ở MỌI trang) có đường dẫn
   * href="/pages/menu.html#favorite". Phần "#favorite" ở cuối URL gọi là
   * "hash" — khi khách bấm icon đó từ trang chủ/trang khác, trình duyệt
   * sẽ mở menu.html và ta có thể đọc được window.location.hash để biết
   * khách vừa đến từ đâu, từ đó TỰ ĐỘNG bấm giúp khách vào tab "Yêu Thích"
   * luôn, không cần khách phải tự bấm tab thêm 1 lần nữa.
   */
  if (window.location.hash === "#favorite") {
    const favoriteTab = document.querySelector('[data-category="favorite"]');
    if (favoriteTab) {
      // Gọi .click() bằng code giống như khách tự bấm chuột vào tab đó
      // -> tái sử dụng lại đúng đoạn code addEventListener("click") ở
      // trên, không cần viết lại logic lọc tab lần thứ 2.
      favoriteTab.click();
    }
  }

  // ==========================================================================
  // KHỞI TẠO GIAO DIỆN NGAY KHI TRANG VỪA TẢI XONG
  // ==========================================================================
  // Bắt buộc phải gọi 2 hàm này ngay từ đầu, vì nếu khách đã thích vài món
  // từ lần truy cập trước (dữ liệu vẫn còn trong localStorage), giao diện
  // (nút ♥ đỏ, thanh tổng hợp) phải hiện ĐÚNG NGAY từ đầu, không phải chờ
  // khách bấm gì mới hiện.
  renderFavoriteButtons();
  renderFavoriteSummary();
});