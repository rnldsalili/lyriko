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
      <h1>Artists</h1>
      <p>Browse all artists page</p>
    </div>
  );
}
