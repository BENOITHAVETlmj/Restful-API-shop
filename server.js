const http = require("http");
const app = require("./app");
console.log(process.env);
const server = http.createServer(app);
server.listen(process.env.PORT, () => {
  console.log(`server started on ${process.env.PORT}`);
});
