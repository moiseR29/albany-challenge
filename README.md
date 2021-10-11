# ALBANY CHALLENGE

- [challenge](#challenge)
- [requiremet](#requirements)
- [how to use](#how-to-use)
- [api](#api)
  - [create user](#create-user)
  - [login](#login)
  - [modify user](#modify-user)
  - [create ticket](#create-ticket)
  - [create ticket image](#create-ticket-image)
  - [get ticket](#get-ticket)
  - [attention ticket](#attention-ticket)
  - [comment ticket](#comment-ticket)
  - [state ticket](#state-ticket)

## CHALLENGE 

Se solicita el desarrollo de una aplicación de servicio técnico, la cual debe contar con las siguientes funcionalidades:

- Registro e Identificación de usuario
- Administración de tickets de soporte

> Debe montarse la aplicación sobre un servidor express.
> Los paquetes adicionales a utilizar quedan a discreción del desarrollador.

### Estructura de datos:

Queda a consideración los tipos de datos que utilizará, como las validaciones que se hagan.

Deberá alimentarse de una base de datos creada en PostgreSQL con la siguientes tablas:

- usuario:
  - userId (autoincremental),
  - name (not null),
  - lastName (not null),
  - email (unique) (not null),
  - company,
  - phone (not null),
  - password (Hashed) (not null),
  - role ( values: ‘C’ para cliente, ‘T’ para técnico) (default ‘C’),
  - active (Y/N) (default Y)
- ticket:
  - ticketId (autoincremental),
  - timestamp,
  - userId(not null),
  - description(not null),
  - filePath,
  - attention,
  - solved (Y/N) (default N),
  - active (Y/N) (default Y)
- ticketComments:
  - ticketId (autoincremental),
  - timestamp,
  - userId (not null),
  - comment (not null),
  - filePath

### Endpoints:

1. Usuario:
- Alta de usuario
  - tanto para clientes como técnicos

- Login
  - Al hacerlo debe devolverse un token, este debe ser controlado para el uso de todo los siguientes endpoints. Validez 8 hs.

- Modificación de usuario
  - Solo el propio usuario

- Baja de usuario
  - Solo el propio usuario

2. Ticket:
- Alta de ticket
  - Solo Cliente
  - en caso de enviar una imagen, debe guardarse en un folder de imágenes y la ruta guardarla en filePath

- Obtener tickets
  - Cliente, solo los propios (todos ordenados de mas actual a mas antiguo)
  - Técnico, (ordenados de mas actual a mas antiguo) poder enviar un parámetro que me permita obtener los siguientes casos:
    - todos los tickets
    - solo los activos
    - solo los resueltos
    - solo los no resueltos
    - solo los inactivos
    > En caso de tener imagen, deberá devolverse como base64,
    > Deberá cada ticket devolverse con sus comentarios si los tuviese.

- Atender ticket
  - Solo Técnico
  - actualizar attention con el id del técnico que lo marco para atender

- Comentar ticket
  - Solo Cliente creador del ticket o Técnico en atención del ticket,
  - en caso de enviar una imagen, debe guardarse en un folder de imágenes y la ruta guardarla en filePath

- Actualizar estados del ticket
  - Solo Técnico del ticket podrá cambiar active
  - Solo Cliente creador del ticket podrá cambiar el estado de solved, siempre y cuanto
  - el estado active esta en Y, osea el ticket no se cerro ya.

> La prueba deberá subirse a repositorio, con el backup de la base de datos y la
> documentación para uso de las apis generadas.

## REQUIREMENTS

- docker
- node > 12.8.1


## HOW TO USE

1. install dependencies

```bash
yarn
```

2. create database and execute migrations

```bash
yarn db:create && yarn db:migration
```

3. execute server
  - local
    ```bash
    yarn build && yarn start
    ```
  - docker
    ```bash
    yarn start:docker
    ```

# API

## CREATE USER

- host: http://localhost:8080/api/user
- method: POST

### body

```json
{
	"name": "Nombre",
	"lastname": "Apellido",
	"email": "nombreapellido@mail.com",
	"company": "Company",
	"phone": "1234567",
	"password": "password",
	"role": "T"
}
```

### Example 

```bash
curl --request POST \
  --url http://localhost:8080/api/user \
  --header 'Content-Type: application/json' \
  --data '{
	"name": "Nombre",
	"lastname": "Apellido",
	"email": "nombreapellido@mail.com",
	"company": "Company",
	"phone": "1234567",
	"password": "password",
	"role": "T"
}'
```

## LOGIN 

- host: http://localhost:8080/api/login
- method: POST
- return in header, albany-token

### body

```json
{
	"email": "email",
	"password": "password"
}
```

### returns (header)

albany-token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmVuQG1haWwuY29tIiwidHlwZSI6IkMiLCJ1c2VySWQiOjIsImlhdCI6MTYzMzk2MzI2MiwiZXhwIjoxNjMzOTY2ODYyfQ.hIV035qozmo5l1sAbKMTHoIBUmbX_if_vK9dwnxdmzk

### Example 

```bash
curl --request POST \
  --url http://localhost:8080/api/login \
  --header 'Content-Type: application/json' \
  --data '{
	"email": "nombreapellido@mail.com",
	"password": "password"
}'
```

## MODIFY USER 

- host: http://localhost:8080/api/user
- method: PUT 
- header: albany-token 

### body

```json
{
  "name": "Nombre",
  "lastname": "Apellido",
  "email": "nombreapellido@mail.com",
  "company": "Company",
  "phone": "1234567",
  "role": "T",
  "active": true
}
```

### Example 

```bash
curl --request PUT \
  --url http://localhost:8080/api/user \
  --header 'Content-Type: application/json' \
  --header 'albany-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vaXNlQG1haWwuY29tIiwidHlwZSI6IlQiLCJ1c2VySWQiOjEsImlhdCI6MTYzMzk2MTEzNCwiZXhwIjoxNjMzOTY0NzM0fQ.1ncS6FOM0JcN12A3ZqDBt9AVj4voyY71VCFXO6rIL5E'
  --data '{
  "name": "Nombre",
  "lastname": "Apellido",
  "email": "nombreapellido@mail.com",
  "company": "Company",
  "phone": "1234567",
  "role": "T",
  "active": true
}'
```

## CREATE TICKET 

- host: http://localhost:8080/api/ticket
- method: POST
- header: albany-token 

### body

```json
{
	"description": "description"
}
```

### Example 

```bash
curl --request POST \
  --url http://localhost:8080/api/ticket \
  --header 'Content-Type: application/json' \
  --header 'albany-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vaXNlQG1haWwuY29tIiwidHlwZSI6IlQiLCJ1c2VySWQiOjEsImlhdCI6MTYzMzk2MTEzNCwiZXhwIjoxNjMzOTY0NzM0fQ.1ncS6FOM0JcN12A3ZqDBt9AVj4voyY71VCFXO6rIL5E'
  --data '{
	"description": "description"
  }'
```

## CREATE TICKET IMAGE

- host: http://localhost:8080/api/ticket
- method: POST
- header: albany-token 

### Example 

```bash
curl --request POST \
  --url http://localhost:8080/api/ticket \
  --header 'albany-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmVuQG1haWwuY29tIiwidHlwZSI6IkMiLCJ1c2VySWQiOjIsImlhdCI6MTYzMzk2MzI2MiwiZXhwIjoxNjMzOTY2ODYyfQ.hIV035qozmo5l1sAbKMTHoIBUmbX_if_vK9dwnxdmzk' \
  --header 'content-type: multipart/form-data; boundary=---011000010111000001101001' \
  --form 'description=ticket prueba imagen' \
  --form 'ticketImage=@PATH_TO_IMAGE'
```

## GET TICKET 

- host: http://localhost:8080/api/ticket/:state?
- method: GET 
- header: albany-token 

### PARAMS

- client 
  - null
- technical
  - null
  - active
  - inactive
  - solved
  - unsolved


### Example 

```bash
curl --request GET \
  --url 'http://localhost:8080/api/ticket/active' \
  --header 'albany-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vaXNlQG1haWwuY29tIiwidHlwZSI6IlQiLCJ1c2VySWQiOjEsImlhdCI6MTYzMzk2MTEzNCwiZXhwIjoxNjMzOTY0NzM0fQ.1ncS6FOM0JcN12A3ZqDBt9AVj4voyY71VCFXO6rIL5E'
```

## ATTENTION TICKET 

- host: http://localhost:8080/api/ticket/:ticket_id
- method: PUT 
- header: albany-token 

### BODY

```json
{
	 "comment": "primer comentario"
}
```

### PARAM 

- ticket_id

### Example 

```bash
curl --request PUT \
  --url http://localhost:8080/api/ticket/1 \
  --header 'Content-Type: application/json' \
  --header 'albany-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vaXNlQG1haWwuY29tIiwidHlwZSI6IlQiLCJ1c2VySWQiOjEsImlhdCI6MTYzMzk2MTEzNCwiZXhwIjoxNjMzOTY0NzM0fQ.1ncS6FOM0JcN12A3ZqDBt9AVj4voyY71VCFXO6rIL5E' \
  --data '{
	 "comment": "primer comentario"
  }'
```

## COMMENT TICKET 

- host: http://localhost:8080/api/ticket/comment/:ticket_id
- method: POST
- header: albany-token 

### BODY

```json
{
	 "comment": "primer comentario"
}
```

### PARAM 

- ticket_id

### Example 

```bash
curl --request POST \
  --url http://localhost:8080/api/ticket/comment/1 \
  --header 'Content-Type: application/json' \
  --header 'albany-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmVuQG1haWwuY29tIiwidHlwZSI6IkMiLCJ1c2VySWQiOjIsImlhdCI6MTYzMzk2MzI2MiwiZXhwIjoxNjMzOTY2ODYyfQ.hIV035qozmo5l1sAbKMTHoIBUmbX_if_vK9dwnxdmzk' \
  --data '{
	 "comment": "cuarto comentario"
}'
```

## STATE TICKET 

- host: http://localhost:8080/api/ticket/state/:ticket_id
- method: PUT
- header: albany-token 

### BODY

- tech

```json
{
	 "active": false
}
```

- client

```json
{
	 "solved": true 
}
```

### PARAM 

- ticket_id

### Example 

```bash
curl --request PUT \
  --url http://localhost:8080/api/ticket/state/1 \
  --header 'Content-Type: application/json' \
  --header 'albany-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vaXNlQG1haWwuY29tIiwidHlwZSI6IlQiLCJ1c2VySWQiOjEsImlhdCI6MTYzMzk2MTEzNCwiZXhwIjoxNjMzOTY0NzM0fQ.1ncS6FOM0JcN12A3ZqDBt9AVj4voyY71VCFXO6rIL5E' \
  --data '{
	"active": false
  }'
```