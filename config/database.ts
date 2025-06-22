import env from '#start/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { usersTable } from '#models/user'

/**
 * These functions are to setup a Drizzle database connection
 * that can be used by the `db_provider.ts` to create an
 * Adonis service provider for interacting with the db.
 */

// Build the schema object
export const schema = {
  users: usersTable,
  // Add other tables here as you create them
}

export function createDatabase() {
  const pool = new Pool({
    connectionString: env.get('DATABASE_URL'),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })

  return drizzle(pool, { schema })
}

// Export the type for use in Provider
export type DatabaseType = ReturnType<typeof createDatabase>

// For backwards compatibility if needed elsewhere
const db = createDatabase()
export default db
