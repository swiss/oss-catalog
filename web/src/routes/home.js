import { getPublishers } from "../api/publishers.js";
import { getSoftwares } from "../api/softwares.js";
import { withLayout } from "../layout.js";

export async function homeRoute(req, res) {
  const [publishers, softwares] = await Promise.all([
    getPublishers(),
    getSoftwares(),
  ]);

  res.send(
    withLayout(`
      <h2>Publishers</h2>
      <a href="/publishers/new">Create publisher</a>
      <ul>
        ${publishers.data
          .map(
            (p) =>
              `<li>
                  ${p.description}: ${p.codeHosting
                .map((h) => h.url)
                .join(", ")}
                <form method="POST" action="/publishers/${
                  p.id
                }/delete"><button type="submit">Delete</button></form>
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
    `)
  );
}
