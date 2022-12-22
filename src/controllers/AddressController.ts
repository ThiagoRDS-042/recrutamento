import { Request, Response } from "express";

import { StatusCode } from "../utils";
import { AddressService } from "../services/AddressService";

export class AddressController {
  async create(req: Request, res: Response) {
    // Capturando os dados do corpo da requisição
    const { logradouro, bairro, numero } = req.body;

    // Instanciando addressService
    const addressService = new AddressService();

    // Criando um objeto com os dados
    const dados = { logradouro, bairro, numero };

    // Criando um novo endereço
    const address = await addressService.create(dados);

    // Retornando o endereço criado junto do status
    return res.status(StatusCode.CREATED).json(address);
  }

  async findById(req: Request, res: Response) {
    // Capturando os dados do path
    const { id } = req.params;

    // Instanciando addressService
    const addressService = new AddressService();

    // Pesquisando um endereço pelo id
    const address = await addressService.findById(id);

    // Retornando o Cliente pesquisado junto do status
    return res.status(StatusCode.OK).json(address);
  }

  async update(req: Request, res: Response) {
    // Capturando os dados do corpo da requisição
    const { logradouro, bairro, numero } = req.body;
    // Capturando os dados do path
    const { id } = req.params;

    // Instanciando addressService
    const addressService = new AddressService();

    // Criando um objeto com os dados
    const dados = { id, logradouro, bairro, numero };

    // Atualizando um endereço
    const address = await addressService.update(dados);

    // Retornando o endereço atualizado junto do status
    return res.status(StatusCode.NO_CONTENT).json(address);
  }

  async delete(req: Request, res: Response) {
    // Capturando os dados do path
    const { id } = req.params;

    // Instanciando addressService
    const addressService = new AddressService();

    // Deletando um endereço
    await addressService.delete(id);

    // Retornando o status
    return res.status(StatusCode.NO_CONTENT).json();
  }

  async find(req: Request, res: Response) {
    // Capturando os dados do query
    const { logradouro, bairro, numero } = req.query;

    // Instanciando addressService
    const addressService = new AddressService();

    // Criando um objeto com os dados, obs: (as string) pra garantir que o valor recebido é uma string e p TS não apontar como erro
    const dados = {
      logradouro: logradouro as string,
      bairro: bairro as string,
      numero: Number(numero),
    };

    // Pesquisando endereços
    const addresses = await addressService.find(dados);

    // Retornando os endereços pesquisados junto do status
    return res.status(StatusCode.OK).json({ dados: addresses });
  }
}
