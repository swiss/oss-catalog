#!/bin/bash
echo "PASETO_KEY=$(shuf -er -n32  {A..Z} {a..z} {0..9} | tr -d '\n' | base64)" >> $(dirname "$0")/../.env
echo "added PASETO_KEY to .env, make sure to execute 'source .env'... (check the file first for duplicate keys!)"