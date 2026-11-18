
document.addEventListener("DOMContentLoaded", () => {
    console.log("AngoSound iniciado com sucesso!");

    const button = document.querySelector("#explore");

    if (button) {
        button.addEventListener("click", () => {
            alert("Bem-vindo ao AngoSound! A música angolana está aqui.");
        });
    }
});
