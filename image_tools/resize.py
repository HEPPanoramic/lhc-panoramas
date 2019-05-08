import os, sys
from PIL import Image

size = 8192, 4096

for infile in sys.argv[1:]:
    print infile
    outfile = "images/test/" + infile.split("/")[-1]
    print outfile

    img = Image.open(infile)
    new_img = img.resize((128, 64))
    new_img.save(outfile, "JPEG", optimize=True)
