import type { Route } from './+types/search';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Search - Lyriko' },
    { name: 'description', content: 'Search for music' },
  ];
}

export default function Search() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Search</h1>
      <p className="text-muted-foreground text-lg">
        Search for artists, albums, songs, and playlists
      </p>
    </div>
  );
}
