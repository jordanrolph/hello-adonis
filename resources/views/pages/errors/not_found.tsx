interface NotFoundProps {}

export function NotFound(props: NotFoundProps) {
  const {} = props

  return (
    <>
      <h1>404 - Page not found</h1>
      <p>
        This template is rendered by the
        <a href="http://docs.adonisjs.com/guides/exception-handling#status-pages">
          status pages feature
        </a>
        of the global exception handler.
      </p>
    </>
  )
}
