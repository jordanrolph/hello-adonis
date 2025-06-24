import { csrfField } from '#view_helpers/csrfField_helper'
import { route } from '#view_helpers/route_helper'
import type { AuthenticatedUser } from '#types/auth'

interface HomeProps {
  user: AuthenticatedUser
}

export function Home({ user }: HomeProps) {
  return (
    <>
      <h1>Hello {user.fullName}</h1>
      <p>You are logged in as {user.email}</p>
      <form action={route('auth.logout')} method="post">
        {csrfField()}
        <button type="submit">Logout</button>
      </form>
    </>
  )
}
