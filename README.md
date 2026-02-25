# Linkify — Backend API  
![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript) ![Express](https://img.shields.io/badge/Express-5.1-lightgrey?logo=express) ![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?logo=mongodb) ![License](https://img.shields.io/badge/License-ISC-lightgrey) ![Version](https://img.shields.io/badge/Version-1.0.0-success)

> **A lightweight, high‑performance URL shortener API built with Express, TypeScript and MongoDB.**  
> Shorten any URL in a single request, track click counts, and redirect instantly.

---

## Table of Contents  

- [Overview](#overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Architecture](#architecture)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Configuration](#configuration)  
  - [Running the Server](#running-the-server)  
- [Usage](#usage)  
  - [API Endpoints](#api-endpoints)  
  - [Example Requests](#example-requests)  
- [Development](#development)  
  - [Running in Development Mode](#running-in-development-mode)  
  - [Testing](#testing)  
  - [Code Style & Linting](#code-style--linting)  
- [Deployment](#deployment)  
  - [Docker (optional)](#docker-optional)  
  - [Vercel / Cloud Platforms](#vercel--cloud-platforms)  
- [Contributing](#contributing)  
- [Roadmap](#roadmap)  
- [Troubleshooting & FAQ](#troubleshooting--faq)  
- [License & Credits](#license--credits)  

---

## Overview  

Linkify‑backend is the RESTful service that powers the **Linkify** URL shortener. It exposes two endpoints:

1. **POST** `/api/url/shorten` – Accepts a long URL and returns a short, human‑readable link.  
2. **GET** `/:code` – Redirects the visitor to the original URL while incrementing a click counter.

The service is deliberately minimal: no authentication, no rate‑limiting, and a single MongoDB collection. This makes it an excellent starter project for learning modern TypeScript back‑ends or for quick prototyping of a custom shortener.

---

## Features  

| Feature | Description | Status |
|---------|-------------|--------|
| **URL shortening** | Generates a 6‑character NanoID for each request. | ✅ Stable |
| **Redirect handling** | Looks up the short code, updates click count, and redirects. | ✅ Stable |
| **Click analytics** | Stores `click_count` per URL in MongoDB. | ✅ Stable |
| **CORS support** | Allows requests from the frontend (`localhost:5173` & Vercel demo). | ✅ Stable |
| **Environment‑driven configuration** | Port, DB URI, and allowed origins are configurable via `.env`. | ✅ Stable |
| **Docker ready** | `Dockerfile` can be added easily (see Deployment). | ⚙️ Planned |
| **Rate limiting / auth** | Not included in the core repo – can be added by contributors. | 🚧 Planned |

---

## Tech Stack  

| Layer | Technology | Reason |
|-------|------------|--------|
| **Runtime** | Node.js (v20+) | Modern, async‑first JavaScript runtime |
| **Language** | TypeScript 5.9 | Static typing, better IDE support |
| **Web framework** | Express 5.1 | Minimalist routing & middleware |
| **Database** | MongoDB (via Mongoose 8.x) | Document store, easy schema definition |
| **ID generator** | nanoid 5.x | Collision‑resistant, URL‑friendly IDs |
| **Environment** | dotenv | Loads `.env` variables |
| **Development** | nodemon + ts-node | Hot‑reloading for rapid iteration |
| **Testing (future)** | Jest / Supertest (not yet added) | Planned for CI pipelines |

---

## Architecture  

```
src/
├─ controller/
│   └─ url.controller.ts      # Business logic (register & redirect)
├─ database/
│   └─ index.ts               # MongoDB connection helper
├─ models/
│   └─ urlSchema.ts           # Mongoose schema (original_link, short_code, click_count)
├─ routes/
│   ├─ url.register.ts        # POST /api/url/shorten
│   └─ redirect.route.ts      # GET /:code
├─ index.ts                   # Express app bootstrap
└─ (other TS config files)
```

* **Controller** – Contains pure async functions that interact with the model and send HTTP responses.  
* **Routes** – Thin wrappers that bind HTTP verbs + paths to controller functions.  
* **Model** – Mongoose schema defines the persisted shape of a shortened URL.  
* **Database** – Centralised connection logic (`connectDB`) that returns a promise resolved when MongoDB is ready.  
* **Entry point** – `src/index.ts` configures middleware (JSON body parser, CORS), registers routes, and starts the HTTP server after a successful DB connection.

**Data Flow (shorten request)**  

1. Client POSTs JSON `{ "link": "https://example.com" }` to `/api/url/shorten`.  
2. `urlRegister` validates input, generates a NanoID, creates a `Url` document, and returns the short URL.  
3. The short URL is stored as `linkifyts.vercel.app/<code>` (adjustable in code).  

**Data Flow (redirect request)**  

1. Browser navigates to `https://linkifyts.vercel.app/<code>`.  
2. `redirect` middleware looks up the document, increments `click_count`, ensures the URL has a protocol, and issues an HTTP 302 redirect.

---

## Getting Started  

### Prerequisites  

| Tool | Minimum version |
|------|-----------------|
| Node.js | 20.x |
| npm (or Yarn) | 9.x |
| MongoDB | 6.x (local or Atlas) |
| Git | any recent version |

### Installation  

```bash
# Clone the repository
git clone https://github.com/kaihere14/Linkify---backend.git
cd Linkify---backend

# Install dependencies
npm install
```

### Configuration  

Create a `.env` file in the project root:

```dotenv
# .env
PORT_NUMBER=5000               # Port the API will listen on
MONGODB_URI=mongodb://localhost:27017/linkify   # Replace with your Atlas URI if needed
ALLOWED_ORIGINS=http://localhost:5173,https://linkify-xi-gules.vercel.app
```

* `ALLOWED_ORIGINS` is used by the CORS middleware; you can add or remove origins as required.

### Running the Server  

```bash
# Build the TypeScript source
npm run build

# Start the compiled server
npm start
```

The console should output:

```
Data base connected
server is running on http://localhost:5000
```

#### Development mode (auto‑restart)

```bash
npm run dev
```

`nodemon` watches for file changes, recompiles with `ts-node`, and restarts the server automatically.

---

## Usage  

### API Endpoints  

| Method | Path | Description | Request Body | Success Response |
|--------|------|-------------|--------------|------------------|
| **POST** | `/api/url/shorten` | Create a short URL | `{ "link": "https://example.com" }` | `201 Created` <br> `{ "status":201, "data": { "shortned_url":"linkifyts.vercel.app/abc123", "click_count":0 }, "message":"Url shortned successfully" }` |
| **GET** | `/:code` | Redirect to original URL (no JSON) | – | `302 Found` (redirect) or `404` if code not found |

### Example Requests  

#### Shorten a URL (cURL)

```bash
curl -X POST http://localhost:5000/api/url/shorten \
     -H "Content-Type: application/json" \
     -d '{"link":"https://www.openai.com"}'
```

**Response**

```json
{
  "status": 201,
  "data": {
    "shortned_url": "linkifyts.vercel.app/5Gk9Xz",
    "click_count": 0
  },
  "message": "Url shortned successfully"
}
```

#### Follow a short link  

Open a browser and navigate to:

```
http://localhost:5000/5Gk9Xz
```

You will be redirected to `https://www.openai.com`. The `click_count` for that document is incremented automatically.

---

## Development  

### Running in Development Mode  

```bash
npm run dev
```

* Uses `nodemon` + `ts-node` for hot‑reloading.  
* Source maps are generated automatically, making stack traces readable.

### Testing  

The repository currently ships with a placeholder test script. To add proper tests:

1. Install testing libraries: `npm i -D jest ts-jest supertest @types/jest @types/supertest`  
2. Create a `tests/` folder and write unit/integration tests.  
3. Update `package.json`:

```json
"scripts": {
  "test": "jest"
}
```

Then run:

```bash
npm test
```

### Code Style & Linting  

The project follows the **Airbnb TypeScript style guide** (via ESLint) – you can add it later:

```bash
npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npx eslint --init   # choose "To check syntax, find problems, and enforce code style"
```

Run linting with:

```bash
npm run lint   # (add a script `"lint": "eslint 'src/**/*.ts'"` to package.json)
```

---

## Deployment  

### Docker (optional)

A minimal Dockerfile can be added:

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --production
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

Build & run:

```bash
docker build -t linkify-backend .
docker run -p 5000:5000 --env-file .env linkify-backend
```

### Vercel / Cloud Platforms  

Because the entry point is a standard Node.js server, you can deploy to Vercel (Node.js Serverless) or any cloud provider (Render, Railway, Fly.io). Ensure the environment variables (`PORT_NUMBER`, `MONGODB_URI`, `ALLOWED_ORIGINS`) are set in the platform’s dashboard.

---

## Contributing  

We welcome contributions! Follow these steps:

1. **Fork** the repository.  
2. **Create a feature branch**: `git checkout -b feat/your-feature`.  
3. **Commit** your changes with clear messages.  
4. **Push** to your fork and open a **Pull Request** against `main`.  

### Development Workflow  

| Step | Command |
|------|---------|
| Install dependencies | `npm install` |
| Run the server (dev) | `npm run dev` |
| Build for production | `npm run build` |
| Lint (if configured) | `npm run lint` |
| Run tests (once added) | `npm test` |

### Code Review Guidelines  

* Keep the code **typed** – avoid `any`.  
* Add JSDoc comments for exported functions.  
* Ensure any new endpoint returns a consistent JSON envelope (`status`, `data`, `message`).  
* Write unit tests for new logic.  

---

## Roadmap  

- **v1.1** – Add rate limiting (express-rate-limit) and basic API key auth.  
- **v1.2** – Implement custom alias support (`/custom/:alias`).  
- **v1.3** – Add pagination & admin endpoint for analytics.  
- **v2.0** – Full Docker Compose setup with Redis cache for hot URLs.  

Feel free to propose additional features by opening an issue.

---

## Troubleshooting & FAQ  

| Problem | Solution |
|---------|----------|
| **Server fails to start – “failed to start the server”** | Verify that `MONGODB_URI` is correct and MongoDB is reachable. Check network/firewall rules. |
| **CORS error in frontend** | Add the frontend origin to `ALLOWED_ORIGINS` in `.env` and restart the server. |
| **Shortened URL returns 404** | Ensure the generated code is stored in the DB (`short_code` field). Check the collection `urls` in MongoDB. |
| **Redirect adds `https://` twice** | The controller trims the original link and only prepends `https://` if no protocol is present. Ensure you store full URLs with protocol if you want to keep them unchanged. |
| **Port already in use** | Change `PORT_NUMBER` in `.env` or stop the process occupying the port (`lsof -i :5000`). |

If you encounter other issues, open an issue on GitHub or contact the maintainers.

---

## License & Credits  

**License:** ISC – see the `LICENSE` file for details.  

**Author:** *Kaihere14* (original repository)  

**Contributors:**  

- Kaihere14 – core implementation  
- Community contributors – bug reports, documentation improvements  

**Third‑Party Attributions**

- **Express** – MIT License  
- **Mongoose** – MIT License  
- **nanoid** – MIT License  
- **dotenv** – BSD‑3-Clause  

---

*Happy coding! 🎉*