import type { Route } from './+types/genres';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Genres - Lyriko' },
    { name: 'description', content: 'Browse all genres' },
  ];
}

export default function Genres() {
  return (
    <div>
      <h1>Genres</h1>
      <p>Browse all genres page</p>
    </div>
  );
}
