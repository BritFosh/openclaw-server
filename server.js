const http = require("http");
const https = require("https");

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

function sendTelegramMessage(chatId, text) {
  const data = JSON.stringify({
    chat_id: chatId,
    text: text
  });

  const options = {
    hostname: "api.telegram.org",
    path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data)
    }
  };

  const req = https.request(options, (res) => {
    res.on("data", () => {});
  });

  req.on("error", (err) => {
    console.error("Telegram send error:", err);
  });

  req.write(data);
  req.end();
}

const server = http.createServer((req, res) => {
  if (req.method !== "POST") {
    res.writeHead(200);
    return res.end("Bot is running");
  }

  let body = "";

  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const update = JSON.parse(body);

      if (update.message && update.message.text) {
        const chatId = update.message.chat.id;
        const text = update.message.text;

        sendTelegramMessage(chatId, "Received: " + text);
      }

      res.writeHead(200);
      res.end("OK");

    } catch (err) {
      console.error("Handler error:", err);
      res.writeHead(200);
      res.end("OK");
    }
  });
});

const PORT = process.env.PORT;

server.listen(PORT, "0.0.0.0", () => {
  console.log("Server listening on", PORT);
});