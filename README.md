# API SERVER

## How to install

curl https://raw.githubusercontent.com/Juanjofp/sample-api-server/main/docker-compose.yml --output docker-compose.yml

start: docker-compose up -d

stop: docker-compose down

## How to use

### Register

```
curl --location --request POST 'http://127.0.0.1:8080/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "user":"username",
  "password":"passwd"
}'
```

### Login

```
curl --location --request POST 'http://127.0.0.1:8080/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "user":"username",
  "password":"passwd"
}'
```
