 # e-landeros.github.io
 
 ## This is My custom Website build to be launched on a static hosting site.


## Custom build 
#### use npm run to run scripts. 
`npm run watch:sass`
    "watch:sass": "node-sass sass/main.scss css/style.css -w",
    "compile:sass": "node-sass sass/main.scss css/style.comp.css",
    "concat:css": "concat -o css/style.concat.css css/open-icon/font/css/open-icon.css css/style.comp.css",
    "prefix:css": "postcss --use autoprefixer -b 'last 10 versions' css/style.concat.css -o css/style.prefix.css",
    "compress:css": "node-sass css/style.prefix.css css/style.min.css --output-style compressed",
    "build:css": "npm-run-all compile:sass concat:sass prefix:css compress:css"
