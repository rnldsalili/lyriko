import type { Route } from './+types/album';

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Album ${params.id} - Lyriko` },
    { name: 'description', content: 'Album details page' },
  ];
}

export default function Album({ params }: Route.ComponentProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Album Details</h1>
      <p className="text-muted-foreground text-lg">Album ID: {params.id}</p>
    </div>
  );
}
