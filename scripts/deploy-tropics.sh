#!/bin/sh
set -e
cd tropics
npm install
npm run build
. ../aws.local
aws lambda update-function-code \
  --function-name "${TROPICS_FUNCTION_NAME}" \
  --no-cli-pager \
  --zip-file "fileb://../.local/tropics.zip"
