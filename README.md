# GoWagr Core API Service

## OVERVIEW

The Gowagr API allows users to manage inter-transfer between different accounts. It supports features such as creating transfers, retrieving transfers, and handling users. This API uses NestJS and TypeORM and is secured with JWT authentication.

## TABLE OF CONTENTS

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the API](#running-the-api)
- [Documentation](#documentation)
- [API Endpoints](#api-endpoints)
  - [Auth Endpoints](#auth-endpoints)
  - [User Endpoints](#user-endpoints)
  - [Transfer Endpoints](#transfer-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)

## FEATURES

- User management (CRUD operations)
- Transfers between users
- Balance tracking for each user
- JWT-based authentication
- Error handling and validation
- Pagination and filtering

## Getting started with GoWagr API

## PREREQUISITES

To be able to setup the project locally, you need to have the following installed and working properly:

- [Node.js v16.x or higher](https://nodejs.org/en/)
- NPM and Yarn
- [PostgreSQL v12.x or higher](https://www.postgresql.org/download/)
- [TypeORM for database interaction](https://typeorm.io/transactions)

## INSTALLATION

- Clone the repository:
  ```
  git clone https://github.com/cyrilchukwuebuka/gowagr-simple-money-transfer-system.git
  cd gowagr-simple-money-transfer-system
  ```
- Install dependencies:
  ```
  npm install
  ```
- Set up environment variables:
  ```
  cp .env.example .env
  ```
  - Example .env file:
    ```
     DATABASE_URL=postgres://user:password@localhost:5432/myapi
     JWT_SECRET=supersecretkey
    ```
- Run database migrations:
  ```
  npm run typeorm migration:run
  ```

## Running the API

- Start the server on development:
  ```
  npm run start:dev
  ```
- Start the server on test:
  ```
  npm run test:watch
  or
  npm run test
  ```
- The API will be running at http://localhost:5000. eg. PORT=5000

## Documentation

The API is documented using Swagger, and you can access the Swagger UI at the following endpoint:

- Swagger UI: http://localhost:5000/api

## API Endpoints

### **Auth Endpoints**

| HTTP Method | Endpoint                       | Description                       | Request Body/Query Parameters                                   | Example Response                                                                             |
| ----------- | ------------------------------ | --------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `POST`      | `/api/v1/auth/login`           | Log in user                       | `{"password": "j123456789","username": "johndoe"}`              | `{"access_token": "string","is_deactivated": true,"deactivated_at": "2024-10-04T12:34:56Z"}` |
| `PATCH`     | `/api/v1/auth/change-password` | Change a user password credential | `{"current_password": "123456789","new_password": "123456789"}` | `{"message": "string"}`                                                                      |

### **User Endpoints**

| HTTP Method | Endpoint                     | Description                       | Request Body/Query Parameters                                                                                                 | Example Response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------- | ---------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`       | `/api/v1/users`              | Gets users without balance detail | `None`                                                                                                                        | `[{"id": "da155f61-4b12-4e0e-a715-31f97014c664","created_at": "2024-10-22T01:34:58.534Z","updated_at": "2024-10-22T01:34:58.534Z","amount": "200.00","description": "An initial deposit","status": "successful","version": 1,"sender": {"id": "aa167675-f394-46e0-8864-f8b0546fd5ea","created_at": "2024-10-22T01:23:23.762Z","updated_at": "2024-10-22T01:23:23.762Z","firstname": "Ebuka","lastname": "Doe","username": "ebukadoe3","password": "$2b$12$UfR4w6j8xd1TLB1tZvTxWeDDyzzPuvRz2FL.b8TbLLih3WncL5HQK","password_changed_at": null,"gender": "male","is_deactivated": false,"deactivated_at": null,"country": "Nigeria","version": 1},"receiver": null}]` |
| `POST`      | `/api/v1/users`              | Create new user                   | `{"firstname": "John","lastname": "Doe","username": "johndoe","password": "123456789","gender": "male","country": "Nigeria"}` | `[{"id": "da155f61-4b12-4e0e-a715-31f97014c664","created_at": "2024-10-22T01:34:58.534Z","updated_at": "2024-10-22T01:34:58.534Z","amount": "200.00","description": "An initial deposit","status": "successful","version": 1,"sender": {"id": "aa167675-f394-46e0-8864-f8b0546fd5ea","created_at": "2024-10-22T01:23:23.762Z","updated_at": "2024-10-22T01:23:23.762Z","firstname": "Ebuka","lastname": "Doe","username": "ebukadoe3","password": "$2b$12$UfR4w6j8xd1TLB1tZvTxWeDDyzzPuvRz2FL.b8TbLLih3WncL5HQK","password_changed_at": null,"gender": "male","is_deactivated": false,"deactivated_at": null,"country": "Nigeria","version": 1},"receiver": null}]` |
| `PUT`       | `/api/v1/users`              | Update user detail                | `{"firstname": "John","lastname": "Doe","username": "johndoe","password": "123456789","gender": "male","country": "Nigeria"}` | `[{"id": "da155f61-4b12-4e0e-a715-31f97014c664","created_at": "2024-10-22T01:34:58.534Z","updated_at": "2024-10-22T01:34:58.534Z","amount": "200.00","description": "An initial deposit","status": "successful","version": 1,"sender": {"id": "aa167675-f394-46e0-8864-f8b0546fd5ea","created_at": "2024-10-22T01:23:23.762Z","updated_at": "2024-10-22T01:23:23.762Z","firstname": "Ebuka","lastname": "Doe","username": "ebukadoe3","password": "$2b$12$UfR4w6j8xd1TLB1tZvTxWeDDyzzPuvRz2FL.b8TbLLih3WncL5HQK","password_changed_at": null,"gender": "male","is_deactivated": false,"deactivated_at": null,"country": "Nigeria","version": 1},"receiver": null}]` |
| `GET`       | `/api/v1/users/{id}/profile` | Get a user                        | `None`                                                                                                                        | `{"id": "da155f61-4b12-4e0e-a715-31f97014c664","created_at": "2024-10-22T01:34:58.534Z","updated_at": "2024-10-22T01:34:58.534Z","amount": "200.00","description": "An initial deposit","status": "successful","version": 1,"sender": {"id": "aa167675-f394-46e0-8864-f8b0546fd5ea","created_at": "2024-10-22T01:23:23.762Z","updated_at": "2024-10-22T01:23:23.762Z","firstname": "Ebuka","lastname": "Doe","username": "ebukadoe3","password": "$2b$12$UfR4w6j8xd1TLB1tZvTxWeDDyzzPuvRz2FL.b8TbLLih3WncL5HQK","password_changed_at": null,"gender": "male","is_deactivated": false,"deactivated_at": null,"country": "Nigeria","version": 1},"receiver": null}`   |
| `GET`       | `/api/v1/users/username`     | Get a user by username            | `username=johndoe`                                                                                                            | `{"id": "da155f61-4b12-4e0e-a715-31f97014c664","created_at": "2024-10-22T01:34:58.534Z","updated_at": "2024-10-22T01:34:58.534Z","amount": "200.00","description": "An initial deposit","status": "successful","version": 1,"sender": {"id": "aa167675-f394-46e0-8864-f8b0546fd5ea","created_at": "2024-10-22T01:23:23.762Z","updated_at": "2024-10-22T01:23:23.762Z","firstname": "Ebuka","lastname": "Doe","username": "ebukadoe3","password": "$2b$12$UfR4w6j8xd1TLB1tZvTxWeDDyzzPuvRz2FL.b8TbLLih3WncL5HQK","password_changed_at": null,"gender": "male","is_deactivated": false,"deactivated_at": null,"country": "Nigeria","version": 1},"receiver": null}`   |
| `GET`       | `/api/v1/users/profile`      | Get authenticated user            | `None`                                                                                                                        | `{"id": "da155f61-4b12-4e0e-a715-31f97014c664","created_at": "2024-10-22T01:34:58.534Z","updated_at": "2024-10-22T01:34:58.534Z","amount": "200.00","description": "An initial deposit","status": "successful","version": 1,"sender": {"id": "aa167675-f394-46e0-8864-f8b0546fd5ea","created_at": "2024-10-22T01:23:23.762Z","updated_at": "2024-10-22T01:23:23.762Z","firstname": "Ebuka","lastname": "Doe","username": "ebukadoe3","password": "$2b$12$UfR4w6j8xd1TLB1tZvTxWeDDyzzPuvRz2FL.b8TbLLih3WncL5HQK","password_changed_at": null,"gender": "male","is_deactivated": false,"deactivated_at": null,"country": "Nigeria","version": 1},"receiver": null}`   |
| `GET`       | `/api/v1/users/balance`      | Get authenticated user balance    | `None`                                                                                                                        | `{"id": "78a7033a-8282-4d18-be92-d66ea64efb84","created_at": "2024-10-22T01:23:23.762Z","updated_at": "2024-10-22T01:36:23.250Z","amount": "400.00","version": 6}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

### **Transfer Endpoints**

| HTTP Method | Endpoint                 | Description                                    | Request Body/Query Parameters                                                    | Example Response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------- | ------------------------ | ---------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST`      | `/api/v1/transfers`      | Creates a Transfer between sender and receiver | `{"username": "johndoe","amount": 1,"description": "A payment for the service"}` | `{"id": "d69b5a20-02e6-11eb-adc1-0242ac120002", "amount": 100, "sender": "<User>", "receiver": "<User>", created_at": "2024-10-04T12:34:56Z","updated_at": "2024-10-04T12:34:56Z"}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `PUT`       | `/api/v1/transfers`      | Deposits money into user account               | `{"amount": 1,"description": "A payment for the service"}`                       | `{"id": "d69b5a20-02e6-11eb-adc1-0242ac120002", "amount": 100, "sender": "<User>", "receiver": "<User>", created_at": "2024-10-04T12:34:56Z","updated_at": "2024-10-04T12:34:56Z"}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `GET`       | `/api/v1/transfers`      | Gets Transfer information                      | `{"username": "johndoe","amount": 1,"description": "A payment for the service"}` | `{"data": [{"id": "da155f61-4b12-4e0e-a715-31f97014c664","created_at": "2024-10-22T01:34:58.534Z","updated_at": "2024-10-22T01:34:58.534Z","amount": "200.00","description": "An initial deposit","status": "successful","version": 1,"sender": {"id": "aa167675-f394-46e0-8864-f8b0546fd5ea","created_at": "2024-10-22T01:23:23.762Z","updated_at": "2024-10-22T01:23:23.762Z","firstname": "Ebuka","lastname": "Doe","username": "ebukadoe3","password": "$2b$12$UfR4w6j8xd1TLB1tZvTxWeDDyzzPuvRz2FL.b8TbLLih3WncL5HQK","password_changed_at": null,"gender": "male","is_deactivated": false,"deactivated_at": null,"country": "Nigeria","version": 1},"receiver": null}],"meta": {"itemsPerPage": 20,"totalItems": 4,"currentPage": 1,"totalPages": 1,"sortBy": [["created_at","DESC"]]},"links": {"current": "http://localhost:5000/api/v1/transfers?page=1&limit=20&sortBy=created_at:DESC"}}` |
| `GET`       | `/api/v1/transfers/{id}` | Gets a Transfer detail by ID                   | `None`                                                                           | `{"id": "da155f61-4b12-4e0e-a715-31f97014c664","created_at": "2024-10-22T01:34:58.534Z","updated_at": "2024-10-22T01:34:58.534Z","amount": "200.00","description": "An initial deposit","status": "successful","version": 1,"sender": {"id": "aa167675-f394-46e0-8864-f8b0546fd5ea","created_at": "2024-10-22T01:23:23.762Z","updated_at": "2024-10-22T01:23:23.762Z","firstname": "Ebuka","lastname": "Doe","username": "ebukadoe3","password": "$2b$12$UfR4w6j8xd1TLB1tZvTxWeDDyzzPuvRz2FL.b8TbLLih3WncL5HQK","password_changed_at": null,"gender": "male","is_deactivated": false,"deactivated_at": null,"country": "Nigeria","version": 1},"receiver": null}`                                                                                                                                                                                                                                   |

## Authentication

The API uses JWT (JSON Web Token) for authentication. To access protected routes, you need to obtain a token and include it in the Authorization header.

- Register a new user (POST /api/v1/users)
- Login to get a token (POST /api/v1/auth/login)

  ```
  Authorization: Bearer your_jwt_token
  ```

## Error Handling

The API provides detailed error messages with corresponding HTTP status codes.

- 400: Bad Request – Validation errors or malformed requests
- 401: Unauthorized – Missing or invalid JWT token
- 404: Not Found – Resource not found
- 500: Internal Server Error – Server error
  Example Error Response:

  ```json
  {
    "statusCode": 400,
    "message": "Validation failed",
    "error": "Bad Request"
  }
  ```
