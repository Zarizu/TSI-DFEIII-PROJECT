class ConnectionAPI {
    static #MAX_REQUESTS = 5000;

    constructor(seed) {
        this.seed = seed;
        this.query = '';
        this.fields = [];
        this.amount = 1;

        const base_url = 'https://randomuser.me/api/';
        const seed_query = `?seed=${encodeURIComponent(this.seed)}`;
        this.url = base_url + seed_query;
    }

    #resetReq() {
        this.query = '';
        this.fields = [];
    }

    addField(field) {
        if (!this.fields.includes(field)) this.fields.push(field);
        return this;
    }

    amountReq(amount = 1) {
        if (amount > ConnectionAPI.#MAX_REQUESTS)
            throw new Error(`[API] Limite máximo de ${ConnectionAPI.#MAX_REQUESTS} requisições.`);
        
        this.query += `&results=${encodeURIComponent(amount)}`;
        return this;
    }

    async call() {
        let final_url = this.url + `&results=${this.amount}`;

        if (this.query) final_url += this.query;
        if (this.fields.length)
            final_url += `&inc=${this.fields.join(",")}`;

        try {
            const res = await fetch(final_url + '&noinfo');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const results = data.results;

            // Se tiver só 1 resultado, retorna o objeto. Senão, retorna o array.
            return results.length === 1 ? results[0] : results;

        } catch (err) {
            console.error(`[API] Erro: ${err.message}`, err);
            throw err;

        } finally {
            this.#resetReq();
        }
    }

    getAvatar() {
        return this.addField("picture");
    }

    getName() {
        return this.addField("name");
    }
}
