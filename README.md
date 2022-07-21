# natura11y-icons

## Steps to Make Icons

1.) Save SVG to *original-svg* dir

2.) Run saved icons through svgo:

`svgo -f ./original-svg -o ./optimized-svg`

3.) Run fantasticon

`fantasticon ./optimized-svg -o ./dist`

4.) Run svg sprite generate
`svg-sprite-generate -d ./optimized-svg -o ./dist/natura11y-icons-sprite.svg`