#!/usr/bin/env bash
set -e

echo "DEVELOPMENT..."

/opt/wait-for-it.sh postgres:5432

# cp .env.development .env
npm run migration:run
npm run seed:run

npm run start:dev
