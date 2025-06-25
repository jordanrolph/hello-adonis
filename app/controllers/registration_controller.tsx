import { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import db from '#config/database'
import { usersTable, User } from '#models/user'
import { Signup } from '#views/signup'
import { DefaultLayout } from '#layouts/default_layout'
import { signUpValidator } from '#validators/registration'
import { getFlashMessages } from './helpers/flash_messages.js'

export default class RegistrationController {
  async show({ session }: HttpContext) {
    const flashMessages = getFlashMessages(session)
    return (
      <DefaultLayout pageTitle="Sign up">
        <Signup flashMessages={flashMessages} />
      </DefaultLayout>
    )
  }

  async store({ auth, request, response }: HttpContext) {
    // 1. Validate the form submission
    const payload = await request.validateUsing(signUpValidator)
    const { email, password, fullName } = payload

    // 2. Hash the password ready to store it
    const hashedPassword = await hash.make(password)

    // 3. Create the user in the db. Throw an error if a user with this email already exists
    let newUser: User
    try {
      const insert = await db
        .insert(usersTable)
        .values({ email, password: hashedPassword, fullName })
        .returning()

      newUser = insert[0]
    } catch (error) {
      throw new errors.E_INVALID_CREDENTIALS('Error creating account')
    }

    // 4. Finally, log in the user and redirect them to the homepage
    await auth.use('web').login(newUser)
    return response.redirect('/')
  }
}
