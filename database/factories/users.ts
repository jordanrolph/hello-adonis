import { seed } from 'drizzle-seed'
import { usersTable, type User } from '#models/users'
import db from '#config/database'
import hash from '@adonisjs/core/services/hash'

export const usersFactory = {
  table: usersTable,

  /**
   * Creates mock users in the database using drizzle-seed.
   *
   * Note: All mock users are created with the password "Password1" so
   * you can use this password to log into the mock user accounts during
   * dev and testing if needed.
   */
  async create(count: number = 1, seedValue: number = 1): Promise<User[]> {
    const hashedPassword = await hash.make('Password1')

    await seed(db, { users: usersTable }, { count, seed: seedValue }).refine((f) => ({
      users: {
        columns: {
          password: f.default({ defaultValue: hashedPassword }),
        },
      },
    }))

    // Return the created users
    const users = await db.select().from(usersTable).limit(count).orderBy(usersTable.id)
    return users
  },

  /**
   * Create a single user in the database
   */
  async createOne(seedValue: number = 1): Promise<User> {
    const users = await this.create(1, seedValue)
    return users[0]
  },

  /**
   * Create multiple users in the database
   */
  async createMany(count: number, seedValue: number = 1): Promise<User[]> {
    return this.create(count, seedValue)
  },
}
