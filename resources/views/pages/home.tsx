/// <reference types="@kitajs/html/alpine.d.ts" />
import type { AuthenticatedUser } from '#types/auth'
import { Vite } from '#view_helpers/assetPath'
import { LogoutButton } from '../components/LogoutButton.js'

interface HomeProps {
  user: AuthenticatedUser
}

export function Home({ user }: HomeProps) {
  return (
    <>
      <Vite.Entrypoint entrypoints={['resources/js/app.js']} />
      <h1 safe>Hello {user.fullName}</h1>
      <p>You are logged in as {user.email}</p>
      <LogoutButton />

      {/* Simple Alpine test */}
      <div x-data="test">
        <p>
          Test message: <span x-text="message"></span>
        </p>
      </div>

      {/* Basic counter test */}
      <div x-data="{ count: 0 }">
        <button x-on:click="count++" x-bind:class="{ 'is-active': true }">
          Count: <span x-text="count"></span>
        </button>
      </div>

      {/* TipTap rich text editor */}
      <div x-data="editor('<p>Hello world! :-)</p>')">
        <template x-if="isLoaded()">
          <div class="menu">
            <button
              x-on:click="toggleHeading({ level: 1 })"
              x-bind:class="{ 'is-active': isActive('heading', { level: 1 }, updatedAt) }"
            >
              H1
            </button>
            <button
              x-on:click="toggleBold()"
              x-bind:class="{ 'is-active' : isActive('bold', updatedAt) }"
            >
              Bold
            </button>
            <button
              x-on:click="toggleItalic()"
              x-bind:class="{ 'is-active' : isActive('italic', updatedAt) }"
            >
              Italic
            </button>
          </div>
        </template>
        <div x-ref="element"></div>
      </div>
    </>
  )
}
