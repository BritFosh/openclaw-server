const http = require("http");
const OpenClaw = require("openclaw");

const agent = new OpenClaw();

const server = http.createServer(async (req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405);
    return res.end("POST only");
  }

  let body = "";
  req.on("data", chunk => body += chunk);
  req.on("end", async () => {
    const { message } = JSON.parse(body);
    const result = await agent.run(message);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  });
});

server.listen(process.env.PORT || 3000);