// import app from '@adonisjs/core/services/app'
// import env from '#start/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './database/migrations', // Path to migrations // TODO: replace out with  `out: app.migrationsPath()`,
  schema: './app/models/*', // Path to models // TODO: replace schema with `schema: app.modelsPath('*')`,
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://postgres@localhost:5432/hello-adonis', // TODO: replace with `env.get('DATABASE_URL')`,
  },
})
