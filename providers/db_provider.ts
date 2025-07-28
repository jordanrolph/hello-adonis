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
    await this.app.container.make('db')
  }

  async shutdown() {
    const db = await this.app.container.make('db')
    if (db.$client && typeof db.$client.end === 'function') {
      await db.$client.end()
    }
  }
}
