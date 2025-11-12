class ConnectionAPI {
    constructor(rand_seed) {
        this.seed = rand_seed;
        const base_url = 'https://randomuser.me/api/';
        const seed_query = `?seed=${encodeURIComponent(this.seed)}`;
        this.url = base_url + seed_query;
    }

    async fetchUsers(amount) {
        if (amount > 5000) {
            console.error('[API] Aviso: Limite máximo de 5000 usuários por requisição.');
            return;
        }

        const query = `?results=${encodeURIComponent(amount)}`;

        try {
            const res = await fetch(this.url + query);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            return data.results;
        } catch (err) {
            console.error(`[API] Erro: ${err.message}`, err);
            throw err;
        }
    }
}