-- DropForeignKey
ALTER TABLE "Alerta" DROP CONSTRAINT "Alerta_childId_fkey";

-- DropForeignKey
ALTER TABLE "AssistenciaSocial" DROP CONSTRAINT "AssistenciaSocial_childId_fkey";

-- DropForeignKey
ALTER TABLE "Educacao" DROP CONSTRAINT "Educacao_childId_fkey";

-- DropForeignKey
ALTER TABLE "Saude" DROP CONSTRAINT "Saude_childId_fkey";

-- CreateTable
CREATE TABLE "Historico" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Historico_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Saude" ADD CONSTRAINT "Saude_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Educacao" ADD CONSTRAINT "Educacao_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistenciaSocial" ADD CONSTRAINT "AssistenciaSocial_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
