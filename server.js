const http = require("http");

const PORT = process.env.PORT || 3000;

const TMDB_KEY = "439c478a771f35c05022f9feabcca01c";
const SB_BASE = "https://febapi.nuvioapp.space/api/media";

async function getStreams(tmdbId, type, season, episode, token) {
  try {
    if (!token) return [];

    const api =
      type === "series"
        ? `${SB_BASE}/tv/${tmdbId}/${season}/${episode}?cookie=${token}`
        : `${SB_BASE}/movie/${tmdbId}?cookie=${token}`;

    const d = await fetch(api).then(r => r.json());
    if (!d || !d.versions) return [];

    return d.versions.flatMap(v =>
      (v.links || []).map(l => ({
        title: "ShowBox " + (l.quality || "HD"),
        url: l.url
      }))
    );
  } catch {
    return [];
  }
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  // ✅ Manifest
  if (url.pathname === "/manifest.json") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      id: "showbox-private",
      version: "1.0.0",
      name: "ShowBox Private",
      resources: ["stream"],
      types: ["movie", "series"],
      catalogs: []
    }));
  }

  // ✅ Stream endpoint
  if (url.pathname.startsWith("/stream/")) {
    const parts = url.pathname.split("/");

    const type = parts[2];       // movie / series
    const id = parts[3];         // tmdb id
    const season = parts[4];
    const episode = parts[5];

    const token = url.searchParams.get("token");

    const streams = await getStreams(id, type, season, episode, token);

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ streams }));
  }

  res.writeHead(200);
  res.end("OK");

}).listen(PORT, "0.0.0.0", () => console.log("Running"));
