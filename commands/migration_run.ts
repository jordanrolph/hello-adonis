// commands/migration_run.ts
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { execSync } from 'node:child_process'

/**
 * Run with `node ace migration:run`
 *
 * This command runs pending database migrations using Drizzle Kit.
 * It executes any migration files that haven't been applied to the
 * database yet.
 */
export default class MigrationRun extends BaseCommand {
  static commandName = 'migration:run'
  static description = 'Run pending database migrations using Drizzle'

  static options: CommandOptions = {
    startApp: false,
  }

  async run() {
    this.logger.log('Running pending migrations...')

    try {
      execSync(`npx drizzle-kit migrate --config=drizzle.config.ts`, {
        stdio: 'inherit',
        encoding: 'utf8',
      })
    } catch (error) {
      this.logger.error('Failed to run migrations')
      this.exitCode = 1
    }
  }
}
