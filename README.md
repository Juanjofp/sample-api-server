# API SERVER

## How to install

curl docker-compose.yml
docker-compose up -d

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
