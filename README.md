# OSS Catalog POC

Proof-of-concept for an Open Source catalog based on the [Publiccode](https://github.com/publiccodeyml) standard.

## Componenents

### API

Generate PASETO auth key:

```
echo "PASETO_KEY=$(shuf -er -n32  {A..Z} {a..z} {0..9} | tr -d '\n' | base64)" > .env
```

Start API with database:

```
cd components/developers-italia-api/
docker compose up
```

Generate PASETO token:

TODO

Create a publisher:

```
curl -X POST -H "Authorization: Bearer $PASETO_TOKEN" -H "Content-Type: application/json" -d '{"codeHosting": [{"url": "https://github.com/swiss/", "group": true}], "description": "Swiss Government"}' http://localhost:3000/v1/publishers
```

List publishers:

```
curl http://localhost:3000/v1/publishers
```

## Resources

- [publiccode.yml Standard](https://github.com/publiccodeyml/publiccode.yml)
- [publiccode.yml crawler for the software catalog of Developers Italia](https://github.com/italia/publiccode-crawler)
  - Fetches registered publishers from the Developers Italia API, crawles all their repositories & feeds the publiccode.yml results into the Developers Italia API.
- [publiccode.yml parser for Go by Developers Italia](https://github.com/italia/publiccode-parser-go) – Used by the publiccode.yml crawler
- [Developers Italia API](https://github.com/italia/developers-italia-api) – Stores the results of the publiccode.yml crawler in a PostgreSQL db, runs at https://api.developers.italia.it/v1/software
- [publiccode yml Editor by Developers Italia](https://github.com/italia/publiccode-editor) – Web UI to conveniently edit publiccode.yml files
- [Developers Italia website](https://github.com/italia/developers.italia.it) – Italy's [OSS catalog](https://developers.italia.it/en/software) (Jekyll site)
  - Downloads crawled softwares from Developers Italia API: https://github.com/italia/developers.italia.it/blob/main/scripts/get-software.js
- [More publicode.yml components by Developers Italia](https://github.com/italia#-publiccode)
