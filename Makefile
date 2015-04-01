PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash

template_source := templates/*.handlebars
template_dest := build/templates.js

js_source := src/*.js
js_dest := build/main.js

all: npm bower

bower: npm
	node_modules/.bin/bower-installer

npm:
	npm install

build: $(js_dest) $(template_dest)

clean:
	rm -rf build/

distclean: clean
	-$(QUIET)rm -rf node_modules bower_components

$(template_dest): $(template_source)
	mkdir -p $(dir $@)
	handlebars $(template_source) > $@

$(js_dest):
	mkdir -p $(dir $@)
	browserify $(js_source) > $@

run:
	beefy src/main.js 8000 --index=src/index.html --live -- -t browserify-handlebars
