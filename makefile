DOMAIN = kiedtl.surge.sh
HTMLDR = ./_website/
SFLAGS = --project ${HTMLDR} --domain ${DOMAIN}

all:  clean build deploy

clean:
	@echo ==> CLEANING
	cd src && rm -rf _website

build: pull clean
	@echo ==> BUILDING
	cd src && ./mksite

deploy: build
	@echo ==> DEPLOYING
	cd src && surge ${SFLAGS}
	git add . && git commit -am "build"
	git push origin master

.PHONY: all clean build deploy
