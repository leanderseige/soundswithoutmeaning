#!/bin/bash

for i in $(jq -r '.[] | .sound' sounds3.json); do
    ls -1 $i
    o=$(dirname $i)/looped_$(basename $i)
    echo "$i => $o"
    ffmpeg -y -stream_loop -1 -i $i -af 'afade=in:st=0:d=30,afade=out:st=30:d=30' -t 60 -codec:a libmp3lame -qscale:a 0 -ar 48000 -ac 2 $o
    rm $i
done


