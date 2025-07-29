import { test } from '@japa/runner'
import hash from '@adonisjs/core/services/hash'
import { usersTable } from '#models/users'
import db from '#config/database'

test.group('Login', (group) => {
  group.each.setup(async () => {
    await db.delete(usersTable)
  })

  test('displays login form', async ({ visit }) => {
    const page = await visit('/login')

    await Promise.all([
      page.assertTextContains('body', 'Email'),
      page.assertTextContains('body', 'Password'),
      page.assertTextContains('body', 'Login'),
      page.assertTextContains('body', 'Create a new account')
    ])
  })

  test('user can login with valid credentials', async ({ visit }) => {
    const mockUserPassword = 'Pa$$word123'
    const mockUserData = {
      email: 'john@example.com',
      password: await hash.make(mockUserPassword),
      fullName: 'John Doe',
    }
    await db.insert(usersTable).values(mockUserData)

    const page = await visit('/login')

    await page.locator('input[name="email"]').fill(mockUserData.email)
    await page.locator('input[name="password"]').fill(mockUserPassword)
    await page.locator('button[type="submit"]').click()

    await page.waitForURL('/')
    await Promise.all([
      page.assertTextContains('body', `You are logged in as ${mockUserData.email}`)])
  })

  test('login fails if email is incorrect', async ({ visit }) => {
    const page = await visit('/login')

    await page.locator('input[name="email"]').fill('nonexistent@example.com')
    await page.locator('input[name="password"]').fill('somepassword')
    await page.locator('button[type="submit"]').click()

    await page.waitForURL('/login')
    await page.assertTextContains('body', 'Invalid credentials')
  })

  test('login fails with incorrect password', async ({ visit }) => {
    const mockUserPassword = 'Pa$$word123'
    const incorrectPassword = 'Inco^^ect123'
    const userData = {
      email: 'john@example.com',
      password: await hash.make(mockUserPassword),
      fullName: 'John Doe',
    }
    await db.insert(usersTable).values(userData)

    const page = await visit('/login')

    await page.locator('input[name="email"]').fill(userData.email)
    await page.locator('input[name="password"]').fill(incorrectPassword)
    await page.locator('button[type="submit"]').click()

    await page.waitForURL('/login')
    await page.assertTextContains('body', 'Invalid credentials')
  })

  test('login fails if email is missing', async ({ visit }) => {
    const page = await visit('/login')

    await page.locator('input[name="password"]').fill('Password123')
    await page.locator('button[type="submit"]').click()

    await page.waitForURL('/login')
    await page.assertTextContains('body', 'Please enter your email')
  })

  test('login fails if password is missing', async ({ visit }) => {
    const page = await visit('/login')

    await page.locator('input[name="email"]').fill('john@example.com')
    await page.locator('button[type="submit"]').click()

    await page.waitForURL('/login')
    await page.assertTextContains('body', 'Please enter your password')
  })

  test('login fails if email is invalid format', async ({ visit }) => {
    const page = await visit('/login')

    await page.locator('input[name="email"]').fill('john@example')
    await page.locator('input[name="password"]').fill('password123')
    await page.locator('button[type="submit"]').click()

    await page.waitForURL('/login')
    await page.assertTextContains('body', 'The email field must be a valid email address')
  })

  test('email field retains value after password validation error', async ({ visit, assert }) => {
    const page = await visit('/login')
    const testEmail = 'john@example.com'

    await page.locator('input[name="email"]').fill(testEmail)
    await page.locator('button[type="submit"]').click()
    await page.waitForURL('/login')

    const emailInput = page.locator('input[name="email"]')
    const emailInputValue = await emailInput.inputValue()
    assert.equal(emailInputValue, testEmail)
  })
})