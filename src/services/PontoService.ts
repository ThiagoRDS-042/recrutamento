import { getCustomRepository, IsNull, Not, Repository } from "typeorm";
import * as Yup from "yup";

import { Messages, StatusCode } from "../utils";
import { AppError } from "../errors/AppErrors";
import { Ponto } from "../models/Ponto";
import { PontoRepository } from "../repositories/PontoRepository";
import { ClientService } from "./ClientService";
import { AddressService } from "./AddressService";
import { PontoDTO } from "../models/DTOs/PontoDTO";
import { ContractService } from "./ContractService";

// Criando uma interface do ponto
interface IPonto {
  cliente_id: string;
  endereco_id: string;
}

export class PontoService {
  // Criando um atributo para armazenar o repositório de ponto
  private pontoRepository: Repository<Ponto>;

  constructor() {
    // Atribuindo o repositório para a variável
    this.pontoRepository = getCustomRepository(PontoRepository);
  }

  async create({ cliente_id, endereco_id }: IPonto) {
    // validação dos dados
    const schema = Yup.object().shape({
      cliente_id: Yup.string().required(Messages.REQUIRED_FIELD),
      endereco_id: Yup.string().required(Messages.REQUIRED_FIELD),
    });

    try {
      await schema.validate({
        cliente_id,
        endereco_id,
      });
    } catch (error) {
      throw new AppError(error.message, StatusCode.BAD_REQUEST);
    }

    // instanciando clientService
    const clientService = new ClientService();

    // pesquisando um cliente pelo id
    const clientExists = await clientService.findById(cliente_id);

    // verificando se o id do cliente é válido
    if (!clientExists) {
      throw new AppError(Messages.CLIENT_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // instanciando addressService
    const addressService = new AddressService();

    // pesquisando um endereço pelo id
    const AddressExists = await addressService.findById(endereco_id);

    // verificando se o id do endereço é válido
    if (!AddressExists) {
      throw new AppError(Messages.ADDRESS_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // Utilizando o repositório
    const pontoRepository = this.pontoRepository;

    // Pesquisando um cliente pelo nome
    const pontoAlreadyExists = await pontoRepository.findOne({
      cliente_id,
      endereco_id,
    });

    // Validando se já não existe um ponto com esses dados
    if (pontoAlreadyExists) {
      // Se encontrar um ponto com os dados informados e este estiver ativo solta um exceção, caso não esteja ativo ativa o ponto
      if (pontoAlreadyExists.data_remocao === null) {
        throw new AppError(
          Messages.PONTO_ALREADY_EXISTS,
          StatusCode.BAD_REQUEST
        );
      } else {
        await pontoRepository.update(pontoAlreadyExists.id, {
          data_remocao: null,
        });

        // Retorna o ponto ativado
        return PontoDTO.convertPontoToDTO(pontoAlreadyExists);
      }
    }

    // Criando o objeto ponto
    const ponto = pontoRepository.create({
      cliente_id,
      endereco_id,
    });

    // Salvando o ponto
    await pontoRepository.save(ponto);

    // Retornando o ponto criado
    return PontoDTO.convertPontoToDTO(ponto);
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
    const pontoRepository = this.pontoRepository;

    // Pesquisando um ponto pelo id e com data de remoção nula
    const pontoExists = await pontoRepository.findOne({
      id,
      data_remocao: null,
    });

    // Verificando se encontrou algo
    if (!pontoExists) {
      throw new AppError(Messages.PONTO_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // Retornando o ponto encontrado
    return PontoDTO.convertPontoToDTO(pontoExists);
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
    const pontoRepository = this.pontoRepository;

    // Pesquisando um ponto pelo id e com data de remoção nula
    const pontoExists = await pontoRepository.findOne({
      id,
      data_remocao: null,
    });

    // Verificando se encontrou algo
    if (!pontoExists) {
      throw new AppError(Messages.PONTO_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    // Atualizando o campo de remoção com a data e hora atual
    await pontoRepository.update(id, {
      data_remocao: new Date(),
    });

    const contractService = new ContractService();

    await contractService.deleteByPontoId(id);
  }

  async deleteByAddressId(endereco_id: string) {
    // validação dos dados
    const schema = Yup.object().shape({
      endereco_id: Yup.string().required(Messages.REQUIRED_FIELD),
    });

    try {
      await schema.validate({
        endereco_id,
      });
    } catch (error) {
      throw new AppError(error.message, StatusCode.BAD_REQUEST);
    }

    // Utilizando o repositório
    const pontoRepository = this.pontoRepository;

    // Pesquisando um ponto pelo endereco_id e com data de remoção nula
    const pontos = await pontoRepository.find({
      endereco_id,
      data_remocao: null,
    });

    // Verificando se encontrou algo
    if (pontos.length === 0) {
      throw new AppError(Messages.PONTO_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    for (const ponto of pontos) {
      // Atualizando o campo de remoção com a data e hora atual
      await pontoRepository.update(ponto.id, {
        data_remocao: new Date(),
      });
    }
  }

  async deleteByClienteId(cliente_id: string) {
    // validação dos dados
    const schema = Yup.object().shape({
      cliente_id: Yup.string().required(Messages.REQUIRED_FIELD),
    });

    try {
      await schema.validate({
        cliente_id,
      });
    } catch (error) {
      throw new AppError(error.message, StatusCode.BAD_REQUEST);
    }

    // Utilizando o repositório
    const pontoRepository = this.pontoRepository;

    // Pesquisando um ponto pelo cliente_id e com data de remoção nula
    const pontos = await pontoRepository.find({
      cliente_id,
      data_remocao: null,
    });

    // Verificando se encontrou algo
    if (pontos.length === 0) {
      throw new AppError(Messages.PONTO_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    for (const ponto of pontos) {
      // Atualizando o campo de remoção com a data e hora atual
      await pontoRepository.update(ponto.id, {
        data_remocao: new Date(),
      });
    }
  }

  async find({ cliente_id, endereco_id }: IPonto) {
    // Utilizando o repositório
    const pontoRepository = this.pontoRepository;

    // pesquisando os endereços, caso não seja passado algum dos valores (cliente_id, endereco_id), ele busca por uma ocorrência não nula no DB
    const pontos = await pontoRepository.find({
      select: ["id"],
      where: {
        data_remocao: null,
        cliente_id: cliente_id || Not(IsNull()),
        endereco_id: endereco_id || Not(IsNull()),
      },
      relations: ["cliente", "endereco"],
    });

    // Validando se algo foi encontrado
    if (pontos.length === 0) {
      throw new AppError(Messages.PONTO_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    const pontosDTO = pontos.map((ponto) => {
      return {
        id: ponto.id,
        cliente_id: ponto.cliente.id,
        cliente_nome: ponto.cliente.nome,
        cliente_tipo: ponto.cliente.tipo,
        endereco_id: ponto.endereco.id,
        endereco_logradouro: ponto.endereco.logradouro,
        endereco_bairro: ponto.endereco.bairro,
        endereco_numero: ponto.endereco.numero,
      };
    });

    // Retornando os pontos encontrados
    return pontosDTO;
  }
}
