# nodejs-blog

## Installation

```bash
npm install
```

## Scripts

The following scripts are available:

### Start

Starts the server using tsx with the entry point at src/server.ts.

```bash
"start": "tsx src/server.ts"
```

### Watch

Runs the server with tsx and monitors for changes using nodemon, restarting the server automatically when changes are detected.

```bash
"watch": "nodemon --exec tsx src/server.ts"
```

### Test E2E

Runs end-to-end tests using jest with the configuration specified in jest.config.ts.

```bash
"test:e2e": "jest --config jest.config.ts"
```
