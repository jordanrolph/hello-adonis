import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { reset } from 'drizzle-seed'
import db, { schema } from '#config/database'

/**
 * Run with `node ace db:reset`
 *
 * This command resets the database by removing all rows from all tables
 * using drizzle-seed. This is useful for clearing mock seed data during
 * development or in test suites. The empty database can then be seeded
 * with new values as needed.
 *
 * This command can only be run in development or test environments for safety.
 */
export default class DbReset extends BaseCommand {
  static commandName = 'db:reset'
  static description = 'Reset the database by removing all rows of data'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    // Check environment - only allow in development or test
    const nodeEnv = process.env.NODE_ENV || 'development'
    if (nodeEnv !== 'development' && nodeEnv !== 'test') {
      this.logger.error(`Database reset is not allowed in ${nodeEnv} environment`)
      this.logger.log('This command can only be run in development or test environments')
      this.exitCode = 1
      return
    }

    const confirmed = await this.prompt.confirm(
      'This will delete all data in your database. Are you sure you want to continue?'
    )

    if (!confirmed) {
      this.logger.log('Database reset cancelled')
      return
    }

    this.logger.log('Resetting database...')

    try {
      await reset(db, schema)
      await db.$client.end()

      this.logger.log('Database reset completed')
    } catch (error) {
      this.logger.error('Failed to reset database')
      this.exitCode = 1
    }
  }
}
