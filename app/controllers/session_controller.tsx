import { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import db from '#config/database'
import { eq } from 'drizzle-orm'
import { usersTable } from '#models/user'
import { Login } from '#views/login'

export default class SessionController {
  async show({}: HttpContext) {
    return <Login />
  }

  async store({ auth, request, response }: HttpContext) {
    // 1.  Validate input
    const { email, password } = request.only(['email', 'password'])
    if (!email || !password) {
      throw new errors.E_INVALID_CREDENTIALS('Invalid credentials')
    }

    // 2. Attempt to find the user by their email address
    const user = await db.query.users.findFirst({ where: eq(usersTable.email, email) })
    if (!user) {
      throw new errors.E_INVALID_CREDENTIALS('Invalid credentials')
    }

    // 3. Check the password is correct
    const hasValidPassword = await hash.verify(user.password, password)
    if (!hasValidPassword) {
      throw new errors.E_INVALID_CREDENTIALS('Invalid credentials')
    }

    // 4. Finally, log in the user and redirect them to the homepage
    await auth.use('web').login(user)
    return response.redirect().toRoute('home')
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('auth.login.show')
  }
}
