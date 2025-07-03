# @my-app/db

Shared database package containing Prisma schema and configuration for the application.

## Usage

This package provides:
- Prisma schema with database models
- Database migrations 
- Prisma client exports
- Database-related scripts

### Scripts

- `db:generate` - Generate Prisma client
- `db:push` - Push schema changes to database 
- `db:migrate` - Create and run migrations
- `db:studio` - Open Prisma Studio

### Import in other packages

```typescript
import { PrismaClient, PrismaLibSQL } from '@my-app/database';

// Create database instance
const db = new PrismaClient();
```

### Environment Variables

The database package expects these environment variables:
- `DATABASE_URL` - Database connection URL
- `NODE_ENV` - Environment (development/production)

For local development, a local SQLite database will be used automatically. 