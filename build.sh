#!/bin/sh
LESSC="node_modules/.bin/lessc"
UGLIFY="node_modules/.bin/uglifyjs"
LICENSE='Poppy v0.5.0 | (c) 2014 by Arnaud Ceccaldi | MIT License'

# Ensures we're running from the right folder
[ ! -f "build.sh" ] && echo "Could not find build.sh in current folder. Please run this script from the project root folder!" && exit
[ ! -f "src/poppy.js" ] && echo "Could not find poppy.js in current folder. Please run this script from the project root folder!" && exit
[ ! -f "src/poppy.less" ] && echo "Could not find poppy.less in current folder. Please run this script from the project root folder!" && exit

# Create the build folder if it doesn't exist yet
mkdir -p build

# Cleanup build folder if needed
rm -rf build/* build/.* 2> /dev/null

# Minifies all LESS assets
$LESSC --clean-css "src/poppy.less" "build/poppy.min.css"
$LESSC --clean-css "src/theme.less" "build/theme.min.css"

# Inject poppy.min.css content inside poppy.js
POPPY_MIN_CSS=$(cat "build/poppy.min.css")
sed -e "s/{{poppy\.min\.css}}/${POPPY_MIN_CSS}/g" "src/poppy.js" > "build/poppy.tmp.js"

# Minifies JS assets
$UGLIFY "src/utils.js" "src/modal.js" "build/poppy.tmp.js" --enclose --preamble "/* $LICENSE */" --beautify > "build/poppy.js"
$UGLIFY "src/utils.js" "src/modal.js" "build/poppy.tmp.js" --enclose --preamble "/* $LICENSE */" --compress --mangle --screw-ie8 > "build/poppy.min.js"

# Cleanup build folder
rm "build/poppy.tmp.js" "build/poppy.min.css"
