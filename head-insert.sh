#!/bin/sh
# Post-build script to add things to the HTML HEAD
cd dist
TEMP_FILE=$(mktemp)
# copy the lines up to but not including the line containing "<\/head>"
awk '/<\/head>/ {exit} {print}' index.html > "${TEMP_FILE}"
# Add font preloads for the fonts used by the landing page
#  -o -name 'roboto-latin-ext-400-normal-*.woff2' \
find assets \
  \( -name 'roboto-latin-[45]00-normal-*.woff2' \
  -or -name 'roboto-latin-ext-400-normal-*.woff2' \) \
  -exec printf \
 '    <link rel="preload" crossorigin href="/%s" type="font/woff2" as="font">\n' \
 \{\} \; >> "${TEMP_FILE}"
# copy all the lines from and including the line containing "<\/head>"
awk '/<\/head>/,EOF' index.html >> "${TEMP_FILE}"
# now overwrite with the modified content
mv "${TEMP_FILE}" index.html
