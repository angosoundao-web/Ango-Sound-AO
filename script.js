
const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        emailRedirectTo: 'https://angosoundao-web.github.io/Ango-Sound-AO/',
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
