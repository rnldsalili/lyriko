import type { Route } from './+types/artist';

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Artist ${params.id} - Lyriko` },
    { name: 'description', content: 'Artist details page' },
  ];
}

export default function Artist({ params }: Route.ComponentProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Artist Details
      </h1>
      <p className="text-muted-foreground text-lg">Artist ID: {params.id}</p>
    </div>
  );
}
