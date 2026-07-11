-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TECHNICIAN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('RECEIVED', 'DIAGNOSING', 'BUDGETED', 'APPROVED', 'REPAIRING', 'REPAIRED', 'DELIVERED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('PC', 'LAPTOP', 'PHONE', 'TABLET', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'TECHNICIAN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT,
    "trackingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairOrder" (
    "id" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "deviceType" "DeviceType" NOT NULL,
    "deviceBrand" TEXT,
    "deviceModel" TEXT,
    "deviceSerial" TEXT,
    "issue" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'RECEIVED',
    "budgetAmount" DECIMAL(12,2),
    "budgetStatus" TEXT,
    "technicianId" INTEGER,
    "guaranteeDays" INTEGER NOT NULL DEFAULT 10,
    "notes" TEXT,
    "completedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_trackingId_key" ON "Client"("trackingId");

-- CreateIndex
CREATE UNIQUE INDEX "RepairOrder_trackingCode_key" ON "RepairOrder"("trackingCode");

-- CreateIndex
CREATE INDEX "RepairOrder_clientId_idx" ON "RepairOrder"("clientId");

-- CreateIndex
CREATE INDEX "RepairOrder_technicianId_idx" ON "RepairOrder"("technicianId");

-- CreateIndex
CREATE INDEX "RepairOrder_status_idx" ON "RepairOrder"("status");

-- AddForeignKey
ALTER TABLE "RepairOrder" ADD CONSTRAINT "RepairOrder_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairOrder" ADD CONSTRAINT "RepairOrder_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
