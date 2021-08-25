const http = require("http");
const app = require("./app");
console.log(process.env);
const server = http.createServer(app);
server.listen(process.env.port, () => {
  console.log(`server started on ${PORT}`);
});
