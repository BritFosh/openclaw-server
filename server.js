const http = require("http");
const https = require("https");
const OpenClaw = require("openclaw");

const TOKEN = process.env.TELEGRAM_TOKEN;
const PORT = 8080;

const agent = new OpenClaw();

function sendMessage(chatId, text) {
  const data = JSON.stringify({
    chat_id: chatId,
    text: text
  });

  const options = {
    hostname: "api.telegram.org",
    path: `/bot${TOKEN}/sendMessage`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length
    }
  };

  const req = https.request(options);
  req.write(data);
  req.end();
}

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    res.writeHead(200);
    return res.end("Bot is running");
  }

  if (req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const update = JSON.parse(body);
        const chatId = update.message?.chat?.id;
        const text = update.message?.text;

        if (chatId && text) {
          const result = await agent.run(text);
          sendMessage(chatId, result.output || JSON.stringify(result));
        }

        res.writeHead(200);
        res.end("OK");
      } catch (err) {
        console.error(err);
        res.writeHead(200);
        res.end("Error handled");
      }
    });

    return;
  }

  res.writeHead(405);
  res.end("Method Not Allowed");
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
