import { getCustomRepository, IsNull, Not, Repository } from "typeorm";
import * as Yup from "yup";

import { Messages, StatusCode } from "../utils";
import { AppError } from "../errors/AppErrors";
import { PontoService } from "./PontoService";
import { Contract } from "../models/Contract";
import { ContractRepository } from "../repositories/ContractRepository";
import { ContractDTO } from "../models/DTOs/ContractDTO";

const contractStates = ["Em vigor", "Desativado Temporario", "Cancelado"];

export class ContractService {
  // Criando um atributo para armazenar o repositório de contrato
  private contractRepository: Repository<Contract>;

  constructor() {
    // Atribuindo o repositório para a variável
    this.contractRepository = getCustomRepository(ContractRepository);
  }

  async create(ponto_id: string) {
    // validação dos dados
    const schema = Yup.object().shape({
      ponto_id: Yup.string().required(Messages.REQUIRED_FIELD),
    });

    try {
      await schema.validate({
        ponto_id,
      });
    } catch (error) {
      throw new AppError(error.message, StatusCode.BAD_REQUEST);
    }

    const pontoService = new PontoService();

    const pontoExists = await pontoService.findById(ponto_id);

    if (!pontoExists) {
      throw new AppError(Messages.PONTO_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // Utilizando o repositório
    const contractRepository = this.contractRepository;

    // Pesquisando um endereço pelo id do ponto
    const contractAlreadyExists = await contractRepository.findOne({
      ponto_id,
    });

    const estado = contractStates[0];

    // Validando se já não existe um contrato
    if (contractAlreadyExists) {
      // Se encontrar um contrato com esses dados e este estiver ativo solta um exceção, caso não esteja ativo, ativa o contrato
      if (contractAlreadyExists.data_remocao === null) {
        throw new AppError(
          Messages.CONTRACT_ALREADY_EXISTS,
          StatusCode.BAD_REQUEST
        );
      } else {
        await contractRepository.update(contractAlreadyExists.id, {
          data_remocao: null,
          estado,
        });

        // Retorna o contrato ativado
        return ContractDTO.convertPontoToDTO(contractAlreadyExists);
      }
    }

    // Criando o objeto contrato
    const contract = contractRepository.create({ ponto_id, estado });

    // Salvando o contrato
    await contractRepository.save(contract);

    // Retornando o contrato criado
    return ContractDTO.convertPontoToDTO(contract);
  }

  async findById(id: string) {
    // validação dos dados
    const schema = Yup.object().shape({
      id: Yup.string().required(Messages.REQUIRED_FIELD),
    });

    try {
      await schema.validate({
        id,
      });
    } catch (error) {
      throw new AppError(error.message, StatusCode.BAD_REQUEST);
    }

    // Utilizando o repositório
    const contractRepository = this.contractRepository;

    // Pesquisando um contrato pelo id e com data de remoção nula
    const contractExists = await contractRepository.find({
      select: ["id"],
      where: {
        data_remocao: null,
        id,
      },
      relations: ["ponto", "ponto.endereco", "ponto.cliente"],
    });

    // Verificando se encontrou algo
    if (contractExists.length === 0) {
      throw new AppError(Messages.CONTRACT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    const contract = contractExists.map((contract) => {
      return {
        id: contract.id,
        cliente_id: contract.ponto.cliente.id,
        cliente_nome: contract.ponto.cliente.nome,
        cliente_tipo: contract.ponto.cliente.tipo,
        endereco_id: contract.ponto.endereco.id,
        endereco_logradouro: contract.ponto.endereco.logradouro,
        endereco_bairro: contract.ponto.endereco.bairro,
        endereco_numero: contract.ponto.endereco.numero,
      };
    })[0];

    // Retornando o contrato encontrado
    return contract;
  }

  async update(id: string, estado: string) {
    // validação dos dados
    const schema = Yup.object().shape({
      id: Yup.string().required(Messages.REQUIRED_FIELD),
      estado: Yup.string().required(Messages.REQUIRED_FIELD),
    });

    try {
      await schema.validate({
        id,
        estado,
      });
    } catch (error) {
      throw new AppError(error.message, StatusCode.BAD_REQUEST);
    }

    if (!contractStates.includes(estado)) {
      throw new AppError(
        Messages.CONTRACT_STATE_NOT_EXISTS,
        StatusCode.BAD_REQUEST
      );
    }

    // Utilizando o repositório
    const contractRepository = this.contractRepository;

    // Pesquisando um contrato pelo id
    const contractExists = await contractRepository.findOne({
      id,
      data_remocao: null,
    });

    // Validando se existe um contrato com o id informado e data de remoção nula
    if (!contractExists) {
      throw new AppError(Messages.CONTRACT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    if (contractExists.estado === contractStates[2]) {
      throw new AppError(Messages.UNAUTHORIZED, StatusCode.BAD_REQUEST);
    } else if (
      contractExists.estado === contractStates[0] &&
      estado === contractStates[2]
    ) {
      throw new AppError(Messages.UNAUTHORIZED, StatusCode.BAD_REQUEST);
    }

    // Atualizando o contrato com o novo estado
    await contractRepository.update(id, { estado });

    // Atualizando o objeto contractExists
    Object.assign(contractExists, { estado });

    // Retornando o contrato com o estado atualizado
    return ContractDTO.convertPontoToDTO(contractExists);
  }

  async delete(id: string) {
    // validação dos dados
    const schema = Yup.object().shape({
      id: Yup.string().required(Messages.REQUIRED_FIELD),
    });

    try {
      await schema.validate({
        id,
      });
    } catch (error) {
      throw new AppError(error.message, StatusCode.BAD_REQUEST);
    }

    // Utilizando o repositório
    const contractRepository = this.contractRepository;

    // Pesquisando um contrato pelo id e com data de remoção nula
    const contractExists = await contractRepository.findOne({
      id,
      data_remocao: null,
    });

    // Verificando se encontrou algo
    if (!contractExists) {
      throw new AppError(Messages.CONTRACT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // Atualizando o campo de remoção com a data e hora atual
    await contractRepository.update(id, {
      data_remocao: new Date(),
    });
  }

  async deleteByPontoId(ponto_id: string) {
    // validação dos dados
    const schema = Yup.object().shape({
      ponto_id: Yup.string().required(Messages.REQUIRED_FIELD),
    });

    try {
      await schema.validate({
        ponto_id,
      });
    } catch (error) {
      throw new AppError(error.message, StatusCode.BAD_REQUEST);
    }

    // Utilizando o repositório
    const contractRepository = this.contractRepository;

    // Pesquisando um contrato pelo id e com data de remoção nula
    const contractExists = await contractRepository.findOne({
      ponto_id,
      data_remocao: null,
    });

    // Verificando se encontrou algo
    if (!contractExists) {
      throw new AppError(Messages.CONTRACT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // Atualizando o campo de remoção com a data e hora atual
    await contractRepository.update(contractExists.id, {
      data_remocao: new Date(),
    });
  }

  async find(cliente_id: string, endereco_id: string) {
    // Utilizando o repositório
    const contractRepository = this.contractRepository;

    // Pesquisando um contrato pelo id do cliente e endereço e com data de remoção nula
    const contractExists = await contractRepository.find({
      select: ["id"],
      where: {
        data_remocao: null,
        ponto: {
          cliente: { id: cliente_id || Not(IsNull()) },
          endereco: { id: endereco_id || Not(IsNull()) },
        },
      },
      relations: ["ponto", "ponto.endereco", "ponto.cliente"],
    });

    // Verificando se encontrou algo
    if (contractExists.length === 0) {
      throw new AppError(Messages.CONTRACT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    const contracts = contractExists.map((contract) => {
      return {
        id: contract.id,
        cliente_id: contract.ponto.cliente.id,
        cliente_nome: contract.ponto.cliente.nome,
        cliente_tipo: contract.ponto.cliente.tipo,
        endereco_id: contract.ponto.endereco.id,
        endereco_logradouro: contract.ponto.endereco.logradouro,
        endereco_bairro: contract.ponto.endereco.bairro,
        endereco_numero: contract.ponto.endereco.numero,
      };
    });

    // Retornando o contrato encontrado
    return contracts;
  }
}
