import type { Route } from './+types/artists';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Artists - Lyriko' },
    { name: 'description', content: 'Browse all artists' },
  ];
}

export default function Artists() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Artists</h1>
      <p className="text-muted-foreground text-lg">Browse all artists page</p>
    </div>
  );
}
