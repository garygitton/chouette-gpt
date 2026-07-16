# ==============================================================================
# 🦉 Chouette-GPT - Utility Commands
# ==============================================================================
# This file gathers the most useful commands for development,
# testing, and deploying the Chouette-GPT project.
# ==============================================================================

.PHONY: help dev build deploy test tests clean

help: ## 📚 Display help and available commands
	@echo "🦉 Available Chouette-GPT commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## 🚀 Start the local development server (Nuxt/Vite)
	@echo "Starting development server..."
	PORT=$$(python3 -c "import socket; s=socket.socket(); s.bind(('', 0)); print(s.getsockname()[1]); s.close()") pnpm run dev

start: ## 🚀 Start the reverse proxy and local development server
	@echo "Starting the reverse proxy..."
	docker compose -f /home/gary/Projects/repositories/workspaces/pcspecialist/docker-compose.yml up -d traefik
	@echo "Starting development server on port 3014 for Traefik..."
	BROWSER=none HOST=0.0.0.0 PORT=3014 pnpm run dev

build: ## 📦 Generate static application files (/dist folder)
	@echo "Generating static files for GitHub Pages..."
	NUXT_APP_BASE_URL=/chouette-gpt/ pnpm run generate

deploy: build ## 🌐 Deploy to GitHub Pages in Zero-Downtime mode
	@echo "Deploying to gh-pages branch preserving old cache..."
	# The -a (add) option prevents deletion of old CSS/JS files
	# This ensures users with old index.html cached do not get 404 errors.
	npx gh-pages -a --dotfiles -d dist
	@echo "✅ Deployment complete! CDN cache may take up to 10 minutes to refresh."

TYPE ?= all

test: tests ## 🧪 Alias to run tests

tests: ## 🧪 Run E2E tests (specify TYPE=ui, TYPE=gpu, or TYPE=all; defaults to all)
ifeq ($(TYPE),ui)
	@echo "Running Playwright UI tests..."
	npx playwright test --project=ui-tests
else ifeq ($(TYPE),gpu)
	@echo "Running Playwright WebGPU tests..."
	npx playwright test --project=webgpu-tests
else
	@echo "Running all Playwright tests..."
	npx playwright test
endif

test-ui: ## 🧪 Run only UI tests in headless mode
	@echo "Running Playwright UI tests..."
	npx playwright test --project=ui-tests

test-gpu: ## 🧪 Run only WebGPU hardware tests in non-headless mode
	@echo "Running Playwright WebGPU tests..."
	npx playwright test --project=webgpu-tests

clean: ## 🧹 Clean caches (.nuxt, .output, node_modules) for a fresh start
	@echo "Deleting caches and reinstalling dependencies..."
	rm -rf .nuxt .output dist node_modules pnpm-lock.yaml
	pnpm install
	@echo "✅ Clean complete!"
