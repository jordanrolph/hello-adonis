import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { execSync } from 'node:child_process'

/**
 * Run with `node ace migration:rollback`
 *
 * This command rolls back database migrations using Drizzle Kit's drop functionality.
 *
 * The CLI will ask you to choose which migration you wish to drop.
 *
 * Note: Drizzle's "drop" functionality doesn't rollback migrations in the same way
 * as many other ORMs. Whilst "drop" will rollback a migration from the database,
 * it also deletes the migration file from the `database/migrations` directory.
 * If this is not the behaviour you want, you can recover the deleted migration file
 * if you have tracked it with git, or you can generate a new one.
 */
export default class MigrationRollback extends BaseCommand {
  static commandName = 'migration:rollback'
  static description = 'Rollback database migrations using Drizzle'

  static options: CommandOptions = {
    startApp: false,
  }

  async run() {
    this.logger.log('Rolling back migrations...')

    try {
      execSync(`npx drizzle-kit drop --config=drizzle.config.ts`, {
        stdio: 'inherit',
        encoding: 'utf8',
      })

      this.logger.success('Migration rollback completed')
    } catch (error) {
      this.logger.error('Failed to rollback migrations')
      this.exitCode = 1
    }
  }
}
