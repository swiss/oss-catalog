import express from "express";
import { getPublishers } from "./src/api/publishers.js";
import { getSoftwares } from "./src/api/softwares.js";

const app = express();
const port = 8080;

app.get("/", async (req, res) => {
  const [publishers, softwares] = await Promise.all([
    getPublishers(),
    getSoftwares(),
  ]);

  res.send(`
    <html>
      <h1>Open Source Catalog POC</h1>
      <h2>Publishers</h2>
      <ul>
        ${publishers.data
          .map(
            (p) =>
              `<li>
                 ${p.description}: ${p.codeHosting.map((h) => h.url).join(", ")}
              </li>`
          )
          .join("")}
      </ul>
      <h2>Softwares</h2>
      <ul>
        ${softwares.data
          .map(
            (s) =>
              `<li>
                 ${JSON.stringify(s)}
              </li>`
          )
          .join("")}
      </ul>
    </html>`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
