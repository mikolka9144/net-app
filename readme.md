## Postgres-database

### Update config

helm upgrade postgresql bitnami/postgresql \
  --namespace cloud --values ./values.yaml

 helm install instance-frontend ./frontend -f ./frontend/values.yaml