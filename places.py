#!/bin/env python3

# Extracts 36 JSON place-name files from a US Census place name files such as:
# https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2022_Gazetteer/2022_Gaz_place_national.zip
# https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2022_Gazetteer/2022_Gaz_zcta_national.zip

import csv
import json
import os.path
import re

# regex to strip suffixes such as "CDP", "city", "zona urbana", etc. from name
regex = re.compile('( ([a-z]+|CDP))+$')

def extract(row):
  name = regex.sub('', row['NAME'])
  return [f"{name}, {row['USPS']}", float(row['INTPTLAT']), float(row['INTPTLONG'])]

def out(letter, rows):
  if rows:
    outdir = os.path.join(os.path.dirname(__file__), 'public', 'data')
    os.makedirs(outdir, exist_ok=True)
    outfile = os.path.join(outdir, f"{letter}.json")
    with open(outfile, 'w') as output:
      output.write(json.dumps(rows, separators=(',',':')))

def process(places, isName):
  data = None
  with open(places) as input:
    header = input.readline()
    fieldnames = [c.strip() for c in header.split('\t')]
    reader = csv.DictReader(input, delimiter='\t', fieldnames=fieldnames)
    if isName:
      data = [extract(row) for row in reader]
    else:
      data = [[row['GEOID'], float(row['INTPTLAT']), float(row['INTPTLONG'])] for row in reader]
    data = sorted(data, key=lambda row: row[0].lower().replace(' ', ','))

  last = None
  letter = None
  rows = None
  for row in data:
    name = row[0].lower()
    if last == name:
      continue
    last = name
    if letter != name[0]:
      out(letter, rows)
      rows = []
      letter = name[0]
    rows.append(row)
  out(letter, rows)

src = '2022_Gaz_place_national.txt'
places = os.path.join(os.path.dirname(__file__), '.local', src)
process(places, True)

src = '2022_Gaz_zcta_national.txt'
places = os.path.join(os.path.dirname(__file__), '.local', src)
process(places, False)
