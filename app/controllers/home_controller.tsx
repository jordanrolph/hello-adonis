import type { HttpContext } from '@adonisjs/core/http'
import { Home } from '#views/home'
import { DefaultLayout } from '#layouts/default_layout'
import db from '#config/database'
import { postsTable } from '#models/posts'
import { usersTable } from '#models/users'
import { eq, isNull, desc } from 'drizzle-orm'

export default class HomeController {
  async handle({ auth }: HttpContext) {
    const user = auth.getUserOrFail()

    // Fetch all posts with their authors
    const posts = await db
      .select({
        id: postsTable.id,
        body: postsTable.body,
        createdAt: postsTable.created_at,
        author: {
          id: usersTable.id,
          fullName: usersTable.fullName,
          email: usersTable.email,
        },
      })
      .from(postsTable)
      .leftJoin(usersTable, eq(postsTable.authorId, usersTable.id))
      .where(isNull(postsTable.deleted_at))
      .orderBy(desc(postsTable.created_at))

    return (
      <DefaultLayout pageTitle="Home">
        <Home user={user} posts={posts} />
      </DefaultLayout>
    )
  }
}
