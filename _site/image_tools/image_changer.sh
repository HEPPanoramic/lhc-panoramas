#!/bin/bash

var=1

while read line
do
    mv "atlas/""$line" "atlas/atlas_""$var"".jpg"
    var=$(($var + 1))
done < atlas.txt
