.PHONY: helm helm-prod k8s k8s-prod cicd

HELM=helm
KUBECTL=kubectl

helm:
	$(KUBECTL) config set-context --current --namespace=cloud
	$(HELM) upgrade --install instance-redis bitnami/redis -f ./helm/redis/values.yaml -f ./helm/redis/values-dev.yaml
	$(HELM) upgrade --install postgresql bitnami/postgresql -f ./helm/postgres/values.yaml -f ./helm/postgres/values-dev.yaml
	$(HELM) upgrade --install instance-backend ./helm/backend -f ./helm/backend/values.yaml -f ./helm/backend/values-dev.yaml
	$(HELM) upgrade --install instance-frontend ./helm/frontend -f ./helm/frontend/values.yaml -f ./helm/frontend/values-dev.yaml

helm-prod:
	$(KUBECTL) config set-context --current --namespace=cloud-prod
	$(HELM) upgrade --install instance-redis bitnami/redis -f ./helm/redis/values.yaml -f ./helm/redis/values-prod.yaml
	$(HELM) upgrade --install postgresql bitnami/postgresql -f ./helm/postgres/values.yaml -f ./helm/postgres/values-prod.yaml
	$(HELM) upgrade --install instance-backend ./helm/backend -f ./helm/backend/values.yaml -f ./helm/backend/values-prod.yaml
	$(HELM) upgrade --install instance-frontend ./helm/frontend -f ./helm/frontend/values.yaml -f ./helm/frontend/values-prod.yaml

cicd:
	$(KUBECTL) config set-context --current --namespace=cloud-prod
	$(KUBECTL) create serviceaccount github-robot
	$(KUBECTL) apply -f ./k8s/serviceaccount/role.yaml
	$(KUBECTL) apply -f ./k8s/serviceaccount/rolebinding.yaml
	$(KUBECTL) apply -f ./k8s/serviceaccount/secret.yaml

k8s:
	$(KUBECTL) apply -f ./k8s/cloud-namespace.yaml
	$(KUBECTL) apply -f ./k8s/secrets/postgresql-credentials-dev.yaml

k8s-prod:
	$(KUBECTL) apply -f ./k8s/cloud-prod-namespace.yaml
	$(KUBECTL) apply -f ./k8s/secrets/postgresql-credentials-prod.yaml
