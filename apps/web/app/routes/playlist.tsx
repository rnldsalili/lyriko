import type { Route } from './+types/playlist';

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Playlist ${params.id} - Lyriko` },
    { name: 'description', content: 'Playlist details page' },
  ];
}

export default function Playlist({ params }: Route.ComponentProps) {
  return (
    <div>
      <h1>Playlist Details</h1>
      <p>Playlist ID: {params.id}</p>
    </div>
  );
}
