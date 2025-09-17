import { ExternalLink, MessageCircle } from 'lucide-react';

import logoDark from './logo-dark.svg';
import logoLight from './logo-light.svg';

export function Welcome({ message }: { message: string }) {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <img
              alt="React Router"
              className="block w-full dark:hidden"
              src={logoLight}
            />
            <img
              alt="React Router"
              className="hidden w-full dark:block"
              src={logoDark}
            />
          </div>
        </header>
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-border p-6 space-y-4">
            <p className="leading-6 text-muted-foreground text-center">
              What&apos;s next?
            </p>
            <ul>
              {resources.map(({ href, text, icon }) => (
                <li key={href}>
                  <a
                    className="group flex items-center gap-3 self-stretch p-3 leading-normal text-primary hover:underline"
                    href={href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {icon}
                    {text}
                  </a>
                </li>
              ))}
              <li className="self-stretch p-3 leading-normal">{message}</li>
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}

const resources = [
  {
    href: 'https://reactrouter.com/docs',
    text: 'React Router Docs',
    icon: (
      <ExternalLink className="stroke-muted-foreground group-hover:stroke-current h-5 w-5" />
    ),
  },
  {
    href: 'https://rmx.as/discord',
    text: 'Join Discord',
    icon: (
      <MessageCircle className="stroke-muted-foreground group-hover:stroke-current h-5 w-5" />
    ),
  },
];
