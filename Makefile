migration-generate:
	docker exec -i main npm run migration:generate
migration-run:
	docker exec -i main npm run migration:run
local-db-dump:
	pg_dump -h localhost -U postgres local_poti_public_outage > ./initdb/dump.sql
db-dump:
	docker exec -i postgres pg_dump --username postgres poti_public_outage > ./initdb/dump.sql
db-restore:
	docker exec -i postgres psql --username postgres postgres < ./initdb/dump.sql

