-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "bairro" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "revisado" BOOLEAN NOT NULL DEFAULT false,
    "revisado_por" TEXT,
    "revisado_em" TIMESTAMP(3),

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saude" (
    "id" SERIAL NOT NULL,
    "childId" TEXT NOT NULL,
    "ultima_consulta" TIMESTAMP(3) NOT NULL,
    "vacinas_em_dia" BOOLEAN NOT NULL,

    CONSTRAINT "Saude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Educacao" (
    "id" SERIAL NOT NULL,
    "childId" TEXT NOT NULL,
    "escola" TEXT,
    "frequencia_percent" INTEGER,

    CONSTRAINT "Educacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssistenciaSocial" (
    "id" SERIAL NOT NULL,
    "childId" TEXT NOT NULL,
    "cad_unico" BOOLEAN NOT NULL,
    "beneficio_ativo" BOOLEAN NOT NULL,

    CONSTRAINT "AssistenciaSocial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alerta" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "childId" TEXT NOT NULL,

    CONSTRAINT "Alerta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Saude_childId_key" ON "Saude"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "Educacao_childId_key" ON "Educacao"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "AssistenciaSocial_childId_key" ON "AssistenciaSocial"("childId");

-- AddForeignKey
ALTER TABLE "Saude" ADD CONSTRAINT "Saude_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Educacao" ADD CONSTRAINT "Educacao_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistenciaSocial" ADD CONSTRAINT "AssistenciaSocial_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
