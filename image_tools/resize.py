import os, sys
from PIL import Image

size = 8192, 4096

for infile in sys.argv[1:]:
    outfile = "test/" + infile.split("/")[1]

    img = Image.open(infile)
    new_img = img.resize((8192, 4096))
    new_img.save(outfile, "JPEG", optimize=True)
