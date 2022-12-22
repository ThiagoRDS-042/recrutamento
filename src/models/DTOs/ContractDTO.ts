import { Contract } from "../Contract";

// Classe DTO para a filtragem de dados do contrato
export class ContractDTO {
  public readonly ponto_id: string;

  // Intera o DTO com o id do ponto
  constructor(contract: Contract) {
    const { ponto_id } = contract;

    Object.assign(this, { ponto_id });
  }

  // Retorna o DTO
  static convertPontoToDTO(contract: Contract): ContractDTO {
    return new ContractDTO(contract);
  }
}
