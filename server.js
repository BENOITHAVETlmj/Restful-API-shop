const http = require("http");
const PORT = process.env.SERVER_APP || 3000;
const app = require("./app");
console.log(process.env);
const server = http.createServer(app);
server.listen(PORT, () => console.log(`server started on ${PORT}`));
