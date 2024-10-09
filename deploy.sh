#!/bin/sh
set -e
npm install
npm run build
. ./aws.local
cd dist
aws s3 cp --recursive . "s3://${BUCKET}"
aws cloudfront create-invalidation --distribution-id "${DISTRIBUTION_ID}" --paths / /index.html /manifest.json
