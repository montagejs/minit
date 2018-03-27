# {{name}}

## Prerequisites

### 1. Software

* Docker (version 17.03+) - Run software packaged into isolated containers.
[Docker](https://www.docker.com/) must be installed before you can use docker sample.

# Quick start

1. Install 
```
git clone git@github.com:user/repo.git
cd repo
npm install
```

2. Start
```
npm start
```

3. Test
Then Open you browser to "https://localhost:8080".


## Troubleshooting & Useful Tools

### Start and deploy

```
# npm run build
docker build . -t {{name}}:develop-SNAPSHOT

# npm run start:swarm
docker swarm init

# npm run start:stack
docker stack deploy -c docker-compose.yml 'montage-auth'

# npm run start:doc
open https://localhost:8080/doc/swagger.html
```

### Shutdown stack

```
# npm run stop:swarm
docker swarm leave --force
```
### REST API documentation

See swagger Documentation: [swagger.yml](./doc/swagger.yml).

## License

{{#copyright}}
