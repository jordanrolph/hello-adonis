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
      /**
       * Here `NODE_OPTIONS='--import tsx'` is used to run the drizzle generate
       * command using tsx. This is a workaround for the "Cannot find module" errors
       * with Drizzle where Drizzle's execution context is unable to resolve modules
       * that have circular imports (used when defining model relations), or imports
       * with explicit file extensions (imported as .js where the file is .ts).
       * `tsx` has superior ESM and TS support so it is able to handle these files.
       * Related: https://github.com/drizzle-team/drizzle-orm/issues/1228
       * Related: https://github.com/drizzle-team/drizzle-orm/issues/849
       */
      execSync(
        `NODE_OPTIONS='--import tsx' npx drizzle-kit generate --config=drizzle.config.ts --name=${migrationName}`,
        {
          stdio: 'inherit',
          encoding: 'utf8',
          env: { ...process.env, NODE_OPTIONS: '--import tsx' } // Also pass it in env
        }
      )
    } catch (error) {
      this.logger.error('Failed to generate migration')
      this.exitCode = 1
    }
  }
}