# 🧠 12-Week Deep OOP Mastery Program (with TypeScript + Express.js)

This repository documents a **12-week advanced Object-Oriented Programming (OOP) roadmap**, adapted into a **class-based backend architecture** using **TypeScript**, **Express.js**, and modern patterns like **Clean Code**, **SOLID principles**, and **Design Patterns**. This codebase includes:

- Highly structured backend with **ESLint**, **Prettier**, and **strict tsconfig.json**
- A powerful **path aliasing system** for modular architecture
- Deep exploration of OOP concepts
- Practical implementation of design patterns and system design

> 🧩 **Note:** There aren't isolated tutorials for each week. Instead, the full backend server composes all the weekly concepts into a unified, production-grade architecture. However, design pattern examples and learning materials are organized separately inside the `@classes` folder to teach and demonstrate each pattern in isolation.

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

## 📚 Week-by-Week Curriculum

### ✅ Week 1: OOP Basics (Encapsulation, Classes, Instances)

> **Note:** Services, Controllers, App and etc.. all use the OOP basic methods below

---
- Create real-world class models
- Understand `private`, `protected`, `public`
- Learn `getters methods`, `setters methods`, `constructor`

### ✅ Week 2: Inheritance & Polymorphism

> **Note:** Controllers, Classes use the OOP basic methods below

---
- Class hierarchies: `Animal -> Dog/Cat`
- Method overriding
- Use interfaces and abstract classes

### ✅ Week 3: SOLID Principles

> **Note:** Controllers, Services, Routes, and Classes all use the OOP basic methods below

---

- Single Responsibility
- Open/Closed
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

### ✅ Week 4: Composition Over Inheritance

> **Note:** Controllers, Services, Routes, and Classes all use the OOP basic methods below

---

- Mixins with `Object.assign`
- Strategy pattern
- Favor small components over rigid inheritance trees

### ✅ Week 5: Creational Design Patterns

> **Note:** Classes (Creational.class.ts) use the OOP basic methods below

---

- **Factory Pattern** (e.g. `UserFactory`)
- **Builder Pattern** (`ReportBuilder`)
- **Singleton** (`DBConnection`)
- **Abstract Factory**

### ✅ Week 6: Structural Design Patterns

> **Note:** Classes (Structural.class.ts) use the OOP basic methods below

---

- **Adapter** (`LoggerAdapter`)
- **Decorator** (`TimestampLogger`)
- **Composite** (`ShapeGroup`)
- **Proxy** (`LoggingProxy`)

### ✅ Week 7: Behavioral Design Patterns

> **Note:** Classes (Behavioral.class.ts) use the OOP basic methods below

---

- **Observer** (Event system)
- **Command** (Encapsulate request logic)
- **Strategy** (Pluggable behaviors)
- **State** (Finite state machine in backend)

### ✅ Week 8: Domain Modeling + Value Objects

- Domain-Driven Design intro
- Encapsulate logic into Value Objects (e.g. `Money`, `Email`, `PhoneNumber`)

### ✅ Week 9: Repositories & Aggregates

- Persistence layer abstraction
- Domain Aggregate root enforcement (e.g. `Order`)

### ✅ Week 10: Event-Driven Architecture

- Internal domain events
- Event dispatchers, listeners
- Async patterns with Redis/Queue

### ✅ Week 11: Advanced Types + Refactoring

- Utility types, template literals, enums, generics
- Refactor messy classes into clean interfaces and reusable components

### ✅ Week 12: Testing OOP Systems

- Unit testing services, repositories, controllers using Jest
- Mocks, spies, and stubs
- Full coverage of SOLID and patterns under test

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


## 🏁 Final Deliverables

- [ ] `@/classes/creational-patterns`
- [ ] `@/classes/structural-patterns`
- [ ] `@/classes/behavioral-patterns`
- [ ] `@/classes/domain-modeling`
- [ ] `/event-driven`
- [ ] `/test-suite`

> Build your own advanced backend playground and master Object-Oriented design with real architecture.

---

## 👨‍🏫 Inspired By:

- Refactoring.Guru
- TypeScript Deep Dive
- Domain-Driven Design (Vaughn Vernon / Eric Evans)
- Clean Architecture by Uncle Bob

---