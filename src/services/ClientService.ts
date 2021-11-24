import { getCustomRepository, IsNull, Like, Not, Repository } from "typeorm";
import * as Yup from "yup";

import { Messages, StatusCode } from "../utils";
import { AppError } from "../errors/AppErrors";
import { Client } from "../models/Client";
import { ClientRepository } from "../repositories/ClientRepository";
import { ClientDTO } from "../models/DTOs/ClientDTO";

// Criando uma constante para a validação dos tipos de clientes
const clientTypes = ["juridico", "fisico", "especial"];

// Criando uma interface do Cliente
interface IClient {
  id?: string;
  nome: string;
  tipo: string;
}

export class ClientService {
  // Criando um atributo para armazenar o repositório de cliente
  private clientRepository: Repository<Client>;

  constructor() {
    // Atribuindo o repositório para a variável
    this.clientRepository = getCustomRepository(ClientRepository);
  }

  async create({ nome, tipo }: IClient) {
    // validação dos dados
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

    // Validando o tipo de cliente
    if (!clientTypes.includes(tipo)) {
      throw new AppError(
        Messages.CLIENT_TYPE_NOT_EXISTS,
        StatusCode.BAD_REQUEST
      );
    }

    // Utilizando o repositório
    const clientRepository = this.clientRepository;

    // Pesquisando um cliente pelo nome
    const clientAlreadyExists = await clientRepository.findOne({
      nome,
    });

    // Validando se já não existe um cliente com esse nome
    if (clientAlreadyExists) {
      // Se encontrar um cliente com o nome e este estiver ativo solta um exceção, caso não esteja ativo ativa o cliente
      if (clientAlreadyExists.data_remocao === null) {
        throw new AppError(
          Messages.CLIENT_ALREADY_EXISTS,
          StatusCode.BAD_REQUEST
        );
      } else {
        await clientRepository.update(clientAlreadyExists.id, {
          data_remocao: null,
          tipo,
        });

        // Atualizando o objeto clientExists
        Object.assign(clientAlreadyExists, {
          tipo,
        });

        // Retorna o cliente ativado
        return ClientDTO.convertClientToDTO(clientAlreadyExists);
      }
    }

    // Criando o objeto Cliente
    const client = clientRepository.create({
      nome,
      tipo,
    });

    // Salvando o Cliente
    await clientRepository.save(client);

    // Retornando o Cliente criado
    return ClientDTO.convertClientToDTO(client);
  }

  async update({ id, nome, tipo }: IClient) {
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

    // Validando o tipo de cliente
    if (tipo && !clientTypes.includes(tipo)) {
      throw new AppError(
        Messages.CLIENT_TYPE_NOT_EXISTS,
        StatusCode.BAD_REQUEST
      );
    }

    // Utilizando o repositório
    const clientRepository = this.clientRepository;

    // Pesquisando um cliente pelo id
    const clientExists = await clientRepository.findOne({
      id,
      data_remocao: null,
    });

    // Validando se existe um cliente com o id informado e data de remoção nula
    if (!clientExists) {
      throw new AppError(Messages.CLIENT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // Caso o Cliente informe um novo nome e este seja diferente do anterior, valida o novo nome
    if (nome && nome !== clientExists.nome) {
      // Pesquisando se ja existe algum outro Cliente com o nome em questão
      const clientAlreadyExists = await clientRepository.findOne({ nome });

      // Validando a busca
      if (clientAlreadyExists) {
        throw new AppError(
          Messages.CLIENT_ALREADY_EXISTS,
          StatusCode.BAD_REQUEST
        );
      }
    }

    // Atualizando o Cliente, caso não seja informado o nome ou o tipo, pega os valores antigos
    await clientRepository.update(id, {
      nome: nome || clientExists.nome,
      tipo: tipo || clientExists.tipo,
    });

    // Atualizando o objeto clientExists
    Object.assign(clientExists, {
      nome: nome || clientExists.nome,
      tipo: tipo || clientExists.tipo,
    });

    // Retornando o Cliente atualizado
    return ClientDTO.convertClientToDTO(clientExists);
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
    const clientRepository = this.clientRepository;

    // Pesquisando um cliente pelo id e com data de remoção nula
    const clientExists = await clientRepository.findOne({
      id,
      data_remocao: null,
    });

    // Verificando se encontrou algo
    if (!clientExists) {
      throw new AppError(Messages.CLIENT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // Retornando o Cliente encontrado
    return ClientDTO.convertClientToDTO(clientExists);
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
    const clientRepository = this.clientRepository;

    // Pesquisando um cliente pelo id e com data de remoção nula
    const clientExists = await clientRepository.findOne({
      id,
      data_remocao: null,
    });

    // Verificando se encontrou algo
    if (!clientExists) {
      throw new AppError(Messages.CLIENT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // Atualizando o campo de remoção com a data e hora atual
    await clientRepository.update(id, {
      data_remocao: new Date(),
    });
  }

  async find({ nome, tipo }: IClient) {
    // Utilizando o repositório
    const clientRepository = this.clientRepository;

    // Verificando se o tipo é valido
    if (tipo && !clientTypes.includes(tipo)) {
      throw new AppError(
        Messages.CLIENT_TYPE_NOT_EXISTS,
        StatusCode.BAD_REQUEST
      );
    }

    // pesquisando os endereços, caso não seja passado algum dos valores (nome, tipo), ele busca por uma ocorrência não nula no DB
    const clients = await clientRepository.find({
      data_remocao: null,
      nome: nome ? Like(`%${nome}%`) : Not(IsNull()),
      tipo: tipo || Not(IsNull()),
    });

    // Validando se algo foi encontrado
    if (clients.length === 0) {
      throw new AppError(Messages.CLIENT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // Filtrando os campos do Cliente
    const clientsDTO = clients.map((client) => {
      return ClientDTO.convertClientToDTO(client);
    });

    // Retornando os Clientes encontrados
    return clientsDTO;
  }
}
