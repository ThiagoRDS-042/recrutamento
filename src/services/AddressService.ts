import { getCustomRepository, IsNull, Like, Not, Repository } from "typeorm";
import * as Yup from "yup";

import { Messages, StatusCode } from "../utils";
import { AppError } from "../errors/AppErrors";
import { AddressesRepository } from "../repositories/AddressRepository";
import { Address } from "../models/Address";
import { AddressDTO } from "../models/DTOs/AddressDTO";
import { PontoService } from "./PontoService";

// Criando uma interface do endereço
interface IAddress {
  id?: string;
  logradouro: string;
  bairro: string;
  numero: number;
}

export class AddressService {
  // Criando um atributo para armazenar o repositório de endereço
  private addressRepository: Repository<Address>;

  constructor() {
    // Atribuindo o repositório para a variável
    this.addressRepository = getCustomRepository(AddressesRepository);
  }

  async create({ logradouro, bairro, numero }: IAddress) {
    // validação dos dados
    const schema = Yup.object().shape({
      logradouro: Yup.string().required(Messages.REQUIRED_FIELD),
      bairro: Yup.string().required(Messages.REQUIRED_FIELD),
      numero: Yup.number().required(Messages.REQUIRED_FIELD),
    });

    try {
      await schema.validate({
        logradouro,
        bairro,
        numero,
      });
    } catch (error) {
      throw new AppError(error.message, StatusCode.BAD_REQUEST);
    }

    // Utilizando o repositório
    const addressRepository = this.addressRepository;

    // Pesquisando um endereço pelo logradouro, bairro e numero
    const addressAlreadyExists = await addressRepository.findOne({
      logradouro,
      bairro,
      numero,
    });

    // Validando se já não existe um endereço com essas informações
    if (addressAlreadyExists) {
      // Se encontrar um endereço com esses dados e este estiver ativo solta um exceção, caso não esteja ativo ativa o endereço
      if (addressAlreadyExists.data_remocao === null) {
        throw new AppError(
          Messages.ADDRESS_ALREADY_EXISTS,
          StatusCode.BAD_REQUEST
        );
      } else {
        await addressRepository.update(addressAlreadyExists.id, {
          data_remocao: null,
        });

        // Retorna o endereço ativado
        return AddressDTO.convertAddressToDTO(addressAlreadyExists);
      }
    }

    // Criando o objeto endereço
    const address = addressRepository.create({
      logradouro,
      bairro,
      numero,
    });

    // Salvando o endereço
    await addressRepository.save(address);

    // Retornando o endereço criado
    return AddressDTO.convertAddressToDTO(address);
  }

  async update({ id, logradouro, bairro, numero }: IAddress) {
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
    const addressRepository = this.addressRepository;

    // Pesquisando um endereço pelo id
    const addressExists = await addressRepository.findOne({
      id,
      data_remocao: null,
    });

    // Validando se existe um endereço com o id informado e data de remoção nula
    if (!addressExists) {
      throw new AppError(Messages.ADDRESS_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // Caso o Cliente informe um novo nome e este seja diferente do anterior, valida o novo nome
    if (
      (logradouro && logradouro !== addressExists.logradouro) ||
      (bairro && bairro !== addressExists.bairro) ||
      (numero && numero !== addressExists.numero)
    ) {
      // Pesquisando se ja existe algum outro endereço com logradouro, bairro e numero iguais
      const addressAlreadyExists = await addressRepository.findOne({
        logradouro,
        bairro,
        numero,
      });

      // Validando a busca
      if (addressAlreadyExists) {
        throw new AppError(
          Messages.ADDRESS_ALREADY_EXISTS,
          StatusCode.BAD_REQUEST
        );
      }
    }

    // Atualizando o endereço, caso não seja informado o logradouro, bairro e numero, pega os valores antigos
    await addressRepository.update(id, {
      logradouro: logradouro || addressExists.logradouro,
      bairro: bairro || addressExists.bairro,
      numero: numero || addressExists.numero,
    });

    // Atualizando o objeto addressExists
    Object.assign(addressExists, {
      logradouro: logradouro || addressExists.logradouro,
      bairro: bairro || addressExists.bairro,
      numero: numero || addressExists.numero,
    });

    // Retornando o endereço atualizado
    return AddressDTO.convertAddressToDTO(addressExists);
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
    const addressRepository = this.addressRepository;

    // Pesquisando um endereço pelo id e com data de remoção nula
    const addressExists = await addressRepository.findOne({
      id,
      data_remocao: null,
    });

    // Verificando se encontrou algo
    if (!addressExists) {
      throw new AppError(Messages.ADDRESS_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // Retornando o endereço encontrado
    return AddressDTO.convertAddressToDTO(addressExists);
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
    const addressRepository = this.addressRepository;

    // Pesquisando um endereço pelo id e com data de remoção nula
    const addressExists = await addressRepository.findOne({
      id,
      data_remocao: null,
    });

    // Verificando se encontrou algo
    if (!addressExists) {
      throw new AppError(Messages.CLIENT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // Atualizando o campo de remoção com a data e hora atual
    await addressRepository.update(id, {
      data_remocao: new Date(),
    });

    const pontoService = new PontoService();

    await pontoService.deleteByAddressId(id);
  }

  async find({ logradouro, bairro, numero }: IAddress) {
    // Utilizando o repositório
    const addressRepository = this.addressRepository;

    // pesquisando os endereços, caso não seja passado algum dos valores (logradouro, bairro, numero), ele busca por uma ocorrência não nula no DB
    const addresses = await addressRepository.find({
      data_remocao: null,
      logradouro: logradouro ? Like(`%${logradouro}%`) : Not(IsNull()),
      bairro: bairro ? Like(`%${bairro}%`) : Not(IsNull()),
      numero: numero || Not(IsNull()),
    });

    // Validando se algo foi encontrado
    if (addresses.length === 0) {
      throw new AppError(Messages.ADDRESS_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // Filtrando os campos do endereço
    const addressesDTO = addresses.map((address) => {
      return AddressDTO.convertAddressToDTO(address);
    });

    // Retornando os endereços encontrados
    return addressesDTO;
  }
}
