import type { ApplicationService } from '@adonisjs/core/types'
import { createDatabase } from '#config/database'
import type { DatabaseType } from '#config/database'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    db: DatabaseType
  }
}

export default class DbProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton('db', () => {
      return createDatabase()
    })
  }

  async start() {
    const db = await this.app.container.make('db')
    try {
      // Test connection using the schema
      await db.query.users.findFirst()
      console.log('✅ Database connection established')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      throw error
    }
  }

  async shutdown() {
    const db = await this.app.container.make('db')
    if (db.$client && typeof db.$client.end === 'function') {
      await db.$client.end()
      console.log('🔌 Database connections closed')
    }
  }
}
