
<section class="artist-section" id="artistas">
    <div>
        <span class="eyebrow">ANGOSOUND FOR ARTISTS</span>
        <h2>O teu talento merece o mundo.</h2>
        <p>Partilha a tua música, apresenta o teu talento e constrói a tua comunidade de ouvintes.</p>
        <a href="#painel-artista" class="primary-button">
            Aceder ao painel de artista
        </a>
    </div>
    <div class="artist-symbol">♫</div>
</section>

<!-- PAINEL DO ARTISTA -->
<section class="artist-dashboard" id="painel-artista">

    <div class="section-heading">
        <div>
            <span class="eyebrow">ESPAÇO EXCLUSIVO</span>
            <h2>Painel do artista</h2>
            <p>Gere as tuas músicas e publica os teus sons.</p>
        </div>
    </div>

    <div class="dashboard-card">
        <h3>Adicionar nova música</h3>
        <p>Prepara o teu próximo lançamento.</p>

        <form id="uploadForm">

            <label for="trackTitle">Nome da música</label>
            <input
                type="text"
                id="trackTitle"
                placeholder="Ex.: Meu novo som"
                required
            >

            <label for="trackDescription">Descrição</label>
            <textarea
                id="trackDescription"
                placeholder="Conta um pouco sobre esta música..."
                rows="4"
            ></textarea>

            <label for="audioFile">Ficheiro de áudio</label>
            <input
                type="file"
                id="audioFile"
                accept="audio/mpeg,audio/mp4,audio/aac,audio/ogg,audio/wav,audio/flac"
                required
            >

            <label for="coverFile">Capa da música</label>
            <input
                type="file"
                id="coverFile"
                accept="image/jpeg,image/png,image/webp"
            >

            <button type="submit" class="primary-button">
                Enviar música
            </button>

            <p id="uploadMessage" aria-live="polite"></p>
        </form>
    </div>

    <div class="dashboard-card">
        <h3>As minhas músicas</h3>
        <div id="artistTracks">
            <p>Ainda não tens músicas enviadas.</p>
        </div>
    </div>

</section>
