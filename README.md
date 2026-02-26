# Linkify – URL Shortener Backend API  

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org/)  
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey?logo=express)](https://expressjs.com/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-success?logo=mongodb)](https://www.mongodb.com/)  
[![License: ISC](https://img.shields.io/badge/License-ISC-lightgrey)](https://opensource.org/licenses/ISC)  
[![Version](https://img.shields.io/badge/Version-1.0.0-orange)](https://github.com/kaihere14/Linkify---backend/releases)  

> **A lightweight, TypeScript‑powered REST API that creates short, shareable links and tracks click statistics.**  

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
  - [Create a Short URL](#create-a-short-url)  
  - [Redirect to Original URL](#redirect-to-original-url)  
- [API Reference](#api-reference)  
- [Development](#development)  
- [Deployment](#deployment)  
- [Testing](#testing)  
- [Contributing](#contributing)  
- [Roadmap](#roadmap)  
- [Troubleshooting & FAQ](#troubleshooting--faq)  
- [License & Credits](#license--credits)  

---  

## Overview  

Linkify is a **RESTful backend** for a URL‑shortening service. It accepts a long URL, generates a unique 6‑character code using **nanoid**, stores the mapping in MongoDB, and redirects visitors to the original address while counting clicks.  

*Why use Linkify?*  

- **Zero‑dependency front‑end** – you can pair it with any UI (React, Vue, plain HTML).  
- **Stateless & Scalable** – built on Express + MongoDB, ready for containerisation.  
- **Type‑safe** – full TypeScript codebase with strict typings.  

---  

## Features  

| Feature | Description | Status |
|---------|-------------|--------|
| **URL shortening** | `POST /api/url/shorten` – returns a short URL (`linkifyts.vercel.app/<code>`). | ✅ Stable |
| **Redirect handling** | `GET /:code` – redirects to the original URL and increments click count. | ✅ Stable |
| **Click analytics** | Click count is stored per short link. | ✅ Stable |
| **Collision‑free IDs** | Uses `nanoid(6)` (≈ 56 billion unique combos). | ✅ Stable |
| **CORS support** | Allows requests from localhost dev server and production front‑end. | ✅ Stable |
| **Environment‑driven configuration** | Port, MongoDB URI, and allowed origins are configurable via `.env`. | ✅ Stable |
| **Docker ready** | Simple Dockerfile can be added (see Deployment). | 🟡 Planned |
| **Comprehensive test suite** | Jest + supertest (not yet implemented). | ❌ Planned |

---  

## Tech Stack  

| Category | Technology | Reason |
|----------|------------|--------|
| **Runtime** | Node.js (v20+) | Modern, async‑first JavaScript runtime |
| **Framework** | Express 5.x | Minimalist HTTP server with robust routing |
| **Language** | TypeScript 5.x | Static typing, better developer experience |
| **Database** | MongoDB (via Mongoose 8.x) | Document store, easy schema definition |
| **ID Generation** | nanoid 5.x | Collision‑resistant, URL‑friendly IDs |
| **Environment** | dotenv | Loads `.env` variables |
| **Security** | cors | Controls cross‑origin requests |
| **Development** | nodemon, ts-node | Hot‑reloading for rapid iteration |
| **Build** | tsc (TypeScript compiler) | Transpiles TS → JS for production |

---  

## Architecture  

```
src
├─ controller
│   └─ url.controller.ts   ← Business logic (register, redirect)
├─ database
│   └─ index.ts            ← MongoDB connection (mongoose)
├─ models
│   └─ urlSchema.ts        ← Mongoose schema for URLs
├─ routes
│   ├─ url.register.ts     ← POST /api/url/shorten
│   └─ redirect.route.ts   ← GET /:code
├─ index.ts                 ← Express app bootstrap
└─ (other TS config files)
```

* **Controller** – Handles request validation, interacts with the model, and formats responses.  
* **Routes** – Thin wrappers that map HTTP verbs + paths to controller functions.  
* **Model** – `Url` schema stores `original_link`, `short_code`, `click_count`, timestamps.  
* **Database Layer** – Centralised connection logic (`connectDB`) ensures the app starts only after MongoDB is reachable.  

---  

## Getting Started  

### Prerequisites  

| Tool | Minimum Version |
|------|-----------------|
| Node.js | 20.x |
| npm (or yarn) | 9.x |
| MongoDB | 6.x (local or Atlas) |
| Git | any |

### Installation  

```bash
# 1️⃣ Clone the repo
git clone https://github.com/kaihere14/Linkify---backend.git
cd Linkify---backend

# 2️⃣ Install dependencies
npm ci          # or `npm install` if you prefer

# 3️⃣ Build the TypeScript source (optional – dev mode uses ts-node)
npm run build
```

### Configuration  

Create a `.env` file in the project root:

```dotenv
# .env
PORT_NUMBER=5000                # Port the API will listen on
MONGODB_URI=mongodb://localhost:27017/linkify   # MongoDB connection string
ALLOWED_ORIGINS=http://localhost:5173,https://linkify-xi-gules.vercel.app
```

*`ALLOWED_ORIGINS`* is parsed by the CORS middleware; you can add more origins separated by commas.

### Running the Server  

- **Development (auto‑restart on changes)**  

  ```bash
  npm run dev
  ```

- **Production (compiled JS)**  

  ```bash
  npm run start
  ```

The console will output:

```
Data base connected
server is running on http://localhost:5000
```

---  

## Usage  

### Create a Short URL  

```bash
curl -X POST http://localhost:5000/api/url/shorten \
     -H "Content-Type: application/json" \
     -d '{"link":"https://www.example.com/very/long/path"}'
```

**Response (201)**  

```json
{
  "status": 201,
  "data": {
    "shortned_url": "linkifyts.vercel.app/Ab3dE9",
    "click_count": 0
  },
  "message": "Url shortned successfully"
}
```

> **Note** – The returned short URL uses the public domain `linkifyts.vercel.app`. Replace it with your own front‑end domain if needed.

### Redirect to Original URL  

Open a browser or use `curl`:

```bash
curl -v http://localhost:5000/Ab3dE9
```

The server responds with an HTTP **302** redirect to the original link and increments the click counter.

---  

## API Reference  

| Method | Endpoint | Description | Request Body | Success Response |
|--------|----------|-------------|--------------|------------------|
| `POST` | `/api/url/shorten` | Generate a short URL for a given long link. | `{ "link": "string" }` | `201` – `{ shortned_url, click_count }` |
| `GET` | `/:code` | Redirect to the original URL associated with `code`. | – | `302` redirect to original URL (or `404` if not found) |

**Error Codes**  

| Code | Situation |
|------|-----------|
| `400` | Missing `code` parameter (redirect) |
| `404` | No URL found for the supplied short code or missing `link` in request |
| `500` | Internal server error (e.g., DB connectivity issues) |

---  

## Development  

```bash
# Install dev dependencies (already done via `npm ci`)
npm run dev          # start with hot‑reload
npm run build        # compile TS → JS in ./dist
npm run clean        # remove ./dist folder
```

### Code Style  

- Follow the existing **Airbnb**‑inspired linting (ESLint not bundled yet – feel free to add).  
- Use **async/await** exclusively; avoid callback hell.  
- Keep controller functions thin – move business logic to services if the project grows.

### Debugging  

- Logs are printed to the console (`console.log`, `console.error`).  
- Use `node --inspect` or VS Code's debugger with the compiled output in `dist/`.  

---  

## Deployment  

### Docker (recommended)  

Create a `Dockerfile` in the repo root:

```dockerfile
# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

Build & run:

```bash
docker build -t linkify-backend .
docker run -d -p 5000:5000 --env-file .env linkify-backend
```

### Vercel / Render / Railway  

- Set the **build command** to `npm run build`.  
- Set the **output directory** to `dist`.  
- Add the same environment variables (`PORT_NUMBER`, `MONGODB_URI`, `ALLOWED_ORIGINS`).  

---  

## Testing  

The repository currently contains a placeholder test script. To add real tests:

1. Install Jest & supertest  

   ```bash
   npm i -D jest ts-jest @types/jest supertest @types/supertest
   ```

2. Add a `jest.config.js` and write integration tests for the two endpoints.  

3. Update `package.json`  

   ```json
   "scripts": {
     "test": "jest"
   }
   ```

---  

## Contributing  

We welcome contributions! Please follow these steps:

1. **Fork** the repository.  
2. **Create a feature branch** (`git checkout -b feat/your-feature`).  
3. **Write code** adhering to the existing style and add appropriate tests.  
4. **Run the test suite** (`npm test`).  
5. **Commit** with a clear message and **push** to your fork.  
6. Open a **Pull Request** against `main`.  

### Pull Request Checklist  

- [ ] Code compiles (`npm run build`).  
- [ ] Linting passes (if you add ESLint).  
- [ ] Tests (if added) all pass.  
- [ ] Documentation (README/API) updated if needed.  

---  

## Roadmap  

- **Docker Compose** for local MongoDB + API stack.  
- **Rate limiting** (e.g., `express-rate-limit`).  
- **Custom domain support** per user.  
- **Analytics dashboard** (total clicks, per‑link stats).  
- **Comprehensive test coverage** (unit + integration).  

---  

## Troubleshooting & FAQ  

| Problem | Solution |
|---------|----------|
| **Server fails to start – “failed to start the server”** | Verify `MONGODB_URI` is correct and MongoDB is reachable. Check network/firewall rules. |
| **`POST /api/url/shorten` returns 404 “PLease enter a valid url”** | The request body must contain a `link` field. Ensure `Content-Type: application/json`. |
| **Redirect returns 404** | The short code does not exist or has been removed. Double‑check the code in the URL. |
| **CORS error in front‑end** | Add the front‑end origin to `ALLOWED_ORIGINS` in `.env`. |
| **TypeScript compilation errors** | Run `npm run clean && npm run build` to ensure a fresh compile. |

If you still need help, open an issue on GitHub with logs and steps to reproduce.

---  

## License & Credits  

**License:** ISC – see the [LICENSE](LICENSE) file.  

**Author:** *Kaihere14* (original repository owner).  

**Contributors:**  

- [Kaihere14](https://github.com/kaihere14) – project initiation & core implementation  

**Third‑Party Attributions:**  

- **Express** – MIT License  
- **Mongoose** – MIT License  
- **nanoid** – MIT License  
- **dotenv** – BSD‑3-Clause  
- **cors** – MIT License  

---  

*Happy coding! 🎉*  