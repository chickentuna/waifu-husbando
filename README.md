# Run 

```sh
docker run \
-d \
--pull always \
-p 3000:3000 \
-v $(pwd)/waifu-husbando-images:/var/www/html/server/images \
--name waifus \
--rm \
poulton/waifu-husbando
```

It is assumed that `./waifu-husbando-images/images` contains a folder `waifus` with image files for _him_ and a folder `husbandos` with image files for _her_.
