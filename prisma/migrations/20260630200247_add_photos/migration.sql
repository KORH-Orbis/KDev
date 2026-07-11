-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "repairOrderId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Photo_repairOrderId_idx" ON "Photo"("repairOrderId");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_repairOrderId_fkey" FOREIGN KEY ("repairOrderId") REFERENCES "RepairOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
