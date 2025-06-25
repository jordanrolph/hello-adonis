import { csrfField } from '#view_helpers/csrfField'
import { route } from '#view_helpers/route'
import { FlashMessages } from '#types/session'

interface SignupProps {
  flashMessages: FlashMessages
}

export function Signup({ flashMessages }: SignupProps) {
  const { errors, oldValues } = flashMessages

  return (
    <>
      <form action={route('auth.registration.store')} method="post">
        {csrfField()}

        <div>
          <label for="fullName">Full Name</label>
          <input type="text" name="fullName" id="fullName" value={oldValues?.fullName ?? ''} />
          {errors?.fullName ?? <p>{errors?.fullName}</p>}
        </div>

        <div>
          <label for="email">Email</label>
          <input type="email" name="email" id="email" value={oldValues?.email ?? ''} />
          {errors?.email ?? <p>{errors?.email}</p>}
        </div>

        <div>
          <label for="password">Password</label>
          <input type="password" name="password" id="password" />
          {errors?.password ?? <p>{errors?.password}</p>}
        </div>

        <div>
          <button type="submit">Sign up</button>
        </div>
      </form>

      <a href={route('auth.login.show')}>Log in to an existing account</a>
    </>
  )
}
