migration-run:
	docker exec -i main npm run migration:run
db-dump:
	docker exec -i postgres pg_dump --username postgres poti_public_outage > ./initdb/dump_poti_public_outage.sql
db-restore:
	docker exec -i postgres psql --username postgres postgres < ./initdb/dump_poti_public_outage.sql