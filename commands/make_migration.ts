import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { execSync } from 'node:child_process'

/**
 * Run with `node ace make:migration`
 *
 * This command generates new SQL migration file based on changes
 * to your drizzle models. It calls the drizzle kit CLI tool.
 *
 * The ace command will ask you to name the migration file.
 */
export default class MakeMigration extends BaseCommand {
  static commandName = 'make:migration'
  static description = 'Create a new database migration using your Drizzle models'

  @args.string({ description: 'Migration name', required: false })
  declare name: string

  static options: CommandOptions = {
    startApp: false,
  }

  async run() {
    const migrationName =
      this.name ||
      (await this.prompt.ask('Enter a name for the migration e.g. "add-users-table"', {
        validate: (value) => {
          if (!value.trim()) {
            return 'Migration name is required'
          }
          return true
        },
      }))

    this.logger.log(`Asking Drizzle to make a migration called "${migrationName}"...`)

    try {
      execSync(`npx drizzle-kit generate --config=drizzle.config.ts --name=${migrationName}`, {
        stdio: 'inherit',
        encoding: 'utf8',
      })
    } catch (error) {
      this.logger.error('Failed to generate migration')
      this.exitCode = 1
    }
  }
}
