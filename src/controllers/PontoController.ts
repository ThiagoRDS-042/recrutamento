import { Request, Response } from "express";

import { StatusCode } from "../utils";
import { PontoService } from "../services/PontoService";

export class PontoController {
  async create(req: Request, res: Response) {
    // Capturando os dados do corpo da requisição
    const { cliente_id, endereco_id } = req.body;

    // Instanciando pontoService
    const pontoService = new PontoService();

    // Criando um objeto com os dados
    const dados = { cliente_id, endereco_id };

    // Criando um novo ponto
    const ponto = await pontoService.create(dados);

    // Retornando o ponto criado junto do status
    return res.status(StatusCode.CREATED).json(ponto);
  }

  async delete(req: Request, res: Response) {
    // Capturando os dados do path
    const { id } = req.params;

    // Instanciando pontoService
    const pontoService = new PontoService();

    // Deletando um ponto
    await pontoService.delete(id);

    // Retornando o status
    return res.status(StatusCode.NO_CONTENT).json();
  }

  async find(req: Request, res: Response) {
    // Capturando os dados do query
    const { cliente_id, endereco_id } = req.query;

    // Instanciando pontoService
    const pontoService = new PontoService();

    // Criando um objeto com os dados, obs: (as string) pra garantir que o valor recebido é uma string e p TS não apontar como erro
    const dados = {
      cliente_id: cliente_id as string,
      endereco_id: endereco_id as string,
    };

    // Pesquisando pontos
    const pontos = await pontoService.find(dados);

    // Retornando os pontos pesquisados junto do status
    return res.status(StatusCode.OK).json({ dados: pontos });
  }
}
