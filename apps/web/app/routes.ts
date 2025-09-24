import {
  type RouteConfig,
  index,
  route,
  layout,
} from '@react-router/dev/routes';

export default [
  layout('layouts/main-layout.tsx', [
    index('routes/home.tsx'),
    route('login', 'routes/login.tsx'),
    route('signup', 'routes/signup.tsx'),
    route('artists', 'routes/artists.tsx'),
    route('artists/:id', 'routes/artist.tsx'),
    route('albums', 'routes/albums.list.tsx'),
    route('albums/create', 'routes/albums.create.tsx'),
    route('albums/:slug/edit', 'routes/albums.edit.tsx'),
    route('albums/:slug', 'routes/albums.detail.tsx'),
    route('songs', 'routes/songs.tsx'),
    route('songs/:id', 'routes/song.tsx'),
    route('genres', 'routes/genres.list.tsx'),
    route('genres/create', 'routes/genres.create.tsx'),
    route('genres/:slug/edit', 'routes/genres.edit.tsx'),
    route('genres/:slug', 'routes/genres.detail.tsx'),
    route('playlists', 'routes/playlists.tsx'),
    route('playlists/:id', 'routes/playlist.tsx'),
    route('search', 'routes/search.tsx'),
  ]),
] satisfies RouteConfig;
