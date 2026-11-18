
document.addEventListener("DOMContentLoaded", () => {

    const search = document.getElementById("search");
    const musicCards = document.querySelectorAll(".music-card");

    // Pesquisa de músicas e artistas
    if (search) {
        search.addEventListener("input", () => {
            const term = search.value
                .toLowerCase()
                .trim();

            musicCards.forEach(card => {
                const content = card.textContent.toLowerCase();

                card.style.display =
                    content.includes(term) ? "" : "none";
            });
        });
    }

    // Mensagem de boas-vindas
    console.log("AngoSound carregado com sucesso!");

});
