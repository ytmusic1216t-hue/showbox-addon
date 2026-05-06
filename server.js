const express = require("express");
const app = express();

app.get("/manifest.json", (req, res) => {
  const token = req.query.token || "";

  res.json({
    name: "ShowBox Private",
    version: "2.0.0",
    scrapers: [{
      id: "sb-private",
      name: "ShowBox",
      settings: [{ name: "token_box", type: "text" }],
      extra: { token }
    }]
  });
});

app.listen(3000);
