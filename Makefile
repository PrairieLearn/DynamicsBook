
.PHONY: build deploy deploy_mathjax deploy_all deploy_lagrange

build:
	mkdir -p build
	rsync -Prl src/*.xhtml src/*.html src/*.css src/*.js src/*.png src/*.pdf src/*.jpg src/fonts src/text build/

deploy:
	rsync -Prl build/ sftp.courses.engr.illinois.edu:/courses/tam212/sp2013/

deploy_mathjax:
	rsync -Prl src/mathjax sftp.courses.engr.illinois.edu:/courses/tam212/sp2013/

deploy_all: deploy deploy_mathjax

deploy_lagrange:
	rsync -Prl build/ tam212@lagrange.mechse.illinois.edu:public_html/
