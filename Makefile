up:
	docker compose up --build; docker compose down --remove-orphans

shell:
	docker compose exec -it backend sh
