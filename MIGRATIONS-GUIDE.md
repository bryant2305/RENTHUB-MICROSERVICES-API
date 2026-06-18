# Database Migrations Guide

This guide explains how to manage database migrations for the User Service and Reservation Service.

## Overview

- **Development**: `synchronize: true` - Auto-syncs schema (NOT recommended for production)
- **Production**: `synchronize: false` - Requires explicit migrations
- Migrations are run automatically on startup in production when `NODE_ENV=production`

## Migration Scripts

Both services have the following npm scripts available:

```bash
# Generate a new migration (after modifying entities)
npm run migration:generate -- src/database/migrations/YourMigrationName

# Run all pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert
```

## Workflow

### 1. In Development

When you make changes to entity files, you have two options:

**Option A: Use synchronize (Development Only)**
- The database schema updates automatically
- No migration files needed
- Works because `NODE_ENV !== 'production'`

**Option B: Generate Migrations (Recommended)**
```bash
cd user-service
npm run migration:generate -- src/database/migrations/InitialSetup
```

### 2. Before Production Deployment

1. **Generate migrations** from your entity changes:
   ```bash
   npm run migration:generate -- src/database/migrations/AddNewColumns
   ```

2. **Commit migration files** to version control:
   ```bash
   git add src/database/migrations/
   git commit -m "feat: add new database columns"
   ```

3. **Deploy** - migrations will run automatically on startup in production

### 3. In Production

- Migrations run automatically when the application starts
- Check logs for: `Running database migrations...`
- If migration fails, the app will throw an error and crash gracefully
- Database changes are applied before the microservice becomes available

## Example Migration

A generated migration looks like:

```typescript
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewColumns1623456789012 implements MigrationInterface {
    name = 'AddNewColumns1623456789012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "newColumn" varchar`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "newColumn"`);
    }
}
```

## Important Notes

⚠️ **Never enable `synchronize: true` in production!**
- Risk of data loss
- Uncontrolled schema changes
- No rollback capability

✅ **Always use migrations in production**
- Tracked in version control
- Reversible with `migration:revert`
- Production databases should be backed up before migrations
