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
      <h1>Song Details</h1>
      <p>Song ID: {params.id}</p>
    </div>
  );
}
