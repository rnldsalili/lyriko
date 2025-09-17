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
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Playlist Details
      </h1>
      <p className="text-muted-foreground text-lg">Playlist ID: {params.id}</p>
    </div>
  );
}
