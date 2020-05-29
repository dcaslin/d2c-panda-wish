# d2c-panda-wish
Generate a JSON wishlist from PandaPaxxy's god roll Google Sheet (for use on D2Checklist.com, or wherever you want)

Reddit post about [Panda's list](https://www.reddit.com/r/sharditkeepit/comments/gh8vv5/new_breakdown_of_every_weapon/?utm_medium=android_app&utm_source=share)

The [source sheet](https://docs.google.com/spreadsheets/d/1UlPqO4koKRcqMxl2VO4JzdgkKyY7LW07W0k91S_Yl8U/edit?usp=sharing)

[D2Checklist](https://www.d2checklist.com)

Credit: Based loosely on [Little Light](https://play.google.com/store/apps/details?id=me.markezine.luzinha&hl=en_US)'s [own csv parser](https://github.com/LittleLightForDestiny/csv-wishlists-parser/tree/master/output)

## Usage

`git clone https://github.com/dcaslin/d2c-panda-wish.git`

`npm install`

`npm start` or `npm run once`

This will print out to the console. Bad validation messages have a `xxxxx` prefix, and good messages have a `*****` prefix. It will also write out files to the `./tmp` folder for debugging.
Finally it will produce `sheet-errors.txt` and `./panda-godrolls.json` (`./panda-godrolls-with-errors.json` if there are errors). That last one, `panda-godrolls.txt` is what you're looking for!