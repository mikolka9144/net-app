# Metadata

https://github.com/mikolka9144/net-app/actions/runs/26514391612/

# How to setup
- Install minikube
- Install helm
- Enable ingress on minikube: ``minikube addons enable ingress``
- Run ``make k8s``
- Run ``make helm``

For production run the respective "-prod" variants (and review the configuration)

You may also run ``k8s/cert/make.sh``  to create a custom certificate (for use with instance-frontend)

## CI/CD integration
- Run ``make cicd``
- Customise and run ``k8s/serviceaccount/make-kubefile.sh``
- Use the resulting `.yaml` file in a pipeline