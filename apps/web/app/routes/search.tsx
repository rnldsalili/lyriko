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
      <h1>Search</h1>
      <p>Search for artists, albums, songs, and playlists</p>
    </div>
  );
}
