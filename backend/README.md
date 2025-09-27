# ⚡ ENELOB — Chat App Backend (Express.js + TypeScript + Redis + MongoDB)

This repository powers the **backend of the ENELOB Chat Application**, a **real-time chat platform** built with **Express.js**, **TypeScript**, **Redis**, and **MongoDB**.  
It follows a **modular, production-grade architecture** with emphasis on **Clean Code**, **SOLID principles**, and **scalability**.  

The backend provides:

- 🚀 **TypeScript-powered Express.js server** with strict `tsconfig.json`
- 🛡️ **JWT Authentication + Refresh Tokens** middleware
- 📡 **WebSocket (Socket.IO) integration** for real-time messaging & notifications
- 🗄️ **MongoDB schemas** for users, messages, conversations, and friendships
- ⚙️ **Redis + BullMQ** for background jobs (image uploads, queues, notifications)
- 🔐 **Role-based access control (RBAC)** with middleware
- 📂 **Path aliasing** for a clean, modular project structure
- 🧩 **Zod validation** for API schemas
- 🛠️ **ESLint + Prettier** for strict linting and formatting

---


## 📁 Folder Aliases (tsconfig.json)

```json
"paths": {
  "@/*": ["*"],
  "@config": ["src/config"],
  "@controllers/*": ["controllers/*"],
  "@exceptions/*": ["exceptions/*"],
  "@interfaces/*": ["interfaces/*"],
  "@middlewares/*": ["middlewares/*"],
  "@models/*": ["models/*"],
  "@routes/*": ["routes/*"],
  "@schemas/*": ["schemas/*"],
  "@services/*": ["services/*"],
  "@utils/*": ["utils/*"],
  "@classes/*": ["classes/*"]
}
```

### 📦 What lives in each path?

| Alias            | Description                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| `@config`        | Environment variables, database config, server setup                                   |
| `@controllers/*` | Request handlers using class-based controller logic                                    |
| `@exceptions/*`  | Custom error classes (e.g. NotFound, Unauthorized)                                     |
| `@interfaces/*`  | TypeScript interfaces and types shared across app                                      |
| `@middlewares/*` | Express middlewares (auth, error handling, logging)                                    |
| `@models/*`      | Mongoose models and schemas                                                            |
| `@routes/*`      | Route definitions mapped to controller methods                                         |
| `@schemas/*`     | Zod validation schemas                                                             |
| `@services/*`    | Business logic classes (e.g. UserService, AuthService)                                 |
| `@utils/*`       | Utility functions, helpers, formatters, loggers                                        |
| `@classes/*`     |  Design patterns classes, starting from Creational to Behavioral and **teaching patterns** |

---

## ✅ Prerequisites

- TypeScript (strict mode)
- Node.js / Express.js
- OOP fundamentals in JS or another language
- Familiarity with async/await, Promises 
- Familiarity mongodb and mongoose schemas
- Familiarity with zod for validation
- Familiarity with JWT


---

## 📌 Example Command Scripts (package.json)

```json
"scripts": {
    "dev": " cross-env NODE_ENV=development ts-node-dev --respawn --transpile-only --require tsconfig-paths/register src/server.ts",
    "start": "npm run build && cross-env NODE_ENV=production node dist/server.js",
    "build": "swc src -d dist --source-maps --copy-files",
    "build:tsc": "tsc && tsc-alias",
    "lint": "eslint  src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
}
```

---


# 🧱 Node.js TypeScript Starter (SWC + ts-node-dev)

A clean, production-ready Node.js starter with TypeScript, SWC, ts-node-dev, and support for path aliases.

---

## 📦 Project Scripts

### 🛠 Development

Run the project in development mode using `ts-node-dev` with automatic restarts on changes:

```bash
npm run dev
```

> Uses: `ts-node-dev` with path aliases and environment set to `development`.

---

### ⚙️ Build (Production)

Transpile your TypeScript code to JavaScript using SWC and output it to the `dist/src` directory:

```bash
npm run build
```

> Uses: `swc` to transpile everything from `src/` into `dist/src` with source maps and file copying.

---

### 🚀 Start (Production)

First builds the app, then runs the compiled code in production mode:

```bash
npm start
```

> Alias for: `npm run build && NODE_ENV=production node dist/src/server.js`

---

### ✅ Linting

Check for code quality and lint errors:

```bash
npm run lint
```

Automatically fix linting issues:

```bash
npm run lint:fix
```

---

### 🧪 Test (Coming Soon)

Add your test script here once you integrate the testing library **Jest**.

```bash
npm run test
```

> 🧪 Testing setup will be added soon.

---

