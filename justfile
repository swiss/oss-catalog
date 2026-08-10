[doc('List all available recipes')]
default:
    just --list
    

alias sa := start-api
[doc('Start the API container')]
[group('backend')]
start-api:
    docker compose up -d api

alias sp := stop-api
[group('backend')]
[doc('Stop the API container')]
stop-api:
    docker compose down

alias lp := list-publishers
[group('api')]
[doc('Get publishers from the API')]
list-publishers:
    curl localhost:3000/v1/publishers


alias ls := list-softwares
[group('api')]
[doc('Get all softwares from the API')]
list-softwares:
    curl localhost:3000/v1/software?all=true

alias sc := start-crawler
[group('crawler')]
[doc('Start the crawler container')]
start-crawler:
    #!/usr/bin/env bash
    set -euo pipefail
    export API_BEARER_TOKEN="$(just pt)"
    docker compose up crawler


alias pt := paseto-token
[group('token')]
[doc('Generate a PASETO token')]
paseto-token:
    #!/usr/bin/env bash
    set -euo pipefail
    set -a
    source .env
    set +a
    cd paseto/go
    go run paseto-generate.go "$PASETO_KEY"

alias pe := paseto-export
[group('token')]
[doc('Generate a PASETO token and export it')]
paseto-export:
    @echo "export PASETO_TOKEN='$(just pt)'"


alias sf := start-frontend
[group('frontend')]
[doc('Start the frontend in dev mode')]
start-frontend:
    pnpm install
    pnpm scope:client dev