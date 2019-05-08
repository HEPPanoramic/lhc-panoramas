import os, sys
from PIL import Image, ImageOps

new_size = (128, 64)

path = os.getcwd() + "/" + sys.argv[1] + "/"
new_path = os.getcwd() + "/images/test/"
top_border=1
border=1

for infile in os.listdir(path):
    print(path + infile)
    try:
        img = Image.open(path + infile)

        new_img = img.resize((new_size[0]-top_border, new_size[1]-top_border))

        img = ImageOps.expand(new_img, border=top_border, fill='white')

        new_img = img.resize((new_size[0]-top_border, new_size[1]-top_border))

        img_with_border = ImageOps.expand(new_img, border=top_border, fill='black')

        # new_img = img.resize((new_size[0]-border, new_size[1]-border))
        #
        # img_with_border = ImageOps.expand(new_img, border=border, fill='blue')
        img_with_border.save(new_path + infile, "JPEG", optimize=True)
    except:
        print("FAILED")
        pass
