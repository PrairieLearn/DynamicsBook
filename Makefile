
.PHONY: deploy

deploy:
	rsync -Pprl --delete src/ dynamicref@web.engr.illinois.edu:public_html/
