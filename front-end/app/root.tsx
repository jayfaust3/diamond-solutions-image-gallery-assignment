import type { LinksFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
// eslint-disable-next-line import/no-unresolved
import globalStylesUrl from '~/styles/global.css?url';
import ViewImages from './components/view-images';

export const links: LinksFunction = () => [{ rel: "stylesheet", href: globalStylesUrl }];

export default function Root() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name="viewport" content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <main>
          <ViewImages />
          <footer>
            <p>© Diamond Solutions</p>
          </footer>
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
