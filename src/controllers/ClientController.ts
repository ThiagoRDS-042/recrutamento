import { Request, Response } from "express";

import { StatusCode } from "../utils";
import { ClientService } from "../services/ClientService";

export class ClientController {
  async create(req: Request, res: Response) {
    // Capturando os dados do corpo da requisição
    const { nome, tipo } = req.body;

    // Instanciando clientService
    const clientService = new ClientService();

    // Criando um objeto com os dados
    const dados = { nome, tipo };

    // Criando um novo cliente
    const client = await clientService.create(dados);

    // Retornando o Cliente criado junto do status
    return res.status(StatusCode.CREATED).json(client);
  }

  async findById(req: Request, res: Response) {
    // Capturando os dados do path
    const { id } = req.params;

    // Instanciando clientService
    const clientService = new ClientService();

    // Pesquisando um Cliente pelo id
    const client = await clientService.findById(id);

    // Retornando o Cliente pesquisado junto do status
    return res.status(StatusCode.OK).json(client);
  }

  async update(req: Request, res: Response) {
    // Capturando os dados do corpo da requisição
    const { nome, tipo } = req.body;
    // Capturando os dados do path
    const { id } = req.params;

    // Instanciando clientService
    const clientService = new ClientService();

    // Criando um objeto com os dados
    const dados = { id, nome, tipo };

    // Atualizando um Cliente
    const client = await clientService.update(dados);

    // Retornando o Cliente atualizado junto do status
    return res.status(StatusCode.NO_CONTENT).json(client);
  }

  async delete(req: Request, res: Response) {
    // Capturando os dados do path
    const { id } = req.params;

    // Instanciando clientService
    const clientService = new ClientService();

    // Deletando um Cliente
    await clientService.delete(id);

    // Retornando o status
    return res.status(StatusCode.NO_CONTENT).json();
  }

  async find(req: Request, res: Response) {
    // Capturando os dados do query
    const { nome, tipo } = req.query;

    // Instanciando clientService
    const clientService = new ClientService();

    // Criando um objeto com os dados, obs: (as string) pra garantir que o valor recebido é uma string e p TS não apontar como erro
    const dados = { nome: nome as string, tipo: tipo as string };

    // Pesquisando Clientes
    const clients = await clientService.find(dados);

    // Retornando os Clientes atualizados junto do status
    return res.status(StatusCode.OK).json({ dados: clients });
  }
}
