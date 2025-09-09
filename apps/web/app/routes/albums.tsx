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
      <h1>Albums</h1>
      <p>Browse all albums page</p>
    </div>
  );
}
