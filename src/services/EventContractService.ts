import { getCustomRepository, Repository } from "typeorm";
import * as Yup from "yup";

import { Messages, StatusCode } from "../utils";
import { AppError } from "../errors/AppErrors";
import { EventContract } from "../models/EventContract";
import { EventContractRepository } from "../repositories/EventContractRepository";
import { EventContractDTO } from "../models/DTOs/EventContractDTO";
import { ContractService } from "./ContractService";

interface IEventContract {
  contrato_id: string;
  estado_anterior: string;
  estado_posterior: string;
}

export class EventContractService {
  // Criando um atributo para armazenar o repositório de evento de contrato
  private eventContractRepository: Repository<EventContract>;

  constructor() {
    // Atribuindo o repositório para a variável
    this.eventContractRepository = getCustomRepository(EventContractRepository);
  }

  async create({
    contrato_id,
    estado_anterior,
    estado_posterior,
  }: IEventContract) {
    // validação dos dados
    const schema = Yup.object().shape({
      contrato_id: Yup.string().required(Messages.REQUIRED_FIELD),
      estado_anterior: Yup.string().required(Messages.REQUIRED_FIELD),
      estado_posterior: Yup.string().required(Messages.REQUIRED_FIELD),
    });

    try {
      await schema.validate({
        contrato_id,
        estado_anterior,
        estado_posterior,
      });
    } catch (error) {
      throw new AppError(error.message, StatusCode.BAD_REQUEST);
    }

    const contractStates = ["Em vigor", "Desativado Temporario", "Cancelado"];

    if (!contractStates.includes(estado_posterior)) {
      throw new AppError(
        Messages.CONTRACT_STATE_NOT_EXISTS,
        StatusCode.BAD_REQUEST
      );
    }

    const contractService = new ContractService();

    const contract = await contractService.findById(contrato_id);

    if (!contract) {
      throw new AppError(Messages.CONTRACT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // Utilizando o repositório
    const eventContractRepository = this.eventContractRepository;

    // Criando o objeto evento de contrato
    const eventContract = eventContractRepository.create({
      contrato_id,
      estado_anterior,
      estado_posterior,
    });

    // Salvando o evento de contrato
    await eventContractRepository.save(eventContract);

    // Retornando o evento de contrato criado
    return EventContractDTO.convertEventContractToDTO(eventContract);
  }

  async findByContractId(contrato_id: string) {
    // validação dos dados
    const schema = Yup.object().shape({
      contrato_id: Yup.string().required(Messages.REQUIRED_FIELD),
    });

    try {
      await schema.validate({
        contrato_id,
      });
    } catch (error) {
      throw new AppError(error.message, StatusCode.BAD_REQUEST);
    }

    // Utilizando o repositório
    const eventContractRepository = this.eventContractRepository;

    // Pesquisando os eventos de contrato pelo id do contrato
    const eventContracts = await eventContractRepository.find({
      where: { contrato_id },
      order: {
        data_criacao: "ASC",
      },
    });

    // Verificando se encontrou algo
    if (eventContracts.length === 0) {
      throw new AppError(
        Messages.EVENT_CONTRACT_NOT_FOUND,
        StatusCode.BAD_REQUEST
      );
    }

    // filtrando os dados dos eventos do contrato
    const eventContractsDTO = eventContracts.map((eventoContract) => {
      return EventContractDTO.convertEventContractToDTO(eventoContract);
    });

    // Retornando os eventos de contratos encontrados
    return eventContractsDTO;
  }
}
