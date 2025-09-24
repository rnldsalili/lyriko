export enum AlbumType {
  ALBUM = 'ALBUM',
  LP = 'LP',
  SINGLE = 'SINGLE',
  EP = 'EP',
  COMPILATION = 'COMPILATION',
  SOUNDTRACK = 'SOUNDTRACK',
  MIXTAPE = 'MIXTAPE',
  DEMO = 'DEMO',
  LIVE = 'LIVE',
  REMIX = 'REMIX',
  GREATEST_HITS = 'GREATEST_HITS',
  BOOTLEG = 'BOOTLEG',
}

export const ALBUM_TYPE_LABELS: Record<AlbumType, string> = {
  [AlbumType.ALBUM]: 'Album',
  [AlbumType.LP]: 'LP (Long Play)',
  [AlbumType.SINGLE]: 'Single',
  [AlbumType.EP]: 'EP (Extended Play)',
  [AlbumType.COMPILATION]: 'Compilation',
  [AlbumType.SOUNDTRACK]: 'Soundtrack',
  [AlbumType.MIXTAPE]: 'Mixtape',
  [AlbumType.DEMO]: 'Demo',
  [AlbumType.LIVE]: 'Live',
  [AlbumType.REMIX]: 'Remix',
  [AlbumType.GREATEST_HITS]: 'Greatest Hits',
  [AlbumType.BOOTLEG]: 'Bootleg',
};
