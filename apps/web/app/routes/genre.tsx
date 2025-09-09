import type { Route } from './+types/genre';

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Genre ${params.id} - Lyriko` },
    { name: 'description', content: 'Genre details page' },
  ];
}

export default function Genre({ params }: Route.ComponentProps) {
  return (
    <div>
      <h1>Genre Details</h1>
      <p>Genre ID: {params.id}</p>
    </div>
  );
}
