import type { Route } from './+types/song';

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Song ${params.id} - Lyriko` },
    { name: 'description', content: 'Song details page' },
  ];
}

export default function Song({ params }: Route.ComponentProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Song Details</h1>
      <p className="text-muted-foreground text-lg">Song ID: {params.id}</p>
    </div>
  );
}
