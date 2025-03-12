#!/bin/bash
echo "PASETO_KEY=$(shuf -er -n32  {A..Z} {a..z} {0..9} | tr -d '\n' | base64)" > $(dirname "$0")/../.env
echo "Wrote PASETO_KEY to .env, make source to execute 'source .env'..."