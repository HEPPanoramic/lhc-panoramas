# This script, launched from a folder
# containing some JPG images, it does:
# - it creates a folder to contain the output images
# - it copies all the images from the original folder to the output folder
# - it rename the images in the output folder according the prefix set by the user and a sequential number (e.g., pic_1.jpg, pic_2.jpg, ...)
# it resizes all the images in the output folder to the desired width
# - it creates a folder to contain the thumbnails of all images
# - it copies all the images from the original folder to the thumbnail folder
# - it resizes all the images in the thumbnail folder to the deried thumbnail width
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
# USAGE:
#    sh copy_and_rename_pictures.sh imagesFolderName imagesPrefix imagesWidth thumbnailsWidth"
#
# example:
#    sh copy_and_rename_pictures.sh MyPics pic 1024 256"
#
# This will:
# - create a "MyPics" folder containing all the copied&renamed pictures,
# - resize them at 1024 pixels width,
# - create another folder called "MyPics_thumb",
#       containing a copy of all the copied&renamed pictures,
# - resize the thumbnails at 256 pixels width
#

usage(){
  echo "USAGE: "
  echo "     sh copy_and_rename_pictures.sh imagesFolderName imagesPrefix imagesWidth thumbnailsWidth"
  echo
  echo "example: "
  echo "     sh copy_and_rename_pictures.sh MyPics pic 1024 256"
}

if [ $# -eq 0 ]
  then
    echo
    echo "ERROR! No arguments supplied!"
    echo "You should pass a name for the output folder and a image name prefix."
    echo
    usage
    exit 1
fi
if [ $# -lt 2 ]
  then
    echo
    echo "ERROR! You should pass a name for the output folder and a image name prefix."
    echo
    usage
    exit 1
fi

# Variables
IMG_DIR=$1
IMG_PREFIX=$2
IMG_WIDTH=$3
THUMB_WIDTH=$4
# Create the name for the thumbnail folder
THUMB_DIR=$(printf "%s_thumb" "$IMG_DIR")

# Check if output fiolder exists already
if [ -d "$IMG_DIR" ]; then
  echo
  echo "ERROR! The directory '$IMG_DIR' to contain the output images exists already!"
  echo "Please choose another name for the output folder, or delete the existing folder."
  echo
  usage
  exit 1
fi


echo
echo "Arguments:"
printf 'renamed images output folder: %s\n' "$IMG_DIR"
printf 'thumbnails output folder: %s\n' "$THUMB_DIR"
printf 'image name prefix: %s\n' "$IMG_PREFIX"
printf 'image width: %s\n' "$IMG_WIDTH"
printf 'thumbnail width: %s\n' "$THUMB_WIDTH"

create_dirs_and_copy_files(){
  _IMG_DIR=$1
  _THUMB_DIR=$2
  mkdir $_IMG_DIR
  cp *.jpg $_IMG_DIR
  cp -r $_IMG_DIR $_THUMB_DIR
}

resize_images(){
  _DIR=$1
  _WIDTH=$2
  cd $_DIR
  echo "\nResizing the images in '$_DIR' to width '$_WIDTH'..."
  mogrify -resize $_WIDTH *.jpg
  identify *.jpg
  cd ..
}

rename_images_seqnum(){
  _IMG_DIR=$1
  _IMG_PREFIX=$2
  cd $_IMG_DIR
  echo "\ncopying pictures in folder '$PWD' to folder '$_IMG_DIR' and renaming them using the prefix '$_IMG_PREFIX' ...\n"
  a=1
  for i in *; do
    echo "pic: " "$i"
    # new=$(printf "%04d.jpg" "$a") # 0001.jpg, 0002.jpg, ...
    new=$(printf "%s_%d.jpg" "$_IMG_PREFIX" "$a") # pic_1.jpg, pic_2.jpg, ...
    echo "new: " $new
    mv -- "$i" "$new"
    let a=a+1
  done
  # resize_images "$IMG_WIDTH"
  cd ..
}

# create_thumbnails(){
#   mkdir $THUMB_DIR
#   cp *.jpg $THUMB_DIR
#   cd $THUMB_DIR
#   echo "\nCreating thumbnails of width '$THUMB_WIDTH'..."
#   resize_images "$THUMB_WIDTH"
#   cd ..
# }

create_dirs_and_copy_files "$IMG_DIR" "$THUMB_DIR"
rename_images_seqnum "$IMG_DIR" "$IMG_PREFIX"
resize_images "$IMG_DIR" "$IMG_WIDTH"
rename_images_seqnum "$THUMB_DIR" "$IMG_PREFIX"
resize_images "$THUMB_DIR" "$THUMB_WIDTH"

# create_thumbnails
