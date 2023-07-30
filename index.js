const express = require("express");
const { createInstance } = require("@featurevisor/sdk");

require("isomorphic-fetch");

/**
 * Constants
 */
const PORT = 3000;
const REFRESH_INTERVAL = 60 * 5; // every 5 minutes

const DATAFILE_URL =
  process.env.environment === "production"
    ? "https://featurevisor-example-cloudflare.pages.dev/production/datafile-tag-all.json"
    : "https://featurevisor-example-cloudflare.pages.dev/staging/datafile-tag-all.json";

/**
 * Featurevisor instance
 */
const f = createInstance({
  datafileUrl: DATAFILE_URL,

  onReady: () => console.log(`Featurevisor SDK is now ready`),
  onRefresh: () => console.log(`Featurevisor SDK has refreshed`),
  onUpdate: () => console.log(`Featurevisor SDK has updates`),

  // optionally refresh the datafile every 5 minutes,
  // without having to restart the server
  refreshInterval: REFRESH_INTERVAL,
});

/**
 * Express app with middleware
 */
const app = express();

app.use((req, res, next) => {
  req.f = f;
  next();
});

/**
 * Routes
 */
app.get("/", (req, res) => {
  const { f } = req;

  const featureKey = "baz";
  const context = { userId: "user-123" };

  const isEnabled = f.isEnabled(featureKey, context);

  if (isEnabled) {
    res.send("Hello World!");
  } else {
    res.send("Not enabled yet!");
  }
});

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
