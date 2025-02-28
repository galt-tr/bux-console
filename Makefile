# Common makefile commands & variables between projects
include .make/common.mk

## Not defined? Use default repo name which is the application
ifeq ($(REPO_NAME),)
	REPO_NAME="bux-console"
endif

## Not defined? Use default repo owner
ifeq ($(REPO_OWNER),)
	REPO_OWNER="BuxOrg"
endif

## Default branch
ifndef REPO_BRANCH
	override REPO_BRANCH="master"
endif

.PHONY: clean

audit: ## Checks for any packages that are vulnerable
	@yarn audit

clean: ## Remove previous builds and any test cache data
	@npm run clean
	@if [ -d $(DISTRIBUTIONS_DIR) ]; then rm -r $(DISTRIBUTIONS_DIR); fi
	@if [ -d build ]; then rm -r build; fi
	@if [ -d build_cache ]; then rm -r build_cache; fi
	@if [ -d node_modules ]; then rm -r node_modules; fi

install: ## Install the application
	@yarn

install-all-contributors: ## Installs all contributors locally
	@echo "installing all-contributors cli tool..."
	@yarn global add all-contributors-cli

start: ## Starts the console
	@yarn run start

outdated: ## Checks for any outdated packages
	@yarn outdated

update-contributors: ## Regenerates the contributors html/list
	@echo "generating contributor html..."
	@all-contributors generate
