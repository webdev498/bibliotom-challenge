const http = require('http');

const app = require('./app');

const server = http.createServer(app);

app.listen(5000, () => console.log(`Open http://localhost:5000 to see a response.`));