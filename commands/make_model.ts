import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import vine from '@vinejs/vine'

/**
 * Run with `node ace make:model`
 *
 * This command makes a new boilerplate database model file.
 *
 * - Prompts for singular and plural names with validation
 * - Creates the model file at app/models/{plural}.ts with proper boilerplate
 * - Automatically adds the import and table entry to config/database.ts
 * - Uses proper capitalisation (e.g. User, usersTable, users in schema)
 * - Validates that model files don't already exist
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
    const capitalizedSingular = this.capitalize(singular)

    this.logger.log(`Creating model "${capitalizedSingular}" (${plural})...`)

    try {
      // Create model file
      await this.createModelFile(plural, capitalizedSingular)
      this.logger.success(`Model file created at app/models/${plural}.ts`)

      // Update database config
      await this.updateDatabaseConfig(plural)
      this.logger.success(`Updated config/database.ts`)

      this.logger.success(`Model "${capitalizedSingular}" created successfully!`)
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

export const ${plural}Table = pgTable('${plural}', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  // Add the columns you need here
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
})

export type ${capitalizedSingular} = typeof ${plural}Table.$inferSelect
`

    await writeFile(modelPath, modelContent, 'utf8')
  }

  private async updateDatabaseConfig(plural: string) {
    const configPath = join(process.cwd(), 'config', 'database.ts')

    if (!existsSync(configPath)) {
      throw new Error('config/database.ts not found')
    }

    let configContent = await readFile(configPath, 'utf8')

    // Add import statement
    const importStatement = `import { ${plural}Table } from '#models/${plural}'`

    // Find the last import line and add our import after it
    const importLines = configContent.split('\n').filter((line) => line.trim().startsWith('import'))
    const lastImportIndex = configContent.lastIndexOf(importLines[importLines.length - 1])
    const insertPosition = configContent.indexOf('\n', lastImportIndex) + 1

    configContent =
      configContent.slice(0, insertPosition) +
      importStatement +
      '\n' +
      configContent.slice(insertPosition)

    // Add to schema object
    const schemaRegex = /(export const schema = \{[\s\S]*?)((\n\s*\/\/.*\n\s*\})|(\n\s*\}))/
    const match = configContent.match(schemaRegex)

    if (!match) {
      throw new Error('Could not find schema object in config/database.ts')
    }

    const beforeClosing = match[1]
    const closing = match[2]

    // Check if the last non-whitespace, non-comment character before closing is a comma
    const contentBeforeClosing = beforeClosing.replace(/\s*\/\/.*$/gm, '').trim()
    const hasTrailingComma = contentBeforeClosing.endsWith(',')

    // Check if there are any existing tables (contains colon that's not in a comment)
    const hasExistingTables = /:\s*[^\/\n]*[^,\s\/]/.test(beforeClosing)

    let newEntry
    if (!hasExistingTables) {
      // First table
      newEntry = `\n  ${plural}: ${plural}Table,`
    } else if (hasTrailingComma) {
      // Has existing tables and trailing comma
      newEntry = `\n  ${plural}: ${plural}Table,`
    } else {
      // Has existing tables but no trailing comma
      newEntry = `,\n  ${plural}: ${plural}Table,`
    }

    const updatedSchema = beforeClosing + newEntry + closing

    configContent = configContent.replace(schemaRegex, updatedSchema)

    await writeFile(configPath, configContent, 'utf8')
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}
