import type { Route } from './+types/playlists';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Playlists - Lyriko' },
    { name: 'description', content: 'Browse all playlists' },
  ];
}

export default function Playlists() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Playlists</h1>
      <p className="text-muted-foreground text-lg">Browse all playlists page</p>
    </div>
  );
}
