
build: src
	mkdir -p build
	rsync -Prl src/*.xhtml src/*.css src/*.js src/*.png src/*.pdf src/*.jpg src/fonts src/mathjax src/text build/

deploy: build
	rsync -Prl build/ tam212@lagrange.mechse.illinois.edu:public_html/
