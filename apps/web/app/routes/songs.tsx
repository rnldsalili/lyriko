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
      <h1>Songs</h1>
      <p>Browse all songs page</p>
    </div>
  );
}
