const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405);
    return res.end("POST only");
  }

  let body = "";
  req.on("data", chunk => body += chunk);
  req.on("end", () => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ reply: "Server is alive" }));
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});