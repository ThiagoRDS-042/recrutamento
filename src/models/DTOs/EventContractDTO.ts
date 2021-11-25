import { EventContract } from "../EventContract";

// Classe DTO para a filtragem de dados do evento do contrato
export class EventContractDTO {
  public readonly id: string;

  public readonly data_evento: string;

  public readonly estado_antigo: string;

  public readonly estado_novo: string;

  // Intera o DTO com o id do ponto
  constructor(eventContract: EventContract) {
    const {
      id,
      data_criacao: data_evento,
      estado_anterior: estado_antigo,
      estado_posterior: estado_novo,
    } = eventContract;

    Object.assign(this, { id, data_evento, estado_antigo, estado_novo });
  }

  // Retorna o DTO
  static convertEventContractToDTO(
    eventContract: EventContract
  ): EventContractDTO {
    return new EventContractDTO(eventContract);
  }
}
