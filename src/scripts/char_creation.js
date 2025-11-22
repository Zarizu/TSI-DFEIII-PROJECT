updateUI();

console.log("[API] Connection API criada com seed: ", localStorage.getItem('api_seed'));
const APIConn = new ConnectionAPI(localStorage.getItem('api_seed'));

