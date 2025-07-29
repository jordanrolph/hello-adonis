import { csrfField } from '#view_helpers/csrfField'
import { route } from '#view_helpers/route'

interface LogoutButtonProps { }

export function LogoutButton({ }: LogoutButtonProps) {
    return (
        <form action={route('auth.logout')} method="post">
            {csrfField()}
            <button type="submit">Logout</button>
        </form>
    )
}