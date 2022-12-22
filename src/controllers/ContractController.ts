import { Request, Response } from "express";

import { StatusCode } from "../utils";
import { ContractService } from "../services/ContractService";

export class ContractController {
  async create(req: Request, res: Response) {
    // Capturando os dados do corpo da requisição
    const { ponto_id } = req.body;

    // Instanciando contractService
    const contractService = new ContractService();

    // Criando um novo contrato
    const contract = await contractService.create(ponto_id);

    // Retornando o contrato criado junto do status
    return res.status(StatusCode.CREATED).json(contract);
  }

  async findById(req: Request, res: Response) {
    // Capturando os dados do path
    const { id } = req.params;

    // Instanciando contractService
    const contractService = new ContractService();

    // Pesquisando um Cliente pelo id
    const contract = await contractService.findById(id);

    // Retornando o Cliente pesquisado junto do status
    return res.status(StatusCode.OK).json(contract);
  }

  async update(req: Request, res: Response) {
    // Capturando os dados do corpo da requisição
    const { estado } = req.body;
    // Capturando os dados do path
    const { id } = req.params;

    // Instanciando contractService
    const contractService = new ContractService();

    // Atualizando o estado do contrato
    const contract = await contractService.update(id, estado);

    // Retornando o contrato atualizado junto do status
    return res.status(StatusCode.NO_CONTENT).json(contract);
  }

  async delete(req: Request, res: Response) {
    // Capturando os dados do path
    const { id } = req.params;

    // Instanciando contractService
    const contractService = new ContractService();

    // Deletando um contrato
    await contractService.delete(id);

    // Retornando o status
    return res.status(StatusCode.NO_CONTENT).json();
  }

  async find(req: Request, res: Response) {
    // Capturando os dados do query
    const { cliente_id, endereco_id } = req.query;

    // Instanciando contractService
    const contractService = new ContractService();

    // Pesquisando contratos, obs: (as string) pra garantir que o valor recebido é uma string e p TS não apontar como erro
    const contracts = await contractService.find(
      cliente_id as string,
      endereco_id as string
    );

    // Retornando os contratos pesquisados junto do status
    return res.status(StatusCode.OK).json({ dados: contracts });
  }
}
