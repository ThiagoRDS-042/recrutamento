import { Router } from "express";

import { AddressController } from "../controllers/AddressController";

// criando roteador
export const routerAddress = Router();

// instanciando o addressController
const addressController = new AddressController();

// rota de cadastro de endereços
routerAddress.post("/api/v1/enderecos", addressController.create);

// rota de edição de endereços
routerAddress.put("/api/v1/endereco/:id", addressController.update);

// rota de pesquisa de endereços a partir do id
routerAddress.get("/api/v1/endereco/:id", addressController.findById);

// rota de exclusão de endereços
routerAddress.delete("/api/v1/endereco/:id", addressController.delete);

// rota de listagem de endereços
routerAddress.get("/api/v1/enderecos", addressController.find);
