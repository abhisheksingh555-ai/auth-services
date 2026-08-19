# Authentication API

A secure and modular authentication backend built with:

- Node.js
- Express
- MongoDB
- Mongoose
- Redis
- JWT
- Argon2id
- Zod
- Docker

## Features

- User registration
- User login
- Access tokens
- Refresh tokens
- Refresh token rotation
- Logout
- Logout from all devices
- Session management
- Get current user
- Change password
- Forgot password
- OTP verification
- Password reset
- Request validation
- Rate limiting
- Security headers
- Centralized error handling
- Standardized API responses

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | HTTP API |
| MongoDB | Persistent database |
| Mongoose | MongoDB ODM |
| Redis | Temporary/security data |
| Argon2id | Password hashing |
| JWT | Authentication tokens |
| Zod | Request validation |
| Docker | Containerization |

## Project Structure

```text
server/
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   ├── core/
│   ├── middlewares/
│   ├── modules/
│   ├── routes/
│   └── docs/
│
├── tests/
│
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md