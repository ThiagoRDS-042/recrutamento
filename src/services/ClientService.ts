import { getCustomRepository, Like, Repository } from "typeorm";
import * as Yup from "yup";

import { Messages, StatusCode } from "../utils";
import { AppError } from "../errors/AppErrors";
import { Client } from "../models/Client";
import { ClientRepository } from "../repositories/ClientRepository";
import { ClientDTO } from "../models/DTOs/ClientDTO";

const clientTypes = ["juridico", "fisico", "especial"];

export class ClientService {
  private clientRepository: Repository<Client>;

  constructor() {
    this.clientRepository = getCustomRepository(ClientRepository);
  }

  async create(nome: string, tipo: string) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(Messages.REQUIRED_FIELD),
      tipo: Yup.string().required(Messages.REQUIRED_FIELD),
    });

    try {
      await schema.validate({
        nome,
        tipo,
      });
    } catch (error) {
      throw new AppError(error.message, StatusCode.BAD_REQUEST);
    }

    if (!clientTypes.includes(tipo)) {
      throw new AppError(
        Messages.CLIENT_TYPE_NOT_EXISTS,
        StatusCode.BAD_REQUEST
      );
    }

    const clientRepository = this.clientRepository;

    const clientAlreadyExists = await clientRepository.findOne({
      nome,
    });

    if (clientAlreadyExists) {
      if (clientAlreadyExists.data_remocao === null) {
        throw new AppError(
          Messages.CLIENT_ALREADY_EXISTS,
          StatusCode.BAD_REQUEST
        );
      } else {
        await clientRepository.update(clientAlreadyExists.id, {
          data_remocao: null,
        });

        return ClientDTO.convertClientToDTO(clientAlreadyExists);
      }
    }

    const client = clientRepository.create({
      nome,
      tipo,
    });

    await clientRepository.save(client);

    return ClientDTO.convertClientToDTO(client);
  }

  async update(id: string, nome: string, tipo: string) {
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

    const clientRepository = this.clientRepository;

    const clientExists = await clientRepository.findOne({ id });

    if (!clientExists) {
      throw new AppError(Messages.CLIENT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    if (!clientTypes.includes(tipo)) {
      throw new AppError(
        Messages.CLIENT_TYPE_NOT_EXISTS,
        StatusCode.BAD_REQUEST
      );
    }

    if (nome && nome !== clientExists.nome) {
      const clientAlreadyExists = await clientRepository.findOne({ nome });

      if (clientAlreadyExists) {
        throw new AppError(
          Messages.CLIENT_ALREADY_EXISTS,
          StatusCode.BAD_REQUEST
        );
      }
    }

    await clientRepository.update(id, {
      nome: nome || clientExists.nome,
      tipo: tipo || clientExists.tipo,
    });

    Object.assign(clientExists, {
      nome: nome || clientExists.nome,
      tipo: tipo || clientExists.tipo,
    });

    return ClientDTO.convertClientToDTO(clientExists);
  }

  async findById(id: string) {
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

    const clientRepository = this.clientRepository;

    const clientExists = await clientRepository.findOne({ id });

    if (!clientExists) {
      throw new AppError(Messages.CLIENT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    return ClientDTO.convertClientToDTO(clientExists);
  }

  async delete(id: string) {
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

    const clientRepository = this.clientRepository;

    const clientExists = await clientRepository.findOne({
      id,
      data_remocao: null,
    });

    console.log(clientExists);

    if (!clientExists) {
      throw new AppError(Messages.CLIENT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    await clientRepository.update(id, {
      data_remocao: new Date(),
    });
  }

  async find(nome: string, tipo: string) {
    const clientRepository = this.clientRepository;

    let clients: Client[];

    if (tipo) {
      if (!clientTypes.includes(tipo)) {
        throw new AppError(
          Messages.CLIENT_TYPE_NOT_EXISTS,
          StatusCode.BAD_REQUEST
        );
      }

      if (nome) {
        clients = await clientRepository.find({
          data_remocao: null,
          tipo,
          nome: Like(`%${nome}%`),
        });
      } else {
        clients = await clientRepository.find({
          data_remocao: null,
          tipo,
        });
      }
    } else if (nome) {
      clients = await clientRepository.find({
        data_remocao: null,
        nome: Like(`%${nome}%`),
      });
    } else {
      clients = await clientRepository.find({
        data_remocao: null,
      });
    }

    if (clients.length === 0) {
      throw new AppError(Messages.CLIENT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    const clientsDTO = clients.map((client) => {
      return ClientDTO.convertClientToDTO(client);
    });

    return clientsDTO;
  }
}
