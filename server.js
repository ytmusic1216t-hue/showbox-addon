const http = require("http");

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  if (req.url.startsWith("/manifest.json")) {
    const url = new URL(req.url, "http://localhost");
    const token = url.searchParams.get("token") || "";

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      name: "ShowBox Private",
      version: "2.0.0",
      token
    }));
  } else {
    res.writeHead(200);
    res.end("OK");
  }
}).listen(PORT, "0.0.0.0", () => console.log("Running"));
