# Run 

```sh
docker run -d -p 3003:3003 -v $(pwd)/waifu-husbando/db:/var/www/html/server/db -e DB_FILE=db/db.json --name waifus --rm poulton/waifu-husbando
```

It is assumed that `./waifu-husbando-images/db` contains a file `db.json` with the following structure:

```json
{
  "images": {
    "audit": {
      "waifu": [],
      "husbando": []
    }
  }
}
```

Where the `waifu` array contains image links for _him_ and the `husbando` array contains image links for _her_.


Sorry about the gender normatism.


