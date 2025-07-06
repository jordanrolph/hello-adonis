import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { seed } from '#database/seeders/dev_seeder'
import db from '#config/database'

/**
 * Run with `node ace db:seed`
 *
 * This command seeds the database with mock data using the factory system.
 * It runs the database seeder (in `database/seeders`) to populate your
 * development database with realistic fake data to help with local development.
 */
export default class DbSeed extends BaseCommand {
  static commandName = 'db:seed'
  static description = 'Seed the database with test data using factories'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.log('Seeding database...')

    try {
      await seed()

      await db.$client.end()

      this.logger.log('Database seeding complete')
    } catch (error) {
      this.logger.error('Failed to seed database')
      this.exitCode = 1
    }
  }
}
