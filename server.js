const http = require("http");

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const server = http.createServer(async (req, res) => {
  if (req.method !== "POST") {
    res.writeHead(200);
    return res.end("Bot is running");
  }

  let body = "";
  req.on("data", chunk => body += chunk);

  req.on("end", async () => {
    try {
      const update = JSON.parse(body);

      if (!update.message || !update.message.text) {
        res.writeHead(200);
        return res.end();
      }

      const chatId = update.message.chat.id;
      const text = update.message.text;

      // Load OpenClaw inside the request
      const OpenClaw = require("openclaw");
      const agent = new OpenClaw();

      const result = await agent.run(text);

      // Send reply back to Telegram
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: typeof result === "string" ? result : JSON.stringify(result)
        })
      });

      res.writeHead(200);
      res.end();

    } catch (err) {
      console.error(err);
      res.writeHead(200);
      res.end();
    }
  });
});

server.listen(process.env.PORT || 3000);