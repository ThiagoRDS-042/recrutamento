import { Router } from "express";

import { ClientController } from "../controllers/ClientController";

// criando roteador
export const routerClient = Router();

// instanciando o clientController
const clientController = new ClientController();

// rota de cadastro de clientes
routerClient.post("/api/v1/clientes", clientController.create);

// rota de edição de clientes
routerClient.put("/api/v1/cliente/:id", clientController.update);

// rota de pesquisa de clientes a partir do id
routerClient.get("/api/v1/cliente/:id", clientController.findById);

// rota de exclusão de clientes
routerClient.delete("/api/v1/cliente/:id", clientController.delete);

// rota de listagem de clientes
routerClient.get("/api/v1/clientes", clientController.find);
