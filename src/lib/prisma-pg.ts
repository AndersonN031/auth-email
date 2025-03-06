// Utilizando um adaptador para o serveless:
// 1 - O nosso postgress é Serveless, ou seja, vai desligar e ligar
// 2 - Isso não pode acontecer, de ficar abrindo conexão e fechando conexão
// 3 - Então utilizamos esse adaptador para que o projeto Serveless rode de forma fluida, sem problemas de time-out, conexão que não abre no tempo suficiente ou até mesmo muitas conexões ao mesmo tempo que chega a dar um limite de conexão


import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

export function PrismaGetInscante() {
    const pool = new Pool({connectionString: process.env.POSTGRES_PRISMA_URL})
    const adapter = new PrismaNeon(pool);
    const prisma = new PrismaClient({adapter});

    return prisma
}
