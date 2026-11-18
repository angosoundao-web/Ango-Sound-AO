
import { supabase } from './supabase.js';

// ELEMENTOS DA PÁGINA
const form = document.getElementById('authForm');
const loginButton = document.getElementById('loginButton');
const message = document.getElementById('authMessage');
const search = document.getElementById('search');
const musicGrid = document.getElementById('musicGrid');

let loginMode = false;

// ALTERNAR ENTRE REGISTO E LOGIN
loginButton.addEventListener('click', () => {
    loginMode = !loginMode;

    const nameField = document.getElementById('displayName');
    const typeField = document.getElementById('accountType');
    const submitButton = form.querySelector('button[type="submit"]');

    nameField.style.display = loginMode ? 'none' : 'block';
    typeField.style.display = loginMode ? 'none' : 'block';

    nameField.required = !loginMode;

    submitButton.textContent = loginMode ? 'Entrar' : 'Criar conta';

    loginButton.textContent = loginMode
        ? 'Criar nova conta'
        : 'Já tenho conta — Entrar';

    message.textContent = '';
});

// REGISTO E AUTENTICAÇÃO
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const name = document.getElementById('displayName').value.trim();
    const accountType = document.getElementById('accountType').value;

    message.textContent = 'A processar...';

    try {
        if (loginMode) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            message.textContent = 'Sessão iniciada com sucesso!';
        } else {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: name,
                        account_type: accountType
                    }
                }
            });

            if (error) throw error;

            message.textContent = data.session
                ? 'Conta criada com sucesso!'
                : 'Conta criada! Verifica o teu email para confirmar o registo.';
        }
    } catch (error) {
        message.textContent = 'Erro: ' + error.message;
    }
});

// PESQUISA NO CONTEÚDO VISÍVEL
search.addEventListener('input', () => {
    const term = search.value.toLowerCase().trim();
    const cards = musicGrid.children;

    for (const card of cards) {
        const matches = card.textContent.toLowerCase().includes(term);
        card.style.display = matches ? '' : 'none';
    }
});

// VERIFICAR SESSÃO EXISTENTE
async function checkSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Erro ao verificar sessão:', error.message);
        return;
    }

    if (data.session) {
        console.log('Utilizador autenticado:', data.session.user.email);
    }
}

checkSession();

/* =====================================
   ANGOSOUND - FUNCIONAMENTO DO PLAYER
===================================== */

const audioPlayer = document.getElementById('audioPlayer');
const playPauseButton = document.getElementById('playPause');
const previousButton = document.getElementById('previousTrack');
const nextButton = document.getElementById('nextTrack');
const progressBar = document.getElementById('progressBar');
const volumeControl = document.getElementById('volumeControl');

const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerCover = document.getElementById('playerCover');

const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');

let playlist = [];
let currentTrackIndex = -1;

// FORMATAR TEMPO
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

// CARREGAR UMA MÚSICA
function loadTrack(index) {
    if (index < 0 || index >= playlist.length) return;

    currentTrackIndex = index;

    const track = playlist[index];

    audioPlayer.src = track.audioUrl;
    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;
    playerCover.textContent = '♫';

    if (track.coverUrl) {
        playerCover.style.backgroundImage =
            `url("${track.coverUrl}")`;
        playerCover.style.backgroundSize = 'cover';
        playerCover.style.backgroundPosition = 'center';
    } else {
        playerCover.style.backgroundImage = 'none';
    }

    audioPlayer.load();
}

// REPRODUZIR
async function playTrack(index) {
    if (index !== undefined) {
        loadTrack(index);
    }

    if (!audioPlayer.src) return;

    try {
        await audioPlayer.play();
    } catch (error) {
        console.error('Não foi possível reproduzir:', error);
    }
}

// BOTÃO REPRODUZIR / PAUSAR
playPauseButton.addEventListener('click', async () => {
    if (audioPlayer.paused) {
        if (!audioPlayer.src && playlist.length > 0) {
            await playTrack(0);
        } else if (audioPlayer.src) {
            await playTrack();
        }
    } else {
        audioPlayer.pause();
    }
});

// ATUALIZAR ÍCONE
audioPlayer.addEventListener('play', () => {
    playPauseButton.textContent = 'Ⅱ';
});

audioPlayer.addEventListener('pause', () => {
    playPauseButton.textContent = '▶';
});

// ATUALIZAR DURAÇÃO
audioPlayer.addEventListener('loadedmetadata', () => {
    durationDisplay.textContent = formatTime(audioPlayer.duration);
});

// ATUALIZAR PROGRESSO
audioPlayer.addEventListener('timeupdate', () => {
    if (!audioPlayer.duration) return;

    progressBar.value =
        (audioPlayer.currentTime / audioPlayer.duration) * 100;

    currentTimeDisplay.textContent =
        formatTime(audioPlayer.currentTime);
});

// AVANÇAR NA MÚSICA
progressBar.addEventListener('input', () => {
    if (audioPlayer.duration) {
        audioPlayer.currentTime =
            (progressBar.value / 100) * audioPlayer.duration;
    }
});

// VOLUME
audioPlayer.volume = Number(volumeControl.value);

volumeControl.addEventListener('input', () => {
    audioPlayer.volume = Number(volumeControl.value);
});

// MÚSICA ANTERIOR
previousButton.addEventListener('click', () => {
    if (playlist.length === 0) return;

    const previousIndex =
        (currentTrackIndex - 1 + playlist.length) % playlist.length;

    playTrack(previousIndex);
});

// PRÓXIMA MÚSICA
nextButton.addEventListener('click', () => {
    if (playlist.length === 0) return;

    const nextIndex =
        (currentTrackIndex + 1) % playlist.length;

    playTrack(nextIndex);
});

// REPRODUZIR A PRÓXIMA AUTOMATICAMENTE
audioPlayer.addEventListener('ended', () => {
    if (playlist.length > 0) {
        const nextIndex =
            (currentTrackIndex + 1) % playlist.length;

        playTrack(nextIndex);
    }
});

// FUNÇÃO PARA ADICIONAR MÚSICAS À FILA
window.addAngoSoundTrack = function(track) {
    
/* =====================================
   ANGOSOUND - ENVIO DE MÚSICAS
===================================== */

const uploadForm = document.getElementById('uploadForm');
const uploadMessage = document.getElementById('uploadMessage');
const artistTracks = document.getElementById('artistTracks');

if (uploadForm) {

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('trackTitle').value.trim();
        const description = document.getElementById('trackDescription').value.trim();
        const audioFile = document.getElementById('audioFile').files[0];
        const coverFile = document.getElementById('coverFile').files[0];

        uploadMessage.textContent = 'A preparar o envio...';

        try {
            const { data: sessionData, error: sessionError } =
                await supabase.auth.getSession();

            if (sessionError) throw sessionError;

            const user = sessionData.session?.user;

            if (!user) {
                throw new Error('Entra na tua conta antes de enviar músicas.');
            }

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('account_type')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;

            if (profile.account_type !== 'artist') {
                throw new Error('Esta função está disponível apenas para artistas.');
            }

            if (!audioFile) {
                throw new Error('Seleciona um ficheiro de áudio.');
            }

            const safeAudioName = audioFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const audioPath = `${user.id}/${Date.now()}-${safeAudioName}`;

            uploadMessage.textContent = 'A enviar áudio...';

            const { error: audioError } = await supabase.storage
                .from('music-files')
                .upload(audioPath, audioFile);

            if (audioError) throw audioError;

            let coverUrl = null;

            if (coverFile) {
                const safeCoverName = coverFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                const coverPath = `${user.id}/${Date.now()}-${safeCoverName}`;

                uploadMessage.textContent = 'A enviar capa...';

                const { error: coverError } = await supabase.storage
                    .from('album-covers')
                    .upload(coverPath, coverFile);

                if (coverError) throw coverError;

                const { data: coverData } = supabase.storage
                    .from('album-covers')
                    .getPublicUrl(coverPath);

                coverUrl = coverData.publicUrl;
            }

            uploadMessage.textContent = 'A guardar informações...';

            const { error: databaseError } = await supabase
                .from('tracks')
                .insert({
                    artist_id: user.id,
                    title: title,
                    description: description,
                    audio_url: audioPath,
                    cover_url: coverUrl,
                    status: 'draft'
                });

            if (databaseError) throw databaseError;

            uploadMessage.textContent =
                'Música enviada com sucesso! Está guardada como rascunho.';

            uploadForm.reset();

            await loadArtistTracks();

        } catch (error) {
            uploadMessage.textContent = 'Erro: ' + error.message;
        }
    });
}

/* LISTAR MÚSICAS DO ARTISTA */

async function loadArtistTracks() {

    if (!artistTracks) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
        artistTracks.innerHTML = '<p>Entra na tua conta de artista para veres as tuas músicas.</p>';
        return;
    }

    const { data: tracks, error } = await supabase
        .from('tracks')
        .select('title, status, created_at')
        .eq('artist_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        artistTracks.textContent = 'Não foi possível carregar as músicas.';
        console.error(error);
        return;
    }

    if (!tracks || tracks.length === 0) {
        artistTracks.innerHTML = '<p>Ainda não tens músicas enviadas.</p>';
        return;
    }

    artistTracks.innerHTML = '';

    tracks.forEach((track) => {
        const item = document.createElement('div');
        item.style.padding = '15px';
        item.style.borderBottom = '1px solid #333';

        const name = document.createElement('strong');
        name.textContent = track.title;

        const status = document.createElement('p');
        status.textContent = track.status === 'published'
            ? 'Publicada'
            : 'Rascunho';

        status.style.color = '#ff7918';
        status.style.marginTop = '6px';

        item.append(name, status);
        artistTracks.appendChild(item);
    });
}

loadArtistTracks();

    if (!track || !track.audioUrl || !track.title) {
        console.error('Dados da música incompletos.');
        return;
    }

    playlist.push({
        title: track.title,
        artist: track.artist || 'Artista desconhecido',
        audioUrl: track.audioUrl,
        coverUrl: track.coverUrl || ''
    });

    if (currentTrackIndex === -1) {
        loadTrack(0);
    }
};

