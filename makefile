up:
	docker-compose up --build

down:
	docker-compose down

prune:
	docker-compose down --rmi all
	docker system prune -af --volumes

test:
	docker-compose exec app npm jest