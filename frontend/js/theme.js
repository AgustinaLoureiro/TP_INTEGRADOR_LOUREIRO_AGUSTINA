(function () {
    const TEMA_KEY = "brote_tema";

    function aplicarTema(tema) {
        document.documentElement.setAttribute("data-theme", tema);
        const boton = document.getElementById("btnTema");
        if (boton) {
            boton.textContent = tema === "oscuro" ? "☀️" : "🌙";
        }
    }

    const temaGuardado = localStorage.getItem(TEMA_KEY) || "claro";
    aplicarTema(temaGuardado);

    document.addEventListener("DOMContentLoaded", () => {
        const boton = document.getElementById("btnTema");
        if (!boton) return;

        aplicarTema(temaGuardado);

        boton.addEventListener("click", () => {
            const actual = document.documentElement.getAttribute("data-theme") || "claro";
            const nuevo = actual === "claro" ? "oscuro" : "claro";
            localStorage.setItem(TEMA_KEY, nuevo);
            aplicarTema(nuevo);
        });
    });
})();