import apiClient from '@/web/lib/api-client';

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
      <h1 className="text-3xl font-bold text-foreground mb-6">Genre Details</h1>
      <p className="text-muted-foreground text-lg">Genre ID: {params.id}</p>
    </div>
  );
}
