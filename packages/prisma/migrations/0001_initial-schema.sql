-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "bio" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "emailVerifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL DEFAULT 'system',
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL DEFAULT 'system'
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "artist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "image" TEXT,
    "website" TEXT,
    "spotifyUrl" TEXT,
    "country" TEXT,
    "debutYear" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "artist_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "genre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "genre_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "album" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "releaseDate" DATETIME,
    "albumType" TEXT NOT NULL DEFAULT 'ALBUM',
    "totalTracks" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "album_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "song" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "lyrics" TEXT NOT NULL,
    "duration" INTEGER,
    "trackNumber" INTEGER,
    "albumId" TEXT,
    "releaseDate" DATETIME,
    "language" TEXT,
    "isExplicit" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "lyricsSource" TEXT,
    "lyricsVerified" BOOLEAN NOT NULL DEFAULT false,
    "lyricsVerifiedBy" TEXT,
    "lyricsVerifiedAt" DATETIME,
    "spotifyUrl" TEXT,
    "youtubeUrl" TEXT,
    "appleMusicUrl" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "song_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "song_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "album" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "song_artist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "songId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PERFORMER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "song_artist_songId_fkey" FOREIGN KEY ("songId") REFERENCES "song" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "song_artist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "album_artist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "albumId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PRIMARY',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "album_artist_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "album" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "album_artist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "song_genre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "songId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "song_genre_songId_fkey" FOREIGN KEY ("songId") REFERENCES "song" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "song_genre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "album_genre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "albumId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "album_genre_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "album" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "album_genre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "song_collaborator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "songId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "song_collaborator_songId_fkey" FOREIGN KEY ("songId") REFERENCES "song" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "song_collaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "user_favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_favorite_songId_fkey" FOREIGN KEY ("songId") REFERENCES "song" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_follows_artist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "user_follows_artist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_follows_artist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "song_rating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "song_rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "song_rating_songId_fkey" FOREIGN KEY ("songId") REFERENCES "song" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "song_comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "song_comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "song_comment_songId_fkey" FOREIGN KEY ("songId") REFERENCES "song" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "song_comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "song_comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_createdAt_idx" ON "user"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "artist_slug_key" ON "artist"("slug");

-- CreateIndex
CREATE INDEX "artist_name_idx" ON "artist"("name");

-- CreateIndex
CREATE INDEX "artist_slug_idx" ON "artist"("slug");

-- CreateIndex
CREATE INDEX "artist_createdAt_idx" ON "artist"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "genre_name_key" ON "genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genre_slug_key" ON "genre"("slug");

-- CreateIndex
CREATE INDEX "genre_name_idx" ON "genre"("name");

-- CreateIndex
CREATE INDEX "genre_slug_idx" ON "genre"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "album_slug_key" ON "album"("slug");

-- CreateIndex
CREATE INDEX "album_title_idx" ON "album"("title");

-- CreateIndex
CREATE INDEX "album_slug_idx" ON "album"("slug");

-- CreateIndex
CREATE INDEX "album_releaseDate_idx" ON "album"("releaseDate");

-- CreateIndex
CREATE INDEX "album_createdAt_idx" ON "album"("createdAt");

-- CreateIndex
CREATE INDEX "album_albumType_idx" ON "album"("albumType");

-- CreateIndex
CREATE UNIQUE INDEX "song_slug_key" ON "song"("slug");

-- CreateIndex
CREATE INDEX "song_title_idx" ON "song"("title");

-- CreateIndex
CREATE INDEX "song_slug_idx" ON "song"("slug");

-- CreateIndex
CREATE INDEX "song_albumId_idx" ON "song"("albumId");

-- CreateIndex
CREATE INDEX "song_createdBy_idx" ON "song"("createdBy");

-- CreateIndex
CREATE INDEX "song_isPublished_idx" ON "song"("isPublished");

-- CreateIndex
CREATE INDEX "song_releaseDate_idx" ON "song"("releaseDate");

-- CreateIndex
CREATE INDEX "song_language_idx" ON "song"("language");

-- CreateIndex
CREATE INDEX "song_createdAt_idx" ON "song"("createdAt");

-- CreateIndex
CREATE INDEX "song_viewCount_idx" ON "song"("viewCount");

-- CreateIndex
CREATE INDEX "song_favoriteCount_idx" ON "song"("favoriteCount");

-- CreateIndex
CREATE INDEX "song_artist_songId_idx" ON "song_artist"("songId");

-- CreateIndex
CREATE INDEX "song_artist_artistId_idx" ON "song_artist"("artistId");

-- CreateIndex
CREATE INDEX "song_artist_role_idx" ON "song_artist"("role");

-- CreateIndex
CREATE UNIQUE INDEX "song_artist_songId_artistId_role_key" ON "song_artist"("songId", "artistId", "role");

-- CreateIndex
CREATE INDEX "album_artist_albumId_idx" ON "album_artist"("albumId");

-- CreateIndex
CREATE INDEX "album_artist_artistId_idx" ON "album_artist"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "album_artist_albumId_artistId_role_key" ON "album_artist"("albumId", "artistId", "role");

-- CreateIndex
CREATE INDEX "song_genre_songId_idx" ON "song_genre"("songId");

-- CreateIndex
CREATE INDEX "song_genre_genreId_idx" ON "song_genre"("genreId");

-- CreateIndex
CREATE UNIQUE INDEX "song_genre_songId_genreId_key" ON "song_genre"("songId", "genreId");

-- CreateIndex
CREATE INDEX "album_genre_albumId_idx" ON "album_genre"("albumId");

-- CreateIndex
CREATE INDEX "album_genre_genreId_idx" ON "album_genre"("genreId");

-- CreateIndex
CREATE UNIQUE INDEX "album_genre_albumId_genreId_key" ON "album_genre"("albumId", "genreId");

-- CreateIndex
CREATE INDEX "song_collaborator_songId_idx" ON "song_collaborator"("songId");

-- CreateIndex
CREATE INDEX "song_collaborator_userId_idx" ON "song_collaborator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "song_collaborator_songId_userId_key" ON "song_collaborator"("songId", "userId");

-- CreateIndex
CREATE INDEX "user_favorite_userId_idx" ON "user_favorite"("userId");

-- CreateIndex
CREATE INDEX "user_favorite_songId_idx" ON "user_favorite"("songId");

-- CreateIndex
CREATE INDEX "user_favorite_createdAt_idx" ON "user_favorite"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorite_userId_songId_key" ON "user_favorite"("userId", "songId");

-- CreateIndex
CREATE INDEX "user_follows_artist_userId_idx" ON "user_follows_artist"("userId");

-- CreateIndex
CREATE INDEX "user_follows_artist_artistId_idx" ON "user_follows_artist"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "user_follows_artist_userId_artistId_key" ON "user_follows_artist"("userId", "artistId");

-- CreateIndex
CREATE INDEX "song_rating_userId_idx" ON "song_rating"("userId");

-- CreateIndex
CREATE INDEX "song_rating_songId_idx" ON "song_rating"("songId");

-- CreateIndex
CREATE UNIQUE INDEX "song_rating_userId_songId_key" ON "song_rating"("userId", "songId");

-- CreateIndex
CREATE INDEX "song_comment_userId_idx" ON "song_comment"("userId");

-- CreateIndex
CREATE INDEX "song_comment_songId_idx" ON "song_comment"("songId");

-- CreateIndex
CREATE INDEX "song_comment_parentId_idx" ON "song_comment"("parentId");

-- CreateIndex
CREATE INDEX "song_comment_createdAt_idx" ON "song_comment"("createdAt");

-- CreateIndex
CREATE INDEX "song_comment_isHidden_idx" ON "song_comment"("isHidden");
