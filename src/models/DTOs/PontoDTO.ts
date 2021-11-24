import { Ponto } from "../Ponto";

// Classe DTO para a filtragem de dados do ponto
export class PontoDTO {
  public readonly cliente_id: string;

  public readonly endereco_id: string;

  // Intera o DTO com o id do cliente e endereço
  constructor(ponto: Ponto) {
    const { cliente_id, endereco_id } = ponto;

    Object.assign(this, { cliente_id, endereco_id });
  }

  // Retorna o DTO
  static convertPontoToDTO(ponto: Ponto): PontoDTO {
    return new PontoDTO(ponto);
  }
}
