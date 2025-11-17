/* ============================
   TOGGLE DE TEMA GLOBAL
============================ */

/* Referências */
const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

/* Garante que o botão exista (caso alguma página não tenha) */
if (toggleBtn) {

    /* Tema salvo ou padrão */
    const savedTheme = localStorage.getItem("theme") || "dark";
    body.className = savedTheme;

    /* Define o ícone inicial */
    toggleBtn.classList.add(savedTheme === "light" ? "sun" : "moon");

    /* Alternância Light/Dark */
    toggleBtn.addEventListener("click", () => {
        const isDark = body.classList.contains("dark");
        const newTheme = isDark ? "light" : "dark";

        body.classList.replace(isDark ? "dark" : "light", newTheme);
        localStorage.setItem("theme", newTheme);

        toggleBtn.classList.toggle("sun", newTheme === "light");
        toggleBtn.classList.toggle("moon", newTheme === "dark");
    });
}