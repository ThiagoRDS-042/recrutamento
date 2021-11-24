import { Router } from "express";

import { PontoController } from "../controllers/PontoController";

// criando roteador
export const routerPonto = Router();

// instanciando o pontoController
const pontoController = new PontoController();

// rota de cadastro de pontos
routerPonto.post("/api/v1/pontos", pontoController.create);

// rota de exclusão de pontos
routerPonto.delete("/api/v1/ponto/:id", pontoController.delete);

// rota de listagem de pontos
routerPonto.get("/api/v1/pontos", pontoController.find);
