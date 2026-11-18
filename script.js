
import { supabase } from './supabase.js';

const form = document.getElementById('authForm');
const loginButton = document.getElementById('loginButton');
const message = document.getElementById('authMessage');

let loginMode = false;

loginButton.addEventListener('click', () => {
    loginMode = !loginMode;

    const nameField = document.getElementById('displayName');
    const typeField = document.getElementById('accountType');

    nameField.style.display = loginMode ? 'none' : 'block';
    typeField.style.display = loginMode ? 'none' : 'block';

    nameField.required = !loginMode;

    form.querySelector('button[type="submit"]').textContent =
        loginMode ? 'Entrar' : 'Criar conta';

    loginButton.textContent =
        loginMode ? 'Criar nova conta' : 'Já tenho conta — Entrar';
});

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
