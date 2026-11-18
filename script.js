
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
