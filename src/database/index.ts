import { createConnection, getConnectionOptions } from "typeorm";

// criando a conexão com o DB
export default async () => {
  // Pegando os dados pra a conexão do DB
  const defaultOptions = await getConnectionOptions();

  // Criando a conexão com o DB padrão do postgres (postgres)
  const connection = await createConnection();
  // Sobrescrevendo o valor do nome do DB
  process.env.DB_NAME = "recrutamento";
  // Criando o DB recrutamento
  await connection
    .createQueryRunner()
    .createDatabase(process.env.DB_NAME, true);
  // Fechando a conexão antiga (postgres)
  await connection.close();

  // Criando a conexão dom o DB criado (recrutamento)
  return createConnection(
    Object.assign(defaultOptions, {
      database: process.env.DB_NAME,
    })
  );
};
