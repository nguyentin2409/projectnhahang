document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".chef-card");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle("show", entry.isIntersecting);
        });
    });

    cards.forEach(card => observer.observe(card));

});