-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "password" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workTime" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "start" BIGINT NOT NULL,
    "finish" BIGINT NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "dinnerHour" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isFestive" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "messageId" BIGINT NOT NULL,

    CONSTRAINT "workTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_userId_key" ON "user"("userId");

-- AddForeignKey
ALTER TABLE "workTime" ADD CONSTRAINT "workTime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
