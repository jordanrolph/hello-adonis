import db from '#config/database'
import { eq } from 'drizzle-orm'
import { usersTable } from '#models/user'
import type { InferSelectModel } from 'drizzle-orm'
import { symbols } from '@adonisjs/auth'
import { SessionGuardUser, SessionUserProviderContract } from '@adonisjs/auth/types/session'

/**
 * For background on this file see these related docs. They show an example of integrating
 * Kysely ORM with Adonis auth instead of Drizzle ORM, but the premise is the same.
 * https://adonisjs.com/blog/kysely-with-auth-session-guard
 */

type User = InferSelectModel<typeof usersTable>

export class SessionDrizzleUserProvider implements SessionUserProviderContract<User> {
  declare [symbols.PROVIDER_REAL_USER]: User

  async createUserForGuard(user: User): Promise<SessionGuardUser<User>> {
    return {
      getId() {
        return user.id
      },
      getOriginal() {
        return user
      },
    }
  }

  async findById(identifier: number): Promise<SessionGuardUser<User> | null> {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, identifier))
      .limit(1)
      .then((results) => results[0] || null)

    if (!user) {
      return null
    }

    return this.createUserForGuard(user)
  }
}
