# natura11y-icons


## Steps to Make Icons

1.) Save SVG to *original-svg* dir

2.) Run saved icons through svggo:

`svgo -f ./original-svg -o ./optimized-svg`

3.) Run fantasticon

`fantasticon ./optimized-svg -o ./dist`

4.) Run css minify

`-d dist -o dist`