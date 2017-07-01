# dirwatch
``
node node_modules/dirwatch/watch.js "res/layout/, res/skins/, res/l18n/" "node scripts/update_res.js" 3000
``
1. "res/layout/, res/skins/, res/l18n/" - dirs to be listened for changes
2. "node scripts/update_res.js" - script to be executed when dir changed
3. 3000 script executing frequrency throttling (microseconds, optional, default - 3000)
