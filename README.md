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

1. Run `npm install`
2. Copy `.env.example` file and rename to `.env`
3. Run `node ace generate:key` to generate a random app key (automatically added to .env)
4. Create a postgres database and add connection string to `DATABASE_URL` in `.env`
5. Create a second postgres database, with a name ending _test. Add connection string to `.env.test`
6. TODO: Add link guide to run db migration
7. Run `node ace serve` to start the app


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

## Database commands

### Ace commands

This starter defines some ace commands to simplify using Drizzle, and keep the Developer experience consistent with a normal Adonis app.

Run `node ace list` to see all the available commands. The database specific commands are explained in more detail below, but in summary:

- `node ace make:model` -> Makes a new database model and adds it to the schema
- `node ace make:migration` -> Generates a new migration file
- `node ace migration:run` -> Applies any pending migrations to the database
- `node ace migration:rollback` -> Reverts a migration and deletes the file

### Exploring the database with Drizzle Studio

Drizzle Studio is great for managing your database tables, and doing simple admin like creating test records.

To start Drizzle Studio, in terminal run:

`npx drizzle-kit studio`

When Drizzle Studio starts it will be available at https://local.drizzle.studio.

### Creating or updating a database model

The Drizzle database models are stored in the `app/models` folder. Note, Drizzle calls these "schema" files in their docs but it's the same concept.

To create a new database table, run `node ace make:model`. This command will create a new Drizzle model file in `/app/models/` with some boilerplate columns, and add the new table to the schema list at `config/database.ts`. Edit the model file to reflect the table you need, generate a migration, then run the migration to update the actual database structure.

To change an existing table, just edit the relevant model, then generate and run a migration.

### Database Migrations

Migrations are stored in the `/database/migrations` folder, like in a normal Adonis project.

This starter defines some ace commands to help you call the Drizzle specific commands without memorising them.

#### Generate a new migration:

Make the changes you need to your database models, then run:

`node ace make:migration`

This custom ace command will prompt you to add a custom name for the migration. The command is basically the same as running `npx drizzle-kit generate --name="add-users-table"`, but the ace command easier to remember.

#### Apply migrations:

Generate a migration (instructions above), then apply it to the database by running:

`node ace migration:run`

This custom ace command will execute any migration files that haven't been applied to the database yet.

### Rollback a migration

To rollback a migration, run:

`node ace migration:rollback`

The CLI will ask you to choose which migration you wish to drop.

Note: Drizzle's "drop" functionality doesn't rollback migrations in the same way as many other ORMs. Whilst "drop" will rollback a migration from the database, it also delete the migration file from the `database/migrations` directory. If this is not the behaviour you want, you can recover the deleted migration file if you have tracked it with git, or you can generate a new one.

### Database Seeding

TODO: explain where seeds are defined
TODO: explain how to run seeds

## Rendering typesafe view templates with Kita

This starter swaps the Adonis default EdgeJS template engine for ([KitaJS HTML](https://github.com/kitajs/html)). Kita generates HTML from JSX view templates, which means you can use TSX syntax when writing views.

### Why Kita?

The TSX syntax is easy to read, and gives type hinting, support for components, and syntax highlighting in most code editors without needing any special plugins.

Kita only renders static HTML on the server, so we don't get any of the client side functionality from React or NextJS. But this simplicity does allow for really easy developer experience. You don't need to worry about data fetching or loading states - just pass the data to the view directly from a controller. 

## Note on returning JSX from controllers

Controller file names need the `.tsx` extension if the controller returns a JSX view. `node ace make:controller` creates files with a `.ts` extension by default, so you will need to rename the file to `.tsx` manually.

For example, this show method returns a view in a JSX syntax, so this controller would need a `.tsx` extension

```jsx
// app/controllers/my_controller.tsx

export default class MyController {
    async show() {
        return (
            <DefaultLayout pageTitle="My Page">
                Hello world
            </DefaultLayout>
        )
    }
}
```

## Adding CSS and JS to Kita views

TODO: Add explainer about Vite.Entrypoint helper
` <Vite.Entrypoint entrypoints={['resources/js/app.js']} />`

## AlpineJS for adding client side interactivity

TODO: Add overview of Alpine
TODO: Add explainer of shortform vs longform naming, and triple slash convention
`/// <reference types="@kitajs/html/alpine.d.ts" />`

### Rich text editing with TipTap and AlpineJS

TODO: Add explainer of TipTap, optional so can delete
