-- CreateTable
CREATE TABLE "WordProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "deck" TEXT NOT NULL,
    "box" INTEGER NOT NULL DEFAULT 0,
    "dueAt" DATETIME NOT NULL,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "wrongCount" INTEGER NOT NULL DEFAULT 0,
    "lastAnsweredAt" DATETIME NOT NULL,
    "learnedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WordProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WordAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "deck" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "given" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WordAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "accountType" TEXT NOT NULL DEFAULT 'STUDENT_SELF',
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentAge" INTEGER,
    "parentContact" TEXT,
    "consentPersonalData" BOOLEAN NOT NULL DEFAULT false,
    "isPersonalStudent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("accountType", "consentPersonalData", "createdAt", "email", "id", "name", "parentContact", "passwordHash", "phone", "role", "studentAge", "studentName", "updatedAt") SELECT "accountType", "consentPersonalData", "createdAt", "email", "id", "name", "parentContact", "passwordHash", "phone", "role", "studentAge", "studentName", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "WordProgress_userId_deck_dueAt_idx" ON "WordProgress"("userId", "deck", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "WordProgress_userId_cardId_key" ON "WordProgress"("userId", "cardId");

-- CreateIndex
CREATE INDEX "WordAnswer_userId_createdAt_idx" ON "WordAnswer"("userId", "createdAt");
