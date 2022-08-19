-- CreateTable
CREATE TABLE "Menu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL DEFAULT '#',
    "parrentMenuId" INTEGER,
    CONSTRAINT "Menu_parrentMenuId_fkey" FOREIGN KEY ("parrentMenuId") REFERENCES "Menu" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
