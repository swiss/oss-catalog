# OSS Catalog – Client

Web Client for OSS Catalog, based on [Astro](https://astro.build).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## CD Bund
The client's styling is based on the [Design System for the Swiss Confederation](https://github.com/swiss/designsystem) 🇨🇭.


## Organisations
The client application contains a filter that allows the software to be filtered by organisation. The organisations are loaded from `src/data/organisations.json`, which is copied from the [Public Code Editor](https://github.com/swiss/publiccode-editor/tree/cd-bund/src/app/data/README.md).