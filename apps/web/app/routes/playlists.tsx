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
      <h1>Playlists</h1>
      <p>Browse all playlists page</p>
    </div>
  );
}
