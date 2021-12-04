# Run 

`docker run -d -p 3000:3000 -v $(pwd)/server/images/:/var/www/html/server/images poulton/waifu-husbando`

It is assumed that `./server/images` contains a folder `waifus` with image files for _him_ and a folder `husbandos` with image files for _her_.
