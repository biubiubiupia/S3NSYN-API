# S3NSYN SERVER

## Setup
1. Clone the repository: `git clone <repo-link>`
2. Install dependencies: `npm install`
3. Set environment variables in a `.env` file, following the .env.sample file:
PORT=8080
BACKEND_URL=http://localhost
DB_HOST=127.0.0.1
DB_NAME=S3NSYN
DB_USER=root
DB_PASSWORD=****
CORS_ORIGIN=http://localhost:5173
TOKEN_SECRET=*****************************

## Migrate 
- In your MySQL database, create a database name “S3NSYN”:
`CREATE DATABASE S3NSYN`
- Run migration: `npm run migrate`

## Run
- Start the server: `npm run start`
- Access the app at: `http://localhost:8080`