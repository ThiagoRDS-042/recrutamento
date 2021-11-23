import { Router } from "express";

import { ClientController } from "../controllers/ClientController";

export const routerClient = Router();

const clientController = new ClientController();

routerClient.post("/api/v1/clientes", clientController.create);

routerClient.put("/api/v1/cliente/:id", clientController.update);

routerClient.get("/api/v1/cliente/:id", clientController.findById);

routerClient.delete("/api/v1/cliente/:id", clientController.delete);

routerClient.get("/api/v1/clientes", clientController.find);
