import { Router } from "express";

import { EventContractController } from "../controllers/EventContractController";

// criando roteador
export const routerEventContract = Router();

// instanciando o eventContractController
const eventContractController = new EventContractController();

// rota de listagem de eventos de um contratos
routerEventContract.get(
  "/api/v1/contrato/:contrato_id/historico",
  eventContractController.findByContractId
);
