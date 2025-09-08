-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "bio" TEXT,
    "avatar" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT NOT NULL
);
INSERT INTO "new_user" ("avatar", "bio", "createdAt", "createdBy", "email", "emailVerified", "emailVerifiedAt", "firstName", "id", "isPublic", "lastName", "password", "updatedAt", "updatedBy") SELECT "avatar", "bio", "createdAt", "createdBy", "email", "emailVerified", "emailVerifiedAt", "firstName", "id", "isPublic", "lastName", "password", "updatedAt", "updatedBy" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE INDEX "user_email_idx" ON "user"("email");
CREATE INDEX "user_createdAt_idx" ON "user"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
