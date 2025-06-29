import { Vite } from '#view_helpers/assetPath'
import type { Children } from '@kitajs/html'

interface LayoutProps {
  children: Children
  pageTitle: string
}

export function DefaultLayout({ children, pageTitle }: LayoutProps) {
  return (
    <>
      {'<!DOCTYPE html>'}
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* Example for importing an external font (uncomment and add to CSS font-family) */}
          {/* <link
            href="https://fonts.bunny.net/css?family=instrument-sans:400,400i,500,500i,600,600i,700,700i"
            rel="stylesheet"
          /> */}
          <title safe>{pageTitle} | Hello Adonis</title>
        </head>
        <body>
          <Vite.Entrypoint entrypoints={['resources/css/app.css']} />
          {children}
        </body>
      </html>
    </>
  )
}
