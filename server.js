const http = require("http");

const PORT = 8080;

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    res.writeHead(200);
    return res.end("Bot is running");
  }

  if (req.method === "POST") {
    res.writeHead(200);
    return res.end("OK");
  }

  res.writeHead(405);
  res.end("Method Not Allowed");
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});