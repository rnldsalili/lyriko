import {
  type RouteConfig,
  index,
  route,
  layout,
} from '@react-router/dev/routes';

export default [
  index('routes/login.tsx'),
  layout('layouts/main-layout.tsx', [
    route('home', 'routes/home.tsx'),
    route('artists', 'routes/artists.tsx'),
    route('artists/:id', 'routes/artist.tsx'),
    route('albums', 'routes/albums.tsx'),
    route('albums/:id', 'routes/album.tsx'),
    route('songs', 'routes/songs.tsx'),
    route('songs/:id', 'routes/song.tsx'),
    route('genres', 'routes/genres.tsx'),
    route('genres/:id', 'routes/genre.tsx'),
    route('playlists', 'routes/playlists.tsx'),
    route('playlists/:id', 'routes/playlist.tsx'),
    route('search', 'routes/search.tsx'),
  ]),
] satisfies RouteConfig;
