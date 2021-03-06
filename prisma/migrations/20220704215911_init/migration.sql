-- CreateTable
CREATE TABLE "Note" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" STRING NOT NULL,
    "content" STRING,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);
