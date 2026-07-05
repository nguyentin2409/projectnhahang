document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const items = document.querySelectorAll(".menu-item");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Cập nhật tab active
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const category = tab.dataset.category;

      items.forEach((item) => {
        if (category === "all" || item.dataset.category === category) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });
});
