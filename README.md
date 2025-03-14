# Project Setup Guide

## Requirements
- Node.js v22.13
- NVM (Node Version Manager)
- Yarn
- Docker & Docker Compose

## Installation & Running the Project

1. Use the correct Node.js version:
   ```sh
   nvm use
   ```

2. Install dependencies:
   ```sh
   yarn install
   ```

3. Start MySQL and RabbitMQ using Docker Compose:
   ```sh
   docker compose up -d
   ```

4. Run the application in development mode:
   ```sh
   yarn start:dev
   ```

## Example cURL Request to Create a User
```sh
curl --location 'localhost:3000/sign-up' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "Example",
    "role": "MANAGER",
    "password": "Example@123"
}'
```

## API Documentation
Other API routes can be found at:
[API Docs](http://localhost:3000/docs)

