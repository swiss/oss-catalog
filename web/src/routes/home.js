import yaml from "js-yaml";
import { getPublishers } from "../api/publishers.js";
import { getSoftwares } from "../api/softwares.js";
import { withLayout } from "../layout.js";

export async function homeRoute(req, res, next) {
  try {
    const [publishers, softwares] = await Promise.all([
      getPublishers(),
      getSoftwares(),
    ]);

    res.send(
      withLayout(`
      <section>
        <h2>Publishers</h2>
        <ul>
          ${publishers.data.map(renderPublisher).join("")}
        </ul>
        <a href="/publishers/new">➕ Add publisher</a>
      </section>
      <section style="margin-top: 3rem;">
        <h2>Softwares</h2>
        <style>
          ul.softwares {
            list-style: none;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
          }
          ul.softwares li {
            padding: 1rem;
            border: 1px solid #eee;
            border-radius: 5px;
            box-shadow: 0 .5rem 1rem rgba(0,0,0,.15);
          }
        </style>
        <ul class="softwares">
          ${softwares.data.map(renderSoftware).join("")}
        </ul>
        ${
          softwares.data.length > 0
            ? `<form method="POST" action="/softwares/delete">
                 <button type="submit">❌ Delete all softwares</button>
               </form>`
            : ""
        }
        
      </section>
    `)
    );
  } catch (error) {
    next(error);
  }
}

function renderPublisher(publisher) {
  return `
    <li>
      <div style="display: flex; align-items: baseline; gap: 0.5rem;">
        <div>
          ${publisher.description}: ${publisher.codeHosting
    .map(({ url }) => `<a href="${url}">${url}</a>`)
    .join(", ")}
        </div>
        <form method="POST" action="/publishers/${publisher.id}/delete">
          <button type="submit" aria-label="Delete">❌ Delete</button>
        </form>
      </div>
    </li>
  `;
}

function renderSoftware(software) {
  const content = yaml.load(software.publiccodeYml);
  return `
    <li>
      <div style="font-weight: 600; margin-bottom: 0.5rem;">📦 ${
        content.name
      }</div>
      <div><a href="${content.url}">${content.url}</a></div>
      ${
        content.legal?.license
          ? `<div style="color: #888; font-style: italic">${content.legal.license}</div>`
          : ""
      }
      <br>
      ${Object.values(content.description)[0]?.shortDescription ?? "–"}

      <!--<div style="margin-top: 0.5rem; font-family: monospace;">${JSON.stringify(
        content
      )}</div>-->
    </li>
  `;
}
