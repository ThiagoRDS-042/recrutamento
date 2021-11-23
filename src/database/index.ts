import { createConnection, getConnectionOptions } from "typeorm";

// criando a conexão com o DB
export default async () => {
  const defaultOptions = await getConnectionOptions();

  const connection = await createConnection();
  process.env.DB_NAME = "recrutamento";
  await connection
    .createQueryRunner()
    .createDatabase(process.env.DB_NAME, true);
  await connection.close();

  return createConnection(
    Object.assign(defaultOptions, {
      database: process.env.DB_NAME,
    })
  );
};
