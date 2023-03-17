install:
	npm install
	npm install --prefix ./frontend/
back:
	npm run build
	npm run backendStart