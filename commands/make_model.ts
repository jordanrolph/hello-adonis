import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import vine from '@vinejs/vine'

/**
 * Run with `node ace make:model`
 *
 * This command makes a new boilerplate database model file.
 *
 * - Prompts for singular and plural names with validation
 * - Uses proper capitalisation (e.g. User, usersTable)
 * - Validates that model files don't already exist
 * - Creates a new model file at app/models/{plural}.ts with useful boilerplate
 */
export default class MakeModel extends BaseCommand {
  static commandName = 'make:model'
  static description = 'Create a new boilerplate Drizzle database model file'

  @args.string({ description: 'Model name (singular)', required: false })
  declare name: string

  static options: CommandOptions = {
    startApp: false,
  }

  async run() {
    // Define validation schema
    const modelNameSchema = vine.compile(
      vine.object({
        name: vine.string().trim().minLength(1),
      })
    )

    // Get singular name
    const singularName =
      this.name ||
      (await this.prompt.ask('Enter the singular name for the model (e.g. "user"):', {
        validate: async (value) => {
          try {
            await modelNameSchema.validate({ name: value })
            return true
          } catch (error) {
            return 'Model name must be alphanumeric and start with a letter'
          }
        },
      }))

    // Get plural name
    const pluralName = await this.prompt.ask(
      `Enter the plural name for the model (e.g. "users"):`,
      {
        validate: async (value) => {
          try {
            await modelNameSchema.validate({ name: value })
            return true
          } catch (error) {
            return 'Plural name must be alphanumeric and start with a letter'
          }
        },
      }
    )

    const singular = singularName.trim().toLowerCase()
    const plural = pluralName.trim().toLowerCase()
    const capitalizedSingular = singular.charAt(0).toUpperCase() + singular.slice(1)

    this.logger.log(`Creating model "${plural}"...`)

    try {
      // Create model file
      await this.createModelFile(plural, capitalizedSingular)
      this.logger.log(`Model file created at app/models/${plural}.ts`)

      this.logger.success(`Model "${plural}" created successfully!`)

      // Suggest next steps
      this.logger.info(
        'You should now import this model at `config/database.ts` to add this model to your Drizzle schema'
      )
      this.logger.log(
        '[ optional ] then run `node ace make:factory` to create a seed data factory for this model'
      )
    } catch (error) {
      this.logger.error(`Failed to create model: ${error.message}`)
      this.exitCode = 1
    }
  }

  private async createModelFile(plural: string, capitalizedSingular: string) {
    const modelPath = join(process.cwd(), 'app', 'models', `${plural}.ts`)

    if (existsSync(modelPath)) {
      throw new Error(`Model file already exists at app/models/${plural}.ts`)
    }

    const modelContent = `import { pgTable, integer, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const ${plural}Table = pgTable('${plural}', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  // Add the columns you need here
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
})

export type ${capitalizedSingular} = typeof ${plural}Table.$inferSelect

export const ${plural}Relations = relations(${plural}Table, () => ({
  // Add relations to other table models here
}))
`

    await writeFile(modelPath, modelContent, 'utf8')
  }
}
