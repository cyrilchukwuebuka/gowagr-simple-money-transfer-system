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
- [Authentication](#authentication)
- [Error Handling](#error-handling)


## FEATURES  
*  User management (CRUD operations)
*  Transfers between users
*  Balance tracking for each user
*  JWT-based authentication
*  Error handling and validation
*  Pagination and filtering

## Getting started with GoWagr API  

## PREREQUISITES
To be able to setup the project locally, you need to have the following installed and working properly:
* [Node.js v16.x or higher](https://nodejs.org/en/)
* NPM and Yarn
* [PostgreSQL v12.x or higher](https://www.postgresql.org/download/)
* [TypeORM for database interaction](https://typeorm.io/transactions)

## INSTALLATION
* Clone the repository:
  ```
  git clone https://github.com/your-username/gowagr-simple-money-transfer-system.git
  cd gowagr-simple-money-transfer-system
  ```
* Install dependencies:
  ```
  npm install
  ```
* Set up environment variables:
  ```
  cp .env.example .env
  ```
  *  Example .env file:
     ```
      DATABASE_URL=postgres://user:password@localhost:5432/myapi
      JWT_SECRET=supersecretkey
     ```
* Run database migrations:
  ```
  npm run typeorm migration:run
  ```
  
## Running the API
* Start the server on development:
  ```
  npm run start:dev
  ```
* Start the server on test:
  ```
  npm run test:watch
  or
  npm run test
  ```
* The API will be running at http://localhost:5000. eg. PORT=5000

## Documentation
The API is documented using Swagger, and you can access the Swagger UI at the following endpoint:

* Swagger UI: http://localhost:5000/api

## Authentication
The API uses JWT (JSON Web Token) for authentication. To access protected routes, you need to obtain a token and include it in the Authorization header.

* Register a new user (POST /api/users)
* Login to get a token (POST /api/auth/login)
  
  ```
  Authorization: Bearer your_jwt_token
  ```

## Error Handling
The API provides detailed error messages with corresponding HTTP status codes.

* 400: Bad Request – Validation errors or malformed requests
* 401: Unauthorized – Missing or invalid JWT token
* 404: Not Found – Resource not found
* 500: Internal Server Error – Server error
  Example Error Response:
  
  ```json
  {
    "statusCode": 400,
    "message": "Validation failed",
    "error": "Bad Request"
  }
  ```

