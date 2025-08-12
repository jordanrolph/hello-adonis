/// <reference types="@kitajs/html/alpine.d.ts" />
import type { AuthenticatedUser } from '#types/auth'
import type { PostWithAuthor } from '#types/posts'
import { Vite } from '#view_helpers/assetPath'
import { LogoutButton } from '../components/LogoutButton.js'

interface HomeProps {
  user: AuthenticatedUser
  posts: PostWithAuthor[]
}

export function Home({ user, posts }: HomeProps) {
  return (
    <>
      <Vite.Entrypoint entrypoints={['resources/js/app.js']} />
      <h1 safe>Hello {user.fullName}</h1>
      <p>You are logged in as {user.email}</p>
      <LogoutButton />

      <div class="posts">
        <h2>Recent Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div class="posts-list">
            {posts.map((post) => (
              <div class="post">
                <div class="post-content">
                  <p>{post.body}</p>
                </div>
                <div class="post-meta">
                  <small>
                    By {post.author?.fullName || 'Unknown Author'} on{' '}
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
