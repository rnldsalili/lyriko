import type { Route } from './+types/songs';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Songs - Lyriko' },
    { name: 'description', content: 'Browse all songs' },
  ];
}

export default function Songs() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Songs</h1>
      <p className="text-muted-foreground text-lg">Browse all songs page</p>
    </div>
  );
}
