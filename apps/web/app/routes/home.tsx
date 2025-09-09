import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Lyriko - Home' },
    {
      name: 'description',
      content: 'Welcome to Lyriko - Your lyrics management system',
    },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Welcome to Lyriko
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-lg">
        Your comprehensive lyrics management system. Navigate through the menu
        above to explore artists, albums, songs, genres, and playlists.
      </p>
    </div>
  );
}
