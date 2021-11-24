import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import "reflect-metadata";
import createConnection from "./database";

import { AppError } from "./errors/AppErrors";
import * as routes from "./routes/index";

// cria a conexão com o DB
createConnection();

// Inicia uma aplicação express
const app = express();

// configurações do servidor
app.use(cors());
app.use(express.json());
app.use(routes.routerClient, routes.routerAddress);

// tratamento de exceções
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ Message: error.message });
  }

  return res.status(500).json({ Message: error.message });
});

// Inicia o servidor da api na porta 2222
app.listen(2222, () => console.log("Servidor Rodando!"));
