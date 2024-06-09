// import type { LinksFunction } from '@remix-run/node';
import {
  // Form,
  Links,
  Meta,
  // Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
// import appStylesHref from './styling/app.css';
import Index from './components';

// export const links: LinksFunction = () => [
//   { rel: 'stylesheet', href: appStylesHref },
// ];

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
      <header>
          <nav>
            <a href="/">Home</a>
            {/* Add more navigation links here */}
          </nav>
        </header>
        <main>
          {/* <Outlet /> */}
          <Index />
        </main>
        <footer>
          <p>© Diamond Solutions</p>
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
