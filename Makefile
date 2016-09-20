get-deps: ; npm i ; node_modules/.bin/bower i

build: build-js build-css
build-js: ; node_modules/.bin/browserify -p [ tsify --target es6 ] ts/grid.ts > public/js/grid.js
build-css: ; helpers/build_css.sh sass public/css

serve: ; node_modules/.bin/static-server
