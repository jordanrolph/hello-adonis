import { assert } from '@japa/assert'
import app from '@adonisjs/core/services/app'
import type { Config } from '@japa/runner/types'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import testUtils from '@adonisjs/core/services/test_utils'
import { browserClient } from '@japa/browser-client'
import { sessionBrowserClient } from '@adonisjs/session/plugins/browser_client'
import { authBrowserClient } from '@adonisjs/auth/plugins/browser_client'
import { execSync } from 'node:child_process'
import env from '#start/env'
import db from '#config/database'


/**
 * This file is imported by the "bin/test.ts" entrypoint file
 */

/**
 * Configure Japa plugins in the plugins array.
 * Learn more - https://japa.dev/docs/runner-config#plugins-optional
 */
export const plugins: Config['plugins'] = [assert(),
pluginAdonisJS(app),
browserClient({
  runInSuites: ['browser']
}),
sessionBrowserClient(app),
authBrowserClient(app),
]
/**
 * Configure lifecycle function to run before and after all the
 * tests.
 *
 * The setup functions are executed before all the tests
 * The teardown functions are executed after all the tests
 */
export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [
    // Simple safety check to ensure the tests are using a test database
    // because we don't want to wipe the development, staging, or production db
    async () => {
      const databaseUrl = env.get('DATABASE_URL')
      const isTestDatabase = databaseUrl.includes('test')

      if (!isTestDatabase) {
        throw new Error(
          `
              SAFETY CHECK FAILED!
              Tests should run against a database with 'test' in the name.
              Current DATABASE_URL: ${databaseUrl}
              Expected something like: ${databaseUrl}_test
              Did you add a test database URL to the ".env.test" file?
            `
        )
      }

      console.log('Using test database:', databaseUrl)
    },

    // Reset database and run migrations
    async () => {
      console.log('Resetting test database...')

      try {
        // Clear all database tables and data
        // (this is safe because we verified it's a test DB)
        await db.execute(`
          DROP SCHEMA public CASCADE;
          CREATE SCHEMA public;
          GRANT ALL ON SCHEMA public TO postgres;
          GRANT ALL ON SCHEMA public TO public;
        `)
        console.log('Database reset complete')

        // Run migrations
        console.log('Running migrations...')
        execSync('npx drizzle-kit push --config=drizzle.config.ts', {
          stdio: 'inherit',
          env: { ...process.env, NODE_ENV: env.get('NODE_ENV') },
          cwd: app.makePath(),
        })
        console.log('Migrations complete')

        // List all the tables exist after migration for debugging
        const tablesResult = await db.execute(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `)
        console.log(
          'Test database now has these tables:',
          tablesResult.rows.map((row) => row.table_name)
        )
      } catch (error) {
        console.error('Database setup failed:', error)
        throw error
      }
    },
  ],
  teardown: [],
}

/**
 * Configure suites by tapping into the test suite instance.
 * Learn more - https://japa.dev/docs/test-suites#lifecycle-hooks
 */
export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}
