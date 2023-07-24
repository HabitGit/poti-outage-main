migration-generate:
	docker exec -i main npm run migration:generate
migration-run:
	docker exec -i main npm run migration:run
migration-revert:
	docker exec -i main npm run migration:revert
local-db-dump:
	pg_dump -h localhost -U postgres local_poti_public_outage > ./initdb/dump.sql
db-dump:
	docker exec -i postgres_db pg_dump --username postgres poti_public_outage > ./initdb/dump.sql
db-restore:
	docker exec -i postgres_db psql --username postgres postgres < ./initdb/dump.sql

