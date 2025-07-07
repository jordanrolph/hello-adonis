import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import vine from '@vinejs/vine'

/**
 * Run with `node ace make:factory`
 *
 * This command creates a new boilerplate factory file for seeding data.
 * It generates a factory that uses drizzle-seed to create deterministic,
 * realistic fake data for your models.
 */
export default class MakeFactory extends BaseCommand {
  static commandName = 'make:factory'
  static description = 'Create a new factory for seeding data with drizzle-seed'

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

    this.logger.log(`Creating "${plural}" factory...`)

    try {
      await this.createFactoryFile(singular, plural, capitalizedSingular)
      this.logger.success(`Factory created at database/factories/${plural}.ts`)
      this.logger.info(
        'Remember to update `database/seeders/dev_seeder.ts` if you want to use data from this factory during development'
      )
    } catch (error) {
      this.logger.error(`Failed to create factory: ${error.message}`)
      this.exitCode = 1
    }
  }

  private async createFactoryFile(singular: string, plural: string, capitalizedSingular: string) {
    const factoryPath = join(process.cwd(), 'database', 'factories', `${plural}.ts`)

    if (existsSync(factoryPath)) {
      throw new Error(`Factory file already exists at database/factories/${plural}.ts`)
    }

    const factoryContent = `
import { seed } from 'drizzle-seed'
import { ${plural}Table, type ${capitalizedSingular} } from '#models/${plural}'
import db from '#config/database'

export const ${plural}Factory = {
  table: ${plural}Table,
  
  /**
   * Create ${plural} in the database using drizzle-seed
   */
  async create(count: number = 1, seedValue: number = 1): Promise<${capitalizedSingular}[]> {
    await seed(db, { ${plural}: ${plural}Table }, { count, seed: seedValue })
    
    // Return the created ${plural}
    const ${plural} = await db.select().from(${plural}Table).limit(count).orderBy(${plural}Table.id)
    return ${plural}
  },

  /**
   * Create a single ${singular} in the database
   */
  async createOne(seedValue: number = 1): Promise<${capitalizedSingular}> {
    const ${plural} = await this.create(1, seedValue)
    return ${plural}[0]
  },

  /**
   * Create multiple ${plural} in the database
   */
  async createMany(count: number, seedValue: number = 1): Promise<${capitalizedSingular}[]> {
    return this.create(count, seedValue)
  },
}
`

    await writeFile(factoryPath, factoryContent, 'utf8')
  }
}
