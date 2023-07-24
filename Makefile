install:
	npm ci

start-frontend:
	make -C frontend start

start-backend:
	npm run start

start:
	npm run build
	make start-backend & make start-frontend