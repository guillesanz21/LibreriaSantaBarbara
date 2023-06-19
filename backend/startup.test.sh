#!/usr/bin/env bash
set -e

echo "TEST..."

/opt/wait-for-it.sh postgres:5432
# npm run migration:run
# npm run seed:run
npm run lint
npm run test
npm run test:e2e -- --runInBand
