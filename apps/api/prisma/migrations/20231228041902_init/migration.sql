-- CreateTable
CREATE TABLE "Fatura" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "clientNumber" TEXT NOT NULL,
    "referenceMonth" TEXT NOT NULL,
    "referenceYear" TEXT NOT NULL,
    "eletric_energy_amount" DOUBLE PRECISION NOT NULL,
    "eletric_energy_value" DOUBLE PRECISION NOT NULL,
    "sceee_energy_amount" DOUBLE PRECISION NOT NULL,
    "sceee_energy_value" DOUBLE PRECISION NOT NULL,
    "compensated_energy_amount" DOUBLE PRECISION NOT NULL,
    "compensated_energy_value" DOUBLE PRECISION NOT NULL,
    "public_ilumination_contrib" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fatura_pkey" PRIMARY KEY ("id")
);
