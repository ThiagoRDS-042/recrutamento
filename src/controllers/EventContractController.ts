import { Request, Response } from "express";

import { StatusCode } from "../utils";
import { EventContractService } from "../services/EventContractService";

export class EventContractController {
  async findByContractId(req: Request, res: Response) {
    // Capturando os dados do path
    const { contrato_id } = req.params;

    // Instanciando contractService
    const eventContractService = new EventContractService();

    // Pesquisando os eventos do contrato
    const eventContracts = await eventContractService.findByContractId(
      contrato_id
    );

    // Retornando os eventos do contrato pesquisado junto do status
    return res.status(StatusCode.OK).json({ dados: eventContracts });
  }
}
