import { route } from '#view_helpers/route_helper'
import { csrfField } from '#view_helpers/csrfField_helper'
// import { inspect } from '#view_helpers/inspect_helper'
import { FlashMessages } from '#types/session'

interface LoginProps {
  flashMessages: FlashMessages
}

export function Login({ flashMessages }: LoginProps) {
  const { errorsBag } = flashMessages
  const invalidCredentialsMessage = errorsBag?.E_INVALID_CREDENTIALS ?? ''

  return (
    <>
      {invalidCredentialsMessage ?? <p>{invalidCredentialsMessage}</p>}
      {/* {inspect(flashMessages)} */}

      <form action={route('auth.login.store')} method="post">
        {csrfField()}
        <div>
          <label for="email">Email </label>
          <input type="email" name="email" id="email" />
        </div>

        <div>
          <label for="password">Password </label>
          <input type="password" name="password" id="password" />
        </div>

        <div>
          <button type="submit">Login </button>
        </div>
      </form>
      <a href={route('auth.registration.show')}>Create a new account</a>
    </>
  )
}
