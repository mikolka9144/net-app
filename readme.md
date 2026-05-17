## Postgres-database

### Update config

helm upgrade postgresql bitnami/postgresql \
  --namespace cloud --values ./values.yaml