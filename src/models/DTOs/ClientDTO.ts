import { Client } from "../Client";

// Classe DTO para a filtragem de dados do cliente
export class ClientDTO {
  public readonly nome: string;

  public readonly tipo: string;

  // Intera o DTO com o nome e tipo
  constructor(client: Client) {
    const { nome, tipo } = client;

    Object.assign(this, { nome, tipo });
  }

  // Retorna o DTO
  static convertClientToDTO(client: Client): ClientDTO {
    return new ClientDTO(client);
  }
}
