# Turbo FullStack Template

## clone

```
git clone <repository_url> <desired_folder_name>
git remote set-url origin <NEW_GIT_URL_HERE>
```

## Apps

- pos: react vite app create by doing

```
npm create vite@latest post -- --template react-ts
```

- api: fastify API with TRPC

## Packages

- api-type: exports AppRouter from TRPC and any other custom type that needs to be shared
- config: base typescript config
- db: prisma config, schema and migrations.

## Deploy
- apps/api
Deployed to Railway with

```
pnpm run api:build
pnpm run api:start
```
