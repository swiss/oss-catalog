import yaml from "js-yaml";
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
      <ul>
        ${publishers.data.map(renderPublisher).join("")}
      </ul>
      <a href="/publishers/new">New publisher</a>
      <h2>Softwares</h2>
      <style>
        ul.softwares {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 0.5rem;
        }
        ul.softwares li {
          padding: 1rem;
          border: 1px solid #eee;
          border-radius: 5px;
        }
      </style>
      <ul class="softwares">
        ${softwares.data.map(renderSoftware).join("")}
      </ul>
      <form method="POST" action="/softwares/delete">
        <button type="submit">❌ Delete all softwares</button>
      </form>
    `)
  );
}

function renderPublisher(publisher) {
  return `
    <li>
      <div style="display: flex; align-items: baseline; gap: 0.5rem;">
        <div>
          ${publisher.description}: ${publisher.codeHosting
    .map(({ url }) => url)
    .join(", ")}
        </div>
        <form method="POST" action="/publishers/${publisher.id}/delete">
          <button type="submit" aria-label="Delete">❌</button>
        </form>
      </div>
    </li>
  `;
}

function renderSoftware(software) {
  const content = yaml.load(software.publiccodeYml);
  return `
    <li>
      <div style="font-weight: 600; margin-bottom: 0.5rem;">${
        content.name
      }</div>
      <div><a href="${content.url}">${content.url}</a></div>
      ${content.legal?.license ? `<div>${content.legal.license}</div>` : ""}
      <br>
      ${Object.values(content.description)[0]?.shortDescription ?? "–"}

      <!--<div style="margin-top: 0.5rem; font-family: monospace;">${JSON.stringify(
        content
      )}</div>-->
    </li>
  `;
}
