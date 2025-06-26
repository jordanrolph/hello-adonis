/**
 * Alpine.js Base Setup
 *
 * This file initializes Alpine.js and registers common components.
 *
 * SYNTAX IN VIEWS
 * Without additonal setup this repo only supports the long form syntax.
 *
 * Alpine.js itself supports long and shorthand syntax. Both syntaxes are functionally
 * identical (Alpine.js processes them the same way). But code editor and SWC (compiles
 * typescript in AdonisJS) support for Alpine shorthand can be flakey. So:
 * @example
 * USE          x-bind:class=
 * INSTEAD OF   :class=
 * @example
 * USE          x-on:click=
 * INSTEAD OF   @click=
 *
 * USAGE IN VIEWS
 * This file loads Alpine but does NOT actually start Alpine itself.
 * Alpine should only be started once all the components that use
 * Alpine have been registered, otherwise you'll get errors.
 *
 * @example
 * // resources/js/examplePage.js
 * import { startAlpine } from './shared/alpine.js'
 * // Optional: Register any components that use Alpine first
 * // Example: Alpine.data('something', (content) => {...
 * // Then start Alpine
 * startAlpine()
 */

import Alpine from 'alpinejs'

// Common Alpine components
Alpine.data('test', () => ({
  message: 'Alpine is working!',
}))

Alpine.data('modal', () => ({
  open: false,
  toggle() {
    this.open = !this.open
  },
  close() {
    this.open = false
  },
}))

Alpine.data('dropdown', () => ({
  open: false,
  toggle() {
    this.open = !this.open
  },
  close() {
    this.open = false
  },
}))

window.Alpine = Alpine

// Export a function to start Alpine
export const startAlpine = () => {
  console.log('Starting Alpine...')
  Alpine.start()
  console.log('Alpine started')
}
