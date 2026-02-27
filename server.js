const http = require("http");
const https = require("https");

// ---- FIXED IMPORT STYLE ----
const { OpenClaw } = require("openclaw");

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const agent = new OpenClaw();

// ---- TELEGRAM SEND FUNCTION ----
function sendMessage(chatId, text) {
  const data = JSON.stringify({
    chat_id: chatId,
    text: text,
  });

  const options = {
    hostname: "api.telegram.org",
    path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  const req = https.request(options);
  req.write(data);
  req.end();
}

// ---- SERVER ----
const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    res.writeHead(200);
    return res.end("Bot is running");
  }

  if (req.method !== "POST") {
    res.writeHead(405);
    return res.end("Method Not Allowed");
  }

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
        console.log("Received message:", text);

        try {
          const result = await agent.run(text);

          console.log("OpenClaw result:", result);

          const reply =
            result?.output ||
            result?.text ||
            JSON.stringify(result);

          sendMessage(chatId, reply);
        } catch (err) {
          console.error("OpenClaw error:", err);
          sendMessage(chatId, "OpenClaw execution failed.");
        }
      }

      res.writeHead(200);
      res.end("OK");
    } catch (err) {
      console.error("Webhook parse error:", err);
      res.writeHead(500);
      res.end("Error");
    }
  });
});

// ---- IMPORTANT: Railway Port ----
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});