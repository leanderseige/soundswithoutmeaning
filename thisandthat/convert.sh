#!/bin/bash

cat public/sounds.json | jq " [ .records[] | { \
    sound: .RDF.Media.link, \
    image: .RDF.Image.thumbnailSource, \
    label: .RDF.Entity.itemLabel } \
] " > public/sounds2.json
