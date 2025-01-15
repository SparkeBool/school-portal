// script.js
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("menu-toggle-btn");
    const menu = document.getElementById("menu");

    toggleBtn.addEventListener("click", () => {
        menu.classList.toggle("open");
    });
});
