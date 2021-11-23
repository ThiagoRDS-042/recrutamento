import { Client } from "../Client";

export class ClientDTO {
  public readonly nome: string;

  public readonly tipo: string;

  constructor(client: Client) {
    const { nome, tipo } = client;

    Object.assign(this, { nome, tipo });
  }

  static convertClientToDTO(client: Client): ClientDTO {
    return new ClientDTO(client);
  }
}
