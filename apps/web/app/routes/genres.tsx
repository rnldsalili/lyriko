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
      <h1 className="text-3xl font-bold text-foreground mb-6">Genres</h1>
      <p className="text-muted-foreground text-lg">Browse all genres page</p>
    </div>
  );
}
