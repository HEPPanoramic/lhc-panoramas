# This script, launched from a folder
# containing some JPG images,
# creates a folder with the thumbnails of all images.
#
#
# Script derived from work by Martin Malinda, taken from: https://hackernoon.com/save-time-by-transforming-images-in-the-command-line-c63c83e53b17
#
#
#  === Note ===
#  you must have 'Imagemagick' installed on your machine:
#  - macOS:   brew update && brew install imagemagick
#  - Ubuntu:  sudo apt-get install imagemagick
#
#  It can be used as:
#
# $ cd some-image-folder
# $ sh <path-to>/image_tools/create_thumbnails.sh thumb 150
#
# This will create a "thumb" folder, copies the images into it, and resizes them to 150px width.
#

mkdir $1
cp *.jpg $1
cd $1
mogrify -resize $2 *.jpg
cd ..
