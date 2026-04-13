# Vehicle Selector

A vehicle selection form with cascading dropdowns (Make → Model → Badge) and service logbook upload.

## Stack

- **Client**: React 18, TypeScript, Vite, CSS Modules
- **Server**: Node.js, Express, TypeScript, Multer
- **Testing**: Vitest + React Testing Library (client), Jest + Supertest (server)

## Project Structure

```
vehicle-selector/
├── client/          # React frontend
└── server/          # Express backend
```

## Setup

### Prerequisites

- Node.js ≥ 18
- npm ≥ 7

### Install dependencies

```bash
# From the project root
npm install
npm install --prefix client
npm install --prefix server
```

## Environment Variables

The server reads the following environment variable:

| Variable | Default | Description        |
|----------|---------|--------------------|
| `PORT`   | `3001`  | Server listen port |

Create `server/.env` (never committed) to override:

```
PORT=3001
```

## Running

### Development (client + server concurrently)

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3001

The Vite dev server proxies `/api` requests to the Express server automatically.

### Production build

```bash
npm run build
```

## Testing

```bash
# Run all tests (client + server)
npm test

# Client tests only
npm test --prefix client

# Server tests only
npm test --prefix server
```

## Linting

```bash
npm run lint
```

## API

### `POST /api/vehicle`

Accepts `multipart/form-data`:

| Field     | Type   | Required | Description                        |
|-----------|--------|----------|------------------------------------|
| `make`    | string | ✓        | Vehicle make key (e.g. `tesla`)    |
| `model`   | string | ✓        | Vehicle model (e.g. `Model 3`)     |
| `badge`   | string | ✓        | Vehicle badge (e.g. `Performance`) |
| `logbook` | file   | ✓        | Plain text (.txt) logbook file     |

**Success response (200):**

```json
{
  "make": "tesla",
  "model": "Model 3",
  "badge": "Performance",
  "logbookContents": "..."
}
```

**Error response (400):**

```json
{ "error": "make, model, and badge are required" }
```
