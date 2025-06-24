import { Html } from '@kitajs/html'
import { HttpContext } from '@adonisjs/core/http'

/**
 * This view helper will generate a hidden input with the CSRF token for use inside a form.
 *
 * Usage example:
 * `<form>{csrfField()}</form>`
 *
 * Renders:
 * `<form><input type="hidden" value="some random token" name="_csrf"></form>`
 */
export function csrfField() {
  const { request } = HttpContext.getOrFail()

  return Html.createElement('input', { type: 'hidden', value: request.csrfToken, name: '_csrf' })
}
