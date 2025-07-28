import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './database/migrations', // Path to migrations
  schema: './app/models/*', // Path to models
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
