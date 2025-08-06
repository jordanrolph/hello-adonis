import { pgTable, integer, timestamp, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { usersTable } from '#models/users'


export const postsTable = pgTable('posts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  authorId: integer('author_id'),
  title: text().notNull(),
  body: text().notNull(),
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
})

export type Post = typeof postsTable.$inferSelect


export const postsRelations = relations(postsTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [postsTable.authorId],
    references: [usersTable.id],
  }),
}))