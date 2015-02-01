all: build/MathForm.js

build/MathForm.js: src/MathForm.coffee
	mkdir -p build
	coffee --compile --output build/ src/MathForm.coffee