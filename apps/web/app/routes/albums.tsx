import type { Route } from './+types/albums';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Albums - Lyriko' },
    { name: 'description', content: 'Browse all albums' },
  ];
}

export default function Albums() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Albums</h1>
      <p className="text-muted-foreground text-lg">Browse all albums page</p>
    </div>
  );
}
