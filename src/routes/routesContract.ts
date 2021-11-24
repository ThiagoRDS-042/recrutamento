import { Router } from "express";

import { ContractController } from "../controllers/ContractController";

// criando roteador
export const routerContract = Router();

// instanciando o contractController
const contractController = new ContractController();

// rota de cadastro de contratos
routerContract.post("/api/v1/contratos", contractController.create);

// rota de edição de contratos
routerContract.put("/api/v1/contrato/:id", contractController.update);

// rota de pesquisa de contratos a partir do id
routerContract.get("/api/v1/contrato/:id", contractController.findById);

// rota de exclusão de contratos
routerContract.delete("/api/v1/contrato/:id", contractController.delete);

// rota de listagem de contratos
routerContract.get("/api/v1/contratos", contractController.find);
