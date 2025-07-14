const express = require("express");
const { createInstance } = require("@featurevisor/sdk");

require("isomorphic-fetch");

/**
 * Constants
 */
const PORT = 3000;

const DATAFILE_URL =
  process.env.environment === "production"
    ? "https://featurevisor-example-cloudflare.pages.dev/production/featurevisor-tag-all.json"
    : "https://featurevisor-example-cloudflare.pages.dev/staging/featurevisor-tag-all.json";

/**
 * Featurevisor instance
 */
const f = createInstance({});

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
fetch(DATAFILE_URL)
  .then((response) => response.json())
  .then((datafile) => {
    f.setDatafile(datafile);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error fetching datafile:", error);
  });
