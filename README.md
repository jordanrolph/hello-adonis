# Hello Adonis Starter

An opinionated Adonis starter based on AdonisJS, optimised for type hinting and easy development.

Under the hood it's just a normal Adonis web app with a few packages swapped out, so you still get the lovely Adonis developer experience... but with a few tactical changes:

- Uses the Adonis core web server and services
- Drizzle ORM for type hinting when interacting with the database
- KitaJS Html for rendering typesafe view templates on the server
- AlpineJS for sprinklings of client side JS for interactivity
- Authentication with Adonis session guard
- Example pages to make a quick start when developing a new project

## Getting Started

TODO: add command for running the starter to make a new app
TODO: follow instructions to connect to postgres db
TODO: run migration to initialise the database
TODO: run seed to create test data

Start development server: `node ace serve`

## Database with Drizzle ORM

This starter swaps the Adonis default Lucid ORM for Drizzle ORM. I find Drizzle type hinting very useful, and Drizzle's Studio feature is really handy when doing the small database admin tasks you often need to do during development.

The starter assumes you want to use a Postgres database. Drizzle supports lots of database types, so you can switch away from Postgres if you prefer.

Drizzle docs: `https://orm.drizzle.team/docs/`

### Connecting to your Postgres database for local development

Open the `.env` file and replace the value of `DATABASE_URL` with your Postgres connection string.

If you're using a Mac, I recommend using `https://postgresapp.com/` which is a simple tool to create and run Postgres databases for local development.

### Connecting to your Postgres database for production

Set the environment variable `DATABASE_URL` with your Postgres connection string for your production database. How you do this depends on your hosting provider.

### Exploring the database with Drizzle Studio

Drizzle Studio is great for managing your database tables, and doing simple admin like creating test records.

To start Drizzle Studio, in terminal run:

`npx drizzle-kit studio`

When Drizzle Studio starts it will be available at https://local.drizzle.studio.

### Creating or updating a database table

The Drizzle database schema files are stored in the `app/models` folder.

To change an existing table, edit the relevnat schema file then run a migration.

To create a new database table, create a new shema file. Then add it to the schema list at `config/database.ts`, and run a migration.

### Database Migrations

Migrations are stored in the `/database/migrations` folder, like in a normal Adonis project. But Migration management requires using some Drizzle specific commands instead of AdonisJS Ace commands.

#### Generate a new migration:

`npx drizzle-kit generate --name="add-user-profiles"`

#### Apply migrations:

`npx drizzle-kit migrate`

### Drop a migration

Note: Drizzle currently doesn't have the ability to rollback a migration, so drop is the best alternative. "Drop" is a bit of a nuclear option to rollback because it will also delete the migration file from the `database/migrations` directory. You can recover the deleted file if you have tracked it with git.

`npx drizzle-kit drop`

The CLI will ask you to choose which migration you wish to drop.

### Database Seeding

TODO: explain where seeds are defined
TODO: explain how to run seeds

## Rendering typesafe view templates with Kita

This starter swaps the Adonis default EdgeJS template engine for ([KitaJS HTML](https://github.com/kitajs/html)). Kita generates HTML from JSX view templates, which means you can use TSX syntax when writing views.

### Why Kita?

The TSX syntax is easy to read, and gives type hinting, support for components, and syntax highlighting in most code editors without needing any special plugins.

Kita only renders static HTML on the server, so we don't get any of the client side functionality from React or NextJS. But this simplicity does allow for really easy developer experience. You don't need to worry about data fetching or loading states - just pass the data to the view directly from a controller.

## Adding CSS and JS to Kita views

TODO: Add explainer about Vite.Entrypoint helper
` <Vite.Entrypoint entrypoints={['resources/js/app.js']} />`

## AlpineJS for adding client side interactivity

TODO: Add overview of Alpine
TODO: Add explainer of shortform vs longform naming, and triple slash convention
`/// <reference types="@kitajs/html/alpine.d.ts" />`

### Rich text editing with TipTap and AlpineJS

TODO: Add explainer of TipTap, optional so can delete
